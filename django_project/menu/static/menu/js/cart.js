document.addEventListener("DOMContentLoaded", function () {
    // Добавление товара в корзину
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const name = this.getAttribute("data-name");
            const price = parseInt(this.getAttribute("data-price"));
            const quantitySpan = document.querySelector(`.quantity[data-name="${name}"]`);
            const quantity = parseInt(quantitySpan?.textContent) || 1;

            fetch("/add-to-cart/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify({ name: name, price: price, quantity: quantity })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert(`${quantity} шт. ${name} добавлено в корзину!`);
                } else {
                    alert("Ошибка при добавлении в корзину.");
                }
            });
        });
    });

    // Обработчик увеличения, уменьшения количества и удаления товаров (делегирование событий)
    document.addEventListener("click", function (event) {
        const button = event.target;

        // Увеличение/уменьшение количества
        if (button.classList.contains("quantity-btn")) {
            const name = button.getAttribute("data-name");
            const quantitySpan = document.querySelector(`.quantity[data-name="${name}"]`);
            let quantity = parseInt(quantitySpan.textContent) || 1;

            if (button.classList.contains("increase")) {
                quantity += 1;
            } else if (button.classList.contains("decrease")) {
                quantity = Math.max(1, quantity - 1);
            }

            quantitySpan.textContent = quantity;

            fetch("/update-cart/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify({ name: name, quantity: quantity })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status !== "success") {
                    alert("Ошибка обновления корзины.");
                }
            });
        }

        // Удаление товара
        if (button.classList.contains("remove-item")) {
            const name = button.getAttribute("data-name");

            fetch("/remove-from-cart/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify({ name: name })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    location.reload();
                } else {
                    alert("Ошибка удаления товара.");
                }
            });
        }
    });

    // Функция получения CSRF-токена
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
