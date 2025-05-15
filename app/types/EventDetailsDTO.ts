import { HomePageEventDTO } from "./HomePageEventDTO";

export interface EventDetailsDTO {
  id: number;
  name: string;
  description: string;
  agenda: string;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  date: string;
  venue: string;
  price: number;
  booked: boolean;
}

export function mapEventDetailsToHomePage(event: EventDetailsDTO): HomePageEventDTO {
  return {
    id: event.id,
    title: event.name,               
    description: event.description,                     
    categoryId: event.categoryId,
    category: event.categoryName,    
    imageUrl: event.imageUrl,
    date: event.date,                    
    price: event.price,
    booked: event.booked,
  };
}