from django.db import models
from django.core.validators import MinValueValidator

# Create your models here.

class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    marca = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to='imagenes/', null=True, blank=True)
    stock = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    precio = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    activo = models.BooleanField(default=True)
    
    def estado_stock(self):
        if self.stock == 0:
            return "Producto agotado"
        else:
            return f"Dispoonible: {self.stock} unidades."
    
    def __str__(self):
        return self.nombre
    
    def delete(self, using = None, keep_parents = False):
        self.imagen.storage.delete(self.imagen.name)
        super().delete()