import { getServerSession } from "next-auth"
import { SendCard } from "../../../components/sendCard"
import { authOptions } from "../../../lib/auth"
import prisma from "@repo/db/client"
import { OnRampTransactions } from "../../../components/onRampTransaction"
import { P2PTransactions } from "../../../components/p2pTxn"

async function getP2PTxn(){
    const session=await getServerSession(authOptions)
    const txns=await prisma.p2pTransfer.findMany({
        where:{
            OR:[
                {fromUserId:Number(session?.user.id)},
                {toUserId:Number(session?.user.id)}
            ]
        }
    })
    return txns.map(t=>({
        time:t.timestamp,
        amount:t.amount,
        status:(t.toUserId==session?.user?.id)?"Received":"Sent",
    }))
}

export default async function() {
    const transactions=await getP2PTxn()
    return <div className="flex w-full justify-top h-screen items-center p-2">
        <div className="w-1/2">

        <SendCard />
        </div>
        <div className="w-1/2">

        <P2PTransactions transactions={transactions}/>
        </div>
    </div>
}