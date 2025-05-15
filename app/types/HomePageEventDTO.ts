import { EventDetailsDTO } from "./EventDetailsDTO";

export interface HomePageEventDTO {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  category: string;
  imageUrl: string;
  date: string;
  price: number;
  booked: boolean;
}


export function mapHomePageToEventDetails(event: HomePageEventDTO): EventDetailsDTO {
  return {
    id: event.id,
    name: event.title,                // title → name
    description: event.description,
    agenda: '',                       // Not present in source
    categoryId: event.categoryId,
    categoryName: event.category,     // category → categoryName
    imageUrl: event.imageUrl,
    date: event.date,
    venue: '',                        // Not present in source
    price: event.price,
    booked: event.booked,
  };
}
