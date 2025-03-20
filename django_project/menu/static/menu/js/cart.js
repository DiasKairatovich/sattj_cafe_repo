import { addToCart, updateCart, removeFromCart } from "./api.js";

// Функция обновления интерфейса корзины
function updateCartDisplay(cart) {
    const cartContainer = document.querySelector("cart-container");
    if (!cartContainer) return;

    cartContainer.innerHTML = ""; // Очищаем контейнер

    if (Object.keys(cart).length === 0) {
        cartContainer.innerHTML = "<p id='empty-cart-message'>Ваша корзина пуста.</p>";
        document.getElementById("checkout-btn").style.display = "none"; // Скрываем кнопку оплаты
        return;
    }

    document.getElementById("checkout-btn").style.display = "block"; // Показываем кнопку оплаты

    Object.entries(cart).forEach(([itemId, data]) => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <strong>${data.name}</strong> (${data.quantity} шт.)
            <button class="decrease" data-id="${itemId}">-</button>
            <button class="increase" data-id="${itemId}">+</button>
            <button class="remove" data-id="${itemId}">Удалить</button>
        `;
        cartContainer.appendChild(itemElement);
    });
}

// Делегирование событий для кнопок внутри корзины
document.addEventListener("click", async (event) => {
    const button = event.target;
    const itemId = button.dataset.id;
    if (!itemId) return;

    try {
        let updatedCart;

        if (button.classList.contains("increase")) {
            updatedCart = await updateCart(itemId, 1);
        } else if (button.classList.contains("decrease")) {
            updatedCart = await updateCart(itemId, -1);
            if (!updatedCart.cart[itemId] || updatedCart.cart[itemId]?.quantity <= 0) {
                updatedCart = await removeFromCart(itemId);
            }
        } else if (button.classList.contains("remove")) {
            updatedCart = await removeFromCart(itemId);
        } else if (button.classList.contains("add-to-cart")) {
            updatedCart = await addToCart(itemId);
        }

        if (updatedCart && updatedCart.cart) {
            updateCartDisplay(updatedCart.cart);
        }
    } catch (error) {
        console.error("Ошибка при обновлении корзины:", error);
    }
});

// Первоначальная загрузка корзины
async function loadCart() {
    try {
        const response = await fetch("/cart_api/");
        const data = await response.json();
        if (data.cart) updateCartDisplay(data.cart);
    } catch (error) {
        console.error("Ошибка загрузки корзины:", error);
    }
}

// Запуск при загрузке страницы
document.addEventListener("DOMContentLoaded", loadCart);
