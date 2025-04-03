import { HttpError } from "routing-controllers";

export class TicketError extends HttpError {
    name: string;
    constructor(message?: string, errorCode?: number) {
        super(errorCode || 500, message || "Ticket error occurred");
        this.name = "TicketError";
      }
}