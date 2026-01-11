import dotenv from "dotenv";
dotenv.config();
interface ENVconfig {
  PORT: string;
  CLOUDENARY_NAME: string;
  CLOUDENARY_API_KEY: string;
  CLOUDENARY_API_SECRET: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRE: string;
  FRONTEND_URL: string;
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
  ];
  requireVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`missing environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    CLOUDENARY_NAME: process.env.CLOUDENARY_NAME as string,
    CLOUDENARY_API_KEY: process.env.CLOUDENARY_API_KEY as string,
    CLOUDENARY_API_SECRET: process.env.CLOUDENARY_API_SECRET as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
  };
};
export const envVars = loadEnvVariable();
