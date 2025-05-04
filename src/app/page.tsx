import Head from "next/head";
import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import Cities from "@/components/sections/cities";
import FeaturedProperties from "@/components/sections/featured_property";
import Services from "@/components/sections/services";
import Testimonials from "@/components/sections/testimonial";
import Agents from "@/components/sections/agents";
import Blog from "@/components/sections/blog";
import Footer from "@/components/sections/footer";
import TestimonialSection from "@/components/sections/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Home Lengo - Find Your Dream Property</title>
        <meta
          name="description"
          content="Discover your perfect home with Home Lengo"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header  />
        <Hero />
        <Cities />
        <FeaturedProperties />
        <Services />
        <Testimonials />
        <Agents />
        <TestimonialSection />
        <Blog />
      </main>
      <Footer />
    </div>
  );
}
