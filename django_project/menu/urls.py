from django.urls import path
from .views import menu_list

urlpatterns = [
    path('menu/', menu_list, name='menu_list'),  # тут name='menu_list' — имя маршрута
]
