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

// Безопасная отправка AJAX-запросов к серверу
async function sendRequest(action, name, quantity = 1) {
    try {
        const response = await fetch("/cart_api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ action, name, quantity })
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

// Функции для работы с корзиной
export function addToCart(name) {
    return sendRequest("add", name);
}

export function updateCart(name, quantityChange) {
    return sendRequest("update", name, quantityChange);
}

export function removeFromCart(name) {
    return sendRequest("remove", name, 0); // Количество 0, так как товар удаляется
}
