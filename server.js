const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const {initializeConfig} = require('./src/utils/allPokemon');

dotenv.config();

const app = express();
app.use(express.text());
app.use(express.json());
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

const routes = require('./src/routes/routes.config');

app.use(cors({origin: '*'}));
app.use('/', routes);

const port = process.env.PORT || 3001;

async function startServer() {
	await initializeConfig();
	app.listen(port, () => {
		console.log('Server is running on port ' + port + '.');
	});
}

startServer();
