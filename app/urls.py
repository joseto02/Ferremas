from django.urls import path, include
from . import views

from django.conf import settings
from django.contrib.staticfiles.urls import static

from rest_framework import routers
from .api import ProductoViewSet

router = routers.DefaultRouter()
router.register(r'api/productos', ProductoViewSet, basename='productos')


urlpatterns = [
    path("", views.home, name="home"),
    path("productos", views.productos, name="productos"),
    path("productos/crear", views.crear_producto, name="crear_producto"),
    path("productos/editar", views.editar_producto, name="editar_producto"),
    path("eliminar/<int:id_producto>", views.eliminar_producto, name="eliminar_producto"),
    path("productos/editar/<int:id_producto>", views.editar_producto, name="editar_producto"),
    
    
    path("", include(router.urls))
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
