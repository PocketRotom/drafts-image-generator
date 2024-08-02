const General = require('../models/main.js');

module.exports = {
	generateImage: async (req, res) => {
		try {
			let body = req.body;
			let pokemonP1 = body.pokemonP1;
			let pokemonP2 = body.pokemonP2;
			let caster1 = body.caster1;
			let caster2 = body.caster2;
			let round = body.round;
			let team1Name = body.team1Name;
			let team2Name = body.team2Name;
			let team1Logo = body.team1Logo;
			let team2Logo = body.team2Logo;
			let tera1 = body.tera1;
			let tera2 = body.tera2;
			let image = await General.generateImage(pokemonP1, pokemonP2, caster1, caster2, round, team1Name, team2Name, team1Logo, team2Logo, tera1, tera2);
			let path = require('path').dirname(require.main.filename) + '/' + image;
			console.log('PATH', path);
			res.sendFile(path);
			/*return res.status(200).json({
        success: true,
        data: image,
      });*/
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				success: false,
				error: error,
			});
		}
	},
	teste: async (req, res) => {
		try {
			let body = req.body;
			let pokemonP1 = body.pokemonP1;
			let test = await General.teste(pokemonP1);
			return res.status(200).json({
				success: true,
				data: test,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({
				success: false,
				error: error,
			});
		}
	},
};
