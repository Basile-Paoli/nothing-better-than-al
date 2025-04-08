import {db} from "../../db/database";
import {desc, eq, sql} from "drizzle-orm";
import { PublicUser, userTable } from "../../db/schema";
import { UpdateBalance, Balance } from "../../validators/accounts";
import { BalanceError } from "../../errors/BalancesErrors";
import { balanceTable } from "../../db/schema/balances";
import { NotFoundError } from "routing-controllers";

export async function getPersonnalBalance(user: PublicUser): Promise<number>{
    
    const res = await db.select({
        balance: userTable.balance,
    })
        .from(userTable)
        .where(
            eq(userTable.id, user.id)
        )

    if (!res || res.length == 0) {
        throw new NotFoundError("No Balance for you")
    }
    
    return res[0]?.balance ? res[0]?.balance : 0
}

export async function getPersonnalHistoryBalance(user: PublicUser): Promise<Balance[]>{
    const res = await db.select()
        .from(balanceTable)
        .where(
            eq(balanceTable.user_id, user.id)
        )
        .orderBy(desc(balanceTable.deposit_date))

    if (!res || res.length == 0) {
        throw new NotFoundError("No Balance for you")
    }

    console.log(res)

    const balancesHistory: Balance[] = res.map((item) => ({
        id: item.id,
        user_id: item.user_id,
        deposit_amount: item.deposit_amount,
        deposit_date: new Date(item.deposit_date),
    }));
    
    return balancesHistory
}

export async function depositPersonnalMoney(user: PublicUser, param: UpdateBalance): Promise<boolean>{

    const createBalanceRes = await db.insert(balanceTable)
    .values({
        user_id: user.id,
        deposit_amount: param.balance,
        deposit_date: new Date()
    })

    if(!createBalanceRes){
        throw new BalanceError("Impossible to deposit an amount")
    }


    const res = await db.update(userTable)
        .set({
            balance: sql`${userTable.balance} + ${param.balance}`
        })
        .where(eq(userTable.id, user.id))
        .returning()

    if(!res || res.length == 0){
        throw new BalanceError("Impossible to deposit an amount in the account")
    }

    return true
}