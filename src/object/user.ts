import { UserStatus } from "@ksm/type/index";
import Base from "./base";
import Kasumi from "@ksm/client";

export default class User extends Base {
    protected readonly _syncViewKeys = ['avatar', 'isBot', 'identifyNum', 'isMobileVerified', 'isOnline', 'accountStatus', 'username', 'vipAvatar'];
    protected async syncView() {
        const { data: user, err } = await this.client.API.user.view(this._id);
        if (!err) {
            this.putEntry('avatar', user.avatar);
            this.putEntry('isBot', user.bot);
            this.putEntry('identifyNum', user.identify_num);
            this.putEntry('isMobileVerified', user.mobile_verified);
            this.putEntry('isOnline', user.online);
            this.putEntry('accountStatus', user.status);
            this.putEntry('username', user.username);
            this.putEntry('vipAvatar', user.vip_avatar);
        }
    }

    /**
     * Get user Id
     * @returns Id of the user
     */
    public id() {
        return this._id;
    }

    /**
     * Get user avatar
     * @returns Avatar of the user
     */
    public async avatar() {
        return this.getEntry<string>('avatar');
    }

    /**
     * Get if user is a bot
     * @returns True if the user is a bot
     */
    public async isBot() {
        return this.getEntry<boolean>('isBot');
    }

    /**
     * Get user identify number
     * @returns Identify number of the user
     */
    public async identifyNum() {
        return this.getEntry<number>('identifyNum');
    }

    public async fullname() {
        return `${await this.username()}#${await this.identifyNum()}`;
    }

    /**
     * Get user identify number
     * @alias identifyNum
     * @returns Identify number of the user
     */
    public async discriminator() {
        return this.identifyNum();
    }

    /**
     * Get user identify number
     * @alias identifyNum
     * @returns Identify number of the user
     */
    public async tag() {
        return this.identifyNum();
    }

    /**
     * Get if user is verified by mobile number
     * @returns True if the user is mobile verified
     */
    public async isMobileVerified() {
        return this.getEntry<boolean>('isMobileVerified');
    }

    /**
     * Get if user is online
     * @returns True if the user is online
     */
    public async isOnline() {
        return this.getEntry<boolean>('isOnline');
    }

    /**
     * Get user account status
     * @returns Account status of the user
     */
    public async accountStatus() {
        return this.getEntry<UserStatus>('accountStatus');
    }

    /**
     * Get user username
     * @returns Username of the user
     */
    public async username() {
        return this.getEntry<string>('username');
    }

    /**
     * Get user vip avatar
     * @returns Vip avatar of the user
     */
    public async vipAvatar() {
        return this.getEntry<string>('vipAvatar');
    }

    public static async build(client: Kasumi<any>, id: string) {
        return new User(client, id);
    }
}