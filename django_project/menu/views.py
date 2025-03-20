from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Данные о меню (в реальном проекте должны быть в БД)
MENU_ITEMS = {
    "Брускетта с томатами": {"price": 1200, "category": "snacks", "image": "menu/images/brucela_tomato.jpg"},
    "Стейк из говядины": {"price": 3200, "category": "main", "image": "menu/images/steak_beef.jpg"},
    "Чизкейк": {"price": 1300, "category": "dessert", "image": "menu/images/chees_cake.jpg"},
    "Тирамису": {"price": 900, "category": "dessert", "image": "menu/images/tiramisu.jpg"},
    "Лимонад": {"price": 1500, "category": "drinks", "image": "menu/images/limonade.jpg"},
    "Зеленый чай": {"price": 1300, "category": "drinks", "image": "menu/images/tea.jpg"},
}

def menu_list(request):
    """Рендерит страницу с меню."""
    menu_items = [{"name": name, **data} for name, data in MENU_ITEMS.items()]
    return render(request, 'menu/menu_list.html', {'menu_items': menu_items})

@require_http_methods(["GET", "POST"])
@csrf_exempt  # Отключаем CSRF для API-запросов
def cart_api(request):
    """API для работы с корзиной."""
    cart = request.session.get("cart", {})

    if request.method == "GET":
        total_price = sum(MENU_ITEMS[item]["price"] * quantity for item, quantity in cart.items() if item in MENU_ITEMS)
        return JsonResponse({"cart": cart, "total_price": total_price})

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Неверный формат JSON"}, status=400)

    action = data.get("action")
    name = data.get("name")
    quantity = int(data.get("quantity", 1))

    if not name or name not in MENU_ITEMS:
        return JsonResponse({"error": "Неверное название товара"}, status=400)

    if action == "add":
        cart[name] = cart.get(name, 0) + quantity
    elif action == "remove":
        cart.pop(name, None)
    elif action == "update":
        if name in cart:
            cart[name] = max(0, quantity)  # Теперь обновляет четко до `quantity`
            if cart[name] == 0:
                del cart[name]

    request.session["cart"] = cart
    request.session.modified = True

    total_price = sum(MENU_ITEMS[item]["price"] * quantity for item, quantity in cart.items() if item in MENU_ITEMS)
    return JsonResponse({"cart": cart, "total_price": total_price})

def cart_view(request):
    """Рендерит страницу корзины."""
    cart = request.session.get("cart", {})
    cart_items = {name: {"quantity": quantity, **MENU_ITEMS[name]} for name, quantity in cart.items() if name in MENU_ITEMS}

    return render(request, "menu/cart.html", {"cart": cart_items})
