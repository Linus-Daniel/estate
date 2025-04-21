// app/tenant/page.tsx
import { Home, FileText, Wrench, DollarSign, Calendar, Bell, MessageSquare } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function TenantDashboard() {
  // Mock data - replace with real data from your API
  const leaseStatus = 'Active'
  const nextPayment = {
    amount: 1200,
    dueDate: '2023-11-05'
  }
  const maintenanceRequests = [
    { id: 1, status: 'Completed', description: 'Kitchen sink leak' },
    { id: 2, status: 'In Progress', description: 'Broken AC unit' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome back, Sarah</h1>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Lease Status</h3>
              <p className="text-lg font-semibold">{leaseStatus}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Next Payment</h3>
              <p className="text-lg font-semibold">
                ${nextPayment.amount} due {nextPayment.dueDate}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-orange-100">
              <Wrench className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Open Requests</h3>
              <p className="text-lg font-semibold">
                {maintenanceRequests.filter(r => r.status !== 'Completed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/tenant/pay" className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
          <DollarSign className="h-6 w-6 mx-auto text-blue-600" />
          <span className="mt-2 block font-medium">Pay Rent</span>
        </Link>

        <Link href="/tenant/maintenance" className="p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors text-center">
          <Wrench className="h-6 w-6 mx-auto text-orange-600" />
          <span className="mt-2 block font-medium">Request Maintenance</span>
        </Link>

        <Link href="/tenant/lease" className="p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors text-center">
          <FileText className="h-6 w-6 mx-auto text-purple-600" />
          <span className="mt-2 block font-medium">View Lease</span>
        </Link>

        <Link href="/tenant/messages" className="p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors text-center">
          <MessageSquare className="h-6 w-6 mx-auto text-green-600" />
          <span className="mt-2 block font-medium">Messages</span>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-100">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <span>Payment received for October rent</span>
              </div>
              <span className="text-sm text-gray-500">Oct 3, 2023</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Wrench className="h-4 w-4 text-blue-600" />
                </div>
                <span>Maintenance request #456 completed</span>
              </div>
              <span className="text-sm text-gray-500">Sep 28, 2023</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}