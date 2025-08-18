"use client"
import { PropertyCard } from "@/constants/propertyCard";
import { useProperty } from "@/context/PropertyContext";

export default function Home() {
  const {properties} = useProperty()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Featured Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {
          properties.map((item,index) => (

            <PropertyCard property={item} key={index} />

          ))
        }
        {/* Add more cards here */}
      </div>
    </div>
  );
}