import Router from "express";
import portRouter from '../controllers/port';
import aisRouter from '../controllers/ais';

const mainRouter = Router();

mainRouter.use('/ais',aisRouter);
mainRouter.use('/ports',portRouter);

export default mainRouter;
