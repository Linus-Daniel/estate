// app/tenant/lease/page.tsx
import { FileText, Calendar, Home, User, DollarSign, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LeasePage() {
  // Mock lease data - replace with API call
  const lease = {
    property: '123 Main St, Apt 4B',
    landlord: 'Acme Property Management',
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    rentAmount: 1200,
    dueDate: '5th of each month',
    securityDeposit: 1200,
    status: 'Active'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lease Agreement</h1>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Download Lease
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lease Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Lease Information</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <Home className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Property</p>
                <p className="font-medium">{lease.property}</p>
              </div>
            </div>

            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Landlord</p>
                <p className="font-medium">{lease.landlord}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Lease Term</p>
                <p className="font-medium">
                  {lease.startDate} to {lease.endDate}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <DollarSign className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Monthly Rent</p>
                <p className="font-medium">${lease.rentAmount}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Rent Due Date</p>
                <p className="font-medium">{lease.dueDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lease Documents */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Lease Documents</h2>
          <div className="space-y-3">
            <div className="p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-3" />
                <span>Original Lease Agreement</span>
              </div>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>

            <div className="p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-3" />
                <span>Move-in Checklist</span>
              </div>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>

            <div className="p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-3" />
                <span>House Rules</span>
              </div>
              <Button variant="ghost" size="sm">
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lease Terms */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Key Lease Terms</h2>
        <div className="prose max-w-none">
          <h3>1. Rent Payment</h3>
          <p>
            Tenant agrees to pay ${lease.rentAmount} per month, due on the {lease.dueDate}. 
            Late payments will incur a 5% fee if received after the 10th of the month.
          </p>

          <h3>2. Security Deposit</h3>
          <p>
            A security deposit of ${lease.securityDeposit} was collected at lease signing. 
            This deposit will be returned within 30 days of lease termination, minus any 
            deductions for damages beyond normal wear and tear.
          </p>

          <h3>3. Maintenance Responsibilities</h3>
          <p>
            Tenant is responsible for basic upkeep including changing light bulbs, 
            air filters, and keeping the unit clean. All maintenance requests must 
            be submitted through the tenant portal.
          </p>
        </div>
      </div>
    </div>
  )
}