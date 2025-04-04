import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { RequestBody, ResponseBody } from "../open-api/decorators";
import { PublicUser, Session } from "../db/schema";
import {zBookSessionsParams, zSessions} from "../validators/sessions";
import { bookSession, getAllSessionsByScreen, getAllSessionsByMovie } from "../services/sessions/crud";

@JsonController('/sessions')
export class SessionsController {

    @Get('/screen/:id')
    @ResponseBody(200, zSessions)
    async getAllSessionsByScreen(@Param('id') id_screen: number): Promise<Session[]> {
        return await getAllSessionsByScreen(id_screen)
    }

    @Get('/movie/:id')
    @ResponseBody(200, zSessions)
    async getAllSessionsByMovie(@Param('id') id_movie: number,): Promise<Session[]> {
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