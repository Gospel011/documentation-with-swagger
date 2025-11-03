import express from "express";
import userRouter from "@/routes/userRoutes.js";
const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running successfully on port: ${PORT}`);
});
