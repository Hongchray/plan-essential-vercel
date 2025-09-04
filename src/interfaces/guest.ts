import { Tag } from "@/interfaces/tag";
import { Group } from "@/interfaces/group";

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
  note?: string;
  address?: string;
  createdAt: string; 
  updatedAt: string; 
  guestTag?: GuestTag[];       
  guestGroup?: GuestGroup[];   
  image?: string;
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