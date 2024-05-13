import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import db from "@repo/db/client"

export const authOptions={
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                number:{label:"number",type:"text",placeholder:"9876543210"},
                password:{label:"password",type:"password"}
            },
            async authorize(credentials:any){
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const existingUser=await db.user.findFirst({
                    where:{
                        number:credentials.number
                    }
                })
                if(existingUser){
                    const passwordValidation=await bcrypt.compare(credentials.password,existingUser.password)
                    if(passwordValidation){
                        return{
                            id:existingUser.id.toString(),
                            name:existingUser.name,
                            number:existingUser.number
                        }
                    }
                    return null
                }
                try {
                    const user=await db.user.create({
                        data:{
                            number:credentials.number,
                            password:hashedPassword
                        }
                    })
                    return{
                        id:user.id.toString(),
                            name:user.name,
                            number:user.number
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