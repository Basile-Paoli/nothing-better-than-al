import type {CreateScreenParams, UpdateScreenParams} from "../../validators/screens";
import {type Screen, screenTable} from "../../db/schema";
import {db} from "../../db/database";
import {eq} from "drizzle-orm";
import {NotFoundError} from "routing-controllers";

export async function createScreen(params: CreateScreenParams): Promise<Screen> {
	const [screen] = await db.insert(screenTable)
		.values(params)
		.returning();

	return screen!;
}

export async function updateScreen(id: number, params: UpdateScreenParams) {
	const [screen] = await db.update(screenTable)
		.set(params)
		.where(eq(screenTable.id, id))
		.returning();
	if (!screen) {
		throw new NotFoundError('Screen not found');
	}

	return screen;
}

export async function deleteScreen(id: number): Promise<void> {
	const [screen] = await db.delete(screenTable)
		.where(eq(screenTable.id, id))
		.returning();
	if (!screen) {
		throw new NotFoundError('Screen not found');
	}
}

export async function getScreens(): Promise<Screen[]> {
	return db.select().from(screenTable);
}

export async function getScreenById(id: number): Promise<Screen> {
	const [screen] = await db.select()
		.from(screenTable)
		.where(eq(screenTable.id, id));

	if (!screen) {
		throw new NotFoundError('Screen not found');
	}

	return screen;
}
