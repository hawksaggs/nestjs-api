import { Post } from "./post.model";

export const postProviders = [
    {
        provide: 'POST_REPOSITORY',
        useValue: Post
    }
]