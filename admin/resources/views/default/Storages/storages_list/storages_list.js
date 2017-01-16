
        var  select2OptPH = {
            minimumResultsForSearch: -1,
            dropdownAutoWidth: false,
            width: '100%',
            allowDuplicates: false,
            placeholder : {
                id: "-1",
                text: "",
                selected: 'selected'
            }
        };

        var conf = {
            form: '#karaoke_form',
            lang : '{{ app.js_validator_language }}',
            showHelpOnFocus : true,
            validateHiddenInputs: true,
            ignore: ['.ignore'],
            modules: 'jsconf',
            onSuccess: function () {
                var sendData = {};

                $("#modalbox_ad form").find('input, select').each(function () {
                    sendData[$(this).attr('name')] = $(this).is(':checkbox') ? ($(this).is(':checked') ? 1 : 0) : $(this).val();
                });
                hideAdModalBox();
                $("#modalbox").data('complete', 0);
                JSshowModalBox();
                ajaxPostSend($('#modalbox_ad form').attr('action'), sendData, false, false, true);
                return false;
            },
            onError: function () {
                return false;
            }
        };

        function DemoSelect2() {
            $('#file_stream_server_type').select2(select2OptPH);
        }

        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object') {
                    for (var i in json.data) {
                        var id = json.data[i].id;

                        json.data[i].operations = "<div class='col-xs-3 col-sm-8'>\n\
                                                        <a href='#' class='dropdown-toggle no_context_menu' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/toggle-storages-status' data-id='"+ id +"' data-status='"+ json.data[i].status +"'>\n\
                                                                    <span>" + (json.data[i].status == 1? "{{ 'Switch off'|trans }}": "{{ 'Switch on'|trans }}") + "</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/reset-cache' data-id='"+ id +"'>\n\
                                                                    <span>{{ 'Clean the cache'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/get-storage' data-id='"+ id +"'>\n\
                                                                    <span>{{ 'Edit'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/remove-storage' data-id='" + id + "'>\n\
                                                                    <span> {{ 'Delete'|trans }} </span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>\n\
                                                    </div>";
                        if (json.data[i].status == 1) {
                            json.data[i].status = '<span class="">{{ 'status on'|trans }}</span>';
                        } else {
                            json.data[i].status = '<span>{{ 'status off'|trans }}</span>';
                        }
                        json.data[i].storage_name = "<a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/get-storage' data-id='"+ id +"'><span>"+json.data[i].storage_name+"</span></a>";
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/storages-list-json"
                },
                "language": {
                    "url": "{{ app.datatable_lang_file }}"
                },
                {% if attribute(app, 'dropdownAttribute') is defined %}
                {{ main_macro.get_datatable_column(app['dropdownAttribute']) }}
                {% endif %}
                "bFilter": true,
                "bPaginate": true,
                "bInfo": true,
                "columnDefs": [
                    { className: "action-menu", "targets": [ -1 ] },
                    {"searchable": false, "targets": [-1, -2]},
                    {"sortable": false, "targets": [-1]}
                ]
            }).prev('.dataTables_processing').hide('');
        }

        function yelp() {
            $(document).ready(function () {
                $.validate(conf);

                LoadSelect2Script(DemoSelect2);

                $(document).on('change', '#file_stream_server_type', function(e){
                    var val = $(this, 'option[selected]').val() ? true: false;
                    $('#file_stream_server_port, #file_stream_server_app').prop('disabled', !val).closest('.form-group')[val? 'show': 'hide']('fast');
                });

                $(document).on('click', "a.main_ajax[disabled!='disabled']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox").data('complete', 0);
                    var sendData = $(this).data();
                    JSshowModalBox();
                    ajaxPostSend($(this).attr('href'), sendData, false, false, true);
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });
                
                        
                $(document).on('click', "#modalbox, #modalbox a.close-link, #modalbox a.close-link *", function(e){
                    if (e.currentTarget != e.target) {
                        return;
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    if ($("#modalbox").data('complete') && $("#modalbox").data('complete') == 1) {
                        JScloseModalBox();
                    } else {
                        for(i=0;i<3;i++) {
                            $('#modalbox > div').fadeTo('slow', 0.5).fadeTo('slow', 1.0);
                        }
                    }
                    return false;
                });
                        
                $(document).on('click', '#add_storage', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    showAdModalBox('{{ 'Add storage'|trans }}');
                    return false;
                });
                $("#Additional_information").hide('fast');
                $(":checkbox[name*='fake_tv_archive'], :checkbox[name*='_dvr']").closest('.form-group').hide();
                
                $(document).on('change', ":checkbox[name*='for_records']", function(e){
                    if ($(this).is(':checked')) {
                        $(":checkbox[name*='fake_tv_archive'], :checkbox[name*='_dvr']").closest('.form-group').show('fast').find('input').prop("disabled", false).removeAttr('disabled');
                    } else {
                        $(":checkbox[name*='fake_tv_archive'], :checkbox[name*='_dvr']").closest('.form-group').hide('fast').find('input').prop("disabled", 'disabled').attr('disabled', 'disabled');
                    }
                });

                $(document).on('change', ":checkbox[name*='_dvr']", function(){
                    if ($(this).is(":checked")) {
                        $(":checkbox[name*='_dvr']").not(this).prop('checked', false).removeAttr('checked');
                    }
                });

                $(document).on('submit', '#modalbox_ad form', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });
                $(document).off('click', '#modalbox_ad .save_storage button[type="submit"]');
                $(document).on('click', '#modalbox_ad .save_storage button[type="submit"]', function(e){
                    e.stopPropagation();
                    e.preventDefault();

                    if ($(conf.form).isValid({}, conf, true)) {
                        conf.onSuccess();
                    } else {
                        conf.onError();
                    }
                    return false;
                });
                LoadDataTablesScripts(TestTable1);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);

        function showAdModalBox(title){
            $("#modalbox_ad").find(".modal-header-name").children('span').text(title);
            $("#modalbox_ad").find("input, select").prop("disabled", false).removeAttr('disabled').val('').prop("checked", false).removeAttr('checked');
            $('#file_stream_server_type').trigger('change');
            $(":checkbox[name*='fake_tv_archive']").closest('.form-group').hide('fast');
            $.validate();
            $(conf.form).get(0).reset();
            $("#modalbox_ad").show();
        }
        
        function hideAdModalBox(reset){
            if (typeof(reset) != 'undefined' && reset) {
                $("#modalbox_ad").find(".modal-header-name").children('span').text(title);
                $("#modalbox_ad").find("input, select").prop("disabled", false).removeAttr('disabled');
                $.validate();
                $(conf.form).get(0).reset();
            }
            $("#modalbox_ad").hide();
        }

        var fillModalAd = function(data){
            if (typeof(data.storage) != 'undefined') {
                $("#modalbox").data('complete') == 1
                showAdModalBox('{{ 'Edit storage'|trans }}');
                $.validate();
                $(conf.form).get(0).reset();
                $("#modalbox_ad form").find('input, select').each(function(){
                    var name = $(this).attr('name').replace('form[', '').replace(']', '');
                    var val = typeof(data.storage[name]) != 'undefined' && data.storage[name] ? data.storage[name] : '';
                    if (this.tagName.toLocaleLowerCase() == 'input') {
                        $(this).val(data.storage[name]);
                        if($(this).is('[type=checkbox]')){
                            $(this).prop('checked', parseInt(data.storage[name], 10));
                        }
                    } else {
                        $(this).find('option[value="'+ val +'"]').prop('selected', 'selected');
                        $(this).trigger('change');
                    }
                });
                if ($(":checkbox[name*='for_records']").is(':checked')) {
                    $(":checkbox[name*='fake_tv_archive'], :checkbox[name*='_dvr']").closest('.form-group').show('fast').find('input').prop("disabled", false).removeAttr('disabled');
                } else {
                    $(":checkbox[name*='fake_tv_archive'], :checkbox[name*='_dvr']").closest('.form-group').hide('fast').find('input').prop("disabled", 'disabled').attr('disabled', 'disabled');
                }
            }
        }
