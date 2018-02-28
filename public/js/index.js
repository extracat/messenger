   // первый маршрут,для показа
    var GLOBALSTATE = {
        route: '.list-account'
    };

    // Установка первого маршрута
    setRoute(GLOBALSTATE.route);
    $('.nav > li[data-route="' + GLOBALSTATE.route + '"]').addClass('active');

    // Волновый эффект
    $('.floater').on('click', function(event) {
        var $ripple = $('<div class="ripple tiny bright"></div>');
        var x = event.offsetX;
        var y = event.offsetY;
        var $me = $(this);

        $ripple.css({
            top: y,
            left: x
        });
        $(this).append($ripple);

        setTimeout(function() {
            $me.find('.ripple').remove();
        }, 530)

    });

    // должна происходить пульсация , если (добавить)
    $('ul.mat-ripple').on('click', 'li', function(event) {
        if ($(this).parent().hasClass('tiny')) {
            var $ripple = $('<div class="ripple tiny"></div>');
        } else {
            var $ripple = $('<div class="ripple"></div>');
        }
        var x = event.offsetX;
        var y = event.offsetY;

        var $me = $(this);

        $ripple.css({
            top: y,
            left: x
        });

        $(this).append($ripple);

        setTimeout(function() {
            $me.find('.ripple').remove();
        }, 530)
    });


    var colorarray = [51,102,153,1]; // 15 157 88 = #0f9d58
    localStorage.setItem('color', JSON.stringify(colorarray));
    stylechange(colorarray);
    

    // Помощики
    function setName(name) {
        $.trim(name) === '' || $.trim(name) === null ? name = 'Name' : name = name;
        $('h1').text(name);
        localStorage.setItem('username', name);
        $('#username').val(name).addClass('used');
        $('.card.menu > .header > h3').text(name);
    }

    // Стиль смены
    function stylechange(arr) {
        var x = 'rgba(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ',1)';
        $('#dynamic-styles').text('.dialog h3 {color: ' + x + '} .i-group input:focus ~ label,.i-group input.used ~ label {color: ' + x + ';} .bar:before,.bar:after {background:' + x + '} .i-group label {color: ' + x + ';} ul.nav > li.active {color:' + x + '} .style-tx {color: ' + x + ';}.style-bg {background:' + x + ';color: white;}@keyframes navgrow {100% {width: 100%;background-color: ' + x + ';}} ul.list li.context {background-color: ' + x + '}');
    }

    function closeModal() {
        $('#new-user').val('');
        $('.overlay').removeClass('add');
        $('.floater').removeClass('active');
        $('#contact-modal').fadeOut();

        $('#contact-modal').off('click', '.btn.save');

    }

    function setModal(mode, $ctx) {
        var $mod = $('#contact-modal');
        switch (mode) {
            case 'add':
                $mod.find('h3').text('Add Contact');
                break;

            case 'edit':
                $mod.find('h3').text('Edit Contact');
                $mod.find('#new-user').val($ctx.text()).addClass('used');
                break;
        }

        $mod.fadeIn();
        $('.overlay').addClass('add');
        $mod.find('#new-user').focus();
    }

    $('.mdi-arrow-left').on('click', function() {
        $('.shown').removeClass('shown');
        setRoute('.list-text');
    });

    // Установка маршрутов- установка "поплавка"
    function setRoute(route) {
        GLOBALSTATE.route = route;
        $(route).addClass('shown');

        if (route !== '.list-account') {
            $('#add-contact-floater').addClass('hidden');
        } else {
            $('#add-contact-floater').removeClass('hidden');
        }

        if (route !== '.list-text') {
            $('#chat-floater').addClass('hidden');
        } else {
            $('#chat-floater').removeClass('hidden');
        }

        if (route === '.list-chat') {
            $('.mdi-menu').hide();
            $('.mdi-arrow-left').show();
            $('#content').addClass('chat');
            $('.nav').hide();
        } else {
            $('#content').removeClass('chat');
            $('.mdi-menu').show();
            $('.mdi-arrow-left').hide();
            $('.nav').show();
        }
    }







    $('.mdi-send').on('click', function() {
        var $chatmessage = '<p>' + $('.chat-input').val() + '</p>';
        $('ul.chat > li > .current').append($chatmessage);
        $('.chat-input').val('');
    });

    $('.chat-input').on('keyup', function(event) {
        event.preventDefault();
        if (event.which === 13) {
            $('.mdi-send').trigger('click');
        }
    });

    $('.list-text > ul > li').on('click', function() {
        $('ul.chat > li').eq(1).html('<img src="' + $(this).find('img').prop('src') + '"><div class="message"><p>' + $(this).find('.txt').text() + '</p></div>');

        // timeout just for eyecandy...
        setTimeout(function() {
            $('.shown').removeClass('shown');

            $('.list-chat').addClass('shown');
            setRoute('.list-chat');
            $('.chat-input').focus();
        }, 300);
    });



    // Навигация
    $('.nav li').on('click', function() {
        $(this).parent().children().removeClass('active');
        $(this).addClass('active');
        $('.shown').removeClass('shown');
        var route = $(this).data('route');
        $(route).addClass('shown');
        setRoute(route);
    });

 

    // меню-клик!
    //$('#head .mdi-menu').unbind('click').on('click', function(event) {
    $('#head .mdi-menu').on('click', function(event) {
         $('.menu').toggleClass('open');
         $('.overlay').toggleClass('add');
        
    });


    // Фильтр
    $('.search-filter').on('keyup', function() {
        var filter = $(this).val();
        $(GLOBALSTATE.route + ' .list > li').filter(function() {
            var regex = new RegExp(filter, 'ig');

            if (regex.test($(this).text())) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });

    // для удаления контакта (ничего не трогать !!)
    $('#contact-modal').on('click', '.btn.cancel', function() {
        closeModal();
    });

    $('#new-user').on('keydown', function(event) {
        switch (event.which) {
            case 13:
                event.preventDefault();
                $('.btn.save').trigger('click');
                break;

            case 27:
                event.preventDefault();
                $('.btn.cancel').trigger('click');
                break;
        }

    });

/*
    $('#add-contact-floater').on('click', function() {
        if ($(this).hasClass('active')) {
            	closeModal();
            $(this).removeClass('active');

        } else {

            $(this).addClass('active');
            setModal('add');
            $('#contact-modal').one('click', '.btn.save', function() {
                addUserToList($('#new-user').val());
                closeModal();
            });
        }
    });

*/


function addUserToList(name, id) {

   $('.list-account > .list').prepend('<li id="userId_' + id + '"><img src="userpic.jpg"><span class="name">' + name + '</span><i class="mdi mdi-menu-right"></i></li>');
 
}
