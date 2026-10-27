import { BookingStatus as PrismaBookingStatus } from "@prisma/client";

export type BookingStatus = PrismaBookingStatus;

export interface BookingSpace {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  pricePerHour: number;
}

export interface BookingUser {
  id: string;
  name: string;
  email: string;
}

export interface Booking {
  id: string;
  userId: string;
  spaceId: string;
  startTime: string | Date;
  endTime: string | Date;
  totalHours: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  space?: BookingSpace;
  user?: BookingUser;
}

