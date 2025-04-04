import { Authorized, Body, CurrentUser, Get, JsonController, Patch, Post, QueryParam } from "routing-controllers";
import { RequestBody, ResponseBody } from "../open-api/decorators";
import { PublicUser } from "../db/schema";
import {z} from "zod";
import { zMyAccount, zMyBalance, Account, zDepositMoneyBalance } from "../validators/accounts";
import { MyTicket, Ticket, zCreateTicketParams, zUpdateTicketParams } from "../validators/tickets";
import { zTicket} from "../validators/tickets";
import { getAccountData } from "../services/accounts/crud";
import { depositPersonnalMoney, getPersonnalBalance } from "../services/balances/crud";
import { createTicket, getMyValidTickets, getTicketsById, getTicketsByUserId, incrementUsed } from "../services/tickets/crud";

@JsonController('/account')
export class AccountController {

    @Get('/')
    @Authorized()
    @ResponseBody(200, z.array(zMyAccount))
    async getAccount(@QueryParam('role') role: unknown, @CurrentUser() user: PublicUser): Promise<Account> {
        return getAccountData(user)
    }

    @Get('/balance')
    @Authorized()
    @ResponseBody(200, z.array(zMyBalance))
    async getBalance(@CurrentUser() user: PublicUser): Promise<Number>{
        return getPersonnalBalance(user)
    }

    // ---------------------------------------------------- //

    @Get('/ticket')
    @Authorized()
    @ResponseBody(200, z.array(zTicket))
    async getTicket(@CurrentUser() user: PublicUser): Promise<Ticket[] | null>{
        return getTicketsByUserId(user.id)
    }

    @Get('/ticket/valid')
    @Authorized()
    @ResponseBody(200, z.array(zTicket))
    async getValidTicket(@CurrentUser() user: PublicUser): Promise<MyTicket[] | null>{
        return getMyValidTickets(user.id)
    }

    @Get('/ticket/:id')
    @Authorized()
    @ResponseBody(200, z.array(zTicket))
    async getTicketById(@CurrentUser() user: PublicUser, @QueryParam('id') ticket_id: number): Promise<MyTicket | null>{
        return getTicketsById(ticket_id, user.id)
    }

    // ---------------------------------------------------- //

    @Post('/ticket')
    @Authorized()
    @RequestBody(zCreateTicketParams)
    @ResponseBody(200, z.array(zTicket))
    async buyTicket(@CurrentUser() user: PublicUser, @Body() body: unknown): Promise<Ticket | undefined>{

        const ticketParams = zCreateTicketParams.parse(body)
        return createTicket(ticketParams, user.id)
    }

    // ---------------------------------------------------- //

    /*@Patch('/ticket/update')
    @Authorized()
    @RequestBody(zUpdateTicketParams)
    @ResponseBody(200, z.array(zTicket))
    async updateTicket(@CurrentUser() user: PublicUser, @Body() body: unknown): Promise<MyTicket | undefined>{
        const ticketParams = zUpdateTicketParams.parse(body)
        const res = incrementUsed(ticketParams.ticket_id, user.id, ticketParams.nb_increment)
        if(res != undefined){
            /*const movRes = registerUserToMovies()
            if(!movRes){
                return decrementUsed()
            }*/
        /*}
        return res
    }*/
        
    @Patch('/balance')
    @Authorized()
    @ResponseBody(200, z.array(zTicket))
    async depositMoney(@CurrentUser() user: PublicUser,  @Body() body: unknown): Promise<boolean>{
        const amount = zDepositMoneyBalance.parse(body)
        return depositPersonnalMoney(user, amount)
    }
}
