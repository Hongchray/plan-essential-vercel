import { Tag } from "@/interfaces/tag";
import { Group } from "@/interfaces/group";
import { GuestStatus } from "@/enums/guests";

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
  note?: string;
  address?: string;
  guestTag?: GuestTag[];
  guestGroup?: GuestGroup[];
  image?: string;
  status?: GuestStatus;
  wishing_note?: string;
  number_of_guests?: number;
  sentAt?: string;
  is_invited?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuestTag {
  id: string;
  guestId: string;
  tagId: string;
  createdAt: string;
  updatedAt: string;
  tag?: Tag;
}

export interface GuestGroup {
  id: string;
  guestId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  group?: Group;
}
