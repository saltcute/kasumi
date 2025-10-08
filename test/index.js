const upath = require("upath");
const Kasumi = require("../dist").default;

try {
    const client = new Kasumi({
        type: "websocket",
        token: process.env.TOKEN,
    });
    console.log(
        `Running test ${upath.join(__dirname, ...process.argv.slice(2))}`
    );
    const main = require(upath.join(__dirname, ...process.argv.slice(2))).main;
    main(client).then(() => process.exit(0));
} catch (e) {
    console.error(e);
    console.log("No test found.");
}
