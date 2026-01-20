import dotenv from "dotenv";
dotenv.config();
interface ENVconfig {
  PORT: string;
  NODE_ENV: string;
  CLOUDENARY_NAME: string;
  CLOUDENARY_API_KEY: string;
  CLOUDENARY_API_SECRET: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRE: string;
  FRONTEND_URL: string;
  SSL: {
    SSL_STORE_ID: string;
    SSL_STORE_PASS: string;
    SSL_PAYMENT_API: string;
    SSL_VALIDATION_API: string;
    SSL_SUCCESS_FRONTEND_URL: string;
    SSL_FAIL_FRONTEND_URL: string;
    SSL_CANCEL_FRONTEND_URL: string;
    SSL_SUCCESS_BACKEND_URL: string;
    SSL_FAIL_BACKEND_URL: string;
    SSL_CANCEL_BACKEND_URL: string;
  };
}

const loadEnvVariable = (): ENVconfig => {
  const requireVariable: string[] = [
    "PORT",
    "CLOUDENARY_NAME",
    "CLOUDENARY_API_KEY",
    "CLOUDENARY_API_SECRET",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRE",
    "FRONTEND_URL",
    "SSL_STORE_ID",
    "SSL_STORE_PASS",
    "SSL_PAYMENT_API",
    "SSL_VALIDATION_API",
    "SSL_SUCCESS_FRONTEND_URL",
    "SSL_FAIL_FRONTEND_URL",
    "SSL_CANCEL_FRONTEND_URL",
    "SSL_SUCCESS_BACKEND_URL",
    "SSL_FAIL_BACKEND_URL",
    "SSL_CANCEL_BACKEND_URL",
    "NODE_ENV",
  ];
  requireVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`missing environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
    CLOUDENARY_NAME: process.env.CLOUDENARY_NAME as string,
    CLOUDENARY_API_KEY: process.env.CLOUDENARY_API_KEY as string,
    CLOUDENARY_API_SECRET: process.env.CLOUDENARY_API_SECRET as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    SSL: {
      SSL_STORE_ID: process.env.SSL_STORE_ID as string,
      SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
      SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
      SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
      SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
      SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
      SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
      SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
      SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
      SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,
    },
  };
};
export const envVars = loadEnvVariable();
