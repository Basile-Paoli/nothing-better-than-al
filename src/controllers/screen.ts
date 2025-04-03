import {
    Authorized,
    Body,
    Delete,
    Get,
    HttpCode,
    JsonController,
    OnUndefined,
    Param,
    Patch,
    Post
} from "routing-controllers";
import {RequestBody, ResponseBody} from "../open-api/decorators";
import {zCreateScreenParams, zScreen, zUpdateScreenParams} from "../validators/screens";
import {createScreen, deleteScreen, getScreenById, getScreens, updateScreen} from "../services/screens/crud";
import {z} from "zod";
import type {Screen} from "../db/schema";
import {zId} from "../validators/utils";

@JsonController('/screens')
@Authorized()
export class ScreenController {
    @Get('/')
    @ResponseBody(200, z.array(zScreen))
    async getScreens(): Promise<Screen[]> {
        return getScreens();
    }

    @Get('/:id')
    @ResponseBody(200, zScreen)
    async getScreen(@Param('id') id: string): Promise<Screen> {
        const validatedId = zId.parse(id);
        return await getScreenById(validatedId);
    }

    @Post('/')
    @Authorized('admin')
    @HttpCode(201)
    @RequestBody(zCreateScreenParams)
    @ResponseBody(201, zScreen)
    async addScreen(@Body() screenData: unknown): Promise<Screen> {
        const validatedData = zCreateScreenParams.parse(screenData);
        return await createScreen(validatedData);
    }

    @Patch('/:id')
    @Authorized('admin')
    @RequestBody(zUpdateScreenParams)
    @ResponseBody(200, zScreen)
    async updateScreen(@Param('id') id: string, @Body() screenData: unknown): Promise<Screen> {
        const validatedData = zUpdateScreenParams.parse(screenData);
        const validatedId = zId.parse(id);
        return await updateScreen(validatedId, validatedData);
    }

    @Delete('/:id')
    @Authorized('admin')
    @HttpCode(204)
    @OnUndefined(204)
    async deleteScreen(@Param('id') id: string) {
        const validatedId = zId.parse(id);
        await deleteScreen(validatedId);
    }
}
