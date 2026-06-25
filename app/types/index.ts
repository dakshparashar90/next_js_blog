export interface IUser{
    _id:string;
    username:string;
    email:string;
    role:string;
    token?:string
}

export interface IPost {
    authorName: string;
    views: number;
    likes: any;
    _id: string;
    title: string;
    content: string;
    summary?: string;
    authore: string;
    status: "draft" | "published";
    createdAt: string;
    updatedAt: string;
}
export interface DecodedToken {
    id:string;
    iat:number;
    exp:number;
}