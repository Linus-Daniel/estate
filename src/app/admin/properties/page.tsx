// src/app/admin/properties/page.tsx
import { cookies } from "next/headers";
import serverApi from "@/lib/serverApi";
import PropertyList from "@/components/PropertyList";
import Link from "next/link";
import { Plus } from "lucide-react";

async function getProperties() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.warn("No authentication token found");
      return [];
    }

    const response = await serverApi.get("/properties", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return [];
  }
}

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Property Management</h1>
        <Link
          href="/admin/properties/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </Link>
      </div>
      <PropertyList properties={properties} />
    </div>
  );
}
