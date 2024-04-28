
const postsBox=document.querySelector('#posts-box');
const spinnerBox=document.querySelector('#spinner-box');
const loadBtn = document.querySelector('#load-btn');
const endBox = document.querySelector('#end-box');

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const likeUnlikePost = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-form')]
    likeUnlikeForms.forEach(form => {form.addEventListener('submit', e=>{
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

        $.ajax({
            type: 'POST',
            url: '/like-unlike/',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId
            },
            success: function(response){
                console.log('success',response);
                clickedBtn.textContent = response.liked?`Unlike ${response.count}`:`Like ${response.count}`
            },
            error: function(error){
                console.log('error',error);
            }
        })
    })})
}

let visible = 3

const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/data/${visible}`,
        success: function(response){
            console.log('success',response);
            data=response.data
            setTimeout(() => {
                spinnerBox.classList.add('not-visible');
            data.forEach(element => {
                console.log(element);
                postsBox.innerHTML+=`
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text">${element.body}</p>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col-1">
                                    <a href="#" class="btn btn-primary">Details</a>
                                </div>
                                <div class="col-2">
                                    <form class="like-unlike-form" data-form-id=${element.id}>
                                        <button id="like-unlike-${element.id}" href="#" class="btn btn-primary">${element.liked?`Unlike ${element.count}`:`Like ${element.count}`}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                </div>
                `
            });
            likeUnlikePost()
            }, 100);
            if (response.size===0) {
                endBox.textContent='No posts added yet'
            }
            else if (response.size<=visible) {
                loadBtn.classList.add('not-visible')
                endBox.textContent='No more posts to show...'
            }
        },
        error: function(error){
            console.log('error',error);
        }
    })
}

loadBtn.addEventListener('click', (e)=>{
    spinnerBox.classList.remove('not-visible')
    visible+=3
    getData()
})

getData()