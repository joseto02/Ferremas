from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import AbstractUser

# Create your models here.


class RolUsuario(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Usuario(AbstractUser): 
    direccion = models.CharField(max_length=100)
    numero_telefono = models.CharField(max_length=15)
    rol = models.ForeignKey(RolUsuario, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.username} {self.first_name} {self.last_name}"


class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    marca = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to='imagenes/', null=True, blank=True)
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    precio = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    activo = models.BooleanField(default=True)
    id_usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE, null=True, blank=True)

    def estado_stock(self):
        if self.stock == 0:
            return "Producto agotado"
        else:
            return f"Dispoonible: {self.stock} unidades."

    def __str__(self):
        return self.nombre

    def delete(self, *args, **kwargs):
        # Verificamos si la imagen existe y si tiene un nombre
        if self.imagen and self.imagen.name:
            self.imagen.storage.delete(
                self.imagen.name
            )  # Eliminamos la imagen de los archivos
        super().delete(
            *args, **kwargs
        ) 


class Carrito(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Carrito #{self.id} - {self.usuario}"


class ItemCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE, related_name="items")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        return f"{self.producto} x{self.cantidad}"


class Orden(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    carrito = models.OneToOneField(Carrito, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=50, default="pendiente")  # pendiente, entregado, cancelado

    def __str__(self):
        return f"Orden #{self.id} - {self.usuario}"

class Pago(models.Model):
    orden = models.ForeignKey(Orden, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField()

    def __str__(self):
        return f"Pago #{self.id} - {self.usuario} - ${self.total}"


class Delivery(models.Model):
    orden = models.OneToOneField(Orden, on_delete=models.CASCADE)
    repartidor = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name="entregas",)
    fecha_entrega = models.DateField()
    estado = models.CharField(max_length=50, default="en camino")  # en camino, entregado

    def __str__(self):
        return f"Entrega de Orden #{self.orden.id} - Estado: {self.estado}"