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
            await collection.sessions.insertOne(data);
            return data.userId;
        },
        async readData(id) {
            return (await collection.sessions.find({userId: id})) || null;
        },
        async updateData(id, data, expires) {
            await collection.sessions.updateOne({userId: id}, data);
        },
        async deleteData(id) {
            await collection.sessions.deleteOne({userId: id});
        },
    });