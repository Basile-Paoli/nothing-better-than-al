import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post } from "routing-controllers";
import { RequestBody, ResponseBody } from "../open-api/decorators";
import { PublicUser, Session } from "../db/schema";
import {zBookSessionsParams, zCreateSessions, zSessions} from "../validators/sessions";
import { bookSession, getAllSessionsByScreen, getAllSessionsByMovie, getSessionById, createSession, deleteSession } from "../services/sessions/crud";
import { zId } from "../validators/utils";

@JsonController('/sessions')
export class SessionsController {

    @Get('/:id')
    @ResponseBody(200, zSessions)
    async getSessionById(@Param('id') id_session: number): Promise<Session> {
        zId.parse(id_session)
        return await getSessionById(id_session)
    }

    @Get('/screen/:id')
    @ResponseBody(200, zSessions)
    async getAllSessionsByScreen(@Param('id') id_screen: number): Promise<Session[]> {
        zId.parse(id_screen)
        return await getAllSessionsByScreen(id_screen)
    }

    @Get('/movie/:id')
    @ResponseBody(200, zSessions)
    async getAllSessionsByMovie(@Param('id') id_movie: number,): Promise<Session[]> {
        zId.parse(id_movie)
        return await getAllSessionsByMovie(id_movie)
    }

    @Post('/create')
    @Authorized('admin')
    @RequestBody(zCreateSessions)
    @ResponseBody(200, zSessions)
    async createSession(@Body() sessionData: unknown): Promise<Session> {
        const validatedData = zCreateSessions.parse(sessionData)
        return await createSession(validatedData)
    }

    @Post('/:id/book')
    @Authorized()
    @RequestBody(zBookSessionsParams)
    @ResponseBody(200, zSessions)
    async bookScreenning(@CurrentUser() user: PublicUser, @Param('id') id_session: number, @Body() screenData: unknown): Promise<boolean> {
        const validatedData = zBookSessionsParams.parse(screenData)
        return await bookSession(validatedData, user, id_session)
    }

    @Delete('/:id')
    @Authorized('admin')
    @ResponseBody(200, zSessions)
    async deleteSessionById(@Param('id') id_session: number): Promise<boolean> {
        zId.parse(id_session)
        return await deleteSession(id_session)
    }

}