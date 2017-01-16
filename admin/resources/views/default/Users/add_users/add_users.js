
        var select2Opt = {minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'};

        var conf = {
            form: '#form_',
            lang : '{{ app.js_validator_language }}',
            showHelpOnFocus : true,
            validateHiddenInputs: true,
            ignore: ['.ignore'],
            modules: 'jsconf, date',
            onSuccess: function () {
                $(this.form).get(0).submit();
                return false;
            },
            onError: function () {
                return false;
            }
        };

        function DemoSelect2() {
            $('#form_group_id').select2(select2Opt);
            $('#form_tariff_plan_id').select2(select2Opt);
            $('#form_additional_services_on').select2(select2Opt);
            $('#form_status').select2(select2Opt);
            $('#form_theme').select2(select2Opt);
            {% if attribute(app, 'reseller') is defined and not app['reseller'] %}
            $('#form_reseller_id').select2(select2Opt);
            {% endif %}
        }

        function TestTable1() {
            $('.table-datatable').dataTable({
                "processing": false,
                "serverSide": false,
                "ajax": null,
                "language": {
                    "url": "{{ app.datatable_lang_file }}"
                },
                {% if attribute(app, 'tracert_attr') is defined %}
                {{ main_macro.get_datatable_column(app['tracert_attr']) }}
                {% endif %}
                "bFilter": false,
                "bPaginate": false,
                "bInfo": false,
                "aoColumnDefs": [
                    {"searchable": false},
                    {"orderable": false, "targets": [ 0 ]}
                ]
            });
        }

        function yelp() {
            $(document).ready(function () {

                $.validate(conf);

                $('[data-toggle="tooltip"]').tooltip();
                
                LoadSelect2Script(DemoSelect2);
                LoadDataTablesScripts(TestTable1);

                {% if attribute(app, 'enableBilling') is defined and app.enableBilling %}
                $("#form_expire_billing_date").datepicker({
                            language: 'ru',
                            dateFormat: 'dd-mm-yy',
                            firstDay: 1,
                            minDate: new Date(),
                            dayNamesMin: [
                                '{{ 'Sun'|trans }}',
                                '{{ 'Mon'|trans }}',
                                '{{ 'Tue'|trans }}',
                                '{{ 'Wed'|trans }}',
                                '{{ 'Thu'|trans }}',
                                '{{ 'Fri'|trans }}',
                                '{{ 'Sat'|trans }}'
                            ],
                            monthNames: [
                                '{{ 'January'|trans }}',
                                '{{ 'February'|trans }}',
                                '{{ 'March'|trans }}',
                                '{{ 'April'|trans }}',
                                '{{ 'May'|trans }}',
                                '{{ 'June'|trans }}',
                                '{{ 'July'|trans }}',
                                '{{ 'August'|trans }}',
                                '{{ 'September'|trans }}',
                                '{{ 'October'|trans }}',
                                '{{ 'November'|trans }}',
                                '{{ 'December'|trans }}'
                            ]
                        }
                );
                {% endif %}

                $(document).on('blur change input', '#form_login', function (e) {
                    var _this = $(this);
                    _this.next('div').removeClass('bg-danger').css('visibility', 'hidden').html('&nbsp;');

                    var sendData = {login: _this.val(), id: $("#form_id").val()};

                    ajaxPostSend('{{app.request_context.baseUrl}}/{{app.controller_alias}}/check-login', sendData);
                });

                $(document).on('click', "a.main_ajax", function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    ajaxPostSend($(this).attr('href'), $(this).data(), false, false);

                    return false;
                });

                $(document).on('change', '#form_tariff_plan_id', function(){
                    if($(this).val() != $("#tariff_plan_table").data('planid')){
                        $("#tariff_plan_table").hide();
                        $("#tariff_plan_change").show();
                    } else {
                        $("#tariff_plan_table").show();
                        $("#tariff_plan_change").hide();
                    }
                });
                
                $(document).on('click', '#form_save', function(){
                    if (!$("#tariff_plan_table").is(':visible')) {
                        $("#tariff_plan_table input").attr('disabled', 'disabled');
                    }

                    e.stopPropagation();
                    e.preventDefault();

                    if ($(conf.form).isValid({}, conf, true)) {
                        conf.onSuccess();
                    } else {
                        conf.onError();
                    }
                    return false;
                });

                {% if app.userEdit and (not app['tariffPlanFlag'] or app['tariffPlanSubscriptionFlag']) %}
                $(document).on('click', "#tv_subscription", function (e){
                    e.stopPropagation();
                    e.preventDefault();
                    ajaxPostSend($(this).attr('href'), $(this).data());
                });

                $("#modalbox_ad").on('click', 'button[type="submit"]', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    var sendData = {
                        user_id: $('#form_id').val(),
                        sub_ch: []
                    };
                    $("#subscribed_tv option").each(function(){
                        sendData.sub_ch.push($(this).val())
                    });
                    ajaxPostSend($(this).closest('form').attr('action'), sendData);
                });
                {% endif %}
            });
        }
        document.addEventListener("DOMContentLoaded", yelp, false);

        var resetUsersParentPassword = function (obj) {
            $(obj).closest('.form-group').find('input').val($(obj).data('newpass'));
            JSSuccessModalBox(obj);
        };

        var resetUserFavTv = function (obj) {
            $(obj).closest('.form-group').find('input').val(0);
            JSSuccessModalBox(obj);
        };


        {% if app.userEdit and (not app['tariffPlanFlag'] or app['tariffPlanSubscriptionFlag']) %}
        
        var setSubscribedTVModal = function(data){
            if (data.not_subscribed_tv) {
                $("#not_subscribed_tv").empty();
                $.each(data.not_subscribed_tv, function(){
                    $("#not_subscribed_tv").append('<option value="'+this.id+'">'+this.name+'</option>');
                });
            }

            if (data.subscribed_tv) {
                $("#subscribed_tv").empty();
                $.each(data.subscribed_tv, function(){
                    $("#subscribed_tv").append('<option value="'+this.id+'">'+this.name+'</option>');
                });
            }

            $("#modalbox_ad").show();
        };

        var hideSubscribedTVModal = function(data){
            $("#modalbox_ad").hide();
            JSSuccessModalBox(data);
        };

        var hideSubscribedTVModalError = function(data){
            JSErrorModalBox(data);
        };

        {% endif %}
