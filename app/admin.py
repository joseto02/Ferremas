from django.contrib import admin
from .models import Producto, RolUsuario, Usuario

# Register your models here.
admin.site.register(Producto)
admin.site.register(RolUsuario)
admin.site.register(Usuario)