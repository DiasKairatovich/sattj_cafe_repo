from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

# Данные о меню (в реальном проекте должны быть в БД)
MENU_ITEMS = {
    "1": {"name": "Брускетта с томатами", "price": 1200, "category": "snacks", "image": "menu/images/brucela_tomato.jpg"},
    "2": {"name": "Стейк из говядины", "price": 3200, "category": "main", "image": "menu/images/steak_beef.jpg"},
    "3": {"name": "Чизкейк", "price": 1300, "category": "dessert", "image": "menu/images/chees_cake.jpg"},
    "4": {"name": "Тирамису", "price": 900, "category": "dessert", "image": "menu/images/tiramisu.jpg"},
    "5": {"name": "Лимонад", "price": 1500, "category": "drinks", "image": "menu/images/limonade.jpg"},
    "6": {"name": "Зеленый чай", "price": 1300, "category": "drinks", "image": "menu/images/tea.jpg"},
}

def menu_list(request):
    """Рендерит страницу с меню."""
    menu_items = [{"id": item_id, **data} for item_id, data in MENU_ITEMS.items()]
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
    quantity = int(data.get("quantity", 1))

    item_id = str(data.get("id"))  # ID будет строкой, чтобы избежать проблем
    if not item_id or item_id not in MENU_ITEMS:
        return JsonResponse({"error": "Неверный ID товара"}, status=400)

    if action == "add":
        cart[item_id] = cart.get(item_id, 0) + quantity
    elif action == "remove":
        cart.pop(item_id, None)
    elif action == "update":
        if item_id in cart:
            cart[item_id] = max(0, quantity)  # Теперь обновляет четко до `quantity`
            if cart[item_id] == 0:
                del cart[item_id]

    request.session["cart"] = cart
    request.session.modified = True

    total_price = sum(MENU_ITEMS[item]["price"] * quantity for item, quantity in cart.items() if item in MENU_ITEMS)
    return JsonResponse({"cart": cart, "total_price": total_price})

def cart_view(request):
    """Рендерит страницу корзины."""
    cart = request.session.get("cart", {})

    cart_items = {
        item_id: {"quantity": quantity, **MENU_ITEMS[item_id]}
        for item_id, quantity in cart.items() if item_id in MENU_ITEMS
    }

    return render(request, "menu/cart.html", {"cart": cart_items})
