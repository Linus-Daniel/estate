"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import ImageUpload from "@/components/imageUpload";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditProperty({ params }: PageProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    location: "",
    bed: "",
    rooms: "",
    description: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch property");
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        toast.error("Failed to load property");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/properties/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Update failed");
      toast.success("Property updated!");
      router.push("/dashboard/my-properties");
    } catch (error) {
      toast.error("Failed to update property");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price*</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location*</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bed">Bedrooms</Label>
            <Input
              id="bed"
              type="number"
              value={formData.bed}
              onChange={(e) =>
                setFormData({ ...formData, bed: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rooms">Rooms</Label>
            <Input
              id="rooms"
              type="number"
              value={formData.rooms}
              onChange={(e) =>
                setFormData({ ...formData, rooms: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/my_properties")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
