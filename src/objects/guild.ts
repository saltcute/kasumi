import Base from "./base";
import { Channel, TextChannel } from "./channel";
import User from "./user";

export default class Guild extends Base {

    protected readonly _syncViewKeys = ['avatar', 'isBot', 'identifyNum', 'isMobileVerified', 'isOnline', 'accountStatus', 'username', 'vipAvatar'];
    protected async syncView() {
        const { data: guild, err } = await this.client.API.guild.view(this._id);
        if (!err) {
            this.putEntry('channels', await Promise.all(guild.channels.map(v => Channel.build(this.client, v.id))));
            this.putEntry('defaultChannel', await Channel.build(this.client, guild.default_channel_id));
            this.putEntry('isPublic', guild.enable_open);
            this.putEntry('icon', guild.icon);
            this.putEntry('name', guild.name);
            this.putEntry('publicId', guild.open_id);
            this.putEntry('serverRegion', guild.region);
            this.putEntry('topic', guild.topic);
            this.putEntry('creator', await User.build(this.client, guild.user_id));
            this.putEntry('welcomeChannel', await Channel.build(this.client, guild.welcome_channel_id));
        }
    }

    public async name() {
        return this.getEntry<string>('name');
    }

    public async icon() {
        return this.getEntry<string>('icon');
    }

    public async topic() {
        return this.getEntry<string>('topic');
    }

    public async serverRegion() {
        return this.getEntry<string>('serverRegion');
    }

    public async openId() {
        return this.getEntry<string>('publicId');
    }

    public async isPublic() {
        return this.getEntry<boolean>('isPublic');
    }

    public async creator() {
        return this.getEntry<User>('creator');
    }

    public async defaultChannel() {
        return this.getEntry<TextChannel>('defaultChannel');
    }

    public async welcomeChannel() {
        return this.getEntry<TextChannel>('welcomeChannel');
    }

    public async channels() {
        return this.getEntry<Channel[]>('channels');
    }

    public async kick(user: User) {
        return this.client.API.guild.kick(this._id, user.id());
    }

    public async leave() {
        return this.client.API.guild.leave(this._id);
    }
}