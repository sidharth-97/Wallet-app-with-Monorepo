import GoogleProvider from "next-auth/providers/google"
import db from "@repo/db/client"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
        async signIn({ account, profile }:any) {
                console.log(profile.email,profile.name);
                const existingUser=await db.user.findFirst({
                    where:{
                        email:profile.email
                    }
                })
                if(existingUser)return true
                try {
                    const merchant=await db.merchant.create({
                        data:{
                            email:profile.email,
                            name:profile.name,
                            auth_type:"Google"
                        }
                    })
                    return{
                        id:merchant.id.toString(),
                            name:merchant.name,
                            email:merchant.email
                    }
                } catch (error) {
                    console.log(error);
                    
                }
            
            return true 
        }
        
      }
  }