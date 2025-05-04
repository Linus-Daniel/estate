import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/context/auth_context'
import Link from 'next/link'

interface Chat {
  _id: string
  participants: {
    _id: string
    name: string
    email: string
    photo?: string
  }[]
  property?: {
    _id: string
    title: string
    images: string[]
  }
  lastMessage?: {
    content: string
    createdAt: string
  }
  updatedAt: string
}

export default function ChatList() {
  const { user } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('/api/v1/chats')
        // Filter to only show chats that have a property
        const propertyChats = res.data.data.filter((chat: Chat) => chat.property)
        setChats(propertyChats)
      } catch (err) {
        console.error('Error fetching chats:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchChats()
    }
  }, [user])

  if (loading) return <div>Loading chats...</div>

  return (
    <div className="space-y-2">
      {chats.length === 0 ? (
        <p>No property chats yet</p>
      ) : (
        chats.map((chat) => {
          const agent = chat.participants.find((p) => p._id !== user?._id)
          return (
            <Link
              href={`/chats/${chat._id}`}
              key={chat._id}
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                {agent?.photo && (
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{agent?.name} (Agent)</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(chat.updatedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage?.content || 'No messages yet'}
                </p>
                {chat.property && (
                  <p className="text-xs text-blue-600 mt-1">
                    {chat.property.title}
                  </p>
                )}
              </div>
            </Link>
          )
        })
      )}
    </div>
  )
}