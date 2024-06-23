import Kasumi from "@ksm/client";
import { MessageType } from "@ksm/type";
import Base from "./base";
import User from "./user";

export class Message extends Base {
    protected readonly TYPE: MessageType;

    protected _syncViewKeys = [];
    protected async syncView() {
        const { data: message, err } = await this.client.API.message.view(this._id);
        if (!err) {
            this.putEntry('author', await User.build(this.client, message.author.id));
            this.putEntry('content', message.content);
            this.putEntry('createTimestamp', message.create_at);
            this.putEntry('imageName', message.image_name);
            this.putEntry('mentionedUsers', await Promise.all(message.mention.map(v => User.build(this.client, v))));
            this.putEntry('isMentionAll', message.mention_all);
            this.putEntry('isMentionHere', message.mention_here);
            this.putEntry('quotedMessage', message.quote ? await Message.build(this.client, message.quote.id) : null);
            this.putEntry('updateTimestamp', message.update_at);
        }
    }

    protected constructor(client: Kasumi<any>, id: string, type: MessageType) {
        super(client, id);
        this.TYPE = type;
    }

    public id() {
        return this._id;
    }

    public async author() {
        return this.getEntry<User>('author');
    }

    public async content() {
        return this.getEntry<string>('content');
    }

    public async createTimestamp() {
        return this.getEntry<number>('createTimestamp');
    }

    public async mentionedUsers() {
        return this.getEntry<User[]>('mentionedUsers');
    }

    public async isMentionAll() {
        return this.getEntry<boolean>('isMentionAll');
    }

    public async isMentionHere() {
        return this.getEntry<boolean>('isMentionHere');
    }

    public async quotedMessage() {
        return this.getEntry<Message>('quotedMessage');
    }

    public async updateTimestamp() {
        return this.getEntry<number>('updateTimestamp');
    }

    public async delete() {
        return this.client.API.message.delete(this._id);
    }

    public static async build(client: Kasumi<any>, id: string): Promise<Message | null> {
        const { data: message, err } = await client.API.message.view(id);
        if (!err) {
            switch (message.type) {
                case MessageType.TextMessage: {
                    return new TextMessage(client, id);
                }
                case MessageType.ImageMessage: {
                    return new ImageMessage(client, id);
                }
                default: {
                    return new Message(client, id, message.type);
                }
            }
        }
        return null;
    }

    public isImageMessage(): this is ImageMessage {
        return this.TYPE === MessageType.ImageMessage;
    }
}

export class TextMessage extends Message {
    protected readonly TYPE = MessageType.TextMessage;

    public constructor(client: Kasumi<any>, id: string) {
        super(client, id, MessageType.TextMessage);
    }


    public static async create(client: Kasumi<any>, channelId: string, content: string, quotedMessage?: Message, tempMessageTargetUser?: User) {
        const { data, err } = await client.API.message.create(MessageType.MarkdownMessage, channelId, content, quotedMessage?.id(), tempMessageTargetUser?.id());
        if (!err) {
            return new TextMessage(client, data.msg_id);
        }
        return null;
    }
}

export class ImageMessage extends Message {
    protected readonly TYPE = MessageType.ImageMessage;

    public constructor(client: Kasumi<any>, id: string) {
        super(client, id, MessageType.ImageMessage);
    }

    public async imageURL() {
        return this.content();
    }

    public async imageName() {
        return this.getEntry<string>('imageName');
    }

    public static async create(client: Kasumi<any>, channelId: string, url: string, quotedMessage?: Message, tempMessageTargetUser?: User) {
        const { data, err } = await client.API.message.create(MessageType.ImageMessage, channelId, url, quotedMessage?.id(), tempMessageTargetUser?.id());
        if (!err) {
            return new ImageMessage(client, data.msg_id);
        }
        return null;
    }
}