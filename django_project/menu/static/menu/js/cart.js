import { addToCart, updateCart, removeFromCart } from "./api.js";

// Функция обновления интерфейса корзины
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

// Делегирование событий для кнопок внутри корзины
document.addEventListener("click", async (event) => {
    const button = event.target;
    const name = button.dataset.name;
    if (!name) return;

    try {
        let updatedCart;

        if (button.classList.contains("increase")) {
            updatedCart = await update
