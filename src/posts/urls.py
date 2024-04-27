from django.urls import path
from . import views

app_name = 'posts'

urlpatterns = [
    path('', views.post_list_and_create, name='main-board'),
    path('hello-world/', views.hello_world_view, name='hello-world'),
    path('data/', views.load_post_data_view, name='posts-data'),
]