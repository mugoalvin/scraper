import { DataSource } from 'typeorm'
import { Sugar } from '../Entities/sugar.js'
import dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
	type: process.env.DATABASE_TYPE,
    host: process.env.HOST,
	port: process.env.PORT,
    username: process.env.USERNAME,
	password: process.env.PASSWORD,
	database: process.env.DATABASE_NAME,
	entities: [ Sugar ],
	synchronize: process.env.SYNCHRONIZE
})


export const initDatabase = async () => {
	await AppDataSource.initialize()
		.then(() => {
			console.log("Connection to the database was successful!\nSyncronized tables.\n")
		})
		.catch(error => {
			console.error(error)
		})
}