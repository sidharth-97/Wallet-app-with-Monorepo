import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import db from "@repo/db/client"

export const authOptions={
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"email",type:"text",placeholder:"sample@gmail.com"},
                password:{label:"password",type:"password"}
            },
            async authorize(credentials:any){
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const existingUser=await db.user.findFirst({
                    where:{
                        email:credentials.email
                    }
                })
                if(existingUser){
                    const passwordValidation=await bcrypt.compare(credentials.password,existingUser.password)
                    if(passwordValidation){
                        return{
                            id:existingUser.id.toString(),
                            name:existingUser.name,
                            email:existingUser.email
                        }
                    }
                    return null
                }
                try {
                    const user=await db.user.create({
                        data:{
                            email:credentials.email,
                            password:hashedPassword
                        }
                    })
                    return{
                        id:user.id.toString(),
                            name:user.name,
                            email:user.email
                    }
                } catch (error) {
                    console.log(error);
                    
                }
                return null
            }
        })
    ],
    secret:process.env.JWT_SECRET || "secret",
    callbacks:{
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session
        }
    }
}