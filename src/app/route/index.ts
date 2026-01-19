import { Router } from "express";
import { userRouter } from "../module/user/user.route";
import { authRouter } from "../module/auth/auth.route";
import { guaidRouter } from "../module/guaid/guaid.route";
import { listingRouter } from "../module/listing/losting.route";
import { bookingRouter } from "../module/booking/booking.route";
import { paymentRouter } from "../module/paymet/payment.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/guaid",
    route: guaidRouter,
  },
  {
    path: "/listing",
    route: listingRouter,
  },
  {
    path: "/booking",
    route: bookingRouter,
  },
  {
    path: "/payment",
    route: paymentRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
