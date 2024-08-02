import { Pokemon } from "../types/pokemon";

import { createCanvas, Image, loadImage } from 'canvas';
import fs from 'fs';
import { connectDatabase } from '../utils/database';
import axios from 'axios';
import difflib from 'difflib';
import { getAllPokemon } from '../utils/allPokemon';
import { DiscordUser } from "../types/discord";

const api = axios.create({
	baseURL: 'https://discord.com/api/v10/'
});

export async function generateImage(pokemonP1: string[], pokemonP2: string[], caster1: string, caster2: string, round: string, team1Name: string, team2Name: string, team1Logo: string, team2Logo: string, tera1: number[], tera2: number[]) {
	let pokemonP1ids = await getAllPokemonID(pokemonP1);
	let pokemonP2ids = await getAllPokemonID(pokemonP2);

	let pokemonP1images = [];
	let pokemonP2images = [];
	let pokemonP1Positions = [];
	let pokemonP2Positions = [];

	//Get URL for each pokemon image

	for (const element of pokemonP1ids) {
		pokemonP1images.push('https://pocketrotom.pt/vods_test/' + element + '.png');
	}

	for (const element of pokemonP2ids) {
		pokemonP2images.push('https://pocketrotom.pt/vods_test/' + element + '.png');
	}

	//Call to Discord API to get casters info

	let caster1Info: DiscordUser;

	let temp = await api.get(`users/${caster1}`, {
		headers: {
			'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
		}
	});
	caster1Info = temp.data;

	let caster2Info: DiscordUser;

	temp = await api.get(`users/${caster2}`, {
		headers: {
			'Authorization': `Bot ${process.env.DISCORD_TOKEN}`
		}
	});

	caster2Info = temp.data;

	const canvas = createCanvas(1920, 1080);
	const context = canvas.getContext('2d');

	//Load background image

	await loadImage('./assets/model_bak.png').then((image) => {
		context.drawImage(image, 0, 0, 1920, 1080);
	});

	//Load pokemon images for Player 1

	let x = 45;
	let y = 340;
	for (const [index, element] of pokemonP1images.entries()) {
		const image = await loadImage(element);
		const height = image.height*0.80;
		const width = image.width*0.80;
		context.drawImage(image, x, y, height, width);
		pokemonP1Positions.push({x: x, y: y});
		if (index % 2 == 0) {
			x += 150;
		} else {
			x = 45;
			y += 110;
		}
	}

	//Load pokemon images for Player 2

	x = 1620;
	y = 340;

	for (const [index, element] of pokemonP2images.entries()) {
		const image = await loadImage(element);
		const height = image.height*0.80;
		const width = image.width*0.80;
		context.drawImage(image, x, y, height, width);
		pokemonP2Positions.push({x: x, y: y});
		if (index % 2 == 0) {
			x += 150;
		} else {
			x = 1620;
			y += 110;
		}
	}

	//Load Casters and Team images
	console.log(team1Logo);
	
	let caster1Image = await loadImage(`https://cdn.discordapp.com/avatars/${caster1Info.id}/${caster1Info.avatar}.png?size=1024`);
	let caster2Image = await loadImage(`https://cdn.discordapp.com/avatars/${caster2Info.id}/${caster2Info.avatar}.png?size=1024`);
	let team1LogoImage = await loadImage(team1Logo);
	let team2LogoImage = await loadImage(team2Logo);
  

	context.drawImage(caster1Image, 730, 908, 128,128);
	context.drawImage(caster2Image, 1060, 908, 128,128);


	//Resize team logos

	let ratioCalc = 300 / team1LogoImage.width;
	context.drawImage(team1LogoImage, 30, 30, 300, team1LogoImage.height * ratioCalc);
	ratioCalc = 300 / team2LogoImage.width;
	context.drawImage(team2LogoImage, 1590, 30, 300, team2LogoImage.height * ratioCalc);

	//Casters Names and Round

	context.font = 'bold 30px Impact';
	context.textAlign = 'right';
	context.fillStyle = '#e32966';
	context.fillText(caster1Info.global_name, 720, 975);

	context.textAlign = 'left';
	context.fillText(caster2Info.global_name, 1200, 975);

	context.font = 'bold 40px Impact';
	context.fillStyle = '#595ba9';
	context.fillText(round, 1700, 1000);

	context.font = 'bold 50px Impact';
	context.textAlign = 'right';

	//Team 1 and Team 2 Names

	if (team1Name.length < 20) {
		context.fillText(team1Name, 900, 100);
	} else {
		let searchIndex = team1Name.indexOf(' ');
		context.textAlign = 'center';
		context.fillText(team1Name.substring(0, searchIndex), 610, 80);
		context.fillText(team1Name.substring(searchIndex), 600, 130);
	}

	context.textAlign = 'left';

	if (team2Name.length < 20) {
		context.fillText(team2Name, 1030, 100);
	} else {
		let searchIndex = team2Name.indexOf(' ');
		context.textAlign = 'center';
		context.fillText(team2Name.substring(0, searchIndex), 1310, 80);
		context.fillText(team2Name.substring(searchIndex), 1300, 130);
	}
  

	//Load Tera Images on respective Pokémon
	let teraImage: Image | undefined;

	await loadImage('./assets/tera.png').then((image: Image) => {
		teraImage = image;
	});

	if (teraImage === undefined) {
		throw new Error('Tera image not loaded');
	}

	for (const element of tera1) {
		let pokemonPosition = pokemonP1Positions[element - 1];
		context.font = 'bold 30px Impact';
		context.drawImage(teraImage, pokemonPosition.x + 80, pokemonPosition.y, 50, 50);
	}

	for (const element of tera2) {
		let pokemonPosition = pokemonP2Positions[element - 1];
		context.font = 'bold 30px Impact';
		context.drawImage(teraImage, pokemonPosition.x + 80, pokemonPosition.y, 50, 50);
	}

	const buffer = canvas.toBuffer('image/png');
	fs.writeFileSync('./out.png', buffer);

	return 'out.png';
}

async function getAllPokemonID(pokemonArray: string[]) {
	let pokemonIDs = [];
	for (const element of pokemonArray) {
		const knex = await connectDatabase();
		const result = await knex('pokemon').select('id').where('name', element);
		knex.destroy();
		if (result.length > 0) {
			pokemonIDs.push(result[0].id);
		}
	}
	return pokemonIDs;
}

export async function teste(pokemonName: string){
	const arrayOfNames = getAllPokemon().map((obj: Pokemon) => obj.name);
	let temp = difflib.getCloseMatches(pokemonName, arrayOfNames);
	return temp;
}