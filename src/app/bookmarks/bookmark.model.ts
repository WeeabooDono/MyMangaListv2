export interface Bookmark {
    id: Number;
    status: string;
    user_id: Number;
    manga_id: Number,
    volumesRead: Number;
    chaptersRead: Number;
    score: Number | null;
}