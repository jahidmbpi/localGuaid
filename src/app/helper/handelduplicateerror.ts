import { Tgeneric } from "../interface/error.types";

export const handleDuplicateError = (err: any): Tgeneric => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  return {
    statusCode: 400,
    message: `${matchedArray ? matchedArray[1] : "Field"} already exists`,
  };
};
