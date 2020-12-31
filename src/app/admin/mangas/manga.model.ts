export interface Manga {
  id: number;
  title: string;
  description: string;
  author: string;
  image: File | string;
  // Optionnal parameters since we only get them from a view and not a table
  genres?: string[];
  votes?: number;
  score?: number;
  rank?: number;
  readers?: number;
  popularity?: number;
  status?: string;
}
