const socket = io('http://localhost:3000')
let user = '';
socket.on('update_messages', (messages) => {
    updateMessagesOnScreen(messages)
})


function  updateMessagesOnScreen(data){
    const div_messages = document.querySelector('#messages');

    let list_messages = '<ul>'
    data.forEach( data => {
        list_messages += `<li>${data.user}: ${data.msg}</li>`
    })
    list_messages += '</ul>'

    div_messages.innerHTML = list_messages;
}

document.addEventListener('DOMContentLoaded', ()=> {

    const form = document.querySelector('#message_form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if(!user){
            alert('Defina um usuário!!');
            return;
        }

        const message = document.forms['message_form_name']['msg'].value;
        document.forms['message_form_name']['msg'].value = '';
        socket.emit('new_message', { user: user, msg: message });
        console.log(message);
    })

    const userForm = document.querySelector('#user_form');
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        user = document.forms['user_form_name']['user'].value;
        userForm.parentNode.removeChild(userForm);
    })

})
