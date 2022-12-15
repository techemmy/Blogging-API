const app = require("./index");
const { connectToMongoDb } = require("./database");
const { DB_URI, API_PORT } = require("./config/config");
require("dotenv").config();

connectToMongoDb(DB_URI);

app.listen(API_PORT, () => {
	console.log(`Server started at port ${API_PORT}`);
});
