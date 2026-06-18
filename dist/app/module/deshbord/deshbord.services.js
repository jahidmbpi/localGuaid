"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deshbordServices = void 0;
const prisma_1 = require("../../config/prisma");
const client_1 = require("@prisma/client");
const appError_1 = __importDefault(require("../../helper/appError"));
const http_status_codes_1 = require("http-status-codes");
const getDashboardMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = user;
    if (role === client_1.Role.ADMIN) {
        // 1. Total Counts
        const totalUsers = yield prisma_1.prisma.user.count({ where: { isDeleted: false } });
        const totalTourists = yield prisma_1.prisma.user.count({
            where: { role: client_1.Role.TOURIST, isDeleted: false },
        });
        const totalGuides = yield prisma_1.prisma.user.count({
            where: { role: client_1.Role.GUIDE, isDeleted: false },
        });
        const totalListings = yield prisma_1.prisma.listing.count();
        const totalBookings = yield prisma_1.prisma.booking.count();
        // 2. Revenue (Sum of totalAmount for paid bookings)
        const revenueResult = yield prisma_1.prisma.booking.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                paymentStatus: "PAID",
            },
        });
        const totalRevenue = revenueResult._sum.totalAmount || 0;
        // 3. Booking Status breakdown
        const pendingBookings = yield prisma_1.prisma.booking.count({ where: { status: "PENDING" } });
        const confirmedBookings = yield prisma_1.prisma.booking.count({ where: { status: "CONFIRMED" } });
        const completedBookings = yield prisma_1.prisma.booking.count({ where: { status: "COMPLETED" } });
        const cancelledBookings = yield prisma_1.prisma.booking.count({ where: { status: "CANCELLED" } });
        // 4. Recent bookings
        const recentBookings = yield prisma_1.prisma.booking.findMany({
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
    if (role === client_1.Role.GUIDE) {
        // 1. Total bookings for this guide
        const totalBookings = yield prisma_1.prisma.booking.count({
            where: { guideId: userId },
        });
        // 2. Active listings for this guide
        const totalListings = yield prisma_1.prisma.listing.count({
            where: { guideId: userId, isActive: true },
        });
        // 3. Earnings (Sum of totalAmount for paid bookings for this guide)
        const earningsResult = yield prisma_1.prisma.booking.aggregate({
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
        const pendingBookings = yield prisma_1.prisma.booking.count({
            where: { guideId: userId, status: "PENDING" },
        });
        const confirmedBookings = yield prisma_1.prisma.booking.count({
            where: { guideId: userId, status: "CONFIRMED" },
        });
        const completedBookings = yield prisma_1.prisma.booking.count({
            where: { guideId: userId, status: "COMPLETED" },
        });
        const cancelledBookings = yield prisma_1.prisma.booking.count({
            where: { guideId: userId, status: "CANCELLED" },
        });
        // 5. Recent bookings for this guide
        const recentBookings = yield prisma_1.prisma.booking.findMany({
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
    if (role === client_1.Role.TOURIST) {
        // 1. Total bookings for this tourist
        const totalBookings = yield prisma_1.prisma.booking.count({
            where: { touristId: userId },
        });
        // 2. Total spent (Sum of totalAmount for paid bookings for this tourist)
        const spentResult = yield prisma_1.prisma.booking.aggregate({
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
        const pendingBookings = yield prisma_1.prisma.booking.count({
            where: { touristId: userId, status: "PENDING" },
        });
        const confirmedBookings = yield prisma_1.prisma.booking.count({
            where: { touristId: userId, status: "CONFIRMED" },
        });
        const completedBookings = yield prisma_1.prisma.booking.count({
            where: { touristId: userId, status: "COMPLETED" },
        });
        const cancelledBookings = yield prisma_1.prisma.booking.count({
            where: { touristId: userId, status: "CANCELLED" },
        });
        // 4. Recent bookings for this tourist
        const recentBookings = yield prisma_1.prisma.booking.findMany({
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
    throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid user role");
});
exports.deshbordServices = {
    getDashboardMetaData,
};
