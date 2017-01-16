
        var select2Opt = {minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'};

        function DemoSelect2() {
            $('#s2_status').select2(select2Opt);

        }

        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object' && json.data.length >0) {
                    var date;
                    for (var i in json.data) {
                        var id = json.data[i].id;
                        var status = json.data[i].status;
                        json.data[i].status = (status == 1 ?"<span class='txt-success'>{{ 'Published'|trans }}</span>":"<span>{{ 'Unpublished'|trans }}</span>");
                        json.data[i].operations = "<div class='col-xs-3 col-sm-8'>\n\
                                                        <a href='#' class='dropdown-toggle no_context_menu' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/epg-list-json' data-id='" + id + "'>\n\
                                                                    <span>{{ 'Edit'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/toggle-epg-item-status' data-id='" + id + "' data-status='" + status + "'>\n\
                                                                    <span>" + (status == 1? '<span>{{ 'Unpublish'|trans }}</span>':'<span>{{ 'Publish'|trans }}</span>') + "</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/remove-epg-item' data-id='" + id + "'>\n\
                                                                    <span> {{ 'Delete'|trans }} </span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>\n\
                                                    </div>";
                        date = json.data[i]['updated'];
                        if (date > 0) {
                            date = new Date(date * 1000);
                            json.data[i]['updated'] = date.toLocaleFormat("%b %d, %Y %H:%M");
                        }
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/epg-list-json"
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
                    {className: "action-menu", "targets": [ -1 ] },
                    {"searchable": false, "targets": [-1, -2, -3]},
                    {"sortable": false, "targets": [-1]}
                ]
            }).prev('.dataTables_processing').hide('');
        }

        function yelp() {
            $(document).ready(function () {
                $(document).on('click', "a.main_ajax", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox").data('complete', 0);
                    var sendData = $(this).data();
                    ajaxPostSend($(this).attr('href'), sendData, false, false);
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });

                $("#form_reset").on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).closest('form').get(0).reset();
    {#                    $("#cmd_data").find("tr:visible").remove();#}
                    return false;
                });

                var conf = {
                    form: '#epg_form',
                    lang : '{{ app.js_validator_language }}',
                    showHelpOnFocus : true,
                    validateHiddenInputs: true,
                    ignore: ['.ignore'],
                    modules: 'jsconf',
                    onSuccess: function () {
                        var sendData = new Object();
                        var lengthObj = 0;
                        var arr = [];
                        $("#s2_lang_code option").each(function(){
                            arr.push($(this).val());
                        });
                        $("input[name='lang_code']").val(arr.join(','));
                        var form_fields = $("#modalbox_ad input.own_fields:not(:disabled), #s2_status");
                        form_fields.each(function () {
                            sendData[this.name] = $(this).val();
                            if ($(this).val() || !$(this).is("[required]")) {
                                lengthObj++;
                            }
                        });
                        if (lengthObj < form_fields.length) {
                            JSErrorModalBox({msg: '{{ 'Fill in the required fields'|trans }}'});
                            return false;
                        }
                        ajaxPostSend($("#modalbox_ad form").attr('action'), sendData, false, false);
                        return false;
                    },
                    onError: function () {
                        return false;
                    }
                };
                $.validate(conf);

                $("#modalbox_ad button[type='submit']").on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if ($("#epg_form").isValid({}, conf, true)) {
                        conf.onSuccess();
                    } else {
                        conf.onError();
                    }
                    return false;
                });

                $("#add_epg_item").on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    closeModalBox();
                    $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Add EPG'|trans }}');
                    $("#modalbox_ad .own_fields").prop("disabled", false).removeAttr('disabled').val('');
                    /*$("#modalbox_ad input[type='hidden']:not(.not_disabled)").attr('disabled', 'disabled').val('');*/
                    $("#form_id").attr('disabled', 'disabled').val('');
                    $('#s2_status').val($('#s2_status option:first').val());
                    $('button.remove.all').click();
                    $('#s2_lang_code_available option.old').removeClass('old').addClass('new');
                    $('#form_uri').next('div').removeClass('bg-danger').css('visibility', 'hidden').html('&nbsp;');
                    $('#form_id_prefix').next('div').removeClass('bg-danger').css('visibility', 'hidden').html('&nbsp;');
                    $('#epg_form').find('[type="submit"]').prop('disabled', false);
                    $("#modalbox_ad").show();
                    //        $(this).closest('.form-group').find('tbody tr:hidden').show();
                    return false;
                });

                $(document).on('change keyup', '#form_uri', function (e) {
                    var _this = $(this);
                    _this.next('div').removeClass('bg-danger').css('visibility', 'hidden').html('&nbsp;');
                    _this.closest('form').find('[type="submit"]').prop('disabled', false);

                    if (_this.val()) {
                        ajaxPostSend("{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/epg-check-uri", {param: _this.val(), epgid: $('#form_id').val()});
                    }
                });

                $(document).on('change keyup', '#form_id_prefix', function(e){
                    var _this = $(this);
                    _this.next('div').removeClass('bg-danger').css('visibility', 'hidden').html('&nbsp;');
                    _this.closest('form').find('[type="submit"]').prop('disabled', false);

                    if (_this.val()) {
                        ajaxPostSend("{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/epg-check-prefix", {epg_id: $("#form_id").val(), prefix: _this.val()});
                    }

                });

                $('button.add').click(resetAddOption);
                $(document).on('dblclick', '#s2_lang_code_available option', resetAddOption);

                LoadDataTablesScripts(TestTable1);
                LoadSelect2Script(DemoSelect2);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);

        var resetAddOption = function(){
            if ( $('#s2_lang_code option').length > 5) {
                JSErrorModalBox({msg: "{{ 'Max count of languages 5'|trans }}"});
                var lastOption;
                while($('#s2_lang_code option').length > 5){
                    lastOption = $('#s2_lang_code option:last-of-type');
                    $('#s2_lang_code_available').append(lastOption);
                    $('#s2_lang_code_available').sortBoxes();
                }
            }
        };

        var setEPGModal = function (data) {
            closeModalBox();
            $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Edit EPG'|trans }}');
            $('#form_id_prefix').next('div').removeClass('bg-danger').css('visibility', 'hidden').html('&nbsp;');
            $('#form_uri').next('div').removeClass('bg-danger').css('visibility', 'hidden').html('&nbsp;');
            $('#epg_form').find('[type="submit"]').prop('disabled', false);
            if (data.data.length == 1) {
                var row = data.data[0];
                for (var field_name in row) {
                    $("#modalbox_ad .own_fields[name='" + field_name + "']").val(row[field_name]);
                }
            }
            $("#modalbox_ad input").removeAttr('disabled');
            $('#s2_lang_code_available').append($('#s2_lang_code option'));
            $('#s2_lang_code').empty();
            $('#s2_lang_code_available').sortBoxes();
            if (data.data[0]['lang_code']) {

                $('#s2_lang_code_available option.old').removeClass('old').addClass('new');
                $(data.data[0]['lang_code'].split(',')).each(function (num, item) {
                    /*$('#s2_lang_code option[value="' + item + '"]');*/
                    $('#s2_lang_code').append($('#s2_lang_code_available option[value="' + item + '"]'));
                    $('#s2_lang_code_available option[value="' + item + '"]').remove();
                });
            }
            $('#s2_lang_code_available').sortBoxes();
            $("#modalbox_ad").show();
        };

        var manageEPG = function (obj) {
            $("#modalbox_ad").click();
            JSSuccessModalBox(obj);
            $('#datatable-1').DataTable().ajax.reload();
        };

        var manageEPGError = function (obj) {
            JSErrorModalBox(obj);
        };

        function closeModalBox(){
            JScloseModalBox();
        }

        var errAction = function(){
            JSErrorModalBox({msg: '<span>{{ 'Failed'|trans }}!</span>'});
        };
