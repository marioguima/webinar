$(document).ready(
    function() {
        // login

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


        // toastr
        $('#cta-btn').on('click', () => {
            toastr["success"]("Você conseguiu garantir a sua vaga", "Parabéns Bianca Santos");

            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": true,
                "progressBar": true,
                "positionClass": "toast-top-left",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "4000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
        });

    });