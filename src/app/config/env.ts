import dotenv from "dotenv";
dotenv.config();
interface ENVconfig {
  PORT: string;
}

const loadEnvVariable = (): ENVconfig => {
  const requireVariable: string[] = ["PORT"];
  requireVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`missing environment variable ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
  };
};
export const envVars = loadEnvVariable();
