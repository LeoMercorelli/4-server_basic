const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            ...product,
        };
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;

        const updatedProduct = { ...products[index], ...updatedFields };
        delete updatedProduct.id; // evitar sobrescribir ID
        products[index] = { ...products[index], ...updatedFields };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const newProducts = products.filter(p => p.id !== id);
        await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
        return newProducts;
    }
}

module.exports = ProductManager;