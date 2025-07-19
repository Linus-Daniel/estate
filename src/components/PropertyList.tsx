import PropertyCard from "./PropertyCard";


const properties = [
  {
    id: 1,
    title: 'Modern Downtown Loft',
    address: '123 Main St, New York, NY',
    price: 450000,
    status: 'Active',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: '/property1.jpg'
  },
  {
    id: 2,
    title: 'Suburban Family Home',
    address: '456 Oak Ave, Boston, MA',
    price: 750000,
    status: 'Pending',
    type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    image: '/property2.jpg'
  },
  {
    id: 3,
    title: 'Luxury Waterfront Villa',
    address: '789 Beach Blvd, Miami, FL',
    price: 2500000,
    status: 'Active',
    type: 'Villa',
    bedrooms: 5,
    bathrooms: 4,
    area: 3800,
    image: '/property3.jpg'
  },
  {
    id: 4,
    title: 'City Center Penthouse',
    address: '101 Skyline Dr, Chicago, IL',
    price: 1200000,
    status: 'Sold',
    type: 'Penthouse',
    bedrooms: 3,
    bathrooms: 3,
    area: 2800,
    image: '/property4.jpg'
  },
  {
    id: 5,
    title: 'Mountain View Cabin',
    address: '222 Forest Rd, Denver, CO',
    price: 350000,
    status: 'Active',
    type: 'Cabin',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image: '/property5.jpg'
  },
  {
    id: 6,
    title: 'Historic Townhouse',
    address: '333 Heritage Ln, Philadelphia, PA',
    price: 650000,
    status: 'Draft',
    type: 'Townhouse',
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    image: '/property6.jpg'
  },
];

export default function PropertyList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}