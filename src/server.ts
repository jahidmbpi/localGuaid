import { Server } from "http";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = () => {
  try {
    app.listen(envVars.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();
