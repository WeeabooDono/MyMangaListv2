export interface Bookmark {
    id: Number;
    status: string;
    user_id: Number;
    manga_id: Number;
    title: string;
    author: string;
    image: string;
    volumes: Number;
    volumes_read: Number;
    chapters: Number;
    chapters_read: Number;
    score: Number | null;
}