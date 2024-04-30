from django.http import JsonResponse
from django.shortcuts import render
from django.core import serializers
from .models import Post
from .forms import PostForm
from profiles.models import Profile

def post_list_and_create(request):
    form = PostForm(request.POST or None)
    # qs = Post.objects.all()
    if is_ajax(request):
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = author
            instance.save()
            if is_ajax(request):
                return JsonResponse({
                    'id': instance.id, 
                    'title': instance.title, 
                    'body': instance.body, 
                    'author': instance.author.user.username
                })
    context = {
        'form': form,
        # 'qs': qs
    }
    return render(request, 'posts/main.html', context)

def load_post_data_view(request,num_posts):
    if is_ajax(request):
        visible=3
        upper = num_posts
        lower = upper - visible
        size = Post.objects.all().count()
        posts = Post.objects.all()
        data=[]
        for obj in posts:
            item = {
                'id': obj.id,
                'title': obj.title,
                'body': obj.body,
                'liked': True if request.user in obj.liked.all() else False,
                'count': obj.like_count,
                'author': obj.author.user.username,
            }
            data.append(item)
        return JsonResponse({'data': data[lower:upper], 'size': size})
    
def post_detail(request,pk):
    obj = Post.objects.get(pk=pk)
    form=PostForm()
    context = {
        'obj': obj,
        'form': form
    }
    return render(request, 'posts/detail.html', context)
    # return JsonResponse({'id':obj.id, 'title': obj.title, 'body': obj.body, 'author': obj.author.user.username})

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

def post_detail_data_view(request,pk):
    obj=Post.objects.get(pk=pk)
    data={
        'id':obj.id,
        'title':obj.title,
        'body':obj.body,
        'author':obj.author.user.username,
        'logged_in': request.user.username
    }
    return JsonResponse({"data":data})

def like_unlike_post(request):
    if is_ajax(request):
        pk=request.POST.get('pk')
        obj=Post.objects.get(pk=pk)
        if request.user in obj.liked.all():
            liked=False
            obj.liked.remove(request.user)
        else:
            liked=True
            obj.liked.add(request.user)
        obj.save()
        return JsonResponse({'count': obj.like_count, 'liked': liked})

def update_post(request,pk):
    obj = Post.objects.get(pk=pk)
    if is_ajax(request):
        title=request.POST.get('title')
        body=request.POST.get('body')
        obj.title=title
        obj.body=body
        obj.save()
        return JsonResponse({
            'title': obj.title,
            'body': obj.body
        })

def delete_post(request,pk):
    obj = Post.objects.get(pk=pk)
    if is_ajax(request):
        obj.delete()
        return JsonResponse({})