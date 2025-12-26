import Express, { Request, Response } from "express";
import router from "./app/route";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = Express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://percel-delevery-client.vercel.app",
    ],
    credentials: true,
  })
);
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Tour Guide",
  });
});

export default app;
