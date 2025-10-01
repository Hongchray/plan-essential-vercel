export interface Plan {
  id: string;
  name: string;
  price: number;
  userPlan: UserPlan;
  limit_guests: number;
  limit_template: number;
  limit_export_excel: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPlan {
  id: string;
  userId: string;
  planId: string;
  plan: Plan;
  limit_guests: number;
  limit_template: number;
  limit_export_excel: boolean;
  createdAt: string;
  updatedAt: string;
}
