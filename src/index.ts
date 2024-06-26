import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/myUserRoute";
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restauant from "./routes/RestaurantRoute";

/**
 * make the connection the the database intially so that if the connection the database fails then our app crashes
 */
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => {
    console.log("connected to the database successfully");
  })
  .catch((err) => {
    console.log("error connecting the database", err);
  });

/**
 * connecting to cloudinary after connection to the mongodb
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
/**
 * creating a new express server and assigning it to app variable
 */
const app = express();

/**
 * adding middleware to convert body on any request frontend makes into json
 * use app.use() to add a middleware
 * NOTE=> we are using this middlware at the begining so that every request is converted at the very beggining
 * and we dont have to do it manually to every request
 */
app.use(express.json());

/**
 * setting up the cors middle ware
 */
app.use(cors());

/**
 * setting up the test endpoint to check if server is working or not
 */

app.get("/api/health", async (req: Request, res: Response) => {
  /**
   * sending our first request
   * this is the convention used in like docker compose and k8s to check if things are working fine
   */
  res.json({ message: "hello world! server health OK!" });
});

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
//this is public route so anyone can use it
app.use("/api/restaurant", restauant);

const port = process.env.PORT || 4000;
app.listen(7000, () => {
  console.log("server listning on port 7000");
});

/**
 * Flow of the request
 *  connect the controller to the route, and route to index file
 */
