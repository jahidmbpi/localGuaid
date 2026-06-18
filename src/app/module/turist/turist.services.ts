import { BookingStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

const myBooking = async (id: string) => {
  const result = await prisma.booking.findMany({
    where: {
      touristId: id,
      status: BookingStatus.CONFIRMED || BookingStatus.CANCELLED,
    },
  });
  return result;
};

const upcomingAndPastBokkingforTurist = async (id: string) => {
  const currentDate = new Date();

  // Upcoming bookings
  const upcomingBookings = await prisma.booking.findMany({
    where: {
      touristId: id,
      status: BookingStatus.CONFIRMED,
      startDate: {
        gte: currentDate,
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  // Past bookings
  const pastBookings = await prisma.booking.findMany({
    where: {
      touristId: id,
      status: BookingStatus.COMPLETED,
      endDate: {
        lt: currentDate,
      },
    },
    orderBy: {
      endDate: "desc",
    },
  });

  return {
    upcomingBookings,
    pastBookings,
  };
};

export const turistServices = {
  myBooking,
  upcomingAndPastBokkingforTurist,
};
