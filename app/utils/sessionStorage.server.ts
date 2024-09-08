import {createSessionStorage} from "@remix-run/node"; // or cloudflare/deno
import {collection} from '~/utils/mongoDbClient'

export const {getSession, commitSession, destroySession} =
    createSessionStorage({
        cookie: {
            name: "__session",
            sameSite: "lax",
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            secrets: ["your-secret-key"], // Replace with your own secret key
        },
        async createData(data, expires) {
            const id = await collection.sessions.insertOne(data);
            return id;
        },
        async readData(id) {
            return (await collection.sessions.findById(id)) || null;
        },
        async updateData(id, data, expires) {
            await collection.sessions.updateOne({_id: id}, data);
        },
        async deleteData(id) {
            await collection.sessions.deleteOne({_id: id});
        },
    });