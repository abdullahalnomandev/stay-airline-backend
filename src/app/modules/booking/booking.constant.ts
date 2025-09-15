export const enum BOOKING_STATUS {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}
export const bookingStatus = [
    BOOKING_STATUS.PENDING,
    BOOKING_STATUS.COMPLETED,
    BOOKING_STATUS.CANCELLED
]


export const enum PAYMENT_STATUS {
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded'
}

export const paymentStatus = [
    PAYMENT_STATUS.PENDING,
    PAYMENT_STATUS.PAID,
    PAYMENT_STATUS.CANCELLED,
    PAYMENT_STATUS.REFUNDED
]

export const enum BOOKING_PAYMENT_METHOD {
    CASH = 'cash',
    CARD = 'card'
}
export const bookingPaymentMethod = [
    BOOKING_PAYMENT_METHOD.CASH,
    BOOKING_PAYMENT_METHOD.CARD
]

export const bookingSearchableFields = ['bookingId','userId.email','hotelId.email','user.contact']