import Express, { Request, Response } from "express";

const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Tour Guide",
  });
});

export default app;
