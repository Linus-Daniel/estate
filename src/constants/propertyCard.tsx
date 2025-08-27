// Enhanced PropertyCard component
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import PropertyChatButton from "@/components/startChatButton";
import { Property } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Bath, Bed, MapPin, Ruler, Sparkles } from "lucide-react";

export function PropertyCard({
  property,
  viewMode = "grid",
}: {
  property: Property;
  viewMode?: "grid" | "list";
}) {
  // Format price with commas if it's a number
  const formattedPrice =
    typeof property.price === "number"
      ? `₦${property.price.toLocaleString()}`
      : property.price;

  // Shorten the description for mobile
  const shortDescription =
    property.description.length > 100
      ? `${property.description.substring(0, 100)}...`
      : property.description;

  // Extract just the city from the address for mobile view
  const locationParts = property.location?.formattedAddress?.split(",") || [];
  const shortLocation =
    locationParts.length > 1
      ? `${locationParts[0]},${locationParts[locationParts.length - 1]}`
      : property.location?.formattedAddress;

  if (viewMode === "list") {
    return (
      <Card className="flex flex-col md:flex-row w-full rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0 bg-white">
        {/* Image for list view */}
        <div className="md:w-2/5 relative aspect-[4/3]">
          <Image
            src={property.images[0]?.url || "/placeholder-property.jpg"}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-green-600 text-white">{property.status}</Badge>
          </div>
        </div>

        {/* Content for list view */}
        <div className="md:w-3/5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                {property.title}
              </h3>
              <span className="text-xl font-bold text-green-700 whitespace-nowrap">
                {formattedPrice}
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm line-clamp-1">
                {property.location?.formattedAddress}
              </span>
            </div>

            <p className="text-gray-600 mb-4 hidden md:block">
              {property.description}
            </p>
            <p className="text-gray-600 mb-4 md:hidden text-sm">
              {shortDescription}
            </p>

            <div className="flex flex-wrap gap-4 text-sm mb-4">
              <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <Bed className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">{property.bedrooms} Bed</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <Bath className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">{property.bathrooms} Bath</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                <Ruler className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">{property.area}m²</span>
              </div>
              {property.amenities?.length > 0 && (
                <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">
                    {property.amenities[0]}
                    {property.amenities.length > 1 &&
                      ` +${property.amenities.length - 1}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <PropertyChatButton
            propertyId={property._id}
            className="bg-green-600 hover:bg-green-700 text-white"
          />
        </div>
      </Card>
    );
  }

  // Default grid view
  return (
    <Card className="w-full p-0 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-0 group">
      {/* Image with aspect ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={property.images[0]?.url || "/placeholder-property.jpg"}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={false}
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-green-600 text-white">{property.status}</Badge>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <span className="text-lg font-bold text-green-700 whitespace-nowrap">
            {formattedPrice}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.location?.formattedAddress}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex flex-wrap gap-2 text-sm mb-4">
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <Bed className="h-3 w-3 text-gray-600" />
            <span className="text-gray-700">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <Bath className="h-3 w-3 text-gray-600" />
            <span className="text-gray-700">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
            <Ruler className="h-3 w-3 text-gray-600" />
            <span className="text-gray-700">{property.area}m²</span>
          </div>
        </div>
      </CardContent>

      {/* Footer (Action Button) */}
      <CardFooter className="p-4 pt-0">
        <PropertyChatButton
          propertyId={property._id}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        />
      </CardFooter>
    </Card>
  );
}
