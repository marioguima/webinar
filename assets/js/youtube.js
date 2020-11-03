// Este código carrega a API do IFrame Player de forma assíncrona.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Variável definida para receber uma instância do Player
var player;

// Função definida para detectar se o Player está pronto
function onYouTubeIframeAPIReady() {
    console.log('player_ok');
    // Definida a instância do Player com base no ID definido anteriormente
    player = new YT.Player('yt-video');
    // Quando o status do vídeo for alterado, a função será executada.
    player.addEventListener("onStateChange", "onYouTubePlayerStateChange");

    // associa o click para executar o play
    $("#video-overlay").click(playPauseVideo);

}

// Função definida trabalhar as alterações de status do vídeo.
function onYouTubePlayerStateChange(event) {
    // O status 1 significa que o vídeo está sendo reproduzido.
    // O player.getCurrentTime() captura o ponto do vídeo. Foi colocado para evitar envio duplo do evento.
    if (event.data == 1 && player.getCurrentTime() < 0.1) {
        console.log('reproduzindo...');
        // Enviar o evento para o Google Analytics
        // gtag('event', 'play', { 'event_category': 'videos', 'event_label': 'kTKqTnClB-4-Sitemap' });
    } else if (event.data == 0) {
        console.log('encerrado');
        showControls();
    }
    console.log(event.data);
}

function playPauseVideo() {

    // 2 – em  pausa  |  5 – vídeo indicado (é o estado inicial do vídeo)
    if (player.getPlayerState() == 2 || player.getPlayerState() == 5) {
        player.playVideo();

        $("#image-cover").fadeOut(400);

        $('#play-video').fadeOut(function() {
            $("#play-video").removeClass("d-flex");
        });

        setTimeout(async function() {
            $("#bars").fadeOut(function() {
                $("#bars").removeClass("d-flex");
            });

        }, 5000);

        // 1 = em reprodução
    } else if (player.getPlayerState() == 1) {
        player.pauseVideo();

        showControls();

        // setTimeout(async function() {
        // $("#bars").show(function() {
        //     $("#bars").addClass("d-flex");
        // });

        // }, 5000);

    }

}

function showControls() {
    $("#image-cover").fadeIn(10);

    $("#play-video").addClass("d-flex");
    $('#play-video').fadeIn(10);
}