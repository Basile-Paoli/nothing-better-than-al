import {db} from "../../db/database";
import {eq} from "drizzle-orm";
import { PublicUser, userTable } from "../../db/schema";
import { UpdateBalance } from "../../validators/accounts";
import { BalanceError } from "../../errors/BalancesErrors";
import { balanceTable } from "../../db/schema/balances";

export async function getPersonnalBalance(user: PublicUser): Promise<number>{
    
    const res = await db.select({
        balance: userTable.balance,
    })
        .from(userTable)
        .where(
            eq(userTable.id, user.id)
        )

    if (!res || res.length == 0) {
        throw new BalanceError("No Balance for you")
    }
    
    return res[0]?.balance ? res[0]?.balance : 0
}

export async function depositPersonnalMoney(user: PublicUser, param: UpdateBalance): Promise<boolean>{

    const createBalanceRes = await db.insert(balanceTable)
    .values({
        user_id: user.id,
        deposit_amount: param.balance,
        deposit_date: new Date().toISOString()
    })

    if(!createBalanceRes){
        throw new BalanceError("Impossible to deposit an amount")
    }


    const res = await db.update(userTable)
        .set(param)
        .where(eq(userTable.id, user.id))
        .returning()

    if(!res || res.length == 0){
        throw new BalanceError("Impossible to deposit an amount in the account")
    }

    return true
}