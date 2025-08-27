"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Search,
  Filter,
  X,
  Grid,
  List,
  MapPin,
  Home,
  Bed,
  Bath,
  Ruler,
  Sparkles,
} from "lucide-react";

export default function PropertyListingPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Search and Filter Header */}
      <div className="bg-white shadow-md border-b sticky top-0 z-20">
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Find Your Dream Home in Nigeria
              </h1>
              <p className="text-gray-600">
                Discover properties across Lagos, Abuja, Port Harcourt and more
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by location, property type, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full text-lg border-2 focus:border-green-500 transition-colors"
              />
            </motion.div>

            {/* Filter Toggle and View Controls */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="lg"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-white border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Filter className="h-5 w-5" />
                  Filters
                  {isFilterActive && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-6 w-6 p-0 flex items-center justify-center bg-green-600 text-white"
                    >
                      {
                        [
                          filters.status !== "all",
                          filters.type !== "all",
                          filters.bedrooms !== "any",
                          filters.bathrooms !== "any",
                          searchQuery !== "",
                        ].filter(Boolean).length
                      }
                    </Badge>
                  )}
                </Button>

                {isFilterActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-green-700 hover:text-green-800 hover:bg-green-100"
                  >
                    Clear all
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:block">
                  View:
                </span>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-9 w-9 p-0 rounded-md"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-9 w-9 p-0 rounded-md"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t bg-white overflow-hidden"
            >
              <div className="container mx-auto p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Status Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block text-gray-700">
                      Property Status
                    </label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        setFilters({ ...filters, status: value })
                      }
                    >
                      <SelectTrigger className="w-full border-2 focus:border-green-500">
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
                    <label className="text-sm font-medium mb-2 block text-gray-700">
                      Property Type
                    </label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) =>
                        setFilters({ ...filters, type: value })
                      }
                    >
                      <SelectTrigger className="w-full border-2 focus:border-green-500">
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
                    <label className="text-sm font-medium mb-2 block text-gray-700">
                      Bedrooms
                    </label>
                    <Select
                      value={filters.bedrooms}
                      onValueChange={(value) =>
                        setFilters({ ...filters, bedrooms: value })
                      }
                    >
                      <SelectTrigger className="w-full border-2 focus:border-green-500">
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
                    <label className="text-sm font-medium mb-2 block text-gray-700">
                      Bathrooms
                    </label>
                    <Select
                      value={filters.bathrooms}
                      onValueChange={(value) =>
                        setFilters({ ...filters, bathrooms: value })
                      }
                    >
                      <SelectTrigger className="w-full border-2 focus:border-green-500">
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
                  <label className="text-sm font-medium mb-2 block text-gray-700">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="container mx-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2"
        >
          <p className="text-sm text-gray-600">
            {filteredProperties.length === properties.length ? (
              <>Showing all {properties.length} properties</>
            ) : (
              <>
                Showing {filteredProperties.length} of {properties.length}{" "}
                properties {isFilterActive && "that match your criteria"}
              </>
            )}
          </p>

          {isFilterActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="text-green-700 border-green-300 hover:bg-green-50"
            >
              Clear all filters
            </Button>
          )}
        </motion.div>

        {/* Properties Grid/List */}
        {filteredProperties.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PropertyCard property={property} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed"
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No properties found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No properties match your search criteria. Try adjusting your
                filters or search terms.
              </p>
            </div>
            <Button
              onClick={resetFilters}
              className="bg-green-600 hover:bg-green-700"
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}