const Surreal = require('surrealdb.js');
// @ts-ignore
log.info("Connecting to databse")

let Database

(async () => {
	const interval = setInterval(
		async ()=>{
			try {

				log.info("connecting to DB")

				Database = new Surreal.default('http://127.0.0.1:8000/rpc');


				// Signin as a namespace, database, or root user
				await Database.signin({
					user:  Config.DBUsername,
					pass: Config.DBPassword,
				});
		
				// Select a specific namespace / database
				await Database.use(Config.DBNamespace, Config.DBDataBase);
		
				log.info("Connected to databse")
				clearInterval(interval)

				console.log(await Database.query("info for db"))
		
			} catch (e) {
		
				log.error(`Database Login: ${e}`);
		
			}
		}, 2000)



})()
