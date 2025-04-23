"use client";
import { useEffect, useState } from "react";
import { useRouter,useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/imageUpload";

interface PropertyFormData {
  name: string;
  price: string;
  location: string;
  bed: string;
  rooms: string;
  description: string;
  image: string;
}


export default function EditProperty() {
  const router = useRouter();
  const [formData, setFormData] = useState<PropertyFormData>({
    name: "",
    price: "",
    location: "",
    bed: "",
    rooms: "",
    description: "",
    image: "",
  });

  const params = useParams()

  const id = params?.id  as string
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) throw new Error("Failed to fetch property");

        const data = await response.json();
        setFormData({
          name: data.name || "",
          price: data.price || "",
          location: data.location || "",
          bed: data.bed?.toString() || "",
          rooms: data.rooms?.toString() || "",
          description: data.description || "",
          image: data.image || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load property");
        router.push("/dashboard/my-properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bed: parseInt(formData.bed) || 0,
          rooms: parseInt(formData.rooms) || 0,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      toast.success("Property updated successfully!");
      router.push("/dashboard/my-properties");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Property Image</Label>
          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Property Name*</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price*</Label>
            <Input
              id="price"
              type="text"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location*</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bed">Bedrooms</Label>
            <Input
              id="bed"
              type="number"
              min="0"
              value={formData.bed}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rooms">Rooms</Label>
            <Input
              id="rooms"
              type="number"
              min="0"
              value={formData.rooms}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/my-properties")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}