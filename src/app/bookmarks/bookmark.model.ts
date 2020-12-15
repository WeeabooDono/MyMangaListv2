export interface Bookmark {
    id: Number;
    status: string;
    user_id: Number;
    manga_id: Number;
    title: string;
    author: string;
    image: string;
    volumesRead: Number;
    chaptersRead: Number;
    score: Number | null;
}