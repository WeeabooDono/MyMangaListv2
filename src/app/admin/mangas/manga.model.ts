export interface Manga {
  id: number;
  title: string;
  description: string;
  author: string;
  image: File | string;
  genres: string[];
  score: number;
  votes: number;
}
