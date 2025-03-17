import { initDatabase } from './src/DB.js'
import { fetchFromJumia } from './src/scrapper.js'
import { saveToPostgres } from './src/saveData.js'
import { validateProduct } from './src/validation.js'
import dotenv from 'dotenv'

await initDatabase()

dotenv.config()

// Declaring target urls
const targetUrlObjs = JSON.parse(process.env.URL_OBJS.replace(/'/g, '"'));

targetUrlObjs.forEach(async targetUrlObj => {
	try {
		const listOfSugarProducts = await fetchFromJumia(targetUrlObj)
		const validProducts = listOfSugarProducts.filter(sugarProduct => {
			try {
				return validateProduct(sugarProduct)
			}
			catch (error) {
				console.error(`Validation failed for product: ${sugarProduct.productName}`, error.message)
				return false
			}
		})
		await saveToPostgres(validProducts)
	}
	catch (error) {
		console.error(`Failed to process data for ${targetUrlObj.country}:`, error)
	}
})