import { UserDTO } from './UserDTO';

export interface AdminViewEventDTO {
  id: number;
  name: string;
  description: string;
  agenda: string | null;
  category: number | null;
  date: string; 
  venue: string;
  price: number;
  imageUrl: string | null;
  users?: UserDTO[]; // optional
  numberOfBookings?: number; // optional
}

