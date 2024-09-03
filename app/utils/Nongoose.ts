import {DeleteResult, Document, InsertOneResult, UpdateResult} from 'mongodb';
import {client} from './mongoDbClient'

export class Nongoose {
    private collectionName: string;

    constructor(collectionName: string) {
        this.collectionName = collectionName;
    }

    async insertOne(document: Document): Promise<InsertOneResult<Document>> {
        try {
            const result = await client.db.collection(this.collectionName).insertOne(document, {new: true});
            return result._id;
        } catch (error) {
            console.error("Failed to insert document", error);
            throw error;
        }
    }

    async find(query: Document): Promise<Document[]> {
        try {
            const result = await client.db.collection(this.collectionName).find(query).toArray();
            return result;
        } catch (error) {
            console.error("Failed to find documents", error);
            throw error;
        }
    }

    async findById(id: string): Promise<Document> {
        try {
            const result = await client.db.collection(this.collectionName).findById(id).toArray();
            return result;
        } catch (error) {
            console.error("Failed to find documents", error);
            throw error;
        }
    }

    // are there sensible defaults for what and update should be in mongo?
    // A: probably the ones that raw mongo utilizes
    async updateOne(filter: Document, update: Document): Promise<UpdateResult> {
        try {
            const result = await client.db.collection(this.collectionName).updateOne(filter, update);
            return result;
        } catch (error) {
            console.error("Failed to update document", error);
            throw error;
        }
    }

    async deleteOne(filter: Document): Promise<DeleteResult> {
        try {
            const result = await client.db.collection(this.collectionName).deleteOne(filter);
            return result;
        } catch (error) {
            console.error("Failed to delete document", error);
            throw error;
        }
    }
}

export default Nongoose;