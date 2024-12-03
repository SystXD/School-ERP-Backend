import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { MongoConnect } from "./lib/db/mongo-connect";
import { morganFormat } from "./lib/constants";
import 'dotenv/config'
import logger from "./lib/logger";
import baseRouter from './routes/base-router'
import redirectController from './controllers/error-page/invalid-route.controllers'
import { errorMiddleware } from "./middleware/error.middleware";
const app = express();

/**Middlewares*/
app.use(express.json())
app.use(cookieParser());
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const info = message.split(" ");
        logger.info(
          JSON.stringify({
            method: info[0],
            url: info[1],
            status: info[2],
            responseTime: info[3],
          })
        );
      },
    },
  })
);

app.use('/', baseRouter)
app.all("*", redirectController)
app.use(errorMiddleware)

MongoConnect()
  .then(() =>
    app.listen(3200, () => console.log("The school ERP Api Launched."))
  )
  .catch(console.error);
