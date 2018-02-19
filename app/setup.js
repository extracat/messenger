const { Pool } = require('pg')

class Setup {

  constructor() {

		var pool;
		if (process.env.DATABASE_URL === undefined) { // if localhost
		  pool = new Pool({
		    database: 'messenger', 
		  });
		}
		else {  // if heroku
		  pool = new Pool({
		    connectionString: process.env.DATABASE_URL,
		    ssl: true,
		  });
		}

    this.pool = pool;
  }


//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

resetBase(callback) {
    (async () => {
      const client = await this.pool.connect()
      try {

        var res;
        var str = "";

        res = await client.query('DROP TABLE IF EXISTS conversations CASCADE'); str += JSON.stringify(res.rows) + '\n';
        res = await client.query('DROP TABLE IF EXISTS messages CASCADE'); str += JSON.stringify(res.rows) + '\n';
        res = await client.query('DROP TABLE IF EXISTS user_conversation CASCADE'); str += JSON.stringify(res.rows) + '\n';
        res = await client.query('DROP TABLE IF EXISTS users CASCADE'); str += JSON.stringify(res.rows) + '\n';


        callback(str);


      } finally {
        client.release()
      }
    })().catch(e => callback(e.stack))
  }


//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

}
module.exports = new Setup();