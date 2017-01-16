
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
            $('select').select2(select2Opt);
        }
        
        function yelp() {
            $(document).ready(function () {
                $.validate(conf);

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

                $(document).on('change', "#form_platform", function(e){
                    var selectedVal = $(this).val();
                    $(this).find("option").each(function(){
                        if($(this).val() != selectedVal) {
                            $("#" + $(this).val() + "_part").hide().find("input[type='checkbox']").prop("checked", false).removeAttr("checked");
                        } else {
                            $("#" + $(this).val() + "_part").show();
                        }
                    });
                })
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);
