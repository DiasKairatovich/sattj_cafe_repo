from django.urls import path
from .views import home_view, contacts_view

urlpatterns = [
    path('', home_view, name="home"), # тут name='home' — имя маршрута
    path('contacts/', contacts_view, name='contacts'), # тут name='contacts' — имя маршрута
]
