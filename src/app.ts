import express from "express";
import userRouter from "@/routes/userRoutes.js";
import docsRouter from "./routes/docsRouters.js";
import path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());

const __dirname = import.meta.dirname;

app.use(express.static("./public"));
app.use(morgan("dev"));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use("/api/docs", docsRouter);
app.use("/api/v1/user", userRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running successfully on port: ${PORT}`);
});
