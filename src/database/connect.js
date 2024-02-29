import { MongoClient } from 'mongodb';

const dbConectionString ='mongodb+srv://doadmin:721H0Y63Lmcv8Z4R@db-mongodb-sgp-b453bd5c.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=db-mongodb-sgp'
const dbName = 'xosodaithanh'
const client = new MongoClient(dbConectionString);

let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db(dbName);
export default db;