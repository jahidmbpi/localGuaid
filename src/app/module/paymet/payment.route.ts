import { Router } from "express";
import { pamentConroller } from "./payment.controllers";

const router = Router();

router.post("/initPyament/:id", pamentConroller.paymentInit);
router.post("/success", pamentConroller.successpayment);
router.post("/fail", pamentConroller.fail);
router.post("/cancel", pamentConroller.cencel);
export const paymentRouter = router;
