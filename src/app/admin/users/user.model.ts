export interface User {
    id: number;
    status: string;
    username: string;
    email: string;
    roles: string[];
    image: string | File;
}
