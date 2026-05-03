import { Router } from "express";

const usersRouter: Router = Router();

usersRouter.get("/", (_req, res) => {
  res.send("v1");
});

export default usersRouter;
