
const {connectDatabase} = require('./database');

let allPokemon = [];

async function getAllPokemonDB(){
	const knex = await connectDatabase();
	const allPokemonDB = await knex('pokemon');
	knex.destroy();
	return allPokemonDB;
}


async function initializeConfig() {
	allPokemon = await getAllPokemonDB();
}

function getAllPokemon(){
	return allPokemon;
}

module.exports = {
	getAllPokemon,
	initializeConfig
};
