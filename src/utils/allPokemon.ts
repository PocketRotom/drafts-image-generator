import { Pokemon } from "../types/pokemon";
import { connectDatabase } from './database';

let allPokemon: Pokemon[] = [];

async function getAllPokemonDB(){
	const knex = await connectDatabase();
	const allPokemonDB = await knex('pokemon');
	knex.destroy();
	return allPokemonDB;
}

export async function initializeConfig() {
	allPokemon = await getAllPokemonDB();
}

export function getAllPokemon(){
	return allPokemon;
}

