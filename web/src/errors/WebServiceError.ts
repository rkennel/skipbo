import { AxiosError } from "axios";

export class WebServiceError extends Error {
  axiosError: AxiosError;
  status: number;
  statusText: string;

  constructor(axiosError: AxiosError) {
    super();

    const axiosResponse = axiosError.response;

    this.axiosError = axiosError;
    this.message = axiosResponse
      ? axiosResponse.statusText
      : axiosError.message;
    this.name = "Web Service Error";
    this.status = axiosResponse ? axiosResponse.status : -1;
    this.statusText = axiosResponse ? axiosResponse.statusText : "Undefined";
    this.axiosError = axiosError;
  }
}
