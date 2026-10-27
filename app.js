const API_URL = "http://127.0.0.1:8000/api/v1/products/";
const productsContainer = document.getElementById("products");
const statusText = document.getElementById("status");

async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        productsContainer.replaceChildren();

        if (data.results.length === 0) {
            statusText.textContent = "У каталозі поки немає товарів.";
            return;
        }

        for (const product of data.results) {
            const card = document.createElement("article");
            card.className = "product";

            const name = document.createElement("h3");
            name.textContent = product.name;

            const description = document.createElement("p");
            description.textContent = product.description || "Опис відсутній.";

            const price = document.createElement("p");
            price.className = "price";
            price.textContent = `${Number(product.price).toFixed(2)} грн`;

            card.append(name, description, price);
            productsContainer.append(card);
        }

        statusText.textContent =
            `Показано ${data.results.length} з ${data.count} товарів.`;
    } catch (error) {
        statusText.textContent =
            "Не вдалося завантажити товари. Спробуйте оновити сторінку.";
        console.error("Помилка завантаження товарів:", error);
    }
}

loadProducts();