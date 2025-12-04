import { User } from "@prisma/client";
import genaretTocken from "../helper/genareteTocken";
import { envVars } from "../config/env";

const createUserTocken = (user: User) => {
  const JwtPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };

  const accessTocken = genaretTocken(
    JwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRE
  );
  const refreshTocken = genaretTocken(
    JwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRE
  );
  return {
    accessTocken,
    refreshTocken,
  };
};

export default createUserTocken;
