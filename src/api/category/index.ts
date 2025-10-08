import Rest from "@ksm/requestor";
import { RawCategoryListResponse } from "./type";

export default class Category {
    private rest: Rest;
    constructor(rest: Rest) {
        this.rest = rest;
    }

    /**
     * List all thread categories in a channel.
     *
     * @param channelId Channel ID
     * @return List of thread categories
     */
    async list(channelId: string) {
        return this.rest.get<RawCategoryListResponse>("/category/list", {
            channel_id: channelId,
        });
    }
}
