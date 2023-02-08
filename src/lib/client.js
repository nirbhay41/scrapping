const {MongoClient} = require("mongodb")

const uri = "mongodb+srv://nirbhay:MUCglyivUDpdT1iE@watches-cluster.4zay5.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);
const db = client.db("watches_market_db");

module.exports = {db,client};
