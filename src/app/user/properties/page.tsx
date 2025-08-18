"use client"
import { PropertyCard } from "@/constants/propertyCard";
import { useProperty } from "@/context/PropertyContext";
import { getCsrfToken } from "@/lib/api";
import { useEffect } from "react";

export default function Home() {
  const { properties } = useProperty();
  useEffect(()=>{const token = getCsrfToken(); console.log(token)},[])
  
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Featured Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {properties.map((item) => (
          <PropertyCard property={item} key={item._id} />
        ))}
      </div>
    </div>
  );
}