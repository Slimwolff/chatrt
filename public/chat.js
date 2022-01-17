
const socket = io(window.location.href);

let user = '';
let userCheck = false;

socket.on('update_messages', (messages) => {

    updateMessages(messages);
})

socket.on('user-typing', (data) => {
    showUserTyping(data);
})




function updateMessages(data){
    let div_message = document.querySelector('#messages');

    
    div_message.innerHTML = '';
    

    data.forEach( data => {
        let node = composeMsg(data);
        div_message.appendChild(node);
    });

    div_message.scrollTop = div_message.scrollHeight+20;

    div_message.scrollTop = div_message.scrollHeight+50;

    // add a margin-top on first message
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

function showUserTyping(user) {

    console.log(user);
    
    let userContent = document.querySelector('#users-typing');
    
    let usersTyping = '';

    
        
    usersTyping += `${user.userTyping},`;
    

    usersTyping += ' is typing...';

    userContent.appendChild(document.createTextNode(usersTyping));
    userContent.classList.add('active');

    let timeShowingUser = setTimeout(() => {
        userContent.classList.remove('active');
        userContent.innerHTML = '';
    },3000);

    console.log(usersTyping);
}


document.addEventListener('DOMContentLoaded', ()=> {

    let inputTimeSender;
    let timeStarted = false;

    document.forms['message_form_name']['msg'].addEventListener('input', () => {
        
        if(!inputTimeSender && !timeStarted ) {

            socket.emit('typing', { user: user } );
            console.log('user is typing...');


            timeStarted = true;

            let inputTimeSender = setTimeout(()=>{
                clearInterval(inputTimeSender);
                timeStarted = false;
            },2750);
        }
    })

    const form = document.querySelector('#message_form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if(!user){
            alert('Defina um usuário!!');
            return;
        }

        let msg = e.target.elements.msg.value
        msg = msg.trim();

       if(!msg){
           return;
       }

        const message = msg;
        e.target.elements.msg.value = ''
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
