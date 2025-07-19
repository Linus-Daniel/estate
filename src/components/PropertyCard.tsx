// src/components/properties/PropertyCard.tsx
import { Home, Bed, Bath, Ruler, DollarSign, Check, Clock, X, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyCard({ property }: any) {
  const statusColors: any = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Sold: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border overflow-hidden shadow-sm transition-all hover:shadow-md">
      <div className="relative">
        <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-48" />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[property.status]}`}>
            {property.status}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{property.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{property.address}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center text-lg font-bold">
          <DollarSign className="h-5 w-5 mr-1" />
          <span>{property.price.toLocaleString()}</span>
        </div>
        
        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center">
            <Home className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm mt-1">{property.type}</span>
          </div>
          <div className="flex flex-col items-center">
            <Bed className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm mt-1">{property.bedrooms} beds</span>
          </div>
          <div className="flex flex-col items-center">
            <Bath className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm mt-1">{property.bathrooms} baths</span>
          </div>
          <div className="flex flex-col items-center">
            <Ruler className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm mt-1">{property.area} sqft</span>
          </div>
        </div>
        
        <div className="mt-5 flex space-x-2">
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
}