export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  username?: string | null;
  photoUrl?: string | null;
  phone?: string | null;
  role: string;
  telegramId?: string | null;
  otp_code?: string | null;
  otp_expires_at?: Date | null;
  phone_verified?: boolean;
  phone_verified_at?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  plans?: {
    id: string;
    name: string;
    price: number | null;
    limit_guests: number;
    limit_template: number;
    limit_export_excel: boolean;
  }[];
}
