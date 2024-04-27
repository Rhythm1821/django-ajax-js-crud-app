
const helloworld=document.querySelector('#id');
const postsBox=document.querySelector('#posts-box');
const spinnerBox=document.querySelector('#spinner-box');

$.ajax({
    type: 'GET',
    url: "hello-world/",
    success: function(response){
        // console.log('success',response.text);
        helloworld.textContent = response.text
    },
    error: function(error){
        console.log('error',error);
    }
})

$.ajax({
    type: 'GET',
    url: '/data/',
    success: function(response){
        console.log('success',response);
        data=response.data
        setTimeout(() => {
            spinnerBox.classList.add('not-visible');
        data.forEach(element => {
            console.log(element);
            postsBox.innerHTML+=`
            ${element.title} - <b> ${element.body}<b/> <br/>
            `
        });
        }, 100);
        
    },
    error: function(error){
        console.log('error',error);
    }
})