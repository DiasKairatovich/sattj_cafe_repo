///// Этот файл отвечает за взаимодействие фронтенда с бэкендом /////

// Получение CSRF-токена из куки
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        document.cookie.split(";").forEach(cookie => {
            cookie = cookie.trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            }
        });
    }
    return cookieValue;
}

// Универсальная функция отправки AJAX-запросов к серверу
async function sendRequest(action, id, quantity = 1) {
    try {
        const response = await fetch("/cart_api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ action, id, quantity })
        });

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Ошибка при взаимодействии с API корзины:", error);
        return { cart: {} }; // Возвращаем пустую корзину при ошибке
    }
}

// Добавляет товар в корзину, учитывая выбранное количество
export function addToCart(id, quantity = 1) {
    return sendRequest("add", id, quantity);
}

// Устанавливает точное количество товара в корзине
export function updateCart(id, newQuantity) {
    return sendRequest("update", id, newQuantity);
}

// Удаляет товар из корзины
export function removeFromCart(id) {
    return sendRequest("remove", id);
}
