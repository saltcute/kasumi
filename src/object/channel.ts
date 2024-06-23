import Kasumi from '@ksm/client';
import { ChannelType } from '@ksm/type/index';
import Base from './base';
import User from './user';

type SLOW_MODE_INTERVAL = 0 | 5000 | 10000 | 15000 | 30000 | 60000 | 120000 | 300000 | 600000 | 900000 | 1800000 | 3600000 | 7200000 | 21600000;

export abstract class Channel extends Base {
    protected abstract readonly TYPE: ChannelType;

    protected readonly _syncViewKeys = ['name', 'guildId', 'type', 'isCategory', 'topic', 'creatorId', 'slowMode'];
    protected async syncView() {
        const { data: channel, err } = await this.client.API.channel.view(this._id);
        if (!err) {
            this.putEntry('name', channel.name);
            this.putEntry('guildId', channel.guild_id);
            this.putEntry('type', channel.type);
            this.putEntry('isCategory', channel.is_category);
            this.putEntry('topic', channel.topic);
            this.putEntry('creator', await User.build(this.client, channel.user_id));
            this.putEntry('slowMode', channel.slow_mode);
        }
    }

    /**
     * Get channel Id
     * @returns Id of the channel
     */
    public id() {
        return this._id;
    }

    /**
     * Get channel name
     * @returns Name of the channel
     */
    public async name(): Promise<string>;
    public async name(name: string): Promise<this>;
    public async name(name?: string) {
        if (!name) {
            return this.getEntry<string>('name');
        }
        const { err } = await this.client.API.channel.update(this._id, { name });
        if (!err) this.putEntry('topic', name);
        return this;
    }


    /**
     * Get guild Id
     * @returns Id of the guild
     */
    public async guildId() {
        return this.getEntry<string>('guildId');
    }

    /**
     * Get channel type
     * @returns Type of the channel
     */
    public async type() {
        return this.getEntry<ChannelType>('type');
    }

    /**
     * Check if the channel is category
     * @returns True if the channel is category
     */
    public async getIsCategory() {
        return this.getEntry<boolean>('isCategory');
    }

    /**
     * Get channel topic
     * @returns Topic of the channel
     */
    public async topic(): Promise<string>;
    public async topic(topic: string): Promise<this>;
    public async topic(topic?: string) {
        if (!topic) {
            return this.getEntry<string>('topic');
        }
        const { err } = await this.client.API.channel.update(this._id, { topic });
        if (!err) this.putEntry('topic', topic);
        return this;
    }


    /**
     * Get the creator of the channel
     * @returns The creator
     */
    public async creator() {
        return this.getEntry<User>('creator');
    }

    public async delete() {
        const { err } = await this.client.API.channel.delete(this._id);
        return !err;
    }

    public isVoiceChannel(): this is VoiceChannel {
        return this.TYPE === ChannelType.VoiceChannel;
    }
    public isTextChannel(): this is TextChannel {
        return this.TYPE === ChannelType.TextChannel;
    }
    public isCategory(): this is CategoryChannel {
        return this.TYPE === ChannelType.Category;
    }

    public static async build(client: Kasumi<any>, id: string): Promise<Channel | null> {
        const { data: channel, err } = await client.API.channel.view(id);
        if (!err) {
            switch (channel.type) {
                case ChannelType.TextChannel: return new TextChannel(client, id);
                case ChannelType.VoiceChannel: return new VoiceChannel(client, id);
                case ChannelType.Category: return new CategoryChannel(client, id);
            }
        }
        return null;
    }
}

abstract class NormalChannel extends Channel {
    public async parentCategory(): Promise<CategoryChannel | null>;
    public async parentCategory(parent: CategoryChannel): Promise<this>;
    public async parentCategory(parent?: CategoryChannel) {
        if (!parent) {
            const parentId = await this.getEntry<string>('parentCategoryId');
            if (parentId === null) return null;
            return new CategoryChannel(this.client, parentId);
        }
        const { err } = await this.client.API.channel.update(this._id, { parentCategoryId: parent.id() });
        if (!err) this.putEntry('parentCategoryId', parent.id());
        return this;
    }
}

export class TextChannel extends NormalChannel {
    protected TYPE: ChannelType = ChannelType.TextChannel;
    public static async create(client: Kasumi<any>, guildId: string, name: string, parent?: CategoryChannel) {
        const { data: channel, err } = await client.API.channel.createTextChannel(guildId, name, parent?.id());
        if (err) return null;
        return new TextChannel(client, channel.id);
    }


    /**
     * Get slow mode interval
     * @returns Slow mode interval in seconds
     */
    public async slowModeInterval(): Promise<number>;
    /**
     * Set slow mode interval
     * @param interval Slow mode interval in seconds
     */
    public async slowModeInterval(interval: SLOW_MODE_INTERVAL): Promise<this>;
    public async slowModeInterval(interval?: SLOW_MODE_INTERVAL) {
        if (!interval) {
            return this.getEntry<number>('slowMode');
        }
        const { err } = await this.client.API.channel.update(this._id, { slowMode: interval });
        if (!err) this.putEntry('slowMode', interval);
        return this;
    }
}

export class VoiceChannel extends Channel {
    protected TYPE: ChannelType = ChannelType.VoiceChannel;
    public static async create(client: Kasumi<any>, guildId: string, name: string, parent?: CategoryChannel, maxUsers?: number) {
        const { data: channel, err } = await client.API.channel.createVoiceChannel(guildId, name, maxUsers, "HQ", parent?.id());
        if (err) return null;
        return new VoiceChannel(client, channel.id);
    }


    public async maxUsers(): Promise<number>;
    public async maxUsers(maxUsers: number): Promise<this>;
    public async maxUsers(maxUsers?: number) {
        if (!maxUsers) {
            return this.getEntry<number>('maxUsers');
        }
        const { err } = await this.client.API.channel.update(this._id, { maxUsers });
        if (!err) this.putEntry('maxUsers', maxUsers);
        return this;
    }

    public async voiceQuality(): Promise<'LQ' | 'NM' | 'HQ'>;
    public async voiceQuality(quality: 'LQ' | 'NM' | 'HQ'): Promise<this>;
    public async voiceQuality(quality?: 'LQ' | 'NM' | 'HQ') {
        if (!quality) {
            return this.getEntry<'LQ' | 'NM' | 'HQ'>('voiceQuality');
        }
        const { err } = await this.client.API.channel.update(this._id, { voiceQuality: quality });
        if (!err) this.putEntry('voiceQuality', quality);
        return this;
    }

    public async password(): Promise<string>;
    public async password(password: string): Promise<this>;
    public async password(password?: string) {
        if (!password) {
            return this.getEntry<string>('password');
        }
        const { err } = await this.client.API.channel.update(this._id, { password });
        if (!err) this.putEntry('password', password);
        return this;
    }
}

export class CategoryChannel extends NormalChannel {
    protected TYPE: ChannelType = ChannelType.Category;
    public static async create(client: Kasumi<any>, guildId: string, name: string) {
        const { data: channel, err } = await client.API.channel.createCategory(guildId, name);
        if (err) return null;
        return new CategoryChannel(client, channel.id);
    }
}
