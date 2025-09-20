export const enum ROOM_TYPE {
    SINGLE = 'single',
    DOUBLE = 'double'
}

export const enum AVAILABILITY_STATUS {
    BOOKED = 'booked',
    CLOSED = 'closed'
}
export const hotelSearchableFields = ['address']
export const enum HOTEL_STATUS {
    DRAFT = 'draft',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending'
}

export const hotelStatus = [HOTEL_STATUS.DRAFT, HOTEL_STATUS.ACTIVE, HOTEL_STATUS.INACTIVE, HOTEL_STATUS.PENDING];
