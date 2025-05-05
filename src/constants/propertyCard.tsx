// components/PropertyCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import PropertyChatButton from "@/components/startChatButton";
import { Property } from "@/types";

export function PropertyCard({ property }: { property: Property }) {
  // Format price with commas if it's a number
  const formattedPrice = typeof property.price === 'number' 
    ? property.price.toLocaleString() 
    : property.price;

  // Shorten the description for mobile
  const shortDescription = property.description.length > 100 
    ? `${property.description.substring(0, 100)}...` 
    : property.description;

  // Extract just the city from the address for mobile view
  const locationParts = property.location?.formattedAddress?.split(',') || [];
  const shortLocation = locationParts.length > 1 
    ? `${locationParts[0]},${locationParts[locationParts.length - 1]}` 
    : property.location?.formattedAddress;

  return (
    <Card className="w-full  p-0 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]  duration-200">
      {/* Image with aspect ratio */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={property.images[0]?.url || '/placeholder-property.jpg'}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={false}
        />
      </div>

      {/* Header (Name & Price) */}
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap">₦{formattedPrice}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-1 hidden sm:block">
          {property.location?.formattedAddress}
        </p>
        <p className="text-sm text-gray-500 line-clamp-1 sm:hidden">
          {shortLocation}
        </p>
      </CardHeader>

      {/* Details (Description & Features) */}
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600 mb-3 hidden sm:block">
          {property.description}
        </p>
        <p className="text-sm text-gray-600 mb-3 sm:hidden">
          {shortDescription}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <span className="flex items-center gap-1">
            <span className="text-gray-500">🛏️</span> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-gray-500">🚿</span> {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-gray-500">📐</span> {property.area}m²
          </span>
          {property.amenities?.length > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-gray-500">✨</span> {property.amenities[0]}
              {property.amenities.length > 1 && ` +${property.amenities.length - 1}`}
            </span>
          )}
        </div>
      </CardContent>

      {/* Footer (Action Button) */}
      <CardFooter className="p-4 pt-0">
        <PropertyChatButton 
          propertyId={property._id} 
          // className="w-full py-2 text-sm"
        />
      </CardFooter>
    </Card>
  );
}