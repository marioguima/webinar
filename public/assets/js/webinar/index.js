// document load
$(function() {
    const socket = io();

    // Join Chat

    // mensagem de aviso
    $('#nickname-form-msg').hide();

    // chama o formulário para definir ou alterar o nickname
    $('#nickname-label, #nickname-button').click(function(event) {
        $('#nickname-Modal').modal({ keyboard: false });
    });

    // submit do form do nickname
    $("#nickname-form").on('submit', (function(event) {
        event.preventDefault();
        var nickname = $("#nickname-input").val().trim();

        // se foi apagada
        if (!localStorage.cid) {
            localStorage.cid = getAllUrlParams().c;
        }

        // se foi apagada
        if (!localStorage.sid) {
            localStorage.sid = socket.id;
        }

        if (nickname) {
            // if (!localStorage.nickname) {
            //     localStorage.nickname = nickname;
            //     // $('#nickname-button').hide();
            //     // $('#send-message').show();
            // }

            $('#nickname-Modal').modal('hide');
            $('#nickname-button').hide();
            $('#send-message').removeClass('d-none');

            if (localStorage.nickname == "") {
                socket.emit('nickname.set', {
                    from: nickname
                });
            } else if (localStorage.nickname != nickname) {
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
            // se foi apagada
            if (!localStorage.nickname) {
                localStorage.nickname = $("#nickname-input").val().trim();
            }
            if (!localStorage.cid) {
                localStorage.cid = getAllUrlParams().c;
            }
            if (!localStorage.sid) {
                localStorage.sid = socket.id;
            }

            if (localStorage.nickname != "" & localStorage.cid != "") {

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
            } else {
                $('#nickname-button').show();
                $('#send-message').hide();
                $('#nickname-Modal').modal();
            }
        }
    });

    function scrollToBottom() {
        let messages = document.getElementById('messages').lastElementChild;
        messages.scrollIntoView();
    }

    // comuncation with server by socket.io
    socket.on('connect', function() {
        // let params = window.location.search.substring(1)
        // params = JSON.parse('{"' + decodeURI(params).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');
        let allParams = getAllUrlParams();
        if (getAllUrlParams().c == localStorage.cid & localStorage.nickname !== undefined & localStorage.nickname != "") {
            imBack();
        } else {
            localStorage.cid = getAllUrlParams().c;
            localStorage.nickname = '';
            localStorage.sid = socket.id;
        }
    });

    socket.on('nickname.seted', function(messageBody) {
        // informa que a pessoa entrou na sala
        renderMessageJoinChat(messageBody);
    });

    function renderMessageJoinChat(messageBody) {
        sHtml = `
            <div class="chat-day-title">
                <span class="title">${messageBody.from} entrou na sala</span>
            </div>
            `
        $('#messages').append(
            $('<li>').html(sHtml));

        scrollToBottom();
    }

    socket.on('welcome', function(messageBody) {
        // recepciona a pessoa que acabou de entrar
        // aguarda entre 5 a 10 segundos, para parecer mais real
        setTimeout(async function() {
            renderMessageAdmin(messageBody);
        }, getRandomInt(5, 10) * 1000);
    });

    // Render message
    function renderMessageAdmin(messageBody) {
        const formattedTime = moment(messageBody.createdAt).format('LT');

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
                        <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${formattedTime}</span></p>
                    </div>
                </div>
                <div class="conversation-name">
                    ${messageBody.from}
                </div>
            </div>
        </div>
        `

        $('#messages').append(
            $('<li class="right">').html(sHtml));

        scrollToBottom();
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
        $('#messages').append(
            $('<li>').html(sHtml));

        scrollToBottom();
    }

    socket.on('message.share', function(messageBody) {
        renderMessageParticipant(messageBody);
    });

    function renderMessageParticipant(messageBody) {
        const formattedTime = moment(messageBody.createdAt).format('LT');

        sHtml = `
                <div class="conversation-list">
                    <div class="user-chat-content">
                        <div class="ctext-wrap">
                            <div class="ctext-wrap-content">
                                <p class="mb-0">
                                    ${messageBody.data}
                                </p>
                                <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${formattedTime}</span></p>
                            </div>
                        </div>
                        <div class="conversation-name">
                            ${messageBody.from}
                        </div>
                    </div>
                </div>
                `

        $('#messages').append(
            $('<li>').html(sHtml));

        scrollToBottom();
    }

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