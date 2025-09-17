import { CurrencyType } from "@/enums/currency_type";
import { PaymentType } from "@/enums/payment_type";
import { Guest } from "@/interfaces/guest";

export interface Gift {
  id: string;
  eventId: string;
  guestId: string;
  note?: string;
  payment_type: PaymentType; //bank , cash
  currency_type: CurrencyType; //usd , khr
  amount_usd: number;
  amount_khr: number;
  guest: Guest;
  createdAt: string;
  updatedAt: string;
}
