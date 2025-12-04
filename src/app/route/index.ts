import { Router } from "express";
import { userRouter } from "../module/user/user.route";
import { authRouter } from "../module/auth/auth.route";
import { guaidRouter } from "../module/guaid/guaid.route";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
