log.info("Connecting to databse")

const { DBNamespace, DBDataBase, DBUsername, DBPassword } = require('./config');

const Surreal = require('surrealdb.js');

const db = new Surreal.default('http://127.0.0.1:8000/rpc');

(async () => {

	try {

		// Signin as a namespace, database, or root user
		await db.signin({
			user:  DBUsername,
			pass: DBPassword,
		});

		// Select a specific namespace / database
		await db.use(DBNamespace, DBDataBase);

        log.info("Connected to databse")


	} catch (e) {

		log.error(e);

	}


})()

module.exports = db;