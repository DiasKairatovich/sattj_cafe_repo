from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_http_methods

def menu_list(request):
    """Рендерит страницу с меню."""
    menu_items = [
        {"name": "Брускетта с томатами", "description": "Свежие томаты, базилик, оливковое масло.",
         "price": 1200, "category": "snacks", "image": "menu/images/brucela_tomato.jpg"},
        {"name": "Стейк из говядины", "description": "Сочное мясо, приготовленное на гриле.",
         "price": 3200, "category": "main", "image": "menu/images/steak_beef.jpg"},
        {"name": "Чизкейк", "description": "Классический чизкейк с ягодами.",
         "price": 1300, "category": "dessert", "image": "menu/images/chees_cake.jpg"},
        {"name": "Тирамису", "description": "Нежный десерт с кофейным ароматом.",
         "price": 900, "category": "dessert", "image": "menu/images/tiramisu.jpg"},
        {"name": "Лимонад", "description": "Свежевыжатый лимонад с мятой.",
         "price": 1500, "category": "drinks", "image": "menu/images/limonade.jpg"},
        {"name": "Зеленый чай", "description": "Травяной напиток из листьев чайной камелии.",
         "price": 1300, "category": "drinks", "image": "menu/images/tea.jpg"},
    ]
    return render(request, 'menu/menu_list.html', {'menu_items': menu_items})

@require_http_methods(["GET", "POST"])
@csrf_protect
def cart_api(request):
    """API для работы с корзиной."""
    if request.method == "GET":
        cart = request.session.get("cart", {})
        total_price = sum(item["price"] * quantity for item, quantity in cart.items())
        return JsonResponse({"cart": cart, "total_price": total_price})

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Неверный формат JSON"}, status=400)

    cart = request.session.get("cart", {})

    action = data.get("action")
    name = data.get("name")
    quantity = int(data.get("quantity", 1))

    if not name:
        return JsonResponse({"error": "Имя товара обязательно"}, status=400)

    if action == "add":
        cart[name] = cart.get(name, 0) + quantity
    elif action == "remove":
        cart.pop(name, None)
    elif action == "update":
        if name in cart:
            cart[name] = max(0, cart[name] + quantity)
            if cart[name] == 0:
                del cart[name]

    request.session["cart"] = cart
    request.session.modified = True

    return JsonResponse({"cart": cart})

def cart_view(request):
    """Рендерит страницу корзины."""
    cart = request.session.get('cart', {})
    return render(request, 'menu/cart.html', {'cart': cart})

