// components/PropertyCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface Property {
  id: string;
  name: string;
  price: string;
  location: string;
  bed: string;
  rooms: string;
  description: string;
  image: string;
}

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="w-full max-w-sm p-0 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={property.image}
          alt={property.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Header (Name & Price) */}
      <CardHeader className="p-2 mb-0">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{property.name}</h3>
          <span className="text-lg font-bold text-primary">{property.price}</span>
        </div>
        <p className="text-sm text-gray-500">{property.location}</p>
      </CardHeader>

      {/* Details (Description & Features) */}
      <CardContent className="p-2 pt-0">
        <p className="text-sm text-gray-600 mb-3">{property.description}</p>
        <div className="flex gap-4 text-sm">
          <span>🏠 {property.bed} Beds</span>
          <span>🚪 {property.rooms} Rooms</span>
        </div>
      </CardContent>

      {/* Footer (Action Button) */}
      <CardFooter className="p-4 pt-0">
        <Link href={`/tenant/view_property/${property.id}`} className="w-full bg-primary text-white items-center flex justify-center rounded-md p-3 hover:bg-primary/90">
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}