export async function main(client) {
    const { data, err } = await client.API.category.list("8423683936458027");
    if (err) {
        console.error(err);
        return;
    }
    console.dir(data, { depth: null });
}
