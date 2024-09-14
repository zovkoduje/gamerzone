import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/mongodb"
import { getServerSession } from 'next-auth'

const adminEmails= ['zovkoduje98@gmail.com','uniritest@gmail.com']
export const authOptions= {
  secret: process.env.SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })  
  ],
  adapter: MongoDBAdapter(client),
  callbacks: {
    session: ({session,token,user}) =>{
      if (adminEmails.includes(session?.user?.email)){
      return session;
      }else{
        return false; 
      }
    },
    signIn: async ({ user }) => {
      if (!adminEmails.includes(user.email)) {
        return false; 
      }
      return true;
    }
  }
}
export default NextAuth(authOptions);

export async function isAdminRequest(req,res){
  const session= await getServerSession(req,res, authOptions);
  
  if (!adminEmails.includes(session?.user?.email)){
    res.status(401);
    res.end();
    throw ('Unauthorized, not an admin');
  }
}