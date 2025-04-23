"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Clock, Check, X, Download, Send, Printer, Mail, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";

type Invoice = {
  id: string;
  invoiceNumber: string;
  property: string;
  unit: string;
  tenant: string;
  tenantEmail: string;
  tenantPhone: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  status: "paid" | "pending" | "overdue";
  paymentMethod?: string;
  paymentDate?: Date;
  items: {
    description: string;
    amount: number;
  }[];
  notes?: string;
};

export default function InvoiceDetail() {
  const router = useRouter();
  
  // In a real app, this would come from your API based on the route parameter
  const invoice: Invoice = {
    id: "1",
    invoiceNumber: "INV-2023-001",
    property: "123 Main St",
    unit: "Apt 4B",
    tenant: "Sarah Johnson",
    tenantEmail: "sarah@example.com",
    tenantPhone: "(555) 123-4567",
    amount: 2500,
    issueDate: new Date("2023-06-01"),
    dueDate: new Date("2023-06-15"),
    status: "paid",
    paymentMethod: "Bank Transfer",
    paymentDate: new Date("2023-06-10"),
    items: [
      { description: "Monthly Rent", amount: 2000 },
      { description: "Parking Fee", amount: 100 },
      { description: "Pet Fee", amount: 50 },
      { description: "Utilities", amount: 350 },
    ],
    notes: "Please make payment by the due date to avoid late fees of 5% per month.",
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date();
    const diff = dueDate.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days remaining` : days === 0 ? "Due today" : `${Math.abs(days)} days overdue`;
  };

  const markAsPaid = () => {
    console.log("Marking invoice as paid");
    // In a real app, you would make an API call here
    alert("Invoice marked as paid");
  };

  const sendReminder = () => {
    console.log("Sending payment reminder");
    // In a real app, you would make an API call here
    alert("Payment reminder sent");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-4 flex items-center"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to all invoices
      </Button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Invoice Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <FileText className="h-6 w-6 text-blue-500" />
            <div className="ml-3">
              <h2 className="text-xl font-bold text-gray-900">
                {invoice.invoiceNumber}
              </h2>
              <p className="text-sm text-gray-500">
                {formatDate(invoice.issueDate)} • Due {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-sm rounded-full ${
              invoice.status === "paid" ? "bg-green-100 text-green-800" :
              invoice.status === "pending" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }`}>
              {invoice.status === "paid" ? "Paid" : invoice.status === "pending" ? "Pending" : "Overdue"}
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property and Tenant Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Property Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Property</p>
                    <p className="font-medium">{invoice.property}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Unit</p>
                    <p className="font-medium">{invoice.unit}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Tenant Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{invoice.tenant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{invoice.tenantEmail}</p>
                    <p className="font-medium">{invoice.tenantPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Invoice Items</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        {formatCurrency(invoice.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Notes</h3>
                <p className="whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Payment Info */}
          <div className="space-y-6">
            {/* Payment Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Payment Status</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">
                    {formatDate(invoice.dueDate)} • {getDaysRemaining(invoice.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{invoice.status}</p>
                </div>
                {invoice.paymentMethod && (
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <div className="flex items-center mt-1">
                      {invoice.paymentMethod === "Bank Transfer" ? (
                        <Banknote className="h-4 w-4 mr-2 text-blue-500" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                      )}
                      <span className="font-medium">{invoice.paymentMethod}</span>
                    </div>
                  </div>
                )}
                {invoice.paymentDate && (
                  <div>
                    <p className="text-sm text-gray-500">Payment Date</p>
                    <p className="font-medium">{formatDate(invoice.paymentDate)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Actions</h3>
              <div className="space-y-3">
                {invoice.status !== "paid" && (
                  <>
                    <Button 
                      onClick={markAsPaid}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </Button>
                    <Button 
                      onClick={sendReminder}
                      variant="outline"
                      className="w-full"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Reminder
                    </Button>
                  </>
                )}
                <div className="border-t border-gray-200 pt-3 mt-3 flex space-x-2">
                  <Button variant="ghost" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="ghost" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>

            {/* Payment History (would be populated from API) */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Payment History</h3>
              {invoice.status === "paid" ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Payment received</span>
                    <span className="text-sm">{formatCurrency(invoice.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{formatDate(invoice.paymentDate!)}</span>
                    <span>{invoice.paymentMethod}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No payment history yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}