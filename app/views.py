from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'app/home.html')

def productos(request):
    return render(request, 'productos/index.html')

def crear_producto(request):
    return render(request, "productos/crear.html")

def editar_producto(request):
    return render(request, "productos/editar.html")