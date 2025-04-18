"use client";
import { useState } from "react";
import { Search, Filter, AlertTriangle, Droplet, Wrench, Plug, Hammer, Clock, Check, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type MaintenanceReport = {
  id: string;
  property: string;
  unit: string;
  issueType: "plumbing" | "electrical" | "appliance" | "structural" | "other";
  urgency: "low" | "medium" | "high";
  status: "submitted" | "in-progress" | "completed" | "rejected";
  description: string;
  submittedDate: Date;
  images: string[];
  tenantName: string;
  tenantContact: string;
};

export default function MaintenanceDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    urgency: "",
    issueType: "",
  });

  // Sample data
  const reports: MaintenanceReport[] = [
    {
      id: "REP-001",
      property: "123 Main St",
      unit: "Apt 4B",
      issueType: "plumbing",
      urgency: "high",
      status: "submitted",
      description: "Bathroom sink is leaking badly, water all over floor",
      submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      images: ["/placeholder-plumbing.jpg"],
      tenantName: "Sarah Johnson",
      tenantContact: "sarah@email.com",
    },
    {
      id: "REP-002",
      property: "456 Oak Ave",
      unit: "Unit 12",
      issueType: "electrical",
      urgency: "medium",
      status: "in-progress",
      description: "Kitchen outlet not working",
      submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      images: ["/placeholder-electrical.jpg"],
      tenantName: "Mike Chen",
      tenantContact: "(555) 123-4567",
    },
    {
      id: "REP-003",
      property: "789 Pine Blvd",
      unit: "Apt 302",
      issueType: "appliance",
      urgency: "low",
      status: "completed",
      description: "Refrigerator making strange noise",
      submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      images: ["/placeholder-appliance.jpg"],
      tenantName: "Emma Wilson",
      tenantContact: "(555) 987-6543",
    },
  ];

  const filteredReports = reports.filter(report => {
    // Search filter
    const matchesSearch = 
      report.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = filters.status ? report.status === filters.status : true;
    const matchesUrgency = filters.urgency ? report.urgency === filters.urgency : true;
    const matchesIssueType = filters.issueType ? report.issueType === filters.issueType : true;

    return matchesSearch && matchesStatus && matchesUrgency && matchesIssueType;
  });

  const getIssueIcon = (type: MaintenanceReport["issueType"]) => {
    switch(type) {
      case "plumbing": return <Droplet className="h-5 w-5 text-blue-500" />;
      case "electrical": return <Plug className="h-5 w-5 text-yellow-500" />;
      case "appliance": return <Wrench className="h-5 w-5 text-gray-500" />;
      case "structural": return <Hammer className="h-5 w-5 text-orange-500" />;
      case "other": return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: MaintenanceReport["status"]) => {
    switch(status) {
      case "submitted": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
    }
  };

  const getUrgencyColor = (urgency: MaintenanceReport["urgency"]) => {
    switch(urgency) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "high": return "bg-red-100 text-red-800";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Maintenance Reports</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          + Create Work Order
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
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
              <option value="submitted">Submitted</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={filters.urgency}
              onChange={(e) => setFilters({...filters, urgency: e.target.value})}
              className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Urgencies</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={filters.issueType}
              onChange={(e) => setFilters({...filters, issueType: e.target.value})}
              className="rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Issue Types</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="appliance">Appliance</option>
              <option value="structural">Structural</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property/Unit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Urgency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.property}</div>
                    <div className="text-sm text-gray-500">{report.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getIssueIcon(report.issueType)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">{report.issueType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.tenantName}</div>
                    <div className="text-sm text-gray-500">{report.tenantContact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getUrgencyColor(report.urgency)}`}>
                      {report.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(report.status)}`}>
                      {report.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(report.submittedDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={`/maintenance/${report.id}`} className="text-blue-600 hover:text-blue-900 flex items-center justify-end">
                      View <ChevronRight className="h-4 w-4 ml-1" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="p-8 text-center">
            <AlertTriangle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}