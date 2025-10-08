import { MultiPageResponse, Post, Thread as ThreadInterface } from "@ksm/type";
import Rest from "@ksm/requestor";
import {
    RawThreadListResponse,
    RawThreadPostResponseItem,
    RawThreadViewResponse,
} from "./type";
import { Card } from "@ksm/card";

export default class Thread {
    private rest: Rest;
    constructor(rest: Rest) {
        this.rest = rest;
    }

    /**
     * Create a thread.
     *
     * @param channelId Channel ID
     * @param guildId Guild ID
     * @param title Title of the thread
     * @param content Content of the thread. If passing a Card instance of an array of it, the card must have `Theme.INVISIBLE` set.
     * @param coverImageUrl Cover image URL
     * @param categoryId Category of the thread
     * @returns Created thread
     */
    async create(
        channelId: string,
        guildId: string,
        title: string,
        content: string | Card | Card[],
        coverImageUrl?: string,
        categoryId?: string
    ) {
        if (typeof content == "string") content = new Card().addText(content);
        if (content instanceof Card) content = [content];
        if (content instanceof Array) content = JSON.stringify(content);
        return this.rest.post<ThreadInterface>("/thread/create", {
            channel_id: channelId,
            guild_id: guildId,
            category_id: categoryId,
            title,
            cover: coverImageUrl,
            content,
        });
    }

    /**
     * Reply to a thread or a post in a thread.
     *
     * @param channelId Channel ID
     * @param threadId Thread ID
     * @param content Content of the post
     * @param replyPostId Post ID to reply to. Use `undefined` to reply to the thread itself.
     * @returns Created post
     */
    async reply(
        channelId: string,
        threadId: string,
        content: string | Card | Card[],
        replyPostId?: string
    ) {
        if (typeof content == "string") content = new Card().addText(content);
        if (content instanceof Card) content = [content];
        if (content instanceof Array) content = JSON.stringify(content);
        return this.rest.post<Post>("/thread/reply", {
            channel_id: channelId,
            thread_id: threadId,
            content,
            reply_id: replyPostId,
        });
    }

    /**
     * View a thread.
     *
     * @param channelId Channel ID
     * @param threadId Thread ID
     * @returns Thread details
     */
    async view(channelId: string, threadId: string) {
        return this.rest.get<RawThreadViewResponse>(`/thread/view`, {
            channel_id: channelId,
            thread_id: threadId,
        });
    }

    /**
     * List threads in a channel.
     *
     * @param channelId Channel ID
     * @returns List of threads
     */
    async list(
        channelId: string,
        {
            /**
             * Category ID
             */
            categoryId,
            /**
             * Sort method
             */
            sortBy,
            /**
             * Number of threads per page
             */
            pageSize,
            /**
             * Filter the page by time
             */
            time,
        }: {
            categoryId?: string;
            sortBy?: "createTime" | "replyTime";
            pageSize?: number;
            time?: number;
        } = {}
    ) {
        return this.rest.get<RawThreadListResponse>("/thread/list", {
            channel_id: channelId,
            category_id: categoryId,
            sort: (() => {
                switch (sortBy) {
                    case "replyTime":
                        return 1;
                    case "createTime":
                        return 2;
                }
            })(),
            page_size: pageSize,
            time,
        });
    }

    async deleteThread(channelId: string, threadId: string) {
        return this.rest.post<{}>("/thread/delete", {
            channel_id: channelId,
            thread_id: threadId,
        });
    }

    async deletePost(channelId: string, postId: string) {
        return this.rest.post<{}>("/thread/delete", {
            channel_id: channelId,
            post_id: postId,
        });
    }

    async listPosts(
        channelId: string,
        threadId: string,
        {
            page,
            pageSize,
            postId,
            time,
            order = "asc",
        }: {
            page?: number;
            pageSize?: number;
            postId?: string;
            time?: number;
            order?: "asc" | "desc";
        }
    ) {
        return this.rest.multiPageRequest<
            MultiPageResponse<RawThreadPostResponseItem>
        >("/thread/post", page, pageSize, {
            channel_id: channelId,
            thread_id: threadId,
            order,
            post_id: postId,
            time,
        });
    }
}
