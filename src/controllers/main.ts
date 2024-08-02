import {Request, Response} from 'express';
import {generateImage, teste} from '../models/main';

export async function generateImageRes(req: Request, res: Response) {
  try {
	let {pokemonP1, pokemonP2, caster1, caster2, round, team1Name, team2Name, team1Logo, team2Logo, tera1, tera2} = req.body;
    let image = await generateImage(
      pokemonP1,
      pokemonP2,
      caster1,
      caster2,
      round,
      team1Name,
      team2Name,
      team1Logo,
      team2Logo,
      tera1,
      tera2,
    );
    const imagePath = __dirname.split('/').slice(0,-2).join('/') + '/' + image;
    res.sendFile(imagePath);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: String(error),
    });
  }
}

export async function testeRes(req: Request, res: Response) {
  try {
    let body = req.body;
    let pokemonP1 = body.pokemonP1;
    let test = await teste(pokemonP1);
    return res.status(200).json({
      success: true,
      data: test,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: String(error),
    });
  }
}
