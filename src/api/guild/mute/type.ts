import { Guild, MultiPageResponse, NotificationSetting, Role, User } from "@ksm/type/index";


export interface RawListResponse {
    mic: {
        type: 1,
        user_ids: string[]
    },
    headset: {
        type: 2,
        user_ids: string[]
    }
}

