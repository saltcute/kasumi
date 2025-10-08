import { BreifThread, Post, Thread, User } from "@ksm/type";

export interface RawThreadViewResponse extends Thread {
    latest_active_time: number;
    create_time: number;
    is_updated: boolean;
    content_deleted: boolean;
    content_deleted_type: number;
    collect_num: number;
    post_count: number;
}

interface RawThreadListResponseItem extends BreifThread {
    latest_active_time: number;
    create_time: number;
    is_updated: boolean;
    content_deleted: boolean;
    content_deleted_type: number;
    collect_num: number;
    post_count: number;
}

export interface RawThreadListResponse {
    items: RawThreadListResponseItem[];
}

export interface RawThreadPostResponseItem extends Post {
    belong_to_post_id: string;
    create_time: number;
    user: User;
    replies: Post[];
}
