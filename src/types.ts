export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  github?: string;
  twitter?: string;
  website?: string;
  createdAt: number;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  category: string;
  tags: string[];
  workflowJson: string; // The n8n workflow JSON string
  stars: number;
  downloads: number;
  score?: number; // Score out of 10
  downloadUrl?: string; // Download URL for the template
  createdAt: number;
  updatedAt: number;
}

export type SortOption = 'newest' | 'popular' | 'downloads';
export type Category = 'All' | 'AI' | 'Marketing' | 'Sales' | 'DevOps' | 'Personal' | 'Other';

export const CATEGORIES: Category[] = ['All', 'AI', 'Marketing', 'Sales', 'DevOps', 'Personal', 'Other'];
