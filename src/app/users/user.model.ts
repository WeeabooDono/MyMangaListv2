import { Bookmark } from './bookmark.model';

export interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
    status: string;
    bookmarks: Bookmark[];
}