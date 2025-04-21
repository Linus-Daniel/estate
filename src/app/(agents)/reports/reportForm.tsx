"use client";
import { useState } from "react";
import { Home, AlertCircle, Hammer, Droplet, Wrench, Plug, Image, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
const MaintenanceReport = () => {
  const [formData, setFormData] = useState({
    property: "",
    unit: "",
    issueType: "",
    urgency: "medium",
    description: "",
    images: [] as string[],
    contactPreference: "any",
    specialInstructions: "",
  });

  const issueTypes = [
    { value: "plumbing", label: "Plumbing", icon: <Droplet className="h-5 w-5" /> },
    { value: "electrical", label: "Electrical", icon: <Plug className="h-5 w-5" /> },
    { value: "appliance", label: "Appliance", icon: <Wrench className="h-5 w-5" /> },
    { value: "structural", label: "Structural", icon: <Hammer className="h-5 w-5" /> },
    { value: "other", label: "Other", icon: <AlertCircle className="h-5 w-5" /> },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Maintenance report submitted:", formData);
    // In a real app, you would send this data to your backend
    alert("Maintenance request submitted successfully!");
    setFormData({
      property: "",
      unit: "",
      issueType: "",
      urgency: "medium",
      description: "",
      images: [],
      contactPreference: "any",
      specialInstructions: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Hammer className="h-8 w-8 text-orange-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Maintenance Request</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Information */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold flex items-center">
            <Home className="h-5 w-5 mr-2 text-blue-500" />
            Property Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-1">
                Property
              </label>
              <select
                id="property"
                name="property"
                value={formData.property}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select property</option>
                <option value="property-1">123 Main St</option>
                <option value="property-2">456 Oak Ave</option>
                <option value="property-3">789 Pine Blvd</option>
              </select>
            </div>
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit Number
              </label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Issue Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            Issue Details
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type of Issue
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {issueTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, issueType: type.value }))}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border ${formData.issueType === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'} transition-colors`}
                >
                  {type.icon}
                  <span className="mt-1 text-sm">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
              Urgency
            </label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low - Minor issue (e.g., dripping faucet)</option>
              <option value="medium">Medium - Needs attention (e.g., broken appliance)</option>
              <option value="high">High - Urgent (e.g., no water, electrical hazard)</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please describe the issue in detail..."
              required
            />
          </div>
        </div>

        {/* Photo Evidence */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <Image className="h-5 w-5 mr-2 text-purple-500" />
            Photo Evidence
          </h3>
          <p className="text-sm text-gray-500">
            Upload photos to help us understand the issue better (max 5 photos)
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {formData.images.map((image, index) => (
              <div key={index} className="relative h-32 rounded-md overflow-hidden group">
                <img
                  src={image}
                  alt={`Maintenance issue ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {formData.images.length < 5 && (
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors">
                <Plus className="h-8 w-8 text-gray-400 mb-1" />
                <span className="text-sm text-gray-500">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Contact Preferences */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Contact Preferences</h3>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Contact Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="contactPreference"
                  value="any"
                  checked={formData.contactPreference === "any"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span>Any method is fine</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="contactPreference"
                  value="call"
                  checked={formData.contactPreference === "call"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span>Phone call only</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="contactPreference"
                  value="text"
                  checked={formData.contactPreference === "text"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span>Text message only</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="contactPreference"
                  value="email"
                  checked={formData.contactPreference === "email"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span>Email only</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions (Optional)
            </label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special access instructions or details..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
          >
            Submit Maintenance Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceReport;