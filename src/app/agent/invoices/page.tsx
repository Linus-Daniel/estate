"use client";
import { useState } from "react";
import { Search, Filter, FileText, Clock, Check, X, ChevronRight, Download, Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Invoice = {
  id: string;
  invoiceNumber: string;
  property: string;
  unit: string;
  tenant: string;
  amount: number;
  issueDate: Date;
  dueDate: Date;
  status: "paid" | "pending" | "overdue";
  paymentMethod?: string;
};

export default function InvoiceDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    property: "",
    timeframe: "",
  });

  // Sample data
  const invoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2023-001",
      property: "123 Main St",
      unit: "Apt 4B",
      tenant: "Sarah Johnson",
      amount: 2500,
      issueDate: new Date("2023-06-01"),
      dueDate: new Date("2023-06-15"),
      status: "paid",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "2",
      invoiceNumber: "INV-2023-002",
      property: "456 Oak Ave",
      unit: "Unit 12",
      tenant: "Mike Chen",
      amount: 1800,
      issueDate: new Date("2023-06-01"),
      dueDate: new Date("2023-06-15"),
      status: "pending",
    },
    {
      id: "3",
      invoiceNumber: "INV-2023-003",
      property: "789 Pine Blvd",
      unit: "Apt 302",
      tenant: "Emma Wilson",
      amount: 3200,
      issueDate: new Date("2023-05-01"),
      dueDate: new Date("2023-05-15"),
      status: "overdue",
    },
  ];

  const filteredInvoices = invoices.filter(invoice => {
    // Search filter
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.tenant.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = filters.status ? invoice.status === filters.status : true;
    const matchesProperty = filters.property ? invoice.property === filters.property : true;
    
    // Timeframe filter
    const matchesTimeframe = filters.timeframe === "current" 
      ? new Date(invoice.dueDate) >= new Date()
      : filters.timeframe === "past" 
        ? new Date(invoice.dueDate) < new Date()
        : true;

    return matchesSearch && matchesStatus && matchesProperty && matchesTimeframe;
  });

  const getStatusIcon = (status: Invoice["status"]) => {
    switch(status) {
      case "paid": return <Check className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "overdue": return <X className="h-4 w-4 text-red-500" />;
    }
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
    return days > 0 ? `${days} days` : days === 0 ? "Today" : `${Math.abs(days)} days ago`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Invoices</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={filters.property}
              onChange={(e) => setFilters({...filters, property: e.target.value})}
              className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Properties</option>
              <option value="123 Main St">123 Main St</option>
              <option value="456 Oak Ave">456 Oak Ave</option>
              <option value="789 Pine Blvd">789 Pine Blvd</option>
            </select>

            <select
              value={filters.timeframe}
              onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
              className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Time</option>
              <option value="current">Current</option>
              <option value="past">Past Due</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property/Unit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.property}</div>
                    <div className="text-sm text-gray-500">{invoice.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.tenant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</div>
                    <div className={`text-xs ${
                      invoice.status === "overdue" ? "text-red-500" : 
                      invoice.status === "paid" ? "text-green-500" : "text-yellow-500"
                    }`}>
                      {getDaysRemaining(invoice.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(invoice.status)}
                      <span className="ml-2 text-sm capitalize">{invoice.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <a 
                        href={`/invoices/${invoice.id}/download`} 
                        className="text-gray-500 hover:text-gray-700"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <a 
                        href={`/invoices/${invoice.id}/send`} 
                        className="text-gray-500 hover:text-gray-700"
                        title="Send"
                      >
                        <Send className="h-4 w-4" />
                      </a>
                      <a 
                        href={`/invoices/${invoice.id}`} 
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        View <ChevronRight className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="p-8 text-center">
            <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No invoices found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}