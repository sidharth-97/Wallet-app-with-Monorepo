import { PrismaClient } from "@repo/db/client"
import { NextResponse } from "next/server"

const client=new PrismaClient()

export const GET=async ()=>{
    await client.user.create({
        data:{
            email:"sample@gmail.com",
            name:"abcd"
        }
    })
    return NextResponse.json({
        message:"success"
    })
}