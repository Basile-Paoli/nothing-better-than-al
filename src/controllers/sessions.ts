import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { RequestBody, ResponseBody } from "../open-api/decorators";
import { PublicUser } from "../db/schema";
import {zBookSessionsParams, zSessions, Sessions} from "../validators/sessions";
import { bookSession, getAllSessionsByScreen, getAllSessionsByMovie } from "../services/sessions/crud";
import { zId } from "../validators/utils";

@JsonController('/sessions')
export class AccountController {

    @Get('/screen/:id')
    @ResponseBody(200, zSessions)
    async getAllSessionsByScreen(@Param('id') id_screen: number): Promise<Sessions[]> {
        return await getAllSessionsByScreen(id_screen)
    }

    @Get('/movie/:id')
    @ResponseBody(200, zSessions)
    async getAllSessionsByMovie(@Param('id') id_movie: number,): Promise<Sessions[]> {
        return await getAllSessionsByMovie(id_movie)
    }

    @Post('/:id/book')
    @Authorized()
    @RequestBody(zBookSessionsParams)
    @ResponseBody(200, zSessions)
    async bookScreenning(@CurrentUser() user: PublicUser, @Param('id') id_session: number, @Body() screenData: unknown): Promise<boolean> {
        const validatedData = zBookSessionsParams.parse(screenData)
        return await bookSession(validatedData, user, id_session)
    }


}