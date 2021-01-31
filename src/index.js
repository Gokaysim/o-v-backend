import express from "express";
import middlewares from "./utils/middlewares";
import errorHandler from './utils/errorHandler';
import routes from './routes';



const app = express();


app.set("trust proxy", 1);

middlewares(app);

app.use('/',routes)

errorHandler(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Local api has been started at port of ${port}`);
});

export default app;
