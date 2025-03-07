import { initDatabase } from './src/DB.js'
import { fetchFromJumia } from './src/scrapper.js'
import { saveToPostgres } from './src/saveData.js'

const urlObjs = [
	{
		country: "Kenya",
		url: "https://www.jumia.co.ke",
		route: "/sugar/#catalog-listing/"
	},
	{
		country: "Uganda",
		url: "https://www.jumia.ug",
		route: "/sugar-3999/"
	}
]

await initDatabase()


urlObjs.forEach(async urlObj => {
	try {
		const listOfSugar = await fetchFromJumia(urlObj)
		await saveToPostgres(listOfSugar)
	}
	catch (error) {
		console.error(`Failed to process data for ${urlObj.country}:`, error)
	}
});


// for (const urlObj of urlObjs) {
// 	try {
// 		const listOfSugar = await fetchFromJumia(urlObj)
// 		await saveToPostgres(listOfSugar)
// 	} catch (error) {
// 		console.error(`Failed to process data for ${urlObj.country}:`, error)
// 	}
// }