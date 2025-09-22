import { User } from "../user/user.model";
import { Booking } from "../booking/booking.model";
import { AirlinePersonVerification } from "../airlinePersonVerification/airlinePersonVerificaiton.model";
import { Hotel } from "../hotel/hotel.model";


const getAnalytics = async (year: number) => {
    // Total counts
    const totalUsers = await User.countDocuments({ verified: true });
    const totalBookings = await Booking.countDocuments({ paymentStatus: "paid" });
    // Year range
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    // USERS (new users per month of selected year)
    const newUsersAgg = await User.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.month": 1 } },
    ]);

    // SUBSCRIPTIONS (successful payments)
    const subscriptionsAgg = await AirlinePersonVerification.aggregate([
        {
            $match: {
                paymentStatus: "paid",
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $lookup: {
                from: "verificationplans",
                localField: "plan",
                foreignField: "_id",
                as: "plan"
            }
        },
        { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                subscriptions: { $sum: 1 }
            }
        },
        { $sort: { "_id.month": 1 } }
    ]);

    // Month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const lastMonth = year === now.getFullYear() ? now.getMonth() : 11;


    // MONTHLY EARNINGS (paid bookings of this year)...
    const monthlyEarningsAgg = await Booking.aggregate([
        {
            $match: {
                paymentStatus: "paid",
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $lookup: {
                from: "hotels",
                localField: "hotelId",
                foreignField: "_id",
                as: "hotel",
            }
        },
        { $unwind: "$hotel" },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                earnings: { $sum: "$hotel.roomPrice" }
            }
        },
        { $sort: { "_id.month": 1 } }
    ]);

    const monthlyData = (() => {
        let runningUsers = 0;
        let runningSubscriptions = 0;
        let runningEarnings = 0;

        return months.slice(0, lastMonth + 1).map((m, idx) => {
            const monthNumber = idx + 1;

            // Users
            const userDoc = newUsersAgg.find((u) => u._id.month === monthNumber);
            const newUsers = userDoc ? userDoc.count : 0;
            runningUsers += newUsers;

            // Subscriptions
            const subDoc = subscriptionsAgg.find((s) => s._id.month === monthNumber);
            const newSubscriptions = subDoc ? subDoc.subscriptions : 0;
            runningSubscriptions += newSubscriptions;

            // Earnings
            const earningDoc = monthlyEarningsAgg.find((e) => e._id.month === monthNumber);
            const monthlyEarning = earningDoc ? earningDoc.earnings : 0;
            runningEarnings += monthlyEarning;

            return {
                month: m,
                newUsers,
                totalUsers: runningUsers, // cumulative within the year
                newSubscriptions,
                totalSubscriptions: runningSubscriptions,
                monthlyEarning,
                totalEarning: runningEarnings
            };
        });
    })();



    // Total earnings of all time
    const totalEarning = await Booking.aggregate([
        {
            $match: {
                paymentStatus: "paid"
            }
        },
        {
            $lookup: {
                from: "hotels",
                localField: "hotelId",
                foreignField: "_id",
                as: "hotel",
            }
        },
        { $unwind: "$hotel" },
        {
            $group: {
                _id: null,
                earnings: { $sum: "$hotel.roomPrice" }
            }
        }
    ]).then(res => (res[0]?.earnings ?? 0));

    // Total subscriptions of all time
    const totalSubscriptions = await AirlinePersonVerification.countDocuments({ paymentStatus: "paid" });



    return {
        year,
        totalUsers,
        totalBookings,
        totalEarning,
        totalSubscriptions,
        monthlyData,
    };
};


const getAnalyticsHoseWise = async (year: number, hostId: string) => {

    // Total counts
    const hotels = await Hotel.find({ hostId }).lean();
    if (!hotels.length) {
        throw new Error('No hotels found for this host');
    }
    const hotelIds = hotels.map(hotel => hotel._id);
    const totalBookings = await Booking.countDocuments({
        paymentStatus: "paid",
        hotelId: { $in: hotelIds }
    });

    // Year range
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);


    // Month names
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const lastMonth = year === now.getFullYear() ? now.getMonth() : 11;


    // MONTHLY EARNINGS (paid bookings of this year)...
    const monthlyEarningsAgg = await Booking.aggregate([
        {
            $match: {
                paymentStatus: "paid",
                createdAt: { $gte: startDate, $lte: endDate },
                hotelId: { $in: hotelIds }
            }
        },
        {
            $lookup: {
                from: "hotels",
                localField: "hotelId",
                foreignField: "_id",
                as: "hotel",
            }
        },
        { $unwind: "$hotel" },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                earnings: { $sum: "$hotel.roomPrice" }
            }
        },
        { $sort: { "_id.month": 1 } }
    ]);

    const monthlyData = (() => {
        let runningSubscriptions = 0;
        let runningEarnings = 0;

        return months.slice(0, lastMonth + 1).map((m, idx) => {
            const monthNumber = idx + 1;

            // Earnings
            const earningDoc = monthlyEarningsAgg.find((e) => e._id.month === monthNumber);
            const monthlyEarning = earningDoc ? earningDoc.earnings : 0;
            runningEarnings += monthlyEarning;

            return {
                month: m,
                totalSubscriptions: runningSubscriptions,
                monthlyEarning,
                totalEarning: runningEarnings
            };
        });
    })();



    // Total earnings of all time
    const totalEarning = await Booking.aggregate([
        {
            $match: {
                paymentStatus: "paid",
                hotelId: { $in: hotelIds }
            }
        },
        {
            $lookup: {
                from: "hotels",
                localField: "hotelId",
                foreignField: "_id",
                as: "hotel",
            }
        },
        { $unwind: "$hotel" },
        {
            $group: {
                _id: null,
                earnings: { $sum: "$hotel.roomPrice" }
            }
        }
    ]).then(res => (res[0]?.earnings ?? 0));


    return {
        year,
        totalBookings,
        totalEarning,
        monthlyData,
    };
};


export const AnalyticsServices = {
    getAnalytics,
    getAnalyticsHoseWise
};