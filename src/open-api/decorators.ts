import {ZodObject, type ZodRawShape, ZodType} from "zod";
import {OpenAPI} from "routing-controllers-openapi";
import {createSchema} from "zod-openapi";

export function RequestBody(schema: ZodType) {
	return OpenAPI({
		requestBody: {
			content: {
				'application/json': {
					schema: createSchema(schema).schema
				}
			}
		}
	})
}

export function RequestParams(schema: ZodObject<ZodRawShape>) {
	return OpenAPI({
		parameters: Object.keys(schema.shape).map(key => ({
			in: 'query',
			name: key,
			schema: createSchema(schema.pick({[key]: true})).schema
		}))
	})
}

export function ResponseBody(code: number, schema: ZodType) {
	return OpenAPI({
		responses: {
			[code]: {
				content: {
					'application/json': {
						schema: createSchema(schema).schema
					}
				}
			}
		}
	})
}