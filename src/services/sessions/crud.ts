import type {BookSessions, CreateSession} from "../../validators/sessions";
import {PublicUser, sessionsTable, screenTable, movieTable, Session} from "../../db/schema";
import {db} from "../../db/database";
import {eq, sql} from "drizzle-orm";
import { incrementTicketUsage, decrementTicketUsage, getTicketsById } from "../tickets/crud";
import { TicketError } from "../../errors/TicketsErrors";
import { SessionsError } from "../../errors/SessionsErrors";
import { getMovieById } from "../movies/crud";
import { getScreenById } from "../screens/crud";


export async function getSessionById(id_session: number): Promise<Session>{
    const session = await db.select().from(sessionsTable)
        .where(eq(sessionsTable.id, id_session))
    
    if(session && session.length > 0){
        const ses = session[0]!
        const movie = await getMovieById(ses.idMovie);
        const cinema = await getScreenById(ses.idCinema);

        if (!movie) {
            throw new SessionsError("Movie not found for this session", 404);
        }
        if (!cinema) {
            throw new SessionsError("Cinema not found for this session", 404);
        }

        const enrichedSession: Session = {
            id: ses.id,
            movie: movie,
            cinema: cinema,
            duration: ses.duration,
            dateMovie: new Date(ses.dateMovie),
            spectator: ses.spectators,
        };

        return enrichedSession;
    }
    throw new SessionsError("This Sessions don't exist", 404)
}

export async function createSession(session : CreateSession): Promise<Session>{

    try{
        const movie = await getMovieById(session.idMovie)
        const screen = await getScreenById(session.idScreen)
        if(!movie){
            throw new SessionsError("This Movie don't exist", 404)
        }
        if(!screen){
            throw new SessionsError("This Room/Screen don't exist", 404)
        }

        const res = await db.insert(sessionsTable).values({
            duration: movie.duration,
            idMovie: session.idMovie,
            idCinema: session.idScreen,
            dateMovie: session.dateMovie.toISOString(),
            spectators: screen.capacity
        }).returning()

        if(res && res.length > 0){
            const insertedRow = res[0]!;

            const sessionResult: Session = {
                id: insertedRow.id,
                movie: movie,
                cinema: screen,
                duration: insertedRow.duration,
                dateMovie: new Date(insertedRow.dateMovie),
                spectator: insertedRow.spectators,
            };

            return sessionResult;
        }
        throw new SessionsError("Failed to insert session into database");
    } catch (e){
        console.error(e)
        throw new SessionsError("Failed to create session");
    }
}

export async function deleteSession(id_session: number): Promise<boolean>{
    try{
        const resSession = await getSessionById(id_session)
        if(!resSession){

        }

        const res = await db.delete(sessionsTable)
        .where(eq(sessionsTable.id, id_session))
        .returning()
    
        if(res && res.length > 0){
            return true
        }
        return false
    } catch (e){
        console.error(e)
        throw new SessionsError("Failed to delete Sessions")
    }
}

export async function bookSession(book_param: BookSessions, user: PublicUser, id_session: number): Promise<boolean>{

    // Verif if it's my ticket
    await getTicketsById(book_param.ticket_id_used, user)

	const ticket = await incrementTicketUsage(book_param.ticket_id_used, user, book_param.nb_place_to_book)
	if(!ticket){
		throw new TicketError("Invalid ticket")
	}

    if(!await lowerCapacity(id_session, book_param.nb_place_to_book)){
        await decrementTicketUsage(book_param.ticket_id_used, user, book_param.nb_place_to_book)
    }
	return true
}


export async function getAllSessionsByScreen(id_screen: number): Promise<Session[]> {
    const sessions = await db.select({
        id: sessionsTable.id,
        duration: sessionsTable.duration,
        dateMovie: sessionsTable.dateMovie,
        spectators: sessionsTable.spectators,
        movie: {
            id: movieTable.id,
            name: movieTable.name,
            duration: movieTable.duration,
        },
        cinema: {
            id: screenTable.id,
            name: screenTable.name,
            description: screenTable.description,
            imageUrl: screenTable.imageUrl,
            type: screenTable.type,
            capacity: screenTable.capacity,
            disability: screenTable.disability,
        },
    })
    .from(sessionsTable)
    .innerJoin(movieTable, eq(sessionsTable.idMovie, movieTable.id))
    .innerJoin(screenTable, eq(sessionsTable.idCinema, screenTable.id))
    .where(eq(screenTable.id, id_screen));

    return sessions.map((session) => ({
        id: session.id,
        movie: session.movie,
        cinema: session.cinema,
        duration: session.duration,
        dateMovie: new Date(session.dateMovie),
        spectator: session.spectators,
    }));
}



export async function getAllSessionsByMovie(id_movie: number): Promise<Session[]> {
    const sessions = await db.select({
        id: sessionsTable.id,
        duration: sessionsTable.duration,
        dateMovie: sessionsTable.dateMovie,
        spectators: sessionsTable.spectators,
        movie: {
            id: movieTable.id,
            name: movieTable.name,
            duration: movieTable.duration,
        },
        cinema: {
            id: screenTable.id,
            name: screenTable.name,
            description: screenTable.description,
            imageUrl: screenTable.imageUrl,
            type: screenTable.type,
            capacity: screenTable.capacity,
            disability: screenTable.disability,
        },
    })
    .from(sessionsTable)
    .innerJoin(movieTable, eq(sessionsTable.idMovie, movieTable.id))
    .innerJoin(screenTable, eq(sessionsTable.idCinema, screenTable.id))
    .where(eq(movieTable.id, id_movie))

    return sessions.map((session) => ({
        id: session.id,
        movie: session.movie,
        cinema: session.cinema,
        duration: session.duration,
        dateMovie: new Date(session.dateMovie),
        spectator: session.spectators,
    }));
}













// If someone book a Sessions
async function lowerCapacity(id_session: number, number_to_decrease: number): Promise<boolean> {
    const capacityResult = await db.select({ spectator: sessionsTable.spectators })
        .from(sessionsTable)
        .where(eq(sessionsTable.id, id_session));

    let currentCapacity;
    if (capacityResult.length > 0 && capacityResult[0]?.spectator !== undefined) {
        currentCapacity = capacityResult[0].spectator;
    } else {
        currentCapacity = 0;
        console.log("This session doesn't have a spectator count defined");
    }

    if (currentCapacity < number_to_decrease) {
        return false;
    }

    const res = await db.update(sessionsTable)
        .set({
            spectators: sql`${sessionsTable.spectators} - ${number_to_decrease}`
        })
        .where(eq(sessionsTable.id, id_session))
        .returning();

    if (res && res.length > 0) {
        return true;
    }
    return false;
}

// If someone cancel his reservation
async function upCapacity(id_screen: number, number_to_increase: number, id_session: number): Promise<boolean> {

    const maxCapacityResult = await db.select({capacity: screenTable.capacity})
    .from(screenTable)
    .where(eq(screenTable.id, id_screen))

    let maxCapacity
    if (maxCapacityResult.length > 0 && maxCapacityResult[0]?.capacity !== undefined) {
        maxCapacity = maxCapacityResult[0].capacity;
    } else {
        throw new SessionsError("This screen don't have a capacity defined")
    }

    const capacityResult = await db.select({ spectator: sessionsTable.spectators })
        .from(sessionsTable)
        .where(eq(sessionsTable.id, id_session));

    if (!capacityResult || capacityResult.length === 0) {
        return false;
    }


    let currentCapacity
    if (capacityResult.length > 0 && capacityResult[0]?.spectator !== undefined) {
        currentCapacity = capacityResult[0].spectator;
    } else {
        currentCapacity = 0
        console.log("This screen don't have a spectator defined")
    }

    if (currentCapacity + number_to_increase > maxCapacity) {
        return false;
    }

    const res = await db.update(sessionsTable)
        .set({
            spectators: sql`${sessionsTable.spectators} + ${number_to_increase}`
        })
        .where(eq(sessionsTable.id, id_session)).returning();

    if(res && res.length > 0){
        return true
    }
    return false
}
