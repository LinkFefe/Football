// Tipi per l'applicazione

export type Role = "PLAYER" | "OWNER" | "ADMIN";

export type Session = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type UserItem = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type FieldItem = {
  id: number;
  name: string;
  size: string;
  location?: string | null;
  imageUrl?: string | null;
  ownerName?: string; 
  ownerEmail?: string; 
};

export type BookingItem = {
  id: number;
  startDate: string;
  endDate: string;
  createdAt?: string;
  field: { id: number; name: string; size: string; location?: string | null; imageUrl?: string | null };
};

export type AdminBookingItem = {
  id: number;
  startDate: string;
  endDate: string;
  field: { name: string };
  player: { user: { name: string } };
};

// Tipo per i dati della dashboard
export type DashboardData = {
  user?: {
    name: string;
    player?: {
      bookings: BookingItem[];
    } | null;
  } | null;
  fields?: FieldItem[];
  owner?: {
    user: { name: string };
    fields: Array<{
      id: number;
      name: string;
      size: string;
      location?: string | null;
      imageUrl?: string | null;
      createdAt?: string;
      bookings: Array<{
        id: number;
        startDate: string;
        endDate: string;
        player: { user: { name: string } };
      }>;
    }>;
  } | null;
  users?: UserItem[]; // Solo per admin
  bookings?: AdminBookingItem[]; // Solo per admin
};
