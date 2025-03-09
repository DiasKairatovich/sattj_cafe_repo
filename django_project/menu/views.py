from django.shortcuts import render
from .models import MenuItem

def menu_list(request):
    items = MenuItem.objects.all()  # Получаем все блюда из базы
    return render(request, 'menu/menu_list.html', {'items': items})

