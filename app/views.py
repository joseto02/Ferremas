from django.shortcuts import render, redirect
from .models import Producto, Usuario
from .forms import ProductoForm

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .serializers import UsuarioSerializer

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
    producto = Producto.objects.get(id_producto=id_producto)
    formulario = ProductoForm(request.POST or None, request.FILES or None, instance=producto)
    if formulario.is_valid() and request.POST:
        formulario.save()
        return redirect("productos")
    return render(request, "productos/editar.html", {"formulario": formulario, "producto": producto})


def eliminar_producto(request, id_producto):
    producto = Producto.objects.get(id_producto = id_producto)
    producto.delete()
    return redirect("productos")

@api_view(['POST'])
def login (request):
    return Response({})


@api_view(["POST"])
def register(request):
    
    serializer = UsuarioSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        
        user = Usuario.objects.get(username=serializer.data['username'])
        user.set_password(serializer.data['password'])
        user.save()
        
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)