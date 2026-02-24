export interface TErrorResponse {
  path: string;
  message: string;
}

export interface Tgeneric {
  statusCode: number;
  message: string;
  errorSources?: TErrorResponse[];
}
