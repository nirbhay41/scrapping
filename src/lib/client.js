const {MongoClient} = require("mongodb")

const uri = ""
const client = new MongoClient(uri);
const db = client.db("watches_market_db");

module.exports = {db,client};
