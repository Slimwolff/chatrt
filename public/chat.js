
const socket = io(window.location.href);

let user = '';
let userCheck = false;

socket.on('update_messages', (messages) => {

    updateMessages(messages);

})

function updateMessages(data){
    let div_message = document.querySelector('#messages');

    for(let i=div_message.childElementCount; i > 0; i--){
        div_message.removeChild(div_message.children[0]);
    }

    data.forEach( contentBodyMSG => {
        let node = composeMsg(contentBodyMSG);
        div_message.appendChild(node);
    });

    if(div_message.childElementCount > 0){
        div_message.children[0].classList.add('first-container-top');
    }   
}

function composeMsg(data){

    let msgContainer = document.createElement('ul');
    let msgValue = document.createElement('li');
    let msgUser = document.createElement('li');
        msgContainer.classList.add('message-container');
        

    if(data.user == user) {

        
        if(!userCheck){
            msgContainer.classList.add('first-container');
            userCheck = true;
        }

        msgContainer.classList.add('right-msg');

        msgValue.appendChild(document.createTextNode(data.msg));
        msgValue.classList.add('msg-content');

        msgContainer.appendChild(msgValue);

    }else {

        if(userCheck){
            msgContainer.classList.add('first-container');
            userCheck = false;
        }

        msgUser.appendChild(document.createTextNode(data.user));
        msgValue.appendChild(document.createTextNode(data.msg));

        msgUser.classList.add('msg-user');
        msgValue.classList.add('msg-content');

        msgContainer.appendChild(msgUser);
        msgContainer.appendChild(msgValue);

    }
    return msgContainer;
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
