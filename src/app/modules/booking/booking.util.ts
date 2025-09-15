import { Booking } from "./booking.model";

export const findLastBookingId = async (): Promise<string | undefined> => {
  const lastBooking = await Booking.findOne({}, { bookingId: 1, _id: 0 }) 
    .sort({ createdAt: -1 })
    .lean();

  return lastBooking?.bookingId;
};

export const generateBookingId = async (): Promise<string> => {
  const lastId = await findLastBookingId();

  let numericPart = 0;

  if (lastId) {
    numericPart = parseInt(lastId.replace("FD-", ""), 10) || 0;
  }

  const newIdNumber = numericPart + 1;
  const newId = `FD-${newIdNumber.toString().padStart(5, "0")}`;

  return newId;
};
