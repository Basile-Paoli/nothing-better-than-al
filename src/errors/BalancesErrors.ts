import { HttpError } from "routing-controllers";

export class BalanceError extends HttpError {
    name: string;
    constructor(message?: string, errorCode?: number) {
        super(errorCode || 500, message || "Balance error occurred");
        this.name = "BalanceError";
      }
}