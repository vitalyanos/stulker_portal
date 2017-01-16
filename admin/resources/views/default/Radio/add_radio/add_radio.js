
        var select2Opt = {minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'};

        var conf = {
            form: '#form_',
            lang : '{{ app.js_validator_language }}',
            showHelpOnFocus : true,
            validateHiddenInputs: true,
            modules: 'jsconf',
            onSuccess: function () {
                $(conf.form).get(0).submit();
                return true;
            },
            onError: function () {
                return false;
            }
        };

        function DemoSelect2() {
            $('#form_volume_correction').select2(select2Opt);
        }
        
        function yelp() {
            $(document).ready(function () {
                $.validate(conf);
                $(document).on('change', '#form_number, #form_name', function(e){
                    var _this = $(this);
                    _this.next('div').removeClass('bg-danger').css('visibility', 'hidden').html('&nbsp;');
                                       
                   $.ajax({
                        url: 'radio/' + _this.data('checkurl'),
                        type: 'POST',
                        data: {param: _this.val(), radioid: $('#form_id').val()},
                        success: function (data) {
                            if (data.success) {
                                _this.next('div').append('<i class="txt-success fa fa-check"></i> ' + data.chk_rezult).css('visibility', 'visible');
                            } else{
                                JSErrorModalBox(data);
                            }
                        },
                        error: function (data) {
                            if (typeof(data.responseJSON) != 'undefined' && typeof(data.responseJSON.error) != 'undefined') {
                                _this.next('div').append('<i class="txt-danger fa fa-ban"></i> ' + data.responseJSON.error).css('visibility', 'visible');
                            } else {
                                console.log("{{ 'Some network error or access denied' }}");
                            }
                        },
                        dataType: "json",
                        async: false
                    });
                });

                $("#form_save").on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    if ($(conf.form).isValid({}, conf, true)) {
                        conf.onSuccess();
                    } else {
                        conf.onError();
                    }
                    return false;
                });

                LoadSelect2Script(DemoSelect2);
            });
        }
        document.addEventListener("DOMContentLoaded", yelp, false);
