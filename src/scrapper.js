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
	await page.goto(`${urlObj.url}${urlObj.route}`)

	await page.waitForSelector(".cls")
	await page.click(".cls")

	const prodData = await page.evaluate(() => {
		const products = Array.from(document.querySelectorAll("article.prd._fb.col.c-prd"))
		
		 return products.map(product => {
            const productName = product.querySelector(".info .name").textContent;
            const price = parseInt(product.querySelector(".info .prc").textContent.split(' ')[1].replace(/,/g, ''));
            const discountDiv = product.querySelector('.s-prc-w');
            const image = product.querySelector(".img-c .img").getAttribute("data-src");
            const link = product.querySelector("a.core").getAttribute("href");

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
	console.log(`Now in order to fetch each product's size we'll have to fetch it from the product's page...\nCommencing...\n`)

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
			console.log("Will default to a null value")
			product.size = null
		}
		product.webLink = `${urlObj.url}${product.link}`
		product.country = urlObj.country
		await page.goBack()
	}

	await browser.close()
	return prodData
}