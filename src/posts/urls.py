from django.urls import path
from . import views

app_name = 'posts'

urlpatterns = [
    path('', views.post_list_and_create, name='main-board'),
    path('data/<int:num_posts>', views.load_post_data_view, name='posts-data'),
    path('like-unlike/', views.like_unlike_post, name='like-unlike'),
    path('<int:pk>', views.post_detail, name='detail'),
    path('<int:pk>/data', views.post_detail_data_view, name='post-detail-data'),
    path('<int:pk>/delete/', views.delete_post, name='delete'),
    path('<int:pk>/update/', views.update_post, name='update'),
]