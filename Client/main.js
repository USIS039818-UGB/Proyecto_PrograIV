var Socket = io.connect('http://localhost:6678', {'forceNew':true} );

Socket.on('messages', function (data) {
    console.log(JSON.stringify(data));
    render(data);
    $.notification ( "Enviando noficacion" ,"nuevo mensaje",'' ) ;


});

var file = $("#file");
$(file).change(function () {
    
    var freader = new FileReader();
    freader.readAsDataURL($(file).prop("files")[0]);
    freader.onloadend = function (event) {
        console.log(event.target.result);
        var message = {
            nickname:sessionStorage.getItem("nombre"),
            img: event.target.result
        };

        Socket.emit('add-message', message);
    }
})

function render(data) {
    var html = data.map(function (message, index) {
        if (message.text) {
            return (`
                <div class="message">
                    <strong>${message.nickname}</strong>
                    <p>${message.text}</p>
                </div>
            `);
        }
        else{
            return (`
                <div class="message">
                    <p><strong>${message.nickname}</strong><p>
                    <img src="${message.img}">
                </div>
            `);
        }
    }).join('   ');
    var div_msg = document.getElementById("messages");
    div_msg.innerHTML = html;
    div_msg.scrollTop = div_msg.scrollHeight;
}

function addMessage(e) {
    //Nickname es el nombre de usuario que aparecera
    var message = {
        nickname:sessionStorage.getItem("nombre"),
        text: document.getElementById('text').value
    };
    
    
   
    

    Socket.emit('add-message', message);
    document.getElementById('text').value = '';
    return false;
}
