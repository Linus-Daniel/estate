// app/dashboard/my-properties/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { homeData } from "@/constants";
import { useProperty } from "@/context/PropertyContext";
import { Property } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyProperties() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { properties, deleteProperty } = useProperty();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPropertyToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (propertyToDelete) {
      try {
        await deleteProperty(propertyToDelete);
        toast.success("Property deleted successfully");
      } catch (error) {
        toast.error("Failed to delete property");
      } finally {
        setIsDeleteDialogOpen(false);
        setPropertyToDelete(null);
      }
    }
  };

  const filteredProperties = properties.filter(
    (prop: Property) =>
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location?.formattedAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the property and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Property
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <Link href="/agent/my_properties/add">
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
            {properties.map((property) => (
              <Card
                key={property._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="p-0 relative">
                  <div className="relative h-48 w-full">
                    <Image
                      src={property.images[0]?.url}
                      alt={property.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{property.title}</h3>
                  <p className="text-primary font-medium">{property.price}</p>
                  <p className="text-sm text-gray-600">{property?.location?.formattedAddress}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>🛏️ {property.bedrooms} Beds</span>
                    <span>🚪 {property.bathrooms} Rooms</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/agent/my_properties/edit/${property._id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(property._id)}
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