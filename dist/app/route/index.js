"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../module/user/user.route");
const auth_route_1 = require("../module/auth/auth.route");
const guaid_route_1 = require("../module/guaid/guaid.route");
const losting_route_1 = require("../module/listing/losting.route");
const booking_route_1 = require("../module/booking/booking.route");
const payment_route_1 = require("../module/paymet/payment.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRouter,
    },
    {
        path: "/auth",
        route: auth_route_1.authRouter,
    },
    {
        path: "/guaid",
        route: guaid_route_1.guaidRouter,
    },
    {
        path: "/listing",
        route: losting_route_1.listingRouter,
    },
    {
        path: "/booking",
        route: booking_route_1.bookingRouter,
    },
    {
        path: "/payment",
        route: payment_route_1.paymentRouter,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
