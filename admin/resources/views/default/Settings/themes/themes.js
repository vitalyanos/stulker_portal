
        function DemoGallery(){
            $('.fancybox').fancybox({
                openEffect	: 'none',
                closeEffect	: 'none'
            });
        }

        function yelp() {
            $(document).ready(function () {
                $(document).on('click', ".main_ajax[disabled!='disabled']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var objHref = ($(this).attr('href'))? $(this).attr('href'): $(this).data('href');
                    $("#modalbox").data('complete', 0);
                    var sendData = $(this).data();
                    ajaxPostSend(objHref, sendData, false, false);
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });
                
                // Load Fancybox2 and make gallery in callback
                LoadFancyboxScript(DemoGallery);
                
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);
        
        var manageTheme = function (obj) {
            changeTheme(obj);
            JSSuccessModalBox(obj);
        };
        
        var changeTheme = function(obj){
            $("button[data-themename]").each(function(){
                if ($(this).data('themename') == obj.name) {
                    $(this).prop('disabled', 'disabled').attr('disabled', 'disabled');
                    if(!$(this).hasClass('btn-yaly')) {
                        $(this).removeClass('btn-yal').addClass('btn-yaly');
                    }
                    $(this).text('{{ 'Current'|trans }}');
                } else {
                    $(this).prop('disabled', false).removeAttr('disabled');
                    if(!$(this).hasClass('btn-yal')) {
                        $(this).removeClass('btn-yaly').addClass('btn-yal');
                    }
                    $(this).text('{{ 'Apply'|trans }}');
                }
            });
        };
