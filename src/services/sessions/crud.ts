import type {BookSessions, CreateSession} from "../../validators/sessions";
import {PublicUser, sessionsTable, screenTable, movieTable, Session, moviesSeenTable} from "../../db/schema";
import {db} from "../../db/database";
import {and, between, eq, gte, lte, or, sql} from "drizzle-orm";
import { incrementTicketUsage, decrementTicketUsage, getTicketsById } from "../tickets/crud";
import { TicketError } from "../../errors/TicketsErrors";
import { SessionsError } from "../../errors/SessionsErrors";
import { getMovieById } from "../movies/crud";
import { getScreenById } from "../screens/crud";
import { NotFoundError } from "routing-controllers";


export async function getSessionById(id_session: number): Promise<Session>{
    const session = await db.select().from(sessionsTable)
        .where(eq(sessionsTable.id, id_session))
    
    if(session && session.length > 0){
        const ses = session[0]!
        const movie = await getMovieById(ses.idMovie);
        const cinema = await getScreenById(ses.idCinema);

        if (!movie) {
            throw new NotFoundError("Movie not found for this session");
        }
        if (!cinema) {
            throw new NotFoundError("Cinema not found for this session");
        }

        const enrichedSession: Session = {
            id: ses.id,
            movie: movie,
            cinema: cinema,
            dateMovie: new Date(ses.dateMovie),
            remaining_places: ses.remaining_places,
        };

        return enrichedSession;
    }
    throw new NotFoundError("This Sessions don't exist")
}

export async function createSession(session : CreateSession): Promise<Session>{
    if(await checkIdASessionsAlreadyExistInThisScreenAndDate(session)){
        throw new SessionsError("A Sessions is already created at the date for this screen", 403)
    }
    // Errors are handled inside their functions
    const movie = await getMovieById(session.idMovie)
    const screen = await getScreenById(session.idScreen)

    try{

        const res = await db.insert(sessionsTable).values({
            duration: movie.duration,
            idMovie: session.idMovie,
            idCinema: session.idScreen,
            dateMovie: new Date(session.dateMovie),
            remaining_places: screen.capacity
        }).returning()

        if(res && res.length > 0){
            const insertedRow = res[0]!;

            const sessionResult: Session = {
                id: insertedRow.id,
                movie: movie,
                cinema: screen,
                dateMovie: new Date(insertedRow.dateMovie),
                remaining_places: insertedRow.remaining_places,
            };

            return sessionResult;
        }
        throw new SessionsError("Failed to insert session into database");
    } catch (e){
        console.error(e)
        throw new SessionsError("Failed to create session");
    }
}

async function checkIdASessionsAlreadyExistInThisScreenAndDate(session: CreateSession): Promise<boolean> {
    const newSessionStart = new Date(session.dateMovie).toISOString();
    const newSessionEnd = new Date(new Date(session.dateMovie).getTime() + session.duration * 60 * 1000).toISOString();

    console.log("Session Start:", newSessionStart);
    console.log("Session End:", newSessionEnd);

    // Requête pour vérifier les sessions qui se chevauchent
    const overlappingSessions = await db
    .select({
        id: sessionsTable.id,
    })
    .from(sessionsTable)
    .where(
        and(
            eq(sessionsTable.idCinema, session.idScreen),
            or(
                // Une session existante commence entre le début et la fin de la nouvelle session
                between(sessionsTable.dateMovie, sql`${newSessionStart}`, sql`${newSessionEnd}`),
                // Une session existante se termine entre le début et la fin de la nouvelle session
                between(
                    sql`${sessionsTable.dateMovie} + make_interval(mins => ${session.duration + 14})`,
                    sql`${newSessionStart}`,
                    sql`${newSessionEnd}`
                ),
                // La nouvelle session englobe complètement une session existante
                and(
                    lte(sessionsTable.dateMovie, sql`${newSessionStart}`),
                    gte(
                        sql`${sessionsTable.dateMovie} + make_interval(mins => ${session.duration + 14})`,
                        sql`${newSessionEnd}`
                    )
                )
            )
        )
    );

    console.log("Overlapping Sessions:", overlappingSessions);

    return overlappingSessions.length > 0;
}






export async function deleteSession(id_session: number): Promise<boolean>{
    await getSessionById(id_session)
    try{
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

export async function bookSession(book_param: BookSessions, user: PublicUser, id_session: number): Promise<boolean> {
    // Utilisation d'une trasaction pour la cohérence dans la DB
    return await db.transaction(async (trx) => {
        try {
            await getTicketsById(book_param.ticket_id_used, user);

            const session = await getSessionById(id_session);

            const ticket = await incrementTicketUsage(book_param.ticket_id_used, user, book_param.nb_place_to_book, trx);
            if (!ticket) {
                throw new TicketError("Invalid ticket");
            }

            const movieSeenInserted = await insertMovieSeen(user.id, session.movie.id, session.dateMovie, trx);
            if (!movieSeenInserted) {
                throw new TicketError("Server Error");
            }

            const capacityReduced = await lowerCapacity(id_session, book_param.nb_place_to_book, trx);
            if (!capacityReduced) {
                throw new TicketError("Server Error");
            }

            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    });
}



export async function insertMovieSeen(user_id: number, movie_id: number, date_movie: Date, trx: any): Promise<boolean>{
    const moviesSeen = await trx.insert(moviesSeenTable).values({
        userId: user_id,
        movieId: movie_id,
        date: date_movie.toISOString(),
    }).returning();

    if(moviesSeen && moviesSeen.length > 0){
        return true
    }
    return false
}


export async function getAllSessionsByScreen(id_screen: number): Promise<Session[]> {
    const sessions = await db.select({
        id: sessionsTable.id,
        dateMovie: sessionsTable.dateMovie,
        remaining_places: sessionsTable.remaining_places,
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
        dateMovie: new Date(session.dateMovie),
        remaining_places: session.remaining_places,
    }));
}



export async function getAllSessionsByMovie(id_movie: number): Promise<Session[]> {
    const sessions = await db.select({
        id: sessionsTable.id,
        dateMovie: sessionsTable.dateMovie,
        remaining_places: sessionsTable.remaining_places,
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
        dateMovie: new Date(session.dateMovie),
        remaining_places: session.remaining_places,
    }));
}



// If someone book a Sessions
async function lowerCapacity(id_session: number, number_to_decrease: number, trx: any): Promise<boolean> {
    const capacityResult = await trx.select({ remaining_places: sessionsTable.remaining_places })
        .from(sessionsTable)
        .where(eq(sessionsTable.id, id_session));

    let currentCapacity;
    if (capacityResult.length > 0 && capacityResult[0]?.remaining_places !== undefined) {
        currentCapacity = capacityResult[0].remaining_places;
    } else {
        currentCapacity = 0;
        console.log("This session doesn't have a remaining_places count defined");
    }

    if (currentCapacity < number_to_decrease) {
        return false;
    }

    const res = await trx.update(sessionsTable)
        .set({
            remaining_places: sql`${sessionsTable.remaining_places} - ${number_to_decrease}`,
        })
        .where(eq(sessionsTable.id, id_session))
        .returning();

    if (res && res.length > 0) {
        return true;
    }
    return false;
}


/*
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

    const capacityResult = await db.select({ remaining_places: sessionsTable.remaining_places })
        .from(sessionsTable)
        .where(eq(sessionsTable.id, id_session));

    if (!capacityResult || capacityResult.length === 0) {
        return false;
    }


    let currentCapacity
    if (capacityResult.length > 0 && capacityResult[0]?.remaining_places !== undefined) {
        currentCapacity = capacityResult[0].remaining_places;
    } else {
        currentCapacity = 0
        console.log("This screen don't have a remaining_places defined")
    }

    if (currentCapacity + number_to_increase > maxCapacity) {
        return false;
    }

    const res = await db.update(sessionsTable)
        .set({
            remaining_places: sql`${sessionsTable.remaining_places} + ${number_to_increase}`
        })
        .where(eq(sessionsTable.id, id_session)).returning();

    if(res && res.length > 0){
        return true
    }
    return false
}
*/