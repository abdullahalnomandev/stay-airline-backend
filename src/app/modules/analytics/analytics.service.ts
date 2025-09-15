import { User } from "../user/user.model";
import { Booking } from "../booking/booking.model";
import { AirlinePersonVerification } from "../airlinePersonVerification/airlinePersonVerificaiton.model";


const getAnalytics = async (year: number) => {
    // Total counts
    const totalUsers = await User.countDocuments({verified:true});
    const totalBookings = await Booking.countDocuments({ paymentStatus: "paid" });
    console.log({totalBookings})
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

    // USERS created before this year (for running total)
    const usersBeforeYear = await User.countDocuments({ createdAt: { $lt: startDate } });

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

    // Running totals per month
    let runningTotalUsers = usersBeforeYear; // start from previous years
    let runningTotalSubscriptions = 0;

    const monthlyData = months.slice(0, lastMonth + 1).map((m, idx) => {
        const monthNumber = idx + 1;

        // Users
        const userDoc = newUsersAgg.find((u) => u._id.month === monthNumber);
        const newUsers = userDoc ? userDoc.count : 0;
        runningTotalUsers += newUsers;

        // Subscriptions
        const subDoc = subscriptionsAgg.find((s) => s._id.month === monthNumber);
        const newSubscriptions = subDoc ? subDoc.subscriptions : 0;
        runningTotalSubscriptions += newSubscriptions;

        return {
            month: m,
            newUsers,
            totalUsers: runningTotalUsers, // now includes previous years
            newSubscriptions,
            totalSubscriptions: runningTotalSubscriptions,
        };
    });

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


export const AnalyticsServices = {
    getAnalytics,
};

