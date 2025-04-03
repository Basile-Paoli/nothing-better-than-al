import { and, lt, eq } from "drizzle-orm";
import { db } from "../../db/database";
import { ticketTable } from "../../db/schema/tickets";
import { CreateTicketParam, MyTicket, Ticket, zCreateTicketParams} from "../../validators/tickets";


export async function getTicketsByUserId(user_id: number): Promise<Ticket[]>{
    const validTickets = await db
    .select()
    .from(ticketTable)
    .where(
      eq(ticketTable.userId, user_id)
    );
    if (!validTickets || validTickets.length === 0) {
        var tic: Ticket[] = []
        return tic;
    }
    return validTickets as Ticket[]
}

export async function getTicketsById(ticket_id: number, user_id: number): Promise<Ticket>{
    const validTickets = await db
    .select()
    .from(ticketTable)
    .where(
      and(
        eq(ticketTable.userId, user_id),
        lt(ticketTable.used, ticketTable.max_usage)
      )
    );
    if (!validTickets || validTickets.length === 0) {
        throw new Error("This ticket don't exist.")
    }
    return validTickets[0] as Ticket
}  

export async function getMyValidTickets(user_id: number): Promise<MyTicket | null> {

    const validTickets = await db.select()
      .from(ticketTable)
      .where(
        and(
          eq(ticketTable.userId, user_id),
          lt(ticketTable.used, ticketTable.max_usage)
        )
      )
      .limit(1)

    if (!validTickets || validTickets.length == 0) {
      return null;
    }

    const validTicket = validTickets[0];

    if (!validTicket) {
        return null;
      }
    
    const myTicket: MyTicket = {
        id: validTicket.id,
        max_usage: validTicket.max_usage,
        used: validTicket.used,
        type: validTicket.type,
        buy_date: validTicket.buy_date
    }
    return myTicket
}

export async function createTicket(ticket: CreateTicketParam, user_id: number): Promise<Ticket | undefined> {
    const validatedTicket = zCreateTicketParams.parse(ticket);

    const [returnTicket] = await db
        .insert(ticketTable)
        .values({
            type: validatedTicket.type,
            used: validatedTicket.used ? validatedTicket.used : 0,
            max_usage: validatedTicket.max_usage,
            userId: user_id,
            buy_date: new Date().toISOString()
        })
        .returning()

    if (!returnTicket) {
        throw new Error("Échec de la création du ticket.");
    }

    return returnTicket;
}


export async function incrementUsedByOne(ticket_id: number, user_id: number): Promise<Ticket | undefined> {
    const ticket = await getTicketsById(ticket_id, user_id);
  
    if (!ticket) {
      throw new Error("Le ticket spécifié n'existe pas.");
    }
  
    if (ticket.used == ticket.max_usage) {
      throw new Error(`Ce ticket n'a plus d'utilisations disponible`);
    }
  
    const updatedTicket = await db.update(ticketTable)
      .set({ used: ticket.used + 1 })
      .where(eq(ticketTable.id, ticket_id))
      .returning();

    if (!updatedTicket || updatedTicket.length === 0) {
    throw new Error("Échec de la mise à jour du ticket.");
    }
  
    return updatedTicket[0];
}