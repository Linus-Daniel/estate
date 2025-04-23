// app/tenant/maintenance/new/page.tsx
'use client'

import { useState } from 'react'
import { Wrench, AlertTriangle, Droplet, Plug, Hammer, Image, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NewMaintenanceRequest() {
  const [formData, setFormData] = useState({
    type: '',
    priority: 'Medium',
    description: '',
    images: [] as string[]
  })

  const issueTypes = [
    { value: 'plumbing', label: 'Plumbing', icon: <Droplet className="h-5 w-5" /> },
    { value: 'electrical', label: 'Electrical', icon: <Plug className="h-5 w-5" /> },
    { value: 'appliance', label: 'Appliance', icon: <Wrench className="h-5 w-5" /> },
    { value: 'structural', label: 'Structural', icon: <Hammer className="h-5 w-5" /> },
    { value: 'other', label: 'Other', icon: <AlertTriangle className="h-5 w-5" /> },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newImages = files.map(file => URL.createObjectURL(file))
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Maintenance request submitted:", formData)
    // In a real app, you would send this data to your backend
    alert("Maintenance request submitted successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Maintenance Request</h1>
        <Link href="/tenant/maintenance">
          <Button variant="outline">
            Cancel
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {/* Issue Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type of Issue
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {issueTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                  formData.type === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
                } transition-colors`}
              >
                {type.icon}
                <span className="mt-1 text-sm">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="mb-6">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Low">Low - Minor issue (e.g., dripping faucet)</option>
            <option value="Medium">Medium - Needs attention (e.g., broken appliance)</option>
            <option value="High">High - Urgent (e.g., no water, electrical hazard)</option>
          </select>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please describe the issue in detail..."
            required
          />
        </div>

        {/* Photo Evidence */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo Evidence (Optional)
          </label>
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  )
}