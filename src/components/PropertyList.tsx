import { Property } from "@/types";
import PropertyTable from "./PropertyCard";
import { Button } from "./ui/button";

export default function PropertyList({
  properties,
}: {
  properties: Property[];
}) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Management</h1>
        <Button>Add New Property</Button>
      </div>
      <PropertyTable properties={properties} />
    </div>
  );
}
