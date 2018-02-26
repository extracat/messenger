(function ($) {

    $.fn.swOpenMainMenu = function (options) {
        var element = this;
        var defaults = {
            duration_in: 400,
            duration_out: 400,
            ease_in: 'easeOutCubic',
            ease_out: 'easeOutCubic'
        };
        var settings = $.extend({}, defaults, options);
        element.click(function (e) {
            e.preventDefault();
            if ($('body > content > nav').hasClass('menu-open')) {
                $('body > content > nav').transition({
                    x: '-10%',
                    opacity: 0,
                    easing: settings.ease_out,
                    duration: settings.duration_out
                }, function () {
                    $(this).removeClass('menu-open');
                    $('body > content > nav').hide();
                });
            } else {
                $('body > content > nav').show().transition({
                    x: '0%',
                    opacity: 1,
                    easing: settings.ease_in,
                    duration: settings.duration_in
                }, function () {
                    $(this).addClass('menu-open');
                });
            }
        });

        $('body > content > main').click(function (event) {
            if ($('body > content > nav').is(':visible')) {
                element.click();
            }
        });
    }

    $.fn.swGoToFullscreen = function () {
        var element = this;
        element.click(function (e) {
            e.preventDefault();
            var btnId = $(this);
            var docElement, request;
            if (btnId.hasClass('fullscreen')) {
                btnId.removeClass('fullscreen');
                $('i', btnId).removeClass('fa-compress').addClass('fa-expand');
                docElement = document;
                request = docElement.cancelFullScreen || docElement.webkitCancelFullScreen || docElement.mozCancelFullScreen || docElement.msCancelFullScreen || docElement.exitFullscreen;
                if (typeof request != "undefined" && request) {
                    request.call(docElement);
                }
            }
            else {
                btnId.addClass('fullscreen');
                $('i', btnId).removeClass('fa-expand').addClass('fa-compress');
                docElement = document.documentElement;
                request = docElement.requestFullScreen || docElement.webkitRequestFullScreen || docElement.mozRequestFullScreen || docElement.msRequestFullScreen;
                if (typeof request != "undefined" && request) {
                    request.call(docElement);
                }
            }
        });
    }

    $.swOpenDynamicModal = function (options) {

        var defaults = {
            title: '',
            content: '',
            buttons: {
            },
            closeid: ''
        };
        var settings = $.extend({}, defaults, options);
        var callbacks = $.Callbacks();
        var guid = Math.random().toString(30).replace('.', '');

        if (settings.closeid) {
            close_effect(settings.closeid);
        }
        else {
            $('<div>', { 'id': guid, 'class': 'modal' }).appendTo('body');
            $('<div>', { 'class': 'modal-box' }).appendTo('.modal#' + guid);
            $('<div>', { 'class': 'modal-content' }).appendTo('.modal#' + guid + ' .modal-box');
            $('<content>').appendTo('.modal#' + guid + ' .modal-content');
            $('<header>', { 'html': settings.title }).appendTo('.modal#' + guid + ' content');
            $('<main>', { 'html': settings.content }).appendTo('.modal#' + guid + ' content');
            $('<footer>').appendTo('.modal#' + guid + ' content');

            if (settings.buttons.main) {
                var btnguid = Math.random().toString(30).replace('.', '');
                var btnclass = settings.buttons.main.btnclass;
                btnclass = !btnclass ? 'btn-link' : btnclass;

                $('<button>', {
                    'id': btnguid,
                    'data-id': guid,
                    'text': settings.buttons.main.btntext,
                    'class': 'btn ' + btnclass
                }).appendTo('.modal#' + guid + ' footer');

                $('.modal#' + guid + ' button#' + btnguid).click(function (e) {
                    e.preventDefault();
                    callbacks.add(settings.buttons.main.callback);
                    callbacks.fire($(this));
                    callbacks.remove(settings.buttons.main.callback);
                });
            }

            if (settings.buttons.cancel) {
                var btnguid = Math.random().toString(30).replace('.', '');
                var btnclass = settings.buttons.cancel.btnclass;
                btnclass = !btnclass ? 'btn-link' : btnclass;

                $('<button>', {
                    'id': btnguid,
                    'data-id': guid,
                    'text': settings.buttons.cancel.btntext,
                    'class': 'btn ' + btnclass
                }).appendTo('.modal#' + guid + ' footer');

                $('.modal#' + guid + ' button#' + btnguid).click(function (e) {
                    e.preventDefault();
                    callbacks.add(settings.buttons.cancel.callback);
                    callbacks.fire($(this));
                    callbacks.remove(settings.buttons.cancel.callback);
                });
            }

            if (settings.buttons.confirm) {
                var btnguid = Math.random().toString(30).replace('.', '');
                var btnclass = settings.buttons.confirm.btnclass;
                btnclass = !btnclass ? 'btn-link' : btnclass;

                $('<button>', {
                    'id': btnguid,
                    'data-id': guid,
                    'text': settings.buttons.confirm.btntext,
                    'class': 'btn ' + btnclass
                }).appendTo('.modal#' + guid + ' footer');

                $('.modal#' + guid + ' button#' + btnguid).click(function (e) {
                    e.preventDefault();
                    callbacks.add(settings.buttons.confirm.callback);
                    callbacks.fire($(this));
                    callbacks.remove(settings.buttons.confirm.callback);
                });
            }

            open_effect(guid)

        }

        function open_effect(id) {
            $('#' + id).show(0, function () {

                $(this).transition({ opacity: 0 }, 0).transition({ opacity: 1 }, 300);

                $(this).find('content:first').transition({
                    scale: [0.5]
                }, 0).transition({
                    scale: [1.0]
                }, 300, 'easeOutCubic');

                if ($('body').width() > 600) {
                    $(this).niceScroll({
                        background: '#FFF',
                        cursorcolor: '#455A64',
                        cursorwidth: 8,
                        cursorborder: 'none',
                        cursorborderradius: '0px',
                        horizrailenabled: false,
                        autohidemode: false,
                        railpadding: { top: 0, right: 0, left: 0, bottom: 0 }
                    });
                }

            });
        }

        function close_effect(id) {

            $('#' + id).transition({ opacity: 0 }, 300, function () {
                $(this).remove();
            });

            $('#' + id).find('content:first').transition({
                scale: [0.2]
            }, 300, 'easeInBack');

        }

    };

    $.fn.swNavTabs = function (options) {

        var element = this;
        var defaults = {
            duration: 400,
            ease: 'easeOutCubic'
        };
        var settings = $.extend({}, defaults, options);

        element.find('a').first().addClass('active');
        element.parent().find('section').first().show().addClass('active');

        element.find('a').click(function (e) {
            e.preventDefault();

            var btnActive = $(this);
            var btnDeactive = element.find('a.active');
            var secActive = element.parent().find('section' + btnActive.attr('href'));
            var secDective = element.parent().find('section.active');

            if (btnActive.is(':not(.not-ready)')) {
                if (btnActive.attr('href').replace('#', '') != secDective.attr('id')) {

                    element.find('a').addClass('not-ready');
                    btnDeactive.removeClass('active');
                    btnActive.addClass('active');
                    secDective.removeClass('active')
                    secActive.addClass('active');

                    secDective.hide();
                    secActive.show().transition({
                        x: -100,
                        opacity: 0
                    }, 0).transition({
                        x: 0,
                        opacity: 1
                    }, settings.duration, settings.ease, function () {
                        element.find('a').removeClass('not-ready');
                        $('body > main').getNiceScroll().resize();
                    });
                }
            }
        });

    }

    $.fn.swNavWindows = function (options) {

        var element = this;
        var defaults = {
            duration: 400,
            ease: 'easeOutCirc'
        };
        var settings = $.extend({}, defaults, options);

        element.click(function (e) {
            e.preventDefault();

            $($(this).data('current')).hide();
            $($(this).data('target')).show().transition({
                scale: 0.9,
            }, 0).transition({
                scale: 1.0,
            }, settings.duration, settings.ease, function () {
                element.find('a').removeClass('not-ready');
                $('body > main').getNiceScroll().resize();
            });
        });

    }

})(jQuery);

$(document).ready(function () {

    if ($("body").width() > 600) {
        var defaults = {
            background: "#FFF",
            cursorcolor: "#455A64",
            cursorwidth: 8,
            cursorborder: "none",
            cursorborderradius: "0px",
            horizrailenabled: false,
            autohidemode: false,
            railpadding: { top: 0, right: 0, left: 0, bottom: 0 }
        };
        $("body > content > main").niceScroll(defaults);
        $("body > content > nav ul").niceScroll(defaults);
        $(".modal").niceScroll(defaults);
        $("body > content > main > #sw-messages content").niceScroll(defaults);
    }

    $("#sw-attachments, content > nav a").click(function (e) {
        e.preventDefault();
        $.swOpenDynamicModal({
            title: "<h4>Mensagem Teste</h4>",
            content: "Este é apenas um teste de Modal",
            buttons: {
                cancel: {
                    btntext: "Cancelar",
                    btnclass: "btn-link",
                    callback: function (element) {
                        $.swOpenDynamicModal({
                             closeid: $(element).data("id")
                        });
                    }
                },
                confirm: {
                    btntext: "Ok",
                    btnclass: "btn-link",
                    callback: function (element) {
                        $.swOpenDynamicModal({
                             closeid: $(element).data("id")
                        });
                    }
                }
            }
        });
    });

    $("#sw-fullscreen").swGoToFullscreen();
    $("#sw-mainmenu").swOpenMainMenu();
    $("#sw-navtabs").swNavTabs();
    $("#currents tr").swNavWindows();
    $("a").swNavWindows();

});