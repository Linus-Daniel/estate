// app/page.tsx
import { homeData } from "@/constants";
import { PropertyCard } from "@/constants/propertyCard";

const sampleProperty = {
  id: "1",
  name: "Sunset Villa",
  price: "$350,000",
  location: "Malibu, California",
  bed: "3",
  rooms: "4",
  description: "A stunning beachfront villa with panoramic ocean views, modern amenities, and spacious living areas.",
  image: "https://example.com/images/sunset-villa.jpg",
};

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Featured Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {
          homeData.map((item,index) => (

            <PropertyCard property={item} key={index} />

          ))
        }
        {/* Add more cards here */}
      </div>
    </div>
  );
}