from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("productos", views.productos, name="productos"),
    path("productos/crear", views.crear_producto, name="crear_producto"),
    path("productos/editar", views.editar_producto, name="editar_producto"),
]
