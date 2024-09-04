import Layout from "@/components/layout"
import Stats from "@/components/stats";
import { useSession } from "next-auth/react";

export default function Home(){
  const {data: session} =useSession();
  return <Layout>
  <div className="text-black font-bold">
    Hello, {session?.user?.name}
  </div>
  <Stats/>
  </Layout>
  
} 