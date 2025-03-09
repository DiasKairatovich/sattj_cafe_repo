from django.shortcuts import render

def home_view(request):
    return render(request, 'core/home.html')

def contacts_view(request):
    return render(request, 'core/contacts.html')