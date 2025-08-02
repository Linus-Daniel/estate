"use client";
import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImagePlus, X, Upload } from "lucide-react";
import axios from "axios";
import api, { getCsrfToken, uploadImage } from "@/lib/api";
import { useAuth } from "@/context/auth_context";
import { validateFileGroups, validateFormFields } from "@/utils/validation";
import { parseUploadResponse, uploadImageGroup } from "@/utils/imageUpload";

interface PropertyFormData {
  title: string;
  price: string;
  address: string;
  type: string;
  status: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  description: string;
  amenities: string[];
  images: [];
}

export default function AddProperty() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { user } = useAuth();

  const propertyTypes = ["apartment", "house", "condo", "land"];
  const propertyStatuses = ["rent", "sale", "sold", "rented"];
  const commonAmenities = [
    "WiFi",
    "Parking",
    "Swimming Pool",
    "Gym",
    "Air Conditioning",
    "Heating",
    "Laundry",
    "Pets Allowed",
  ];

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = Array.from(files);
    setFormData((prev: any) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Create previews
    const newPreviews: string[] = [];
    newImages.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newImages.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setFormData((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev: any) => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a: any) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    address: "",
    type: "apartment",
    status: "sale",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    amenities: [],
    images: [], // This should hold File objects for upload
  });

  const requiredFields = [
    "title",
    "price",
    "address",
    "bedrooms",
    "bathrooms",
    "area",
    "description",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to create a property");
      return;
    }

    const validationError = validateFormFields(formData, requiredFields);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const { error: fileError, fileGroups } = validateFileGroups(formData);
    if (fileError) {
      toast.error(fileError);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const allUploadedImages: { public_id: string; url: string }[] = [];

      for (const [, fileArray] of fileGroups) {
        const results = await uploadImageGroup(
          fileArray as File[],

          token,
          setUploadProgress
        );
        allUploadedImages.push(...parseUploadResponse(results));
      }

      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        address: formData.address,
        type: formData.type,
        status: formData.status,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        amenities: formData.amenities,
        images: allUploadedImages,
        agent: user?._id,
      };

      const response = await api.post("/properties", propertyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success("Property created successfully!");
      console.log(response.data.data._id);
      // router.push(`/agent/my_properties/${response.data.data._id}`);
    } catch (error) {
      console.error("Property creation error:", error);
      let errorMessage = "Failed to create property";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Add New Property
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Fill in the details of your property to list it for potential buyers
          or renters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">
            Property Images (Max 10)
          </Label>
          <div className="flex flex-col items-center justify-center gap-4">
            {imagePreviews.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={preview}
                      alt={`Property preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                ))}
                {imagePreviews.length < 10 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Add more images
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Click to upload or drag and drop
                  <br />
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    PNG, JPG, JPEG (max. 5MB each)
                  </span>
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              multiple
              max={10}
            />
            {isUploading && uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-gray-700 dark:text-gray-300"
              >
                Property Title*
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="type"
                className="text-gray-700 dark:text-gray-300"
              >
                Property Type*
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-gray-700 dark:text-gray-300"
              >
                Status*
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {propertyStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-gray-700 dark:text-gray-300"
              >
                Price*
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                  className="pl-8 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-gray-700 dark:text-gray-300"
              >
                Address*
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
                className="dark:bg-gray-800 dark:border-gray-700"
                placeholder="Street, City, State, ZIP"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="bedrooms"
                className="text-gray-700 dark:text-gray-300"
              >
                Bedrooms*
              </Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bedrooms: e.target.value })
                }
                required
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="bathrooms"
                className="text-gray-700 dark:text-gray-300"
              >
                Bathrooms*
              </Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) =>
                  setFormData({ ...formData, bathrooms: e.target.value })
                }
                required
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="area"
                className="text-gray-700 dark:text-gray-300"
              >
                Area (sq ft)*
              </Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                required
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">
              Amenities
            </Label>
            <div className="flex flex-wrap gap-2">
              {commonAmenities.map((amenity: string) => (
                <Button
                  key={amenity}
                  type="button"
                  variant={
                    formData.amenities.includes(amenity as never)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-gray-700 dark:text-gray-300"
            >
              Description*
            </Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="dark:bg-gray-800 dark:border-gray-700"
              placeholder="Describe the property features, amenities, and neighborhood..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/my-properties")}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6"
            disabled={isUploading || formData.images.length === 0}
          >
            {isUploading ? "Creating Property..." : "Create Property"}
          </Button>
        </div>
      </form>
    </div>
  );
}
