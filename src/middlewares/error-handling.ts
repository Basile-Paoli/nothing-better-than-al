import type {Request, Response} from "express";
import {type ExpressErrorMiddlewareInterface, HttpError, Middleware} from "routing-controllers";
import {ZodError} from "zod";

@Middleware({type: 'after'})
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
	// Handle any known error type before sending a generic 500 error
	error(error: unknown, request: Request, response: Response) {
		if (error instanceof ZodError) {
			response.status(400).send(formatZodError(error))
			return
		}
		console.error(error);

		if (error instanceof HttpError) {
			response.status(error.httpCode).send({message: error.message})
			return
		}
		response.status(500).send({message: 'Internal server error'})
	}
}

function formatZodError(error: ZodError) {
	return error.issues.reduce<Record<string, string>>((acc, issue) => {
		acc[issue.path.join('.')] = issue.message
		return acc
	}, {})
}