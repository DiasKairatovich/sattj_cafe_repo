from django.urls import path
from .views import menu_list, cart_view, cart_api

urlpatterns = [
    path('menu/', menu_list, name='menu_list'),  # тут name='menu_list' — имя маршрута
    path('cart/', cart_view, name='cart'),
    path("cart_api/", cart_api, name="cart_api"),
]
