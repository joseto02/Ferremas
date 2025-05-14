from rest_framework import serializers
from .models import Producto, Usuario, Carrito, ItemCarrito

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        usuario = Usuario(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario
    
class ItemCarritoSerializer(serializers.ModelSerializer):
    
    id = serializers.IntegerField()
    nombre = serializers.CharField(source='producto.nombre')
    precio = serializers.DecimalField(source='producto.precio', max_digits=10, decimal_places=2)
    imagen = serializers.ImageField(source='producto.imagen', required=False)
    producto_id = serializers.IntegerField(source='producto.id_producto') #id_productos porque el modelo producto tiene como clave primaria id_producto
    
    class Meta:
        model = ItemCarrito
        fields = ['id', 'nombre', 'precio', 'imagen', 'producto_id', 'cantidad']

class CarritoSerializer(serializers.ModelSerializer):
    items = ItemCarritoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Carrito
        fields = '__all__'