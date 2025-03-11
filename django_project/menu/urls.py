from django.urls import path
from .views import menu_list, cart_view, add_to_cart

urlpatterns = [
    path('menu/', menu_list, name='menu_list'),  # тут name='menu_list' — имя маршрута
    path('cart/', cart_view, name='cart'),
    path("add-to-cart/", add_to_cart, name="add_to_cart"),
]
