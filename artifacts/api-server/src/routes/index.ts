import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import subscribersRouter from "./subscribers";
import statsRouter from "./stats";
import adminRouter from "./admin";
import quoteRouter from "./quote";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(subscribersRouter);
router.use(statsRouter);
router.use(adminRouter);
router.use(quoteRouter);

export default router;
