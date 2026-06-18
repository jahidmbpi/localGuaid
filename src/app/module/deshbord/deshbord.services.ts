import { prisma } from "../../config/prisma";
import { Role } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../helper/appError";
import { StatusCodes } from "http-status-codes";

const getDashboardMetaData = async (user: JwtPayload) => {
  const { userId, role } = user;

  if (role === Role.ADMIN) {
    // 1. Total Counts
    const totalUsers = await prisma.user.count({ where: { isDeleted: false } });
    const totalTourists = await prisma.user.count({
      where: { role: Role.TOURIST, isDeleted: false },
    });
    const totalGuides = await prisma.user.count({
      where: { role: Role.GUIDE, isDeleted: false },
    });
    const totalListings = await prisma.listing.count();
    const totalBookings = await prisma.booking.count();

    // 2. Revenue (Sum of totalAmount for paid bookings)
    const revenueResult = await prisma.booking.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        paymentStatus: "PAID",
      },
    });
    const totalRevenue = revenueResult._sum.totalAmount || 0;

    // 3. Booking Status breakdown
    const pendingBookings = await prisma.booking.count({ where: { status: "PENDING" } });
    const confirmedBookings = await prisma.booking.count({ where: { status: "CONFIRMED" } });
    const completedBookings = await prisma.booking.count({ where: { status: "COMPLETED" } });
    const cancelledBookings = await prisma.booking.count({ where: { status: "CANCELLED" } });

    // 4. Recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Tourist: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
          },
        },
        guide: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
          },
        },
      },
    });

    return {
      role,
      stats: {
        totalUsers,
        totalTourists,
        totalGuides,
        totalListings,
        totalBookings,
        totalRevenue,
      },
      bookingStatusBreakdown: {
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
      },
      recentBookings,
    };
  }

  if (role === Role.GUIDE) {
    // 1. Total bookings for this guide
    const totalBookings = await prisma.booking.count({
      where: { guideId: userId },
    });

    // 2. Active listings for this guide
    const totalListings = await prisma.listing.count({
      where: { guideId: userId, isActive: true },
    });

    // 3. Earnings (Sum of totalAmount for paid bookings for this guide)
    const earningsResult = await prisma.booking.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        guideId: userId,
        paymentStatus: "PAID",
      },
    });
    const totalEarnings = earningsResult._sum.totalAmount || 0;

    // 4. Booking Status breakdown for this guide
    const pendingBookings = await prisma.booking.count({
      where: { guideId: userId, status: "PENDING" },
    });
    const confirmedBookings = await prisma.booking.count({
      where: { guideId: userId, status: "CONFIRMED" },
    });
    const completedBookings = await prisma.booking.count({
      where: { guideId: userId, status: "COMPLETED" },
    });
    const cancelledBookings = await prisma.booking.count({
      where: { guideId: userId, status: "CANCELLED" },
    });

    // 5. Recent bookings for this guide
    const recentBookings = await prisma.booking.findMany({
      where: { guideId: userId },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Tourist: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
          },
        },
      },
    });

    return {
      role,
      stats: {
        totalBookings,
        totalListings,
        totalEarnings,
      },
      bookingStatusBreakdown: {
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
      },
      recentBookings,
    };
  }

  if (role === Role.TOURIST) {
    // 1. Total bookings for this tourist
    const totalBookings = await prisma.booking.count({
      where: { touristId: userId },
    });

    // 2. Total spent (Sum of totalAmount for paid bookings for this tourist)
    const spentResult = await prisma.booking.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        touristId: userId,
        paymentStatus: "PAID",
      },
    });
    const totalSpent = spentResult._sum.totalAmount || 0;

    // 3. Booking Status breakdown for this tourist
    const pendingBookings = await prisma.booking.count({
      where: { touristId: userId, status: "PENDING" },
    });
    const confirmedBookings = await prisma.booking.count({
      where: { touristId: userId, status: "CONFIRMED" },
    });
    const completedBookings = await prisma.booking.count({
      where: { touristId: userId, status: "COMPLETED" },
    });
    const cancelledBookings = await prisma.booking.count({
      where: { touristId: userId, status: "CANCELLED" },
    });

    // 4. Recent bookings for this tourist
    const recentBookings = await prisma.booking.findMany({
      where: { touristId: userId },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        guide: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePhoto: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true,
          },
        },
      },
    });

    return {
      role,
      stats: {
        totalBookings,
        totalSpent,
      },
      bookingStatusBreakdown: {
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
      },
      recentBookings,
    };
  }

  throw new AppError(StatusCodes.BAD_REQUEST, "Invalid user role");
};

export const deshbordServices = {
  getDashboardMetaData,
};
