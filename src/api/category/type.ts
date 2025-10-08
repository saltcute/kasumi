export interface RawCategoryListResponse {
    list: {
        id: string;
        name: string;
        allow: number;
        deny: number;
        roles: {
            type: string;
            role_id: number;
            user_id: string;
            allow: number;
        }[];
    }[];
}
