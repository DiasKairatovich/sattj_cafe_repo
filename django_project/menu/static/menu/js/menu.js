import { addToCart, updateCart } from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
    // Найти все товары в меню
    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        const plusBtn = item.querySelector(".increase");
        const minusBtn = item.querySelector(".decrease");
        const quantitySpan = item.querySelector(".quantity");
        const addToCartBtn = item.querySelector(".add-to-cart");

        let quantity = 1; // Локальная переменная для отслеживания количества

        // Увеличение количества
        plusBtn.addEventListener("click", () => {
            quantity++;
            quantitySpan.textContent = quantity;
        });

        // Уменьшение количества (не меньше 1)
        minusBtn.addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                quantitySpan.textContent = quantity;
            }
        });

        // Добавление товара в корзину с учётом количества
        addToCartBtn.addEventListener("click", async () => {
            const itemId = addToCartBtn.dataset.id;

            try {
                const response = await addToCart(itemId, quantity);
                console.log("Товар добавлен в корзину:", response);

                quantity = response.cart[itemId] ?? 1; // Обновляем количество на фронте
                quantitySpan.textContent = quantity;
            } catch (error) {
                console.error("Ошибка при добавлении в корзину:", error);
            }
        });
    });
});
