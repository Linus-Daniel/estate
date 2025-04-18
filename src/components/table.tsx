"use client";
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "./ui/table";
import { Eye, CalendarDays, Home, Clock, MapPin, DollarSign } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";

export const data = [
  {
    rentDate: "2025-04-01",
    id: 3,
    rentType: "Monthly",
    propertyType: "Apartment",
    propertyName: "Green Villa",
    location: "Lagos",
    dueDate: "2025-04-30",
    imageUrl: "/images/house1.jpg",
    price: "₦250,000/month",
    bedrooms: 3,
    bathrooms: 2,
    status: "Active",
  },
  {
    rentDate: "2025-03-15",
    rentType: "Quarterly",
    id: 2,
    propertyType: "House",
    propertyName: "Sunny House",
    location: "Abuja",
    dueDate: "2025-06-15",
    imageUrl: "/images/house2.jpeg",
    price: "₦1,800,000/quarter",
    bedrooms: 4,
    bathrooms: 3,
    status: "Active",
  },
  {
    rentDate: "2025-02-28",
    rentType: "Annual",
    propertyType: "Condo",
    propertyName: "Ocean View",
    location: "Port Harcourt",
    dueDate: "2026-02-28",
    imageUrl: "/images/house3.jpg",
    id: 1,
    price: "₦8,500,000/year",
    bedrooms: 2,
    bathrooms: 2,
    status: "Pending Renewal",
  },
];

const RentTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      // Special handling for dates
      if (sortConfig.key === 'rentDate' || sortConfig.key === 'dueDate') {
        const dateA = new Date(a[sortConfig.key as keyof typeof a] as string).getTime();
        const dateB = new Date(b[sortConfig.key as keyof typeof b] as string).getTime();
        return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
      }
      
      if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [sortConfig]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="success">{status}</Badge>;
      case "Pending Renewal":
        return <Badge variant="warning">{status}</Badge>;
      case "Expired":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      {/* Table Component */}
      <Table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Property
            </TableHead>
            <TableHead 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => requestSort('rentDate')}
            >
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                Rent Date
                {sortConfig?.key === 'rentDate' && (
                  <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Price
              </div>
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Type
              </div>
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Location
              </div>
            </TableHead>
            <TableHead 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => requestSort('dueDate')}
            >
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Due Date
                {sortConfig?.key === 'dueDate' && (
                  <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                )}
              </div>
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </thead>
        <TableBody className="bg-white divide-y divide-gray-200">
          {sortedData.map((row) => (
            <TableRow key={row.id} className="hover:bg-gray-50">
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16">
                    <img
                      src={row.imageUrl}
                      alt={row.propertyName}
                      className="h-16 w-16 rounded-md object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                      onClick={() => openModal(row.imageUrl)}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{row.propertyName}</div>
                    <div className="text-sm text-gray-500">
                      {row.bedrooms} beds • {row.bathrooms} baths
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{new Date(row.rentDate).toLocaleDateString()}</div>
                <div className="text-sm text-gray-500">{row.rentType}</div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {row.price}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.propertyType}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.location}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{new Date(row.dueDate).toLocaleDateString()}</div>
                <div className="text-sm text-gray-500">
                  {Math.ceil((new Date(row.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(row.status || "Active")}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/rented-property/view_property/${row.id}`}
                  className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                >
                  <Eye className="h-5 w-5 mr-1" />
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Full Image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full view"
              className="w-full h-auto max-h-[80vh] object-contain p-4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RentTable;