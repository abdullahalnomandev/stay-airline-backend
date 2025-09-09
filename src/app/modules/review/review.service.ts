import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { Hotel } from "../hotel/hotel.model";
import { IReview } from "./review.interface";
import { Review } from "./review.model";


const createReview = async (review: IReview) => {

    const isHotelExist = await Hotel.findById(review.hotel,).lean();

    if(!isHotelExist){
        throw new ApiError(StatusCodes.NOT_FOUND,'Hotel not found')
    }

    const createReview = await Review.create(review);

    return createReview;


};



export const ReviewService = {
    createReview
}