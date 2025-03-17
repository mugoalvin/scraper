import { launch } from "puppeteer"

const normalizeWeight = (size) => {
    const match = size.match(/([\d.]+)\s*(kg)?/i);
    if (match) {
        return `${parseFloat(match[1])} kg`;
    }
    return 'Invalid size';
};

const getProductsData = async (page) => {
    return await page.evaluate(() => {
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

            return { image, productName, price, originalPrice, discount, link }
        })
    })
}

const getProductWeight = async (urlObj, prodData, page) => {
    for (let i = 0; i < prodData.length; i++) {
        const product = prodData[i]
        try {
            await page.goto(`${urlObj.domain}${product.link}`)
            const size = await page.evaluate(() => {
                const packageSpecs = Array.from(document.querySelectorAll(".-pvxs"))
                const packageSize = packageSpecs.find(packageSpec => packageSpec.textContent.includes("Weight"))
                return packageSize?.textContent || undefined
            })
            product.size = normalizeWeight(size)
            console.log(`${i + 1}/${prodData.length}> ${product.productName} ----- ${product.size}`)
        }
        catch (error) {
            console.error(`Failed to fetch ${product.productName} size: `, error)
            console.log(`${i + 1}/${prodData.length}> ${product.productName} ----- null`)
            console.log("Will default to a null value")
            product.size = null
        }
        product.webLink = `${urlObj.domain}${product.link}`
        product.country = urlObj.country
        await page.goBack()
    }
}



// Root function to fetch required data from Jumia
export const fetchFromJumia = async (targetUrlObj) => {
    const currentTime = new Date()
    const formatedTime = `${currentTime.toLocaleTimeString()} of ${currentTime.toLocaleDateString()}`

    console.log(`\nScraping Products From  ${targetUrlObj.country}...`)
    console.log(`Time: ${formatedTime}\n`)

    const browser = await launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(`${targetUrlObj.domain}${targetUrlObj.route}`)
    await page.waitForSelector(".cls")
    await page.click(".cls")

    const prodData = await getProductsData(page)

    console.log(`\nFound ${prodData.length} results...`)
    console.log(`Now in order to fetch each product's size we'll have to fetch it from the product's page...\nCommencing...\n`)

    await getProductWeight(targetUrlObj, prodData, page)

    await browser.close()
    return prodData
}