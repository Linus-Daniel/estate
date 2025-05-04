"use client"
import { motion } from 'framer-motion'
import { FiCalendar, FiUser, FiArrowLeft, FiEdit, FiTrash2 } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useParams } from 'next/navigation'

const ViewBlog = () => {

  const params = useParams()

  const router = useRouter()
  
  // Mock data - in a real app, you'd fetch this from an API
  const blogPost = {
    id: params.id,
    title: "Building Gains Into Housing Stocks And How",
    date: "January 28, 2024",
    author: "Jerome Bell",
    category: "Furniture",
    content: `
      <p>The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances ($726,200 or less) decreased to 6.23% from 6.34%, with points decreasing to 0.59 from 0.64 (including the origination fee) for loans with a 20% down payment.</p>
      
      <p>Mortgage applications increased 7.4% from one week earlier, according to data from the Mortgage Bankers Association's Weekly Mortgage Applications Survey for the week ending January 20, 2023.</p>
      
      <h3>Market Trends Analysis</h3>
      
      <p>The refinance share of mortgage activity increased to 31.2% of total applications from 30.7% the previous week. The adjustable-rate mortgage (ARM) share of activity decreased to 7.4% of total applications.</p>
      
      <p>The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances ($726,200 or less) decreased to 6.23% from 6.34%, with points decreasing to 0.59 from 0.64 (including the origination fee) for loans with a 20% down payment.</p>
    `,
    image: "/images/blogs/blog1.avif",
    tags: ["Real Estate", "Investing", "Market Trends"]
  }

  const handleDelete = () => {
    // In a real app, you'd call an API here
    console.log('Deleting post:', blogPost.id)
    router.push('/blog')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <button 
            onClick={() => router.back()}
            className="flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Blog
          </button>
        </motion.div>

        <motion.article
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="relative h-96 w-full">
            <Image
              src={blogPost.image}
              alt={blogPost.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-8">
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="flex items-center text-gray-500">
                  <FiCalendar className="mr-2" />
                  <span>{blogPost.date}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FiUser className="mr-2" />
                  <span>{blogPost.author}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => router.push(`/blog/edit/${blogPost.id}`)}
                  className="flex items-center px-4 py-2 bg-primary bg-opacity-10 text-white rounded-lg hover:bg-opacity-20 transition-all"
                >
                  <FiEdit className="mr-2 text-white" />
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 bg-red-500 bg-opacity-10 text-white rounded-lg hover:bg-opacity-20 transition-all"
                >
                  <FiTrash2 className="mr-2 text-white" />
                  Delete
                </button>
              </div>
            </div>

            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              {blogPost.title}
            </motion.h1>

            <div className="flex flex-wrap gap-2 mb-8">
              {blogPost.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
            />
          </div>
        </motion.article>
      </div>
    </motion.div>
  )
}

export default ViewBlog