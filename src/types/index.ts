export interface Details {

    icon:string | any;
    value:number
    title:string;
    color:string;



}

export interface RoomData {
    title:string;
    price:number;
    owner:string;
    roomd:number;
    description:string;
    

}

export interface Property {
    _id: string;
    title: string;
    price: number;
    location?:{
        formattedAddress:string
    }
    description:string;
   address:string;
    bedrooms: number;
    bathrooms: number;
    images: [{
        url:string;
        public_id:string
    }];
    type:string
    amenities:[string];
    area:number
  }


export interface PaymentPropsTypes {
    token:string;
    email:string;
    propertyId:string
}




export type Message = {
    _id: string;
    chat: string;
    sender: {
      _id: string;
      name: string;
      avatar?: string;
    };
    content: string;
    read: boolean;
    readAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  };
  
 export  type TypingEvent = {
    chatId: string;
    userId: string;
  };
  
 export  type SendMessageCallback = (response: {
    status: 'success' | 'error';
    message?: Message;
    error?: string;
  }) => void;


  
  export interface Transaction {
    _id: string;
    user: string;
    property: Property | string;
    amount: number;
    status: "pending" | "completed" | "failed";
    transactionId: string;
    paymentMethod: string;
    createdAt: string;
    __v: number;
  }