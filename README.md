# Jumia Scraper

This project scrapes product information from Jumia (Kenya and Uganda) and saves the data into a PostgreSQL database.

## Features
- Scrapes product details such as name, price, discount, and size.
- Uses Puppeteer for web scraping.
- Saves data into a PostgreSQL database using TypeORM.

## Installation

### 1. Clone the Repository
```sh
git clone https://github.com/mugoalvin/scraper.git
cd scraper
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Set Up Database
Ensure you have PostgreSQL installed and configured.
You can configure the app's environment variables by generating your `.env` file.
Template for the `.env` file can be found in the `.env.example` file.
Adjust database credentials accordingly.

### 4. Run the Scraper
```sh
node .
```

## Project Structure
```
📁 project-directory
├── index.js			# Main entry point
├── src
│   ├── DB.js			 # Database connection
│   ├── scrapper.js  # Scrapes product data from Jumia
│   ├── saveData.js  # Saves scraped data to PostgreSQL
├── Entities
│   ├── sugar.js	   # Sugar product entity
```

## Dependencies
- [Node.js](https://nodejs.org/)
- [Puppeteer](https://pptr.dev/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)

## Notes
- The script runs in headless mode by default.
- Make sure the database is properly configured before running the script.

## License
This project is for educational purposes only.