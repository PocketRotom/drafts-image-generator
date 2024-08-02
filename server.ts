import dotenv from "dotenv";
import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { initializeConfig } from "./src/utils/allPokemon";

dotenv.config();

const app: Express = express();
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
