export function validateProduct(product) {
    const { image, productName, price, originalPrice, discount, link, size, webLink, country } = product;

    if (typeof image !== 'string' || !image.startsWith('https://')) {
        throw new Error('Invalid image URL');
    }

    if (typeof productName !== 'string' || productName.trim() === '') {
        throw new Error('Invalid product name');
    }

    if (typeof price !== 'number' || price <= 0) {
        throw new Error('Invalid price');
    }

    if (typeof originalPrice !== 'number' || originalPrice <= 0) {
        throw new Error('Invalid original price');
    }

    if (typeof discount !== 'number' || discount < 0) {
        throw new Error('Invalid discount');
    }

    if (typeof link !== 'string' || !link.startsWith('/')) {
        throw new Error('Invalid product link');
    }

    if (typeof size !== 'string' || size.trim() === '') {
        throw new Error('Invalid size');
    }

    if (typeof webLink !== 'string' || !webLink.startsWith('https://')) {
        throw new Error('Invalid web link');
    }

    if (typeof country !== 'string' || country.trim() === '') {
        throw new Error('Invalid country');
    }

    return true;
}