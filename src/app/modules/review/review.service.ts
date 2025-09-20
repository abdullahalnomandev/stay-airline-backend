import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { Hotel } from "../hotel/hotel.model";
import { IReview } from "./review.interface";
import { Review } from "./review.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { query } from "express";

const createReview = async (review: IReview): Promise<IReview> => {
    // Check if hotel exists
    const isHotelExist = await Hotel.findById(review.hotel, '_id').lean();
    if (!isHotelExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Hotel not found');
    }

    // Check if user exists
    const isUserExist = await User.findById(review.user).lean();
    if (!isUserExist) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }

    // Check if user is the hotel owner
    const isOwnerOfHotel = await Hotel.findOne({ hostId: review.user, _id: review.hotel }).lean();
    if (isOwnerOfHotel) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Hotel owners cannot review their own hotel');
    }

    // Create and return the review
    const newReview = await Review.create(review);
    return newReview;
};

const getAllReviews = async (query: Record<string, unknown>, hostId: string) => {
    // Get all hotels for the host
    const hotels = await Hotel.find({ hostId: hostId }, '_id');
    const hotelIds = hotels.map(hotel => hotel._id);

    // Add hotel filter to query if hotels exist
    if (hotelIds.length > 0) {
        query.hotel = { $in: hotelIds };
    }

    const reviewQuery = new QueryBuilder(Review.find(), query);

    const result = await reviewQuery.modelQuery;
    const pagination = await reviewQuery.getPaginationInfo();
    
    return {
        pagination,
        result
    };
};


const getSingleReview = async (id: string): Promise<IReview | null> => {
    const review = await Review.findById(id)
        .populate('user', 'name email')
        .populate('hotel', 'title location');

    if (!review) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
    }

    return review;
};
const getAllReviewsByAdmin = async (): Promise<IReview[]> => {
    const reviews = await Review.find()
        .populate('user', 'name email')

    if (!reviews.length) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'No reviews found');
    }

    return reviews;
};
const getReviewsByHotel = async (query: Record<string, any>, hotelId: string) => {
    // Add hotel filter to query
    query.hotel = hotelId;
    query.isVisible = true;

    const reviewQuery = new QueryBuilder(Review.find(), query)
    .filter()
    .paginate()


    const pagination = await reviewQuery.getPaginationInfo();
    const data = await reviewQuery.modelQuery.populate('user','_id name image profilePic').lean();

    return {
        pagination,
        data
    };
};



const updateReview = async (id: string, payload: Partial<IReview>, userId: string): Promise<IReview | null> => {

    // Check if review exists
    const review = await Review.findById(id);
    if (!review) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
    }

    // Check if user is the owner of the review
    if (review.user.toString() !== userId) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to update this review');
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
        id,
        payload,
        { new: true }
    ).populate('user', 'name email').populate('hotel', 'title location');

    return updatedReview;
};

const deleteReview = async (id: string, userId: string): Promise<IReview | null> => {
    // Check if review exists
    const review = await Review.findById(id);
    if (!review) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
    }

    // Check if user is the owner of the review or a host/admin
    const user = await User.findById(userId);
    const isOwner = review.user.toString() === userId;
    const isHostOfHotel = await Hotel.findOne({ _id: review.hotel, hostId: userId });

    if (!isOwner) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to delete this review');
    }

    // Delete the review
    const deletedReview = await Review.findByIdAndDelete(id);
    return deletedReview;
};

const updateStatus = async (reviewId: string): Promise<IReview | null> => {
    // Check if review exists
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Review not found');
    }

    // Toggle the isVisible status
    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { isVisible: !review.isVisible },
        { new: true }
    );

    return updatedReview;
};

export const ReviewService = {
    createReview,
    getSingleReview,
    getReviewsByHotel,
    getAllReviews,
    updateReview,
    deleteReview,
    getAllReviewsByAdmin,
    updateStatus
}