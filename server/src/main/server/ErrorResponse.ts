export class ErrorResponse {
  httpStatus: number;
  errorMessage: string;

  constructor(httpStatus: number, message: string) {
    this.httpStatus = httpStatus;
    this.errorMessage = message;
  }
}
