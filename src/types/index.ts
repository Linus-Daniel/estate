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
  }