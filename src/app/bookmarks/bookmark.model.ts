export interface Bookmark {
  id: number;
  status: string;
  user_id: number;
  manga_id: number;
  title: string;
  author: string;
  image: string;
  volumes: number;
  volumes_read: number;
  chapters: number;
  chapters_read: number;
  score: number | null;
}
