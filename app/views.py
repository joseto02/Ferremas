from django.shortcuts import render, redirect
from .models import Producto
from .forms import ProductoForm

# Create your views here.

def home(request):
    return render(request, 'app/home.html')

def productos(request):
    productos = Producto.objects.all()
    return render(request, 'productos/index.html', {'productos': productos})

def crear_producto(request):
    formulario = ProductoForm(request.POST or None, request.FILES or None)
    if formulario.is_valid():
        formulario.save()
        return redirect('productos')
    return render(request, "productos/crear.html", {'formulario': formulario})


def editar_producto(request, id_producto):
    producto = Producto.objects.get(id_producto = id_producto)
    formulario = ProductoForm(request.POST or None, request.FILES or None, instance=producto)
    if formulario.is_valid() and request.POST:
        formulario.save()
        return redirect('productos')
    return render(request, "productos/editar.html", {'formulario': formulario})


def eliminar_producto(request, id_producto):
    producto = Producto.objects.get(id_producto = id_producto)
    producto.delete()
    return redirect("productos")
