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
    
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_precio = serializers.IntegerField(source='producto.precio', read_only=True)
    
    class Meta:
        model = ItemCarrito
        fields = '__all__'

class CarritoSerializer(serializers.ModelSerializer):
    items = ItemCarritoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Carrito
        fields = '__all__'