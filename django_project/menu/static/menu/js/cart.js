///// Этот файл отвечает за обновление интерфейса /////

import { addToCart, updateCart, removeFromCart } from "./cart_api.js";

// Обновление интерфейса корзины
function updateCartDisplay(cart) {
    const cartContainer = document.querySelector(".cart-container");
    if (!cartContainer) return;

    cartContainer.innerHTML = ""; // Очищаем контейнер

    if (Object.keys(cart).length === 0) {
        cartContainer.innerHTML = "<p>Ваша корзина пуста.</p>";
        return;
    }

    Object.entries(cart).forEach(([name, quantity]) => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <strong>${name}</strong> (${quantity} шт.)
            <button class="decrease" data-name="${name}">-</button>
            <button class="increase" data-name="${name}">+</button>
            <button class="remove" data-name="${name}">Удалить</button>
        `;
        cartContainer.appendChild(itemElement);
    });
}

// Делегирование событий для динамических элементов
document.addEventListener("click", (event) => {
    const button = event.target;
    const name = button.dataset.name;

    if (!name) return;

    if (button.classList.contains("increase")) {
        updateCart(name, 1).then(data => updateCartDisplay(data.cart));
    } else if (button.classList.contains("decrease")) {
        updateCart(name, -1).then(data => {
            if (data.cart[name] === 0) removeFromCart(name);
            updateCartDisplay(data.cart);
        });
    } else if (button.classList.contains("remove")) {
        removeFromCart(name).then(data => updateCartDisplay(data.cart));
    }
});

// Добавление товара в корзину (через делегирование)
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("add-to-cart")) {
        const name = event.target.dataset.name;
        addToCart(name)
            .then(data => {
                if (data.cart) updateCartDisplay(data.cart);
            })
            .catch(error => console.error("Ошибка добавления в корзину:", error));
    }
});

// Первоначальная загрузка корзины
fetch("/cart_api/")
    .then(response => response.json())
    .then(data => {
        if (data.cart) updateCartDisplay(data.cart);
    })
    .catch(error => console.error("Ошибка загрузки корзины:", error));
