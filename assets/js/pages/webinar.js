$(document).ready(
    function() {
        $('#login-msg').hide();

        $('#change-nickname, #login-chat').click(function(event) {
            $('#login-Modal').modal({
                // backdrop: 'static',
                keyboard: false
            });
        });

        $("#nickname-form").on('submit', (function(event) {
            event.preventDefault();
            var nickname = $("#nickname-input").val().trim();

            if (nickname) {
                $('#login-Modal').modal('hide');
            } else {
                $('#login-msg').fadeIn();
            }

        }));

        $('#login-Modal').on('hidden.bs.modal', function(event) {
            $('#login-msg').hide();
        });
    });