"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from './ui/table';


const RentTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
  
    const data = [
      {
        rentDate: '2025-04-01',
        rentType: 'Monthly',
        propertyType: 'Apartment',
        propertyName: 'Green Villa',
        location: 'Lagos',
        dueDate: '2025-04-30',
        imageUrl: '/images/house1.jpg',
      },
      {
        rentDate: '2025-03-15',
        rentType: 'Quarterly',
        propertyType: 'House',
        propertyName: 'Sunny House',
        location: 'Abuja',
        dueDate: '2025-06-15',
        imageUrl: '/images/house2.jpeg',
      },
      {
        rentDate: '2025-02-28',
        rentType: 'Annual',
        propertyType: 'Condo',
        propertyName: 'Ocean View',
        location: 'Port Harcourt',
        dueDate: '2026-02-28',
        imageUrl: '/images/house3.jpg',
      },
    ];
  
    const openModal = (image:string) => {
      setSelectedImage(image);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedImage('');
    };
  
    return (
      <div>
        {/* Table Component */}
        <Table>
          <thead>
            <TableRow className='font-bold'>
              <TableCell>Rent Date</TableCell>
              <TableCell>Rent Type</TableCell>
              <TableCell>Property Type</TableCell>
              <TableCell>Property Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </thead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <img
                    src={row.imageUrl}
                    alt={row.propertyName}
                    className="w-16 h-16 rounded-md object-cover cursor-pointer"
                    onClick={() => openModal(row.imageUrl)}
                  />
                </TableCell>
                <TableCell>{row.rentDate}</TableCell>
                <TableCell>{row.rentType}</TableCell>
                <TableCell>{row.propertyType}</TableCell>
                <TableCell>{row.propertyName}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  
        {/* Modal for Full Image */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div className="bg-white p-4 rounded-md">
              <img src={selectedImage} alt="Full view" className="max-w-full max-h-[80vh]" />
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default RentTable;
  