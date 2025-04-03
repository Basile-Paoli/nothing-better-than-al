import { and, lt, eq } from "drizzle-orm";
import { db } from "../../db/database";
import { ticketTable } from "../../db/schema/tickets";
import { MyTicket, Ticket} from "../../validators/tickets";


export async function getTicketsByUserId(user_id: number): Promise<Ticket[] | null>{
    const validTickets = await db
    .select()
    .from(ticketTable)
    .where(
      eq(ticketTable.userId, user_id)
    );
    if (!validTickets || validTickets.length === 0) {
        return null;
    }
    return validTickets as Ticket[]
}

export async function getTicketsById(ticket_id: number): Promise<Ticket | null>{
    const validTickets = await db
    .select()
    .from(ticketTable)
    .where(
      eq(ticketTable.id, ticket_id)
    );
    if (!validTickets || validTickets.length === 0) {
        return null;
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

export async function createTicket(ticket: Omit<Ticket, 'id'>): Promise<Ticket | undefined> {
    const newTicket = await db.insert(ticketTable).values(ticket).returning();

    if (!newTicket || newTicket.length === 0) {
        throw new Error("Échec de la création du ticket.");
      }

    return newTicket[0];
}  

export async function incrementUsedByOne(ticket_id: number): Promise<Ticket | undefined> {
    const ticket = await getTicketsById(ticket_id);
  
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