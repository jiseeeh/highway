import type { Express } from "express";
import express from "express";
import { appSetup, routerSetup, securitySetup } from "./startup/index.js";

const app: Express = express();

securitySetup(app);
routerSetup(app);
appSetup(app);
