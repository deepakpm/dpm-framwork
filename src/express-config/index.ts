import express from "express";
import { IncomingMessage, ServerResponse } from "http";

import { useHelmet } from "./middlewares";

const app = express();
const baseRouter = express.Router();

// default Middleware
app.use(useHelmet());

type RequestResponse = (
  req: IncomingMessage,
  res: ServerResponse,
  next: (err?: unknown) => void
) => void;

interface ServerOptions {
  port: number;
  callback?: Function;
  isLoggerEnable?: boolean;
  customMiddleWare?: Array<RequestResponse>;
}
enum RouterMethods {
  GET,
  POST,
  DELETE,
  PUT,
}

interface RouterOption {
  path: string;
  controller: RequestResponse;
  method: RouterMethods;
}
const defaultCallback = () => {
  console.log("running on localhost");
};

const registerCustomMiddleware = (middlewares: Array<RequestResponse>) => {
  middlewares?.forEach((middleware: RequestResponse) => {
    app.use(middleware);
  });
};
const useRouter = (router: RouterOption) => {
  switch (router.method) {
    case RouterMethods.GET:
      baseRouter.get(router.path, router.controller);
      break;
    case RouterMethods.POST:
      baseRouter.post(router.path, router.controller);
      break;
    case RouterMethods.PUT:
      baseRouter.put(router.path, router.controller);
      break;
    case RouterMethods.DELETE:
      baseRouter.delete(router.path, router.controller);
      break;
    default:
      baseRouter.get(router.path, router.controller);
  }
};

const registerRouter = (router: express.Router, path: string = null) => {
  if (path) app.use(path, router);
  else app.use(router);
};

const connect = (options: ServerOptions) => {
  registerCustomMiddleware(options.customMiddleWare);
  app.listen(options.port, () => {
    if (typeof options.callback === typeof Function) {
      options.callback();
    } else {
      defaultCallback();
    }
  });
};

export default {
  connect,
  registerRouter,
  useRouter,
};
