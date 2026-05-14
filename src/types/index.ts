export type Category = 'Restaurants' | 'Travel' | 'Fitness' | 'Products' | 'Projects';
export type Status = 'saved' | 'done';
export type SourceType = 'screenshot' | 'link' | 'manual';

export interface SavedItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: Category;
  thumbnail_url: string;
  source_type: SourceType;
  source_url?: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  tags: string[];
  ai_summary: string;
  status: Status;
  created_at: string;
}
