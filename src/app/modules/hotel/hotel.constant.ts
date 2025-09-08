export const enum ROOM_TYPE {
    SINGLE = 'single',
    DOUBLE = 'double'
}

export const enum AVAILABILITY_STATUS {
    BOOKED = 'booked',
    CLOSED = 'closed'
}
export const hotelSearchableFields = ['name', 'address.city','address.street','address.country']
export const hotelStatus = ['draft','active','inactive'];
export const enum HOTEL_STATUS {
    DRAFT = 'draft',
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

