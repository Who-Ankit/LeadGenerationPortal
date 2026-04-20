export type LeadStatus = "new" | "contacted" | "qualified";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: LeadStatus;
  score: number;
  created_at: string;
};
