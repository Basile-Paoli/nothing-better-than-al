import {db} from "../../db/database";
import {eq} from "drizzle-orm";
import {NotFoundError} from "routing-controllers";
import { PublicUser, movieTable, moviesSeenTable } from "../../db/schema";
import { MoviesSeen } from "../../validators/movies";
import { Account } from "../../validators/accounts";
import { MyTicket } from "../../validators/tickets";
import { getMyMovies } from "../movies/crud"
import { getMyValidTickets } from "../tickets/crud"

export async function getAccountData(user: PublicUser): Promise<Account>{
    const movies: MoviesSeen = await getMyMovies(user.id)
    const tickets: MyTicket | null = await getMyValidTickets(user.id)
    
    const account: Account = {
        user: user,
        movies: movies,
        balance:10,
        last_ticket: tickets
    }
    return account
}