import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import subscribersRouter from "./subscribers";
import statsRouter from "./stats";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(subscribersRouter);
router.use(statsRouter);
router.use(adminRouter);

export default router;
