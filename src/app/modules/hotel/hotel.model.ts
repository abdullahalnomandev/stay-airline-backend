import { model, Schema } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import { HOTEL_STATUS, hotelStatus, ROOM_TYPE } from './hotel.constant';
import { IHotel, IHotelModel } from './hotel.interface';

const hotelSchema = new Schema<IHotel, IHotelModel>(
    {
        hostId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: hotelStatus,
            default: HOTEL_STATUS.ACTIVE
        },
        name: {
            type: String,
            required: true,
        },
        roomPrice: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        roomType: {
            type: String,
            enum: [ROOM_TYPE.SINGLE, ROOM_TYPE.DOUBLE],
            required: true,
        },
        address: {
            type: String,
            require: true
        },
        // address: {
        //     street: {
        //         type: String,
        //         required: true
        //     },
        //     city: {
        //         type: String,
        //         required: true
        //     },
        //     country: {
        //         type: String,
        //         required: true
        //     },
        //     zip: {
        //         type: String,
        //         required: true
        //     }
        // },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true
            },
            coordinates: {
                type: [Number] as unknown as [number, number], // TS trick for tuple
                required: true
            }
        },
        image: {
            type: [String],
            required: false
        }, // images
        facilities: [{
            type: Schema.Types.ObjectId,
            ref: 'Facility',
            required: false
        }],
        roomClosureDates: [
            {
                type: Date,
                required: false,
            },
        ],
        hotelRules: [{
            title: {
                type: String,
                required: false
            },
            description: {
                type: String,
                required: false
            }
        }],
        utilityBill: {
            type: String,
            required: false
        } // image

    },
    { timestamps: true }
);

hotelSchema.index({ location: "2dsphere" });

export const Hotel = model<IHotel, IHotelModel>('Hotel', hotelSchema);
