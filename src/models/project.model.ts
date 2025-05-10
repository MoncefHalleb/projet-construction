export interface Project {
  id?: number; // ✅ Ensure id is always defined
  nomProjet: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  documents?: string; // ✅ FIX: Add this property
  location: string;
  images?: string;
  latitude?: number;
  longitude?: number;
}
