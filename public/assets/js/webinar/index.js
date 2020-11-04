// document load
$(function() {
    const socket = io();

    // Join Chat
    $('#nickname-form-msg').hide();

    // chama o formulário para definir ou alterar o nickname
    $('#nickname-label, #nickname-button').click(function(event) {
        $('#nickname-Modal').modal({ keyboard: false });
    });

    // submit do form do nickname
    $("#nickname-form").on('submit', (function(event) {
        event.preventDefault();
        var nickname = $("#nickname-input").val().trim();

        if (nickname) {
            $('#nickname-Modal').modal('hide');
            $('#nickname-button').hide();
            $('#send-message').removeClass('d-none');

            if (localStorage.nickname == "") {
                socket.emit('join', {
                    from: nickname
                });
            } else {
                socket.emit('nickname.change', {
                    from: localStorage.nickname,
                    data: nickname
                });
            }
            // save local nickname
            localStorage.nickname = nickname;

            $('#nickname-label').text(nickname);

        } else {
            $('#nickname-form-msg').fadeIn();
        }

    }));

    $('#nickname-Modal').on('hidden.bs.modal', function(event) {
        $('#nickname-form-msg').hide();
    });

    // formulário de envio de mensagem
    $('#form-send-message').submit(function(e) {
        // evitando o carregamento da página
        e.preventDefault();

        var sMessage = $('#send-message-text').val().trim();

        if (sMessage) {

            var messageBody = {
                from: localStorage.nickname,
                data: sMessage,
            }

            // // associa uma função ao keypress somente após o usuário definir o nickname
            // $('#send-message-text').keypress(function(event) {
            //     socket.emit('typing', `${localStorage.nickname} está digitando...`);
            // });

            // // associa uma função ao keyup somente após o usuário definir o nickname
            // // envia uma mensagem vazia para apagar o aviso que o usuário está digitando
            // $('#send-message-text').keyup(function(event) {
            //     socket.emit('typing', '');
            // });

            // // informando que um usuário está digitando
            // socket.on('typing', function(msg) {
            //     $('#status').html(msg);
            // });

            // emitir a mensagem para o servidor
            socket.emit('message.new', messageBody);

            // limpar o campo da mensagem
            $('#send-message-text').val('');
        }
    });

    socket.on('connect', function() {
        if (getAllUrlParams().c == localStorage.cid & localStorage.nickname != "") {
            imBack();
        } else {
            localStorage.cid = getAllUrlParams().c;
            localStorage.nickname = '';
            localStorage.sid = socket.id;
        }
    });

    socket.on('joined', function(messageBody) {
        // informa que a pessoa entrou na sala
        renderMessageJoinChat(messageBody);
    });

    function renderMessageJoinChat(messageBody) {
        sHtml = `
            <div class="chat-day-title">
                <span class="title">${messageBody.from} entrou na sala</span>
            </div>
            `
        $('#messages').prepend(
            $('<li>').html(sHtml));
    }

    socket.on('welcome', function(messageBody) {
        welcome(messageBody);
    });

    function welcome(messageBody) {
        // recepciona a pessoa que acabou de entrar
        // aguarda entre 5 a 10 segundos, para parecer mais real
        setTimeout(async function() {
            renderMessageAdmin(messageBody);
        }, getRandomInt(5, 10) * 1000);
    }

    socket.on('nickname.changed', function(messageBody) {
        // informa que a pessoa entrou na sala
        renderMessageChangedNickname(messageBody);
    });

    function renderMessageChangedNickname(messageBody) {
        sHtml = `
            <div class="chat-day-title">
                <span class="title"><i>${messageBody.from}</i> mudou para <strong>${messageBody.data}</strong></span>
            </div>
            `
        $('#messages').prepend(
            $('<li>').html(sHtml));
    }

    socket.on('message.share', function(messageBody) {
        renderMessageParticipant(messageBody);
    });

    socket.on('cta', function(messageBody) {
        $('#footer').html(messageBody.data);
    });

    socket.on('people-in-room', function(messageBody) {
        $('.people-in-room').text(messageBody.data);
    });

    // voltou ao evento
    function imBack() {
        $('#nickname-button').hide();
        $('#send-message').removeClass('d-none');
        $('#nickname-label').text(localStorage.nickname);

        // carrega as mensagens
    }

    // Render message
    function renderMessageAdmin(messageBody) {
        // var aSaudacoes = [
        //     ', que bom que você está aqui 👏.',
        //     ', que bom que você chegou 🤝.',
        //     ', estou feliz que você chegou.',
        //     ', estou feliz que você está aqui.',
        //     ', 👏👏👏.'
        // ];

        // var sRecepcionar =
        //     saudacao() +
        //     ' ' +
        //     messageBody.from +
        //     aSaudacoes[(Math.random() * aSaudacoes.length) | 0];

        sHtml = `
        <div class="conversation-list">
            <div class="chat-avatar">
                <img src="/assets/images/users/presenter.jpg" alt="">
            </div>
            <div class="user-chat-content">
                <div class="ctext-wrap">
                    <div class="ctext-wrap-content">
                        <p class="mb-0">
                            ${messageBody.data}
                        </p>
                        <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${messageBody.time.substr(0,5)}</span></p>
                    </div>
                </div>
                <div class="conversation-name">
                    ${messageBody.from}
                </div>
            </div>
        </div>
        `

        $('#messages').prepend(
            $('<li class="right">').html(sHtml));
    }

    function renderMessageParticipant(messageBody) {
        sHtml = `
                <div class="conversation-list">
                    <div class="user-chat-content">
                        <div class="ctext-wrap">
                            <div class="ctext-wrap-content">
                                <p class="mb-0">
                                    ${messageBody.data}
                                </p>
                                <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${messageBody.time.substr(0,5)}</span></p>
                            </div>
                        </div>
                        <div class="conversation-name">
                            ${messageBody.from}
                        </div>
                    </div>
                </div>
                `

        $('#messages').prepend(
            $('<li>').html(sHtml));
    }


    // toastr
    $('#cta-btn').on('click', function() {
        toastr["success"]("Você conseguiu garantir a sua vaga", "Parabéns Bianca Santos");

        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": true,
            "positionClass": "toast-top-left",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "000",
            "hideDuration": "1000",
            "timeOut": "10000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }
    });

});