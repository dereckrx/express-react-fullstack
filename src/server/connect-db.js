import { MongoClient } from "mongodb";
import { defaultState } from "./defaultState";

/* This code initializes the database with sample users.
 Note, it does not drop the database - this can be done manually. Having code in your application that could drop your whole DB is a fairly risky choice.*/
async function initializeDB(db) {
  let user = await db.collection(`users`).findOne({ id: "U1" });
  if (!user) {
    for (let collectionName in defaultState) {
      let collection = db.collection(collectionName);
      await collection.insertMany(defaultState[collectionName]);
    }
  }
}

export async function connectDb(uri) {
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const db = client.db();
  await initializeDB(db);
  return db;
}
