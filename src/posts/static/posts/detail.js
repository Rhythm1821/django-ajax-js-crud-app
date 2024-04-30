const backBtn = document.getElementById('back-btn')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')
const postBox = document.getElementById('post-box')
const alertBox = document.getElementById('alert-box')
const spinnerBox = document.getElementById('spinner-box')

const titleInput = document.getElementById('id_title')
const bodyInput = document.getElementById('id_body')

const url = window.location.href + '/data'
const updateUrl = window.location.href + '/update/'
const deleteUrl = window.location.href + '/delete/'

const updateForm = document.getElementById('update-form')
const deleteForm = document.getElementById('delete-form')

const csrf = document.getElementsByName('csrfmiddlewaretoken')
console.log(csrf);

backBtn.addEventListener('click',()=>{
    history.back()
})

$.ajax({
    type: 'GET',
    url: url,
    success: function(response){
        console.log('response',response);
        data = response.data
        console.log(data.logged_in);
        if (data.logged_in !== data.author) {
            console.log('Different');
        } else {
            console.log('Equal')
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        };

        const titleEle = document.createElement('h3')
        titleEle.setAttribute('class','mt-3')
        titleEle.setAttribute('id','title')

        const bodyEle = document.createElement('p')
        bodyEle.setAttribute('class','mt-3')
        bodyEle.setAttribute('id','body')

        titleEle.textContent = data.title
        bodyEle.textContent = data.body
        postBox.appendChild(titleEle)
        postBox.appendChild(bodyEle)

        titleInput.value = data.title
        bodyInput.value = data.body
        
        spinnerBox.classList.add('not-visible')
    },
    error: function(error){
        console.log('error',error);
    }
})

updateForm.addEventListener('submit',e=>{
    e.preventDefault()

    const title = document.getElementById('title')
    const body = document.getElementById('body')

    $.ajax({
        type: 'POST',
        url: updateUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': titleInput.value,
            'body': bodyInput.value
        },
        success: function(response){
            console.log('response',response);
            handleAlerts('success','Post has been updated successfully')
            title.textContent = response.title
            body.textContent = response.body
        },
        error: function(response){
            console.log('response',response);
        },
    })
})

deleteForm.addEventListener('submit',e=>{
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: deleteUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
        },
        success: function(response){
            window.location.href = window.location.origin
            localStorage.setItem('title',titleInput.value)
        },
        error: function(response){
            console.log('response',response);
        },
    })
})