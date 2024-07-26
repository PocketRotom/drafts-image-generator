module.exports = {
	connectDatabase: async () => {
		try {
			const knex = require('knex')({
				client: 'mysql2',
				connection: {
					host: process.env.MYSQL_HOST,
					user: process.env.MYSQL_USER,
					password: process.env.MYSQL_PASSWORD,
					database: process.env.MYSQL_DB,
					port: process.env.MYSQL_PORT
				},
				acquireConnectionTimeout: 10000,
				pool: {
					afterCreate: function (conn, done) {
						// in this example we use pg driver's connection API
						// Query to test
						conn.query('SET time_zone="+00:00";', function (err) {
							if (err) {
								console.log(err);
								done(err, conn);
							} else {
								done(err, conn);
							}
						});
					}
				}
			});
			return knex;

		} catch (err) {
			console.log(`Error: ${err.message}`);
			process.exit(1);
		}
	}
};