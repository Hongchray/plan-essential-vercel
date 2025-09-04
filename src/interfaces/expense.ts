export interface Expense {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  budget_amount: number;
  actual_amount: number;
  createdAt: string; 
  updatedAt: string;  
}