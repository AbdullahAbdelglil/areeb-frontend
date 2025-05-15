export interface UserDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN'; // Based on the Role enum in backend
}