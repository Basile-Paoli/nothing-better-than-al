import { Body, CurrentUser, Get, JsonController, Patch, Post, QueryParam } from "routing-controllers";
import { RequestBody, ResponseBody } from "../open-api/decorators";
import { PublicUser } from "../db/schema";
import {z} from "zod";
import { zMyAccount, zMyBalance, Account } from "../validators/accounts";
import { MyTicket, Ticket, zCreateTicketParams, zUpdateTicketParams } from "../validators/tickets";
import { zTicket} from "../validators/tickets";
import { getAccountData } from "../services/accounts/crud";
import { createTicket, getMyValidTickets, getTicketsById, getTicketsByUserId, incrementUsedByOne } from "../services/tickets/crud";

@JsonController('/account')
export class AccountController {

    @Get('/')
    @ResponseBody(200, z.array(zMyAccount))
    async getAccount(@QueryParam('role') role: unknown, @CurrentUser() user: PublicUser): Promise<Account> {
        return getAccountData(user)
    }

    @Get('/balance')
    @ResponseBody(200, z.array(zMyBalance))
    async getBalance(@CurrentUser() user: PublicUser): Promise<Number>{
        return 10
    }

    // ---------------------------------------------------- //

    @Get('/ticket')
    @ResponseBody(200, z.array(zTicket))
    async getTicket(@CurrentUser() user: PublicUser): Promise<Ticket[] | null>{
        return getTicketsByUserId(user.id)
    }

    @Get('/ticket/valid')
    @ResponseBody(200, z.array(zTicket))
    async getValidTicket(@CurrentUser() user: PublicUser): Promise<MyTicket | null>{
        return getMyValidTickets(user.id)
    }

    @Get('/ticket/:id')
    @ResponseBody(200, z.array(zTicket))
    async getTicketById(@CurrentUser() user: PublicUser, @QueryParam('id') ticket_id: number): Promise<MyTicket | null>{
        return getTicketsById(ticket_id)
    }

    // ---------------------------------------------------- //

    @Post('/ticket')
    @RequestBody(zCreateTicketParams)
    @ResponseBody(200, z.array(zTicket))
    async buyTicket(@CurrentUser() user: PublicUser, @Body() body: unknown): Promise<Ticket | undefined>{

        const ticketParams = zCreateTicketParams.parse(body)
        return createTicket(ticketParams, user.id)
    }

    // ---------------------------------------------------- //

    @Patch('/ticket/update/:ticket_id')
    @ResponseBody(200, z.array(zTicket))
    async updateTicket(@CurrentUser() user: PublicUser, @QueryParam('ticket_id') ticket_id: number): Promise<MyTicket | undefined>{
        return incrementUsedByOne(ticket_id)
    }
        
    @Patch('/balance')
    @ResponseBody(200, z.array(zTicket))
    async depositMoney(@CurrentUser() user: PublicUser): Promise<boolean>{
        return true
    }
}
