"use client"
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth_context';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import api, { getCsrfToken } from '@/lib/api';

// Mock data and functions for local testing
const MOCK_CHAT_RESPONSE = {
  success: true,
  data: {
    _id: 'mock-chat-id-123',
    participants: ['user-id-1', 'agent-id-1'],
    property: 'property-id-1',
    createdAt: new Date().toISOString()
  }
};

const mockInitiateChat = async (propertyId: string) => {
  console.log('Using mock chat initiation for property:', propertyId);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: MOCK_CHAT_RESPONSE };
};

export default function PropertyChatButton({ propertyId }: { propertyId: string }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  

  const initiateChat = async () => {
    if (!user) {
      router.push('/login?returnUrl=' + window.location.pathname);
      return;
    }

    setLoading(true);
    try {
      let response;
      

        // Call real backend API in production
        response = await api.post(
          `/properties/${propertyId}/chat`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              "x-csrf-token": await getCsrfToken(),
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials:true
          }
        );
      

      console.log('Chat initiated:', response.data.data._id, response.data.data);
      router.push(`/user/chats/${response.data.data._id}`);
    } catch (error) {
      console.error('Error initiating chat:', error);
      
      let errorMessage = 'Failed to start chat. Please try again.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={initiateChat} disabled={loading}>
        <MessageSquare className="mr-2 h-4 w-4" />
        {loading ? 'Starting chat...' : 'Chat with Agent'}
      </Button>
      
      {/* Testing toggle - remove in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={initiateChat}
          className="text-xs text-gray-500 hover:underline"
        >
          {useMockData ? 'Using Mock Data' : 'Using Real Data'} (Dev Only)
        </button>
      )} */}
    </div>
  );
}