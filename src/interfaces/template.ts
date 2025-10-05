export interface Template {
  id: string;
  name: string;
  type: string;
  image?: string;
  defaultConfig?: JSON;
  unique_name: string;
  eventTemplates: EventTemplate[];
  isFree: boolean;
  createdAt: Date;
  status: string;
  updatedAt: Date;
}

export interface EventTemplate {
  id: string;
  eventId: string;
  templateId: string;
  config?: JSON;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
