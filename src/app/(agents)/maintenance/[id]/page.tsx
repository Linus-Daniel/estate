"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Droplet, Wrench, Plug, Hammer, Clock, Check, X, Mail, Phone, MessageSquare, Calendar, Image, Printer, Download } from "lucide-react";
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
  contactPreference: "any" | "call" | "text" | "email";
  specialInstructions: string;
};

export default function MaintenanceReportDetail() {
  const router = useRouter();
  
  // In a real app, this would come from your API based on the route parameter
  const report: MaintenanceReport = {
    id: "REP-001",
    property: "123 Main St",
    unit: "Apt 4B",
    issueType: "plumbing",
    urgency: "high",
    status: "submitted",
    description: "Bathroom sink is leaking badly, water all over floor. The leak started this morning and has gotten progressively worse. There's now about 1/2 inch of water on the bathroom floor that keeps accumulating.",
    submittedDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    images: ["/placeholder-plumbing.jpg", "/placeholder-plumbing-2.jpg"],
    tenantName: "Sarah Johnson",
    tenantContact: "sarah@email.com",
    contactPreference: "call",
    specialInstructions: "Please call before coming as I work from home and need to put my dog away.",
  };

  const getIssueIcon = () => {
    switch(report.issueType) {
      case "plumbing": return <Droplet className="h-6 w-6 text-blue-500" />;
      case "electrical": return <Plug className="h-6 w-6 text-yellow-500" />;
      case "appliance": return <Wrench className="h-6 w-6 text-gray-500" />;
      case "structural": return <Hammer className="h-6 w-6 text-orange-500" />;
      case "other": return <AlertTriangle className="h-6 w-6 text-red-500" />;
    }
  };

  const getContactIcon = () => {
    switch(report.contactPreference) {
      case "call": return <Phone className="h-4 w-4" />;
      case "text": return <MessageSquare className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      default: return null;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const updateStatus = (newStatus: MaintenanceReport["status"]) => {
    console.log("Updating status to:", newStatus);
    // In a real app, you would make an API call here
    alert(`Status updated to ${newStatus}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-4 flex items-center"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to all reports
      </Button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Report Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            {getIssueIcon()}
            <div className="ml-3">
              <h2 className="text-xl font-bold text-gray-900">
                {report.property} - {report.unit}
              </h2>
              <p className="text-sm text-gray-500">
                Submitted by {report.tenantName} • {formatDate(report.submittedDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-sm rounded-full capitalize ${
              report.urgency === "low" ? "bg-gray-100 text-gray-800" :
              report.urgency === "medium" ? "bg-orange-100 text-orange-800" :
              "bg-red-100 text-red-800"
            }`}>
              {report.urgency} urgency
            </span>
            <span className={`px-3 py-1 text-sm rounded-full capitalize ${
              report.status === "submitted" ? "bg-blue-100 text-blue-800" :
              report.status === "in-progress" ? "bg-yellow-100 text-yellow-800" :
              report.status === "completed" ? "bg-green-100 text-green-800" :
              "bg-red-100 text-red-800"
            }`}>
              {report.status.replace("-", " ")}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Report Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-gray-500" />
                Issue Description
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="whitespace-pre-line">{report.description}</p>
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Image className="h-5 w-5 mr-2 text-gray-500" />
                Photos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {report.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image}
                      alt={`Maintenance issue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Meta Info */}
          <div className="space-y-6">
            {/* Tenant Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Tenant Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{report.tenantName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">{report.tenantContact}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Contact Method</p>
                  <div className="flex items-center mt-1">
                    {getContactIcon()}
                    <span className="ml-2 capitalize">
                      {report.contactPreference === "any" ? "Any method" : report.contactPreference}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {report.specialInstructions && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Special Instructions</h3>
                <p className="whitespace-pre-line">{report.specialInstructions}</p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Actions</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={report.status === "in-progress" ? "default" : "outline"}
                    onClick={() => updateStatus("in-progress")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    In Progress
                  </Button>
                  <Button 
                    variant={report.status === "completed" ? "default" : "outline"}
                    onClick={() => updateStatus("completed")}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                </div>
                <Button 
                  variant={report.status === "rejected" ? "default" : "outline"}
                  onClick={() => updateStatus("rejected")}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <div className="border-t border-gray-200 pt-3 mt-3 flex space-x-2">
                  <Button variant="ghost" className="flex-1">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="ghost" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}