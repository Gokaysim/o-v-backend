import Router from "express";
import getPorts from './getPorts';

const portRouter = Router();

portRouter.get('/',getPorts);

export default portRouter;
