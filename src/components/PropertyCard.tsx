"use client";

import { useState } from "react";
import {
  Home,
  Bed,
  Bath,
  Ruler,
  DollarSign,
  Edit2,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Property } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/imageUpload";
import { useProperty } from "@/context/PropertyContext";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const StatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    rent: "bg-green-100 text-green-800",
    sale: "bg-yellow-100 text-yellow-800",
    sold: "bg-blue-100 text-blue-800",
    rented: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusColors[status.toLowerCase() as keyof typeof statusColors] ||
        "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const PropertyTable = ({ properties }: { properties: Property[] }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Beds</TableHead>
            <TableHead>Baths</TableHead>
            <TableHead>Area</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property._id}>
              <TableCell>
                <div className="relative h-12 w-16">
                  <Image
                    src={property.images?.[0]?.url || "/default-property.jpg"}
                    alt={property.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{property.title}</TableCell>
              <TableCell>{property.type}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {property.price.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={property.status} />
              </TableCell>
              <TableCell>{property.bedrooms}</TableCell>
              <TableCell>{property.bathrooms}</TableCell>
              <TableCell>{property.area} sqft</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <ViewPropertyModal property={property} />
                  <EditPropertyModal property={property} />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ViewPropertyModal = ({ property }: { property: Property }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Property Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{property.title}</h3>
              <p className="text-gray-600">{property.address}</p>
              <div className="flex items-center pt-2">
                <DollarSign className="h-5 w-5 mr-1" />
                <span className="text-xl font-bold">
                  {property.price.toLocaleString()}
                </span>
              </div>
              <div className="pt-2">
                <StatusBadge status={property.status} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <p>{property.type}</p>
                </div>
                <div>
                  <Label>Bedrooms</Label>
                  <p>{property.bedrooms}</p>
                </div>
                <div>
                  <Label>Bathrooms</Label>
                  <p>{property.bathrooms}</p>
                </div>
                <div>
                  <Label>Area</Label>
                  <p>{property.area} sqft</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-64 w-full rounded-md overflow-hidden">
            <Image
              src={property.images?.[0]?.url || "/default-property.jpg"}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <Label>Description</Label>
            <p className="text-gray-700">
              {property.description || "No description available"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const EditPropertyModal = ({ property }: { property: Property }) => {
  const { updateProperty } = useProperty();
  const [formData, setFormData] = useState<Property>(property);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error("Please provide a property title");
      return;
    }

    if (!formData.price) {
      toast.error("Please provide a property price");
      return;
    }

    if (!formData.address) {
      toast.error("Please provide a property address");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProperty(property._id, {
        title: formData.title,
        price: formData.price,
        address: formData.address,
        bedrooms: formData.bedrooms || 0,
        bathrooms: formData.bathrooms || 0,
        description: formData.description,
        images: formData.images,
        type: formData.type,
        area: formData.area,
        status: formData.status,
      });

      toast.success("Property updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit2 className="h-4 w-4 text-green-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <section className="space-y-4">
              <h3 className="font-medium">Property Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Main Image</Label>
                  <ImageUpload
                    value={formData.images[0]?.url || ""}
                    onChange={(url) =>
                      setFormData({
                        ...formData,
                        images: [
                          {
                            url,
                            public_id: formData.images[0]?.public_id || "",
                          },
                        ],
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a high-quality image of your property
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title*</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Beautiful 3-bedroom apartment"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price*</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="pl-8"
                      placeholder="250,000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address*</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="123 Main St, City, Country"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Describe your property in detail..."
                />
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="font-medium">Property Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Area (sqft)</Label>
                  <Input
                    id="area"
                    type="number"
                    min="0"
                    value={formData.area}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="1500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Apartment"
                  />
                </div>
              </div>
            </section>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyTable;
