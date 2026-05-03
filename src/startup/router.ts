import type { Express } from "express";

import usersRouter from "@/routes/v1/users.js";
import { errorSetup } from "./error.js";

export const routerSetup = (app: Express) => {
  app.use("/api/health", (_, res) =>
    res.status(200).send({
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "Nothing exploded yet",
    }),
  );

  app.use("/api/v1/users", usersRouter);

  errorSetup(app);
};
