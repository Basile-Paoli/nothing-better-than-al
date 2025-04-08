import { Authorized, Body, CurrentUser, Get, JsonController, Param, Patch, Post, QueryParam } from "routing-controllers";
import { RequestBody, ResponseBody } from "../open-api/decorators";
import { PublicUser } from "../db/schema";
import { z} from "zod";
import { zMyAccount, zMyBalance, Account, zDepositMoneyBalance, Balance } from "../validators/accounts";
import { MyTicket, Ticket, zCreateTicketParams } from "../validators/tickets";
import { zTicket} from "../validators/tickets";
import { getAccountData } from "../services/accounts/crud";
import { depositPersonnalMoney, getPersonnalBalance, getPersonnalHistoryBalance } from "../services/balances/crud";
import { createTicket, getMyValidTickets, getTicketsById, getTicketsByUserId } from "../services/tickets/crud";
import { zId } from "../validators/utils";

@JsonController('/account')
export class AccountController {

    @Get('/')
    @Authorized()
    @ResponseBody(200, z.array(zMyAccount))
    async getAccount(@QueryParam('role') role: unknown, @CurrentUser() user: PublicUser): Promise<Account> {
        let balance = 0
        try{balance = await getPersonnalBalance(user)}catch(e){console.error(e)}
        let cleanUser: any = {
            email: user.email,
            role: user.role,
            id : user.id,
            balance: balance
        }
        return getAccountData(cleanUser)
    }

    @Get('/balance')
    @Authorized()
    @ResponseBody(200, z.array(zMyBalance))
    async getBalance(@CurrentUser() user: PublicUser): Promise<number>{
        return getPersonnalBalance(user)
    }

    @Get('/balance/history')
    @Authorized()
    @ResponseBody(200, z.array(zMyBalance))
    async getHistoryBalance(@CurrentUser() user: PublicUser): Promise<Balance[] | null>{
        return getPersonnalHistoryBalance(user)
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
    async getTicketById(@CurrentUser() user: PublicUser, @Param('id') ticket_id: number): Promise<MyTicket | null>{
        const validData = zId.parse(ticket_id)
        console.log(validData)
        return getTicketsById(ticket_id, user)
    }

    // ---------------------------------------------------- //

    @Post('/ticket')
    @Authorized()
    @RequestBody(zCreateTicketParams)
    @ResponseBody(200, z.array(zTicket))
    async buyTicket(@CurrentUser() user: PublicUser, @Body() body: unknown): Promise<Ticket | undefined>{

        const ticketParams = zCreateTicketParams.parse(body)
        return createTicket(ticketParams, user)
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
