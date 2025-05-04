"use client"
import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FiSave, FiX, FiImage, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { BubbleMenu } from '@tiptap/react'

// Toolbar component for the editor
const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      <div className="flex space-x-1 p-1 bg-white rounded-md shadow-lg border border-gray-200">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
        >
          <span className="italic">I</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
        >
          <span>• List</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
        >
          <span>1. List</span>
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter the URL of the link:')
            if (url) {
              editor.chain().focus().toggleLink({ href: url }).run()
            }
          }}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
        >
          <span>Link</span>
        </button>
      </div>
    </BubbleMenu>
  )
}

const BlogEditor = () => {
  const params =  useParams()

  const router = useRouter()
  const isEditing = !!params.id
  
  const [formData, setFormData] = useState({
    title: isEditing ? "Building Gains Into Housing Stocks And How" : "",
    category: isEditing ? "Furniture" : "",
    content: isEditing ? `
      <p>The average contract interest rate for 30-year fixed-rate mortgages with conforming loan balances ($726,200 or less) decreased to 6.23% from 6.34%, with points decreasing to 0.59 from 0.64 (including the origination fee) for loans with a 20% down payment.</p>
      <p>Mortgage applications increased 7.4% from one week earlier, according to data from the Mortgage Bankers Association's Weekly Mortgage Applications Survey for the week ending January 20, 2023.</p>
    ` : "",
    image: isEditing ? "/images/blogs/blog1.avif" : "",
    tags: isEditing ? ["Real Estate", "Investing"] : []
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your blog content here...',
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
      }),
    ],
    content: formData.content,
    onUpdate: ({ editor }:any) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }))
    },
  })

  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // In a real app, you'd call an API here
      console.log('Submitting:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      router.push(`/blog/${params?.id || 'new-post-id'}`)
    } catch (error) {
      console.error('Error submitting post:', error)
    } finally {
      setIsSubmitting(false)
    }
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
            <FiX className="mr-2" />
            Cancel
          </button>
        </motion.div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg overflow-hidden p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Interior Design">Interior Design</option>
                  <option value="Architecture">Architecture</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {editor && <EditorToolbar editor={editor} />}
                  <EditorContent 
                    editor={editor} 
                    className="min-h-[200px] p-4 focus:outline-none" 
                  />
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
                  {formData.image ? (
                    <div className="relative w-full h-full">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <FiImage className="mx-auto text-gray-400 text-2xl mb-2" />
                      <p className="text-sm text-gray-500">Upload an image</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const file = e.target.files[0]
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              setFormData(prev => ({
                                ...prev,
                                image: event.target?.result as string
                              }))
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <label
                        htmlFor="image-upload"
                        className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary-dark transition-colors"
                      >
                        Select Image
                      </label>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-primary focus:border-primary"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-primary text-white rounded-r-lg hover:bg-primary-dark transition-colors"
                  >
                    <FiPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        <FiX size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="pt-4"
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70"
                >
                  <FiSave className="mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Post'}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.form>
      </div>
    </motion.div>
  )
}

export default BlogEditor