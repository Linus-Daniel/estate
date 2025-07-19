import RevenueChart from "@/components/RevenueChart";
import DashboardStats from "@/components/Stats";

// src/app/admin/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardStats
       />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        {/* <UserActivity /> */}
      </div>
      {/* <RecentProperties /> */}
    </div>
  );
}