"use client";
import { useState } from "react";
import { Download, Printer, ChevronDown, ChevronUp, Mail, CreditCard, Banknote, Wallet } from "lucide-react";

export default function InvoicePage() {
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(true);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);
  const [status, setStatus] = useState<"paid" | "pending" | "overdue">("pending");

  // Invoice data
  const invoice = {
    number: "INV-2023-001",
    date: new Date("2023-06-15"),
    dueDate: new Date("2023-07-15"),
    status,
    from: {
      name: "Acme Inc.",
      address: "123 Business Rd, Suite 100",
      city: "San Francisco, CA 94107",
      email: "billing@acme.com",
      phone: "(555) 123-4567"
    },
    to: {
      name: "Global Solutions LLC",
      address: "456 Client Avenue, Floor 3",
      city: "New York, NY 10001",
      email: "accounting@globalsolutions.com",
      phone: "(555) 987-6543"
    },
    items: [
      {
        id: 1,
        description: "Website Redesign",
        quantity: 1,
        unitPrice: 5000,
        taxRate: 10
      },
      {
        id: 2,
        description: "SEO Optimization",
        quantity: 1,
        unitPrice: 2500,
        taxRate: 10
      },
      {
        id: 3,
        description: "Hosting (Annual)",
        quantity: 1,
        unitPrice: 1200,
        taxRate: 0
      }
    ],
    paymentMethods: [
      {
        type: "credit_card",
        details: "Visa ending in 4242",
        amount: 8700
      },
      {
        type: "bank_transfer",
        details: "Bank Transfer",
        amount: 0
      }
    ]
  };

  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const tax = invoice.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity * (item.taxRate / 100)), 0);
  const total = subtotal + tax;
  const amountPaid = invoice.paymentMethods.reduce((sum, method) => sum + method.amount, 0);
  const amountDue = total - amountPaid;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Handle status change
  const handleStatusChange = () => {
    if (status === "pending") setStatus("paid");
    else if (status === "paid") setStatus("overdue");
    else setStatus("pending");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
            <div className="flex items-center mt-2">
              <span className="text-gray-600 mr-4">#{invoice.number}</span>
              <button
                onClick={handleStatusChange}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  status === "paid"
                    ? "bg-green-100 text-green-800"
                    : status === "overdue"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {status === "paid" ? "Paid" : status === "overdue" ? "Overdue" : "Pending"}
              </button>
            </div>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            <button className="flex items-center px-4 py-2 border border-transparent rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
              <Mail className="h-4 w-4 mr-2" />
              Send
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Invoice Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="mb-6 md:mb-0">
                <img
                  src="https://via.placeholder.com/150x50?text=Acme+Inc."
                  alt="Company Logo"
                  className="h-10 mb-4"
                />
                <p className="text-gray-600">{invoice.from.name}</p>
                <p className="text-gray-600">{invoice.from.address}</p>
                <p className="text-gray-600">{invoice.from.city}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="text-gray-500">Invoice Date:</div>
                <div className="font-medium">{formatDate(invoice.date)}</div>
                <div className="text-gray-500">Due Date:</div>
                <div className="font-medium">{formatDate(invoice.dueDate)}</div>
                <div className="text-gray-500">Invoice #:</div>
                <div className="font-medium">{invoice.number}</div>
                <div className="text-gray-500">Amount Due:</div>
                <div className="font-medium text-indigo-600">{formatCurrency(amountDue)}</div>
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => setIsClientDetailsOpen(!isClientDetailsOpen)}
              className="flex items-center justify-between w-full p-6 text-left"
            >
              <h2 className="text-lg font-medium text-gray-900">Bill To</h2>
              {isClientDetailsOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {isClientDetailsOpen && (
              <div className="px-6 pb-6">
                <p className="font-medium text-gray-900">{invoice.to.name}</p>
                <p className="text-gray-600 mt-1">{invoice.to.address}</p>
                <p className="text-gray-600">{invoice.to.city}</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm">
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="text-gray-900">{invoice.to.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="text-gray-900">{invoice.to.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.taxRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {formatCurrency(item.unitPrice * item.quantity * (1 + item.taxRate / 100))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200">
            <div className="px-6 py-4 flex justify-end">
              <div className="w-full max-w-xs">
                <div className="flex justify-between py-2 text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm text-gray-600">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-medium text-gray-900 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => setIsPaymentDetailsOpen(!isPaymentDetailsOpen)}
              className="flex items-center justify-between w-full p-6 text-left"
            >
              <h2 className="text-lg font-medium text-gray-900">Payment Details</h2>
              {isPaymentDetailsOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {isPaymentDetailsOpen && (
              <div className="px-6 pb-6">
                <div className="space-y-4">
                  {invoice.paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        {method.type === "credit_card" ? (
                          <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
                        ) : method.type === "bank_transfer" ? (
                          <Banknote className="h-5 w-5 text-gray-500 mr-3" />
                        ) : (
                          <Wallet className="h-5 w-5 text-gray-500 mr-3" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {method.details}
                          </p>
                          <p className="text-xs text-gray-500">
                            {method.type === "credit_card" ? "Credit Card" : 
                             method.type === "bank_transfer" ? "Bank Transfer" : "Other"}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(method.amount)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Amount Paid</span>
                    <span className="text-base font-medium text-green-600">{formatCurrency(amountPaid)}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">Amount Due</span>
                    <span className="text-lg font-bold text-indigo-600">{formatCurrency(amountDue)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4">
            <p className="text-xs text-gray-500 text-center">
              Thank you for your business. Please make payment by the due date.
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
            <p className="text-gray-600">
              Payment is due within 30 days. Please include the invoice number in your payment reference.
            </p>
            <p className="text-gray-600 mt-2">
              Late payments are subject to fees of 1.5% per month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}