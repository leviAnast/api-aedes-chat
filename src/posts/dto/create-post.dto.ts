export class CreatePostDto {
    user_id: Number;
    content: String;
    parent_post_id: Number | null;
}

