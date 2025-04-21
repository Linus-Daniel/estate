"use client";
import React from "react";
import { useParams } from "next/navigation";
import { data } from "@/components/table";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CalendarDays, CircleDollarSign, ClockIcon, House, MapIcon, MapPin } from "lucide-react";

// Fix for missing marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

interface Estate {
  id: number;
  rentDate: string;
  rentType: string;
  propertyType: string;
  propertyName: string;
  location: string;
  dueDate: string;
  imageUrl: string;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
}

const ViewProperty: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const numericId = parseInt(id, 10);

  const estate: Estate | undefined = data.find(
    (estate: Estate) => estate.id === numericId
  );

  // Enhanced coordinates with more locations
  const coordinates: Record<string, [number, number]> = {
    Lagos: [6.5244, 3.3792],
    Abuja: [9.0579, 7.4951],
    "Port Harcourt": [4.8156, 7.0498],
    Ibadan: [7.3775, 3.9470],
    Kano: [12.0022, 8.5927],
    Enugu: [6.4584, 7.5464],
    Benin: [6.3350, 5.6037],
  };

  const locationCoords =
    estate && coordinates[estate.location]
      ? coordinates[estate.location]
      : [6.5244, 3.3792]; // default to Lagos

  if (!estate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Properties
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Property Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{estate.propertyName}</h1>
          <div className="flex items-center mt-2 text-gray-600">
            <MapPin className="h-5 w-5 mr-1" />
            <span>{estate.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Images and Details */}
          <div>
            <div className="rounded-xl overflow-hidden shadow-lg mb-6">
              <img
                src={estate.imageUrl || "/placeholder-property.jpg"}
                alt={estate.propertyName}
                className="w-full h-96 object-cover"
              />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailCard 
                  icon={<House className="h-6 w-6 text-blue-600" />}
                  title="Type"
                  value={estate.propertyType}
                />
                <DetailCard 
                  icon={<CircleDollarSign className="h-6 w-6 text-blue-600" />}
                  title="Rent Type"
                  value={estate.rentType}
                />
                <DetailCard 
                  icon={<CalendarDays className="h-6 w-6 text-blue-600" />}
                  title="Rent Date"
                  value={estate.rentDate}
                />
                <DetailCard 
                  icon={<ClockIcon className="h-6 w-6 text-blue-600" />}
                  title="Due Date"
                  value={estate.dueDate}
                />
                {estate.bedrooms && (
                  <DetailCard 
                    icon={<span className="text-blue-600">🛏️</span>}
                    title="Bedrooms"
                    value={estate.bedrooms.toString()}
                  />
                )}
                {estate.bathrooms && (
                  <DetailCard 
                    icon={<span className="text-blue-600">🚿</span>}
                    title="Bathrooms"
                    value={estate.bathrooms.toString()}
                  />
                )}
              </div>

              {estate.price && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Price</div>
                  <div className="text-2xl font-bold text-blue-900">{estate.price}</div>
                </div>
              )}
            </div>
          </div>

          {/* Map and Additional Info */}
          <div className="space-y-6">
            {/* Map Section */}
            <div className="h-96 rounded-xl z-20 shadow-lg overflow-hidden">
              <MapContainer
                center={locationCoords as any}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={locationCoords as any }>
                  <Popup>
                    <div className="font-medium">
                      {estate.propertyName} <br />
                      <span className="text-sm text-gray-600">{estate.location}</span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Location Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Information</h2>
              <p className="text-gray-600 mb-4">
                This property is located in the vibrant area of {estate.location}. The neighborhood offers a mix of residential comfort and urban convenience.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">📍</span>
                  <span>Close to public transportation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🛒</span>
                  <span>Nearby shopping centers and markets</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🏫</span>
                  <span>Quality schools in the area</span>
                </li>
              </ul>
            </div>

            {/* Contact/CTA Section */}
            <div className="bg-blue-600 rounded-xl shadow-md p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">Interested in this property?</h2>
              <p className="mb-6">Schedule a viewing or get more information about this listing.</p>
              <button className="w-full bg-white text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                Contact Agent
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Detail Card Component
const DetailCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
    <div className="mr-3 mt-1">{icon}</div>
    <div>
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  </div>
);

export default ViewProperty;