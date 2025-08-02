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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit2 className="h-4 w-4 text-green-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" defaultValue={property.title} />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue={property.address} />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <DollarSign className="h-4 w-4" />
                  </span>
                  <Input
                    id="price"
                    type="number"
                    defaultValue={property.price}
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={property.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Input id="type" defaultValue={property.type} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    defaultValue={property.bedrooms}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    defaultValue={property.bathrooms}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="area">Area (sqft)</Label>
                <Input id="area" type="number" defaultValue={property.area} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  defaultValue={property.description || ""}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyTable;
