from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def menu_list(request):
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

@csrf_exempt
def add_to_cart(request):
    if request.method == "POST":
        try:
            # Исправляем: Убедимся, что cart - это словарь
            cart = request.session.get("cart", {})

            if not isinstance(cart, dict):  # Если cart вдруг оказался списком — заменим его
                cart = {}

            data = json.loads(request.body)
            name = data["name"] # получаем название
            quantity = int(data.get("quantity", 1))  # Получаем количество

            if name in cart:
                cart[name] += quantity  # Увеличиваем количество
            else:
                cart[name] = quantity  # Добавляем новый товар

            request.session["cart"] = cart  # Сохраняем в сессии
            request.session.modified = True  # Явно указываем, что сессия изменилась

            return JsonResponse({"status": "success", "cart": cart})
        except json.JSONDecodeError:
            return JsonResponse({"status": "error", "message": "Ошибка в JSON"}, status=400)

    return JsonResponse({"status": "error", "message": "Неверный запрос"}, status=400)

def update_cart(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        change = data.get("change")

        cart = request.session.get("cart", {})

        if name in cart:
            cart[name] += change
            if cart[name] <= 0:
                del cart[name]  # Если количество <= 0, удаляем товар
            request.session["cart"] = cart

        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "error"}, status=400)

def remove_from_cart(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")

        cart = request.session.get("cart", {})

        if name in cart:
            del cart[name]  # Полностью удаляем товар
            request.session["cart"] = cart

        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "error"}, status=400)

def cart_view(request):
    cart = request.session.get('cart', {})  # Достаем корзину из сессии
    return render(request, 'menu/cart.html', {'cart': cart})

