import RevenueChart from "@/components/RevenueChart";
import DashboardStats from "@/components/Stats";
import { fetchTotalRevenue } from "@/lib/Revenue";
import serverApi from "@/lib/serverApi";
import { cookies } from "next/headers";


async function getStatsInfo() {
  const urls = [
    "/users",
    "/properties", 
  ];

  const cookieStore = await cookies()

  const token = cookieStore.get("token")?.value
  try {
    const [users, properties] = await Promise.all(
      urls.map((url) => serverApi.get(url,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }))
    );
    const usersData = users.data.data.length
    const propertiesData = properties.data.data.length
    return {
      users: usersData,
      properties: propertiesData,
    };
  } catch (err) {
    console.error("Error fetching from endpoints:", err);
    throw err;
  }
}

export default async function DashboardPage() {
  
  const total = await fetchTotalRevenue() 
  const {users, properties} = await getStatsInfo()
  console.log(users, "users")
  console.log(properties,"properties")

  return (
    <div className="space-y-6">
      <DashboardStats
      total={total}
      users = {users}
      properties = {properties}


       />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
      </div>
    </div>
  );
}