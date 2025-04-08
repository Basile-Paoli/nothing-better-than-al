import { HttpError } from "routing-controllers";

export class SessionsError extends HttpError {
    name: string;
    constructor(message?: string, errorCode?: number) {
        super(errorCode || 500, message || "Screening error occurred");
        this.name = "SessionsError";
      }
}