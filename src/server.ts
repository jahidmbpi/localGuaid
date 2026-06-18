import { Server } from "http";
import dns from "dns";

// Override dns.lookup globally to prefer/force IPv4 to bypass unreachable IPv6 NAT64 DNS resolution timeouts
const originalLookup = dns.lookup;
// @ts-ignore
dns.lookup = function (hostname, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  const opt =
    typeof options === "number" ? { family: options } : { ...options };
  opt.family = 4;
  return (originalLookup as any)(hostname, opt, callback);
};

import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = () => {
  try {
    if (envVars.NODE_ENV !== "production") {
      app.listen(envVars.PORT, () => {
        console.log(`🚀 Server running at http://localhost:${envVars.PORT}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();
