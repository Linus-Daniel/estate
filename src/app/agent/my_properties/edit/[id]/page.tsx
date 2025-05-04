"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/imageUpload";
import { useProperty } from "@/context/PropertyContext";
import { Property } from "@/types";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";



export default function EditProperty() {
  const router = useRouter();
  const [formData, setFormData] = useState<Property>({
    title: "",
    _id: "",
    price: 0,
    address: "",
    bedrooms: 0,
    bathrooms: 0,
    description: "",
    images: [{ url: "", public_id: "" }],
  });

  const { fetchPropertyById, updateProperty } = useProperty();
  const params = useParams();
  const id = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data: Property = await fetchPropertyById(id) as any;
        
        setFormData({
          title: data.title || "",
          _id: id,
          price: data.price || 0,
          address: data.location?.formattedAddress || 
                 (typeof data.location === 'string' ? data.location : ""),
          bedrooms: data.bedrooms ||0 ,
          bathrooms: data.bathrooms || 0,
          description: data.description || "",
          images: data.images || [{ url: "", public_id: "" }],
        });
      } catch (error) {
        console.error("Failed to load property:", error);
        toast.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

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

      console.log(formData)
      await updateProperty(id, {
        title: formData.title,
        price: formData.price,
        address: formData.address,
        bedrooms: formData.bedrooms|| 0,
        bathrooms: formData.bathrooms || 0,
        description: formData.description,
        images: formData.images,
      });
      
      toast.success("Property updated successfully!");
      router.push("/agent/my_properties");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Properties
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Property</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your property details below
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
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
              </div>
            </section>
          </CardContent>

          <CardFooter className="flex justify-end gap-4 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/my-properties")}
              disabled={isSubmitting}
            >
              Discard Changes
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
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}