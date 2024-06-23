import Kasumi from "@ksm/client";
import { StorageItem } from "@ksm/config";
import { Cache } from "memory-cache";

export default abstract class Base {
    private readonly CACHE_TTL = 5 * 60 * 1000;
    private cache = new Cache<string, StorageItem | null>();

    protected readonly client: Kasumi<any>;

    protected readonly _id: string;

    protected constructor(client: Kasumi<any>, id: string) {
        this.client = client;
        this._id = id;
    }
    protected async getEntry<T>(key: string): Promise<T | null> {
        if (!this.hasEntry(key)) {
            switch (true) {
                case this._syncViewKeys.includes(key): {
                    await this.syncView();
                    break;
                }
            }
        }
        // @ts-expect-error
        return this.cache.get(key);
    }

    protected abstract readonly _syncViewKeys: string[];
    protected abstract syncView(): Promise<void>;

    protected hasEntry(key: string) {
        return this.cache.get(key) !== null;
    }
    protected putEntry(key: string, value?: StorageItem | null) {
        if (value === undefined) return this.cache.del(key);
        return this.cache.put(key, value, this.CACHE_TTL);
    }
}