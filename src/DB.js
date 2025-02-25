import { DataSource } from 'typeorm'
import { Sugar } from '../Entities/sugar.js'

export const AppDataSource = new DataSource({
	type: "postgres",
    host: "localhost",
	port: 5432,
    username: "alvin",
	password: 'password123',
	database: 'jumia',
	entities: [ Sugar ],
	synchronize: true
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