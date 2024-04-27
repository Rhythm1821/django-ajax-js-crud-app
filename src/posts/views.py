from django.http import JsonResponse
from django.shortcuts import render
from django.core import serializers
from .models import Post

def post_list_and_create(request):
    posts = Post.objects.all()
    return render(request, 'posts/main.html', {'posts': posts})

def load_post_data_view(request):
    posts = Post.objects.all()
    data=[]
    for obj in posts:
        item = {
            'id': obj.id,
            'title': obj.title,
            'body': obj.body,
            'author': obj.author.user.username,
        }
        data.append(item)
    return JsonResponse({'data': data})

def hello_world_view(request):
    return JsonResponse({'text': 'hello world'})