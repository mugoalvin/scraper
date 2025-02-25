import { AppDataSource } from "./DB.js"
import { Sugar } from "../Entities/sugar.js"

export const saveToPostgres = async (listOfSugar) => {
	const currentTime = new Date()

	console.log(listOfSugar)

	const timeStampedSugarList = listOfSugar.map(sugar => {
		return	{ ...sugar, timestamp:  currentTime }
	})

	console.log(timeStampedSugarList)

	await AppDataSource
		.createQueryBuilder()
		.insert()
		.into(Sugar)
		.values(timeStampedSugarList)
		.execute()
		.then(() => {
			console.log("\nData has been entered in to the database\n")
		})
		.catch(error => {
			console.error(error)
		})
		.finally(() => {
			console.log(`Done with products from ${timeStampedSugarList.country}\n`)
		})
}