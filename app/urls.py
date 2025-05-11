from django.urls import path, include, re_path
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
    
    path("api/login", views.api_login, name="api_login"),
    path("api/register", views.api_register, name="api_register"),
    
    path("login", views.login_view, name="login"),
    path("register", views.register_view, name="register"),
    
    
    
    path("", include(router.urls))
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
