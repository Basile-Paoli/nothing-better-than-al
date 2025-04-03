import { and, lt, eq } from "drizzle-orm";
import { db } from "../../db/database";
import { ticketTable } from "../../db/schema/tickets";
import { CreateTicketParam, MyTicket, Ticket, zCreateTicketParams} from "../../validators/tickets";
import { TicketError } from "../../errors/TicketsErrors";


export async function getTicketsByUserId(user_id: number): Promise<Ticket[] | null>{
    const validTickets = await db
    .select()
    .from(ticketTable)
    .where(
      eq(ticketTable.userId, user_id)
    );
    if (!validTickets || validTickets.length === 0) {
      throw new TicketError("Ce Ticket n'existe pas", 404)
    }
    return validTickets as Ticket[]
}

export async function getTicketsById(ticket_id: number, user_id: number): Promise<Ticket | null>{
    const validTickets = await db
    .select()
    .from(ticketTable)
    .where(
      and(
        //eq(ticketTable.userId, user_id),
        eq(ticketTable.id, ticket_id)
      )
    );
    console.log(validTickets, ticket_id)
    if (!validTickets || validTickets.length === 0) {
      throw new TicketError("Le Ticket n'existe pas1", 404)
    }
    return validTickets[0] as Ticket
}  

export async function getMyValidTickets(user_id: number): Promise<MyTicket[] | null> {

    const validTickets = await db.select()
      .from(ticketTable)
      .where(
        and(
          eq(ticketTable.userId, user_id),
          lt(ticketTable.used, ticketTable.max_usage)
        )
      )

    if (!validTickets || validTickets.length == 0) {
      throw new TicketError("Il n'y a pas de ticket valide", 404)
    }

    const validTicket = validTickets[0];

    if (!validTicket) {
      throw new TicketError("Ticket non valide", 403)
      }
    
    const myTickets: MyTicket[] = validTickets.map((validTicket) => ({
      id: validTicket.id,
      max_usage: validTicket.max_usage,
      used: validTicket.used,
      type: validTicket.type,
      buy_date: validTicket.buy_date,
    }));
    
    return myTickets;
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
        throw new TicketError("Échec de la création du ticket.")
    }

    return returnTicket;
}


export async function incrementUsed(ticket_id: number, user_id: number, nb_increment: number): Promise<Ticket | undefined> {
  console.log(ticket_id)
    const ticket = await getTicketsById(ticket_id, user_id);
  
    if (!ticket) {
      throw new TicketError("Le ticket spécifié n'existe pas.", 404)
    }
  
    if (ticket.used == ticket.max_usage) {
      throw new TicketError(`Ce ticket n'a plus d'utilisations disponible`, 403)
    }

    if(ticket.used + nb_increment > ticket.max_usage){
      throw new TicketError(`Il n'y a pas assez de place disponible sur ce ticket`, 403)
    }
  
    const updatedTicket = await db.update(ticketTable)
      .set({ used: ticket.used + nb_increment })
      .where(eq(ticketTable.id, ticket_id))
      .returning();

    if (!updatedTicket || updatedTicket.length === 0) {
      throw new TicketError("Échec de la mise à jour du ticket.")
    }
  
    return updatedTicket[0];
}