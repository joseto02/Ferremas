from django.shortcuts import render, redirect, get_object_or_404
from .models import Producto, Usuario, Carrito, ItemCarrito
from .forms import ProductoForm

from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token

from .serializers import UsuarioSerializer, ItemCarritoSerializer, CarritoSerializer

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


@api_view(["POST"])
@permission_classes([AllowAny])
def api_login(request):
    users = Usuario.objects.filter(email=request.data["email"])

    if not users.exists():
        return Response(
            {"error": "Usuario no existe"}, status=status.HTTP_400_BAD_REQUEST
        )

    user = users.first()

    if not user.check_password(request.data["password"]):
        return Response(
            {"error": "Contraseña invalida"}, status=status.HTTP_400_BAD_REQUEST
        )

    if not user.is_active:
        return Response(
            {"error": "Usuario inactivo"}, status=status.HTTP_400_BAD_REQUEST
        )

    token, created = Token.objects.get_or_create(user=user)
    serializer = UsuarioSerializer(instance=user)

    return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def api_register(request):

    data = request.data.copy()
    data['rol'] = 1

    serializer = UsuarioSerializer(data=data)

    if serializer.is_valid():
        user = serializer.save()
        user.set_password(data['password'])
        user.save()  
        return Response(
            {"message": "Usuario registrado con éxito"}, status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    
    
    
    return Response("Estas en el perfil de {}".format(request.user.username), status=status.HTTP_200_OK)

def login_view(request):
    return render(request, 'autenticacion/login.html')


def register_view(request):
    return render(request, "autenticacion/register.html")

@api_view(['POST'])
def agregar_al_carrito(request):
    usuario = request.user
    producto_id = request.data.get('producto_id')
    cantidad = request.data.get('cantidad', 1)
    
    carrito, creado = Carrito.objects.get_or_create(usuario=usuario)
    item, creado = ItemCarrito.objects.get_or_create(carrito=carrito, producto_id=producto_id)
    
    if not creado:
        item.cantidad += cantidad
    else:
        item.cantidad = cantidad
    item.save()
    
    return Response({'mensaje': 'Producto agregado al carrito'})

@api_view(['GET'])
def obtener_carrito(request):
    usuario = request.user
    carrito = Carrito.objects.filter(usuario=usuario).first()

    if not carrito:
        return Response({'mensaje': 'Carrito vacío'}, status=status.HTTP_200_OK)

    serializer = CarritoSerializer(carrito)

    return Response(serializer.data)


@api_view(["DELETE"])
def eliminar_item_carrito(request, item_id):
    try:
        item = ItemCarrito.objects.get(id=item_id, carrito_usurio=request.user)
        item.delete()
        return Response({"mensaje": "Item eliminado del carrito"})
    except ItemCarrito.DoesNotExist:
        return Response({"error": "Producto no encontrado"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def actualizar_cantidad_item(request, item_id):
    cantidad = request.data.get('cantidad')
    
    if not cantidad or int(cantidad) <= 0:
        return Response({'error': 'Cantidad inválida'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        item = ItemCarrito.objects.get(id=item_id, carrito__usuario=request.user)
        item.cantidad = cantidad
        item.save()
        return Response({'mensaje': 'Cantidad actualizada'})
    except ItemCarrito.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)