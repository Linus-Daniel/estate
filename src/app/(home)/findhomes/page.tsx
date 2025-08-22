"use client";
import { useState, useMemo } from "react";
import { PropertyCard } from "@/constants/propertyCard";
import { useProperty } from "@/context/PropertyContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Grid, List } from "lucide-react";

export default function Home() {
  const { properties } = useProperty();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    minPrice: 0,
    maxPrice: 1000000,
    bedrooms: "any",
    bathrooms: "any",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Calculate min and max prices from properties
  const priceRange = useMemo(() => {
    if (properties.length === 0) return { min: 0, max: 1000000 };
    const prices = properties.map((p) => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [properties]);

  // Update price filters when properties load
  useState(() => {
    if (properties.length > 0) {
      setFilters((prev) => ({
        ...prev,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      }));
    }
  });

  // Extract unique property types and statuses for filter options
  const propertyTypes = useMemo(() => {
    const types = [...new Set(properties.map((p) => p.type))];
    return types.filter(Boolean);
  }, [properties]);

  const propertyStatuses = useMemo(() => {
    const statuses = [...new Set(properties.map((p) => p.status))];
    return statuses.filter(Boolean);
  }, [properties]);

  // Filter properties based on search and filter criteria
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search query filter
      const matchesSearch =
        searchQuery === "" ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        property.location?.formattedAddress
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        filters.status === "all" || property.status === filters.status;

      // Type filter
      const matchesType =
        filters.type === "all" || property.type === filters.type;

      // Price filter
      const matchesPrice =
        property.price >= filters.minPrice &&
        property.price <= filters.maxPrice;

      // Bedrooms filter
      const matchesBedrooms =
        filters.bedrooms === "any" ||
        property.bedrooms >= parseInt(filters.bedrooms);

      // Bathrooms filter
      const matchesBathrooms =
        filters.bathrooms === "any" ||
        property.bathrooms >= parseInt(filters.bathrooms);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesPrice &&
        matchesBedrooms &&
        matchesBathrooms
      );
    });
  }, [properties, searchQuery, filters]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: "all",
      type: "all",
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      bedrooms: "any",
      bathrooms: "any",
    });
    setSearchQuery("");
  };

  // Check if any filter is active
  const isFilterActive =
    filters.status !== "all" ||
    filters.type !== "all" ||
    filters.minPrice !== priceRange.min ||
    filters.maxPrice !== priceRange.max ||
    filters.bedrooms !== "any" ||
    filters.bathrooms !== "any" ||
    searchQuery !== "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search and Filter Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto p-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search properties by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>

            {/* Filter Toggle and View Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {isFilterActive && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 p-0 flex items-center justify-center"
                    >
                      !
                    </Badge>
                  )}
                </Button>

                {isFilterActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs"
                  >
                    Clear all
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t bg-white p-4 shadow-inner">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Status
                  </label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {propertyStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) =>
                      setFilters({ ...filters, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bedrooms Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Bedrooms
                  </label>
                  <Select
                    value={filters.bedrooms}
                    onValueChange={(value) =>
                      setFilters({ ...filters, bedrooms: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any bedrooms</SelectItem>
                      <SelectItem value="1">1+ bedroom</SelectItem>
                      <SelectItem value="2">2+ bedrooms</SelectItem>
                      <SelectItem value="3">3+ bedrooms</SelectItem>
                      <SelectItem value="4">4+ bedrooms</SelectItem>
                      <SelectItem value="5">5+ bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bathrooms Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Bathrooms
                  </label>
                  <Select
                    value={filters.bathrooms}
                    onValueChange={(value) =>
                      setFilters({ ...filters, bathrooms: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any bathrooms</SelectItem>
                      <SelectItem value="1">1+ bathroom</SelectItem>
                      <SelectItem value="2">2+ bathrooms</SelectItem>
                      <SelectItem value="3">3+ bathrooms</SelectItem>
                      <SelectItem value="4">4+ bathrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="mt-6">
                <label className="text-sm font-medium mb-2 block">
                  Price Range: ₦{filters.minPrice.toLocaleString()} - ₦
                  {filters.maxPrice.toLocaleString()}
                </label>
                <div className="px-2">
                  <Slider
                    min={priceRange.min}
                    max={priceRange.max}
                    step={1000}
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        minPrice: value[0],
                        maxPrice: value[1],
                      })
                    }
                    className="py-2"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₦{priceRange.min.toLocaleString()}</span>
                  <span>₦{priceRange.max.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredProperties.length} of {properties.length}{" "}
            properties
          </p>
        </div>

        {/* Properties Grid/List */}
        {filteredProperties.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property._id || index}
                property={property}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              No properties match your search criteria
            </div>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
