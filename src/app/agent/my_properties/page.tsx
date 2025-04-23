// app/dashboard/my-properties/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { homeData } from "@/constants";

interface Property {
  id: string;
  name: string;
  price: string;
  location: string;
  bed: string;
  rooms: string;
  image: string;
}

export default function MyProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock API fetch
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Replace with actual API call
        const mockProperties: Property[] = [
          {
            id: "1",
            name: "Sunset Villa",
            price: "$350,000",
            location: "Malibu, CA",
            bed: "3",
            rooms: "4",
            image: "/property1.jpg",
          },
          // Add more mock properties...
        ];
        setProperties(mockProperties);
      } catch (error) {
        toast.error("Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleDelete = (id: string) => {
    // Confirm before deleting
    if (window.confirm("Delete this property?")) {
      setProperties(properties.filter((prop) => prop.id !== id));
      toast.success("Property deleted");
    }
  };

  const filteredProperties = properties.filter((prop) =>
    prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header + Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Button asChild>
            <Link href="/my_properties/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New
            </Link>
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No properties found</p>
              <Button asChild>
                <Link href="/dashboard/my-properties/add">
                  Add Your First Property
                </Link>
              </Button>
            </div>
          )}

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeData.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0 relative">
                  <div className="relative h-48 w-full">
                    <Image
                      src={property.image}
                      alt={property.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <p className="text-primary font-medium">{property.price}</p>
                  <p className="text-sm text-gray-600">{property.location}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>🛏️ {property.bed} Beds</span>
                    <span>🚪 {property.rooms} Rooms</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/my_properties/edit/${property.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}