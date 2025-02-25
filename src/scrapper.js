import { launch } from "puppeteer"

const normalizeWeight = (size) => {
	const match = size.match(/([\d.]+)\s*(kg)?/i);
	if (match) {
		return `${parseFloat(match[1])} kg`;
	}
	return 'Invalid size';
};

export const fetchFromJumia = async (urlObj) => {
	const currentTime = new Date()
	const formatedTime = `${currentTime.toLocaleTimeString()} of ${currentTime.toLocaleDateString()}`

	console.log(`\nScraping Products From  ${urlObj.country}...`)
	console.log(`Time: ${formatedTime}\n`)

	const browser = await launch({
		headless: true,
		defaultViewport: {
			width: 1000,
			height: 700
		}
	})

	const page = await browser.newPage()
	// await page.goto("https://www.jumia.co.ke/sugar/#catalog-listing")
	await page.goto(`${urlObj.url}${urlObj.route}`)

	await page.waitForSelector(".cls")
	await page.click(".cls")

	const prodData = await page.evaluate(() => {
		const articalLinks = Array.from(document.querySelectorAll("article.prd._fb.col.c-prd a[class='core']"))
		const productsInfo = Array.from(document.querySelectorAll("article.prd._fb.col.c-prd .info"));
		const productsImages = Array.from(document.querySelectorAll("article.prd._fb.col.c-prd .img-c .img"));

		return productsInfo.map((product, index) => {
			const productName = Array.from(product.children).find(child => child.className == "name").textContent
			const price = parseInt(Array.from(product.children).find(child => child.className == "prc").textContent.split(' ')[1].replace(/,/g, ''))
			const discountDiv = product.querySelector('.s-prc-w');
			const image = productsImages[index].getAttribute("data-src")
			const link = articalLinks[index].getAttribute("href")

			let originalPrice = null;
			let discount = null;

			if (discountDiv) {
				originalPrice = parseInt(discountDiv.querySelector('.old')?.textContent.split(' ')[1].replace(/,/g, '')) || null;
				discount = parseFloat(discountDiv.querySelector('._dsct')?.textContent) || null;
			}

			return {
				image,
				productName,
				price,
				originalPrice,
				discount,
				link,
			}
		})
	})

	console.log(`\nFound ${prodData.length} results...`)

	console.log(`Now Fetching product size`)

	for (let i = 0; i < prodData.length; i++) {
		const product = prodData[i]
		try {
			await page.goto(`${urlObj.url}${product.link}`)
			const size = await page.evaluate(async () => {
				const packageSpecs = Array.from(document.querySelectorAll(".-pvxs"))
				const packageSize = packageSpecs.find(packageSpec => packageSpec.textContent.includes("Weight"))
				return packageSize?.textContent || undefined
			})
			product.size = normalizeWeight(size)
			console.log(`${i + 1}/${prodData.length}>	${product.productName} ----- ${normalizeWeight(size)}`)
		}
		catch (error) {
			console.error(`Failed to fetch ${product.productName} size: `, error)
			product.size = null
		}
		product.webLink = `${urlObj.url}${product.link}`
		product.country = urlObj.country
		await page.goBack()
	}

	await browser.close()

	return prodData
}