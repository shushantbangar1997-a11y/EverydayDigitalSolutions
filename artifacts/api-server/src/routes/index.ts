import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import subscribersRouter from "./subscribers";
import statsRouter from "./stats";
import adminRouter from "./admin";
import adminAnalyticsRouter from "./admin-analytics";
import quoteRouter from "./quote";
import trackRouter from "./track";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(subscribersRouter);
router.use(statsRouter);
router.use(adminRouter);
router.use(adminAnalyticsRouter);
router.use(quoteRouter);
router.use(trackRouter);

export default router;
