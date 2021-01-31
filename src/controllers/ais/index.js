import Router from "express";
import getAis from './getAis';
const aisRouter = Router();

aisRouter.get('/',getAis);

export default aisRouter;
