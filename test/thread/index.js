import { Theme } from "../../dist/card/type.js";
import Kasumi, { Card } from "../../dist/index.js";

const keypress = async () => {
    console.log("Press any key to continue...");
    process.stdin.setRawMode(true);
    return new Promise((resolve) =>
        process.stdin.once("data", () => {
            process.stdin.setRawMode(false);
            resolve(void 0);
        })
    );
};

/**
 *
 * @param {string} expect
 * @param {string} got
 * @param {(expect: string, got: string) => boolean} evaluate
 */
function assert(expect, got, evaluate = (a, b) => a == b) {
    if (!evaluate(expect, got)) {
        throw new Error(`Expect ${expect}, got ${got}`);
    }
}

/**
 *
 * @param {string | import("../../dist/index.js").Card | import("../../dist/index.js").Card[]} card
 */
function getCardContent(card) {
    if (typeof card == "string") card = new Card(card);
    if (card instanceof Array) card = card[0];
    if (card instanceof Card === false) return "";
    return card.modules
        .map((m) => m.text.content)
        .filter((v) => typeof v == "string" && v)
        .join("\n");
}

/**
 *
 * @param {import("../../dist/index").default} client
 * @returns
 */
export async function main(client) {
    const GUILD_ID = process.env.GUILD_ID;
    const CHANNEL_ID = process.env.CHANNEL_ID;

    const TEST_TITLE = `Test Thread ${new Date().toISOString()}`;
    const TEST_CONTENT = new Card()
        .setTheme(Theme.INVISIBLE)
        .addText("API test content. Please return to the command line now.");

    const TEST_POST = new Card()
        .setTheme(Theme.INVISIBLE)
        .addText("This is a reply to the thread.");

    const { data: createThread, err: createErr } =
        await client.API.thread.create(
            CHANNEL_ID,
            GUILD_ID,
            TEST_TITLE,
            TEST_CONTENT
        );
    if (createErr) {
        client.logger.error(createErr);
        return;
    }
    assert(TEST_TITLE, createThread.title);
    assert(getCardContent(TEST_CONTENT), getCardContent(createThread.content));

    await keypress();

    const { data: replyPost, err: replyErr } = await client.API.thread.reply(
        CHANNEL_ID,
        createThread.id,
        TEST_POST
    );
    if (replyErr) {
        client.logger.error(replyErr);
        return;
    }
    assert(getCardContent(TEST_POST), getCardContent(replyPost.content));

    await keypress();

    const { data: viewThread, err: viewErr } = await client.API.thread.view(
        CHANNEL_ID,
        createThread.id
    );
    if (viewErr) {
        client.logger.error(viewErr);
        return;
    }
    assert(TEST_TITLE, viewThread.title);
    assert(getCardContent(TEST_CONTENT), getCardContent(viewThread.content));

    await keypress();

    const { err: deleteErr } = await client.API.thread.deletePost(
        CHANNEL_ID,
        replyPost.id
    );
    if (deleteErr) {
        client.logger.error(deleteErr);
        return;
    }

    await keypress();

    const { err: deleteThreadErr } = await client.API.thread.deleteThread(
        CHANNEL_ID,
        createThread.id
    );
    if (deleteThreadErr) {
        client.logger.error(deleteThreadErr);
        return;
    }
}
