
/*
 this component has templates in .twig file
*/

        var datepickerBaseOpt = {
            numberOfMonths: 1,
            firstDay    : 1,
            language: '{% if attribute(app, 'locale') is defined and app['locale']|length == 2 %}{{ app['locale'] }}{% else %}en{% endif %}',
            dateFormat  : 'dd-mm-yy',
            dayNamesMin : [
                '{{ 'Sun'|trans }}',
                '{{ 'Mon'|trans }}',
                '{{ 'Tue'|trans }}',
                '{{ 'Wed'|trans }}',
                '{{ 'Thu'|trans }}',
                '{{ 'Fri'|trans }}',
                '{{ 'Sat'|trans }}'
            ],
            monthNames  : [
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
            ],
            onClose: function (selectedDate) {
                var dateParam, inputNeighbor;
                if ($(this).attr('id').slice(-3) == '_to') {
                    dateParam = "maxDate";
                    inputNeighbor = $(this).prev('input');
                } else {
                    dateParam = "minDate";
                    inputNeighbor = $(this).next('input');
                }
                if (inputNeighbor && inputNeighbor.length) {
                    inputNeighbor.datepicker("option", dateParam, selectedDate);
                }
            }
        };

        var mediaTypeName = [
            {% for key, val in app.mediaTypeName %}
            '{{ val }}'{% if not loop.last %},{% endif %}
            {% endfor %}
        ];

        var select2Opt = {minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'};

        function DemoSelect2() {
            $("[id^='s2_']").select2(select2Opt);
            $("[id^='filter_s2_']").select2(select2Opt);
        }

        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object' && json.data.length >0) {
                    var date;
                    for (var i in json.data) {
                        var id = json.data[i].id;
                        {% if attribute(app, 'reseller') is defined and not app['reseller'] %}
                        var reseller_id = json.data[i].reseller_id;
                        var reseller_name = json.data[i].reseller_name;
                        {% endif %}
                        var status = json.data[i].status;
                        var state = json.data[i].state;
                        var expire_billing_date = json.data[i].expire_billing_date;
                        var mac = json.data[i].mac;

                        json.data[i].now_playing_type = (typeof (mediaTypeName[json.data[i].now_playing_type]) != 'undefined' ? mediaTypeName[json.data[i].now_playing_type]: '--');
                        json.data[i].operations = "<div class='col-xs-3 col-sm-8'>\n\
                                                        <a href='#' class='dropdown-toggle no_context_menu' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>\n\
                                                            <li>\n\
                                                                <a href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/edit-users?id=" + id + "'>\n\
                                                                    <span>{{ 'Edit'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/users-consoles-logs?mac=" + mac + "'>\n\
                                                                    <span>{{ 'Details'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/send-message' data-userid='" + id + "'>\n\
                                                                    <span>{{ 'Send message'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/toggle-user' data-userid='" + id + "' data-userstatus='" + status + "'>\n\
                                                                    <span>" + (status == 0 ? "{{ 'Turn off'|trans }}" : "{{ 'Turn on'|trans }}") + "</span>\n\
                                                                </a>\n\
                                                            </li>";
                                                            {% if attribute(app, 'reseller') is defined and not app['reseller'] %}
                        json.data[i].operations +=          "<li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/move-user-to-reseller' data-id='" + id + "' data-reseller_id='" + reseller_id + "'>\n\
                                                                    <span>{{ 'Change reseller for current user'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>";
                                                            {% endif %}
                                                            {% if attribute(app, 'enableBilling') is defined and app.enableBilling %}
                        json.data[i].operations +=          "<li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/set-expire-billing-date' data-userid='" + id + "' data-setaction='set'>\n\
                                                                    <span>{{ 'Set expires billing date'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>";
                                                            if (expire_billing_date > 0) {
                        json.data[i].operations +=          "<li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/set-expire-billing-date' data-userid='" + id + "' data-setaction='unset'>\n\
                                                                    <span>{{ 'Unset expires billing date'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>";
                                                            }
                                                            {% endif %}
                        json.data[i].operations +=          "<li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/remove-user' data-userid='" + id + "'>\n\
                                                                    <span>{{ 'Delete'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>\n\
                                                    </div>";
                        var last_active = new Date(json.data[i].last_active * 1000);
                        json.data[i].state = state != 0 ? "<span class=''>Online</span>" : "<span class=''>Offline</span><br><span>{{ 'Last activity'|trans }}: " + (json.data[i].last_active != 0? last_active.toLocaleFormat("%b %d, %Y %H:%M"): "-") + "</span>";
                        json.data[i].status = "<span class=''>" + (status == 0 ? "{{ 'on'|trans }}" : "{{ 'off'|trans }}") + "</span>";

                        if (json.data[i].country) {
                            json.data[i].ip = "<span class='countries-flag-container'><span class='pull-left'>" + json.data[i].ip + "</span>&nbsp;<span class='flag-wrapper pull-right'><span class='img-thumbnail flag flag-icon-background flag-icon-"+json.data[i].country+"'>&nbsp;</span></span></span>";
                        }

                        if (json.data[i].ip_link) {
                            json.data[i].ip = "<a href='"+ json.data[i].ip_link +"' target='_blanc'>" + json.data[i].ip +"</a>";
                        }

                        date = json.data[i]['last_change_status'];
                        if (date > 0) {
                            date = new Date(date * 1000);
                            json.data[i]['last_change_status'] = date.toLocaleFormat("%b %d, %Y");
                        } else {
                            json.data[i]['last_change_status'] = ''/*'00-00-0000'*/;
                        }
                        {% if attribute(app, 'enableBilling') is defined and app.enableBilling %}
                        date = json.data[i]['expire_billing_date'];
                        if (date > 0) {
                            date = new Date(date * 1000);
                            json.data[i]['expire_billing_date'] = date.toLocaleFormat("%b %d, %Y");
                        } else {
                            json.data[i]['expire_billing_date'] = '{{ 'Unlimited'|trans }}';
                        }
                        {% endif %}
                        date = json.data[i]['created'];
                        if (date > 0) {
                            date = new Date(date * 1000);
                            json.data[i]['created'] = date.toLocaleFormat("%b %d, %Y");
                        } else {
                            json.data[i]['created'] = '---';
                        }

                        json.data[i].mac = '<a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/edit-users?id='+ id +'" >'+ mac +'</a>';
                        {% if attribute(app, 'reseller') is defined and not app['reseller'] %}
                        json.data[i].reseller_name = '<a class="main_ajax no_context_menu" href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/move-user-to-reseller" data-id="' + id + '" data-reseller_id="' + reseller_id + '">'+ reseller_name +'</a>';
                        {% endif %}
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "pageLength": 50,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/users-list-json",
                    "data": function (d) {
                        d = dataTableDataPrepare(d);

                        $("div[data-tvfilter]").each(function(){
                            var inputs, s2_filter;
                            if ((inputs = $(this).find('input.datepicker')).length) {
                                d['filters[' + $.trim($(this).data('tvfilter')) + ']'] = inputs.map(function(){return this.value}).get().join('|');
                            } else if((s2_filter = $(this).find('select[id^="filter_s2_"]')).length){
                                d['filters[' + $.trim($(this).data('tvfilter')) + ']'] = s2_filter.find('option:selected').map(function(){return this.value}).get().join('|');
                            } else {
                                d['filters[' + $.trim($(this).data('tvfilter')) + ']'] = $.trim($(this).data('filterval')) || '';
                            }
                        });
                    }
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
                "aoColumnDefs": [
                    { className: "action-menu", "targets": [ -1 ] },
                    {"searchable": false, "targets": [5, 6, 8, 9, 10, 11, {% if attribute(app, 'reseller') is defined and not app['reseller'] %}12, {% endif %}-1]},
                    {"sortable": false, "targets": [-1]},
                    {className: "data-filter-status", "targets": [-{% if attribute(app, 'reseller') is defined and not app['reseller'] %}3{% else %}2{% endif %}{% if attribute(app, 'enableBilling') is defined and app.enableBilling %}-1{% endif %} ]}
                ]
            }).prev('.dataTables_processing').hide('');
        }

        function yelp() {
            $(document).ready(function () {

                $('#filter_param').css({left: "10px", top: "2px"});
                $('#filter_param').parent().css({minHeight: '42px'});
                switch ($("#s2_event").val()) {
                        {% if attribute(app, 'defTTL') is defined %}
                        {% for key, val in app['defTTL'] %}
                        {% if key != 'other' %}
                    case '{{ key }}': { $("#ttl").val("{{ val }}"); break; }
                        {% endif %}
                        {% endfor %}
                    default : { $("#ttl").val("{{ app['defTTL']['other'] }}"); break; }
                        {% endif %}
                }

                $(document).on('click', "a.main_ajax", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var _this = $(this);

                    if (_this.attr('href').search("send-message") != -1 || _this.attr('href').search("set-expire-billing-date") != -1  || _this.attr('href').search("move-user-to-reseller") != -1) {
                        return false;
                    }

                    ajaxPostSend($(this).attr('href'), $(this).data(), false, false);
                    _this.closest('div.open').removeClass('open');
                    return false;
                });
                
                $("[data-list-type], [data-event-type]").hide().find('input, select, textarea').attr('disabled', 'disabled');
                $(document).on('change', "#s2_user_list_type, #s2_event", function (e) {
                    checkFields($(this), e);
                    switch ($("#s2_event").val()) {
                            {% if attribute(app, 'defTTL') is defined %}
                            {% for key, val in app['defTTL'] %}
                            {% if key != 'other' %}
                        case '{{ key }}': { $("#ttl").val("{{ val }}"); break; }
                            {% endif %}
                            {% endfor %}
                        default : { $("#ttl").val("{{ app['defTTL']['other'] }}"); break; }
                            {% endif %}
                    }
                });

                $(document).on('change', "#s2_msg_pattern", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $('#msg_textarea').text($.trim($('#msg_textarea_pattern_'+$(this).val()).text()));
                    $('#msg_header').val($(this).find('option:selected').data('template-header'));
                    return false;
                });

                $(document).on('click', 'a[href*="send-message"]', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var mac = $($(this).closest('tr').children('td').get(0)).text();
                    var macField = $("input[name='mac']");
                    macField.val('').next('div').removeAttr('class').text('');
                    var regExp = /([0-9a-fA-F]{2}([:]|$)){6}$/ig;
                    if ($.trim(mac) != '' && regExp.test(mac)) {
                        macField.val(mac).attr('readonly', 'readonly');
                    } else {
                        macField.removeAttr('readonly').next('div').append('<i class="txt-danger fa fa-ban"></i> {{ 'Enter MAC-address according to the format'|trans }}').css('visibility', 'visible');
                    }
                    $("#modalbox_ad").show().find('input, select, textarea').removeAttr('disabled');
                    checkFields('#s2_user_list_type', e);
                    checkFields('#s2_event', e);
                    $(this).closest("div.open").removeClass('open');
                    return false;
                });
                {% if attribute(app, 'enableBilling') is defined and app.enableBilling %}
                $(document).on('click', 'a[href*="set-expire-billing-date"]', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var _this = $(this);
                    if (_this.data('setaction') == 'set') {
                        setExpireDateModal(_this);
                    } else {
                        ajaxPostSend(_this.attr('href'), _this.data());
                    }
                    return false;
                });

                $(document).on('hide', '#modalbox', function(e){
                    $("div[id*='datepicker']").removeClass('dp_white');
                    $('#modalbox .devoops-modal').removeAttr('style');
                });
                {% endif %}
                {% if attribute(app, 'reseller') is defined and not app['reseller'] %}
                $(document).on('click', "a[href*='move-user-to-reseller']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox").data('complete', 1);
                    $('#modalbox').find('.modal-header-name span').text("{{ 'Resellers'|trans }}");
                    var reseller_id = $(this).data('reseller_id');
                    $('#modalbox').find('.devoops-modal-inner').html($("#move_user_to_reseller_template").html());
                    $('#modalbox input[name="id"]').val($(this).data('id'));
                    $('#modalbox input[name="source_id"]').val(reseller_id);
                    $('#target_reseller option').removeAttr('selected');
                    $('#target_reseller option[value="'+ reseller_id +'"]').attr('selected', 'selected');

                    $('#modalbox').find('.devoops-modal-bottom').html($("#modal_form_button_template").html());
                    $('#modalbox button[type="submit"]').text("{{ 'Move'|trans }}");

                    $("#target_reseller").select2(select2Opt);

                    $("#modalbox").show();
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });
                {% endif %}

                $(document).on('click', "#modalbox button[type='submit']", function (e) {
                    var _this = $(this);

                    e.stopPropagation();
                    e.preventDefault();
                    var sendData = new Object();
                    var form_fields = _this.closest("#modalbox").find('form').find(".own_fields:not(:disabled)");
                    form_fields.each(function () {
                        if ($(this).val()) {
                            if (this.type.toUpperCase() != 'CHECKBOX' || this.checked) {
                                sendData[this.name] = $(this).val();
                            }
                        }
                    });
                    var action = _this.closest("#modalbox").find('form').attr('action');
                    ajaxPostSend(action, sendData, false, false);
                    return false;

                });

                $(document).on('click', "#modalbox_ad button[type='submit']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var formData = $("#modalbox_ad form").serialize();
                    ajaxPostSend("{{app.request_context.baseUrl}}/events/add-event", formData);
                    return false;
                });

                $(document).on('change', "#filter_param li:not(:first-child) input[type='checkbox']", function (e) {
                    if (this.checked) {
                        ajaxPostSend("{{app.request_context.baseUrl}}/{{app.controller_alias}}/get-filter", {text_id: $(this).val()});
                    } else {
                        $('div[data-tvfilter="' + $(this).val() + '"]').remove();
                    }
                });

                $(document).on('click', 'div[data-tvfilter] ul a, div[data-tvfilter] .dropdown-menu button', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var filter_str = (this.tagName == "A") ? $(this).data('filter'): $(this).closest('.dropdown-menu').find('input').map(function(){return this.value}).get().join('|');
                    $(this).closest('[data-filterval]').data('filterval', filter_str);
                    $(this).closest('[data-filterval]').find('a.dropdown-toggle span:nth-child(2)').text((this.tagName == "A") ? $(this).text() : $(this).closest('.dropdown-menu').find('input').map(function(){return this.value}).get().join(' - '));
                    $(this).closest('.open').removeClass('open');
                    return false;
                });

                $(document).on('change', 'select[id^="filter_s2_"]', function (e) {
                    if ($(this).find('option:selected').length == 0) {
                        $($(this).find('option').get(0)).prop('selected', 'selected');
                        $(this).select2(select2Opt);
                    }
                    var filter_val = $(this).find('option:selected').map(function(){return this.value}).get().join('|');
                    var filter_str = $(this).find('option:selected').map(function(){return $(this).text()}).get().join('|');
                    $(this).closest('[data-filterval]').data('filterval', filter_val);
                    $(this).closest('[data-filterval]').find('a.dropdown-toggle span:nth-child(2)').text(filter_str);
                });

                $('.datepicker[id^="filter_string"]').datepicker($.extend(datepickerBaseOpt, {minDate: null}));

                $(document).on("click", "#apply_filter_button", function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    $('div[data-tvfilter] button.filter_string').trigger("click");
                    $('#datatable-1').DataTable().ajax.reload();
                    return false;
                });

                $(document).on("click", "#form_filter_button", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $('#modalbox').find('.modal-header-name span').text("{{ 'Save filter'|trans }}");
                    var filter_set = {
                        id: {% if attribute(app, 'filter_set') is defined %}{{ app.filter_set.id }}{% else %}$(this).data('filter_set_id') || 0{% endif %},
                        admin_id : {% if attribute(app, 'user_id') is defined %}{{ app.user_id }}{% else %}0{% endif %},
                        title: "{% if attribute(app, 'filter_set') is defined %}{{ app.filter_set.title }}{% endif %}",
                        for_all: {% if attribute(app, 'filter_set') is defined and app.filter_set.for_all %}true{% else %}false{% endif %},
                        description: "{% if attribute(app, 'filter_set') is defined %}{{ app.filter_set.description }}{% endif %}",
                        filter_set: {}
                    };

                    $("div[data-tvfilter]").each(function(){
                        var inputs, s2_filter;
                        if ((inputs = $(this).find('input.datepicker')).length) {
                            filter_set.filter_set[$.trim($(this).data('tvfilter'))] = inputs.map(function(){return this.value}).get().join('|');
                        } else if((s2_filter = $(this).find('select[id^="filter_s2_"]')).length){
                            filter_set.filter_set[$.trim($(this).data('tvfilter'))] = s2_filter.find('option:selected').map(function(){return this.value}).get().join('|');
                        } else {
                            filter_set.filter_set[$.trim($(this).data('tvfilter'))] = $.trim($(this).data('filterval')) || '';
                        }
                    });

                    filter_set.filter_set = encodeURIComponent(JSON.stringify(filter_set.filter_set));

                    $('#modalbox').find('.devoops-modal-inner').html($("#save_filter_template").html());
                    $('#modalbox input[name="filter_set[id]"]').val(filter_set.id);
                    $('#modalbox input[name="filter_set[admin_id]"]').val(filter_set.admin_id);
                    $('#modalbox input[name="filter_set[filter_set]"]').val(filter_set.filter_set);
                    $('#modalbox input[name="filter_set[title]"]').val(filter_set.title);
                    $('#modalbox input[name="filter_set[for_all]"]').prop('checked', filter_set.for_all);
                    $('#modalbox textarea').text(filter_set.description);

                    $('#modalbox').find('.devoops-modal-bottom').html($("#modal_form_button_template").html());
                    $('#modalbox button[type="submit"]').text("{{ 'Save'|trans }}");

                    $('#modalbox').show();
                    return false;
                });

                $(document).on('hide', "#add_post_function_container", function(e){
                    $("[data-event-type^='post_function']").hide().find('select, input').attr('disabled', 'disabled');
                });

                $(document).on('change show', "#add_post_function, #add_post_function_container", function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    if ($("#add_post_function").is(':checked')) {
                        $("#post_function_type").show().find('select').removeAttr('disabled');
                    } else {
                        $("#post_function_type").hide().find('select').attr('disabled', 'disabled');
                        $("[data-event-type^='post_function']").hide().find('select, input').attr('disabled', 'disabled');
                    }
                    return false;
                });

                $(document).on('change show', "#s2_post_function, #post_function_type", function(e){
                    $("[data-event-type^='post_function']").filter("[data-event-type!='post_function_type']").hide().find('select, input').attr('disabled', 'disabled');
                    $("#" + $("#s2_post_function").val()).show().find('select, input').removeAttr('disabled');
                });

                $(document).off('click', 'div[data-tvfilter] a.dropdown-toggle i.fa-times-circle');
                $(document).on('click', 'div[data-tvfilter] a.dropdown-toggle i.fa-times-circle', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    var parentDiv = $(this).closest('div[data-tvfilter]');
                    $("#filter_param li[data-filter='" + parentDiv.data('tvfilter') + "'] input").prop("checked", false);
                    parentDiv.remove();
                    return false;
                });

                $(document).on('click', "span.select2-selection__choice__remove", function(e){
                    e.stopPropagation();
                });

                $('input.autocomplete').each(function(){
                    $(this).autocomplete(autoCompleteInit($(this)));
                });

                $(document).on('click', 'div[data-tvfilter] a:first-child', function(e){
                    if ($(this).closest('div').hasClass('open')){
                        $(this).closest('div').find("input:first-of-type").trigger("focus").trigger("click");
                    }
                });

                $("#modalbox").on("click", "button[type='reset']", function(){
                    $("#modalbox form").get(0).reset();
                    JScloseModalBox();
                });

                LoadDataTablesScripts(TestTable1);
                LoadSelect2Script(DemoSelect2);
            });

        }

        document.addEventListener("DOMContentLoaded", yelp, false);

        var removeUser = function (obj) {
            if (typeof(obj.add_button) != 'undefined') {
                if (obj.add_button) {
                    $("#add_button").show();
                    $("#limit_message").hide();
                } else {
                    $("#add_button").hide();
                    $("#limit_message").show();
                }
            }
            deleteTableRow({obj: obj});
        };
        
        function checkFields(obj, e) {
            var dataName = $(obj).attr('id') == 's2_user_list_type' ? 'data-list-type' : 'data-event-type';
            $("[" + dataName + "]").hide().find('input, select, textarea').attr('disabled', 'disabled');
            $(obj).find('option:selected').each(function () {
                var searchVal = $(this).val();
                var dataNameIn = dataName.replace('data-', '').replace('-', ' ').camelCase();
                $('[' + dataName + '*="' + searchVal + '"]').each(function() {
                    if ($(this).data(dataNameIn) && $(this).data(dataNameIn).split(";").indexOf(searchVal) !== -1) {
                        $(this).show().find('input, select, textarea').removeAttr('disabled');
                    }
                });
            });
            return false;
        }

        {% if attribute(app, 'enableBilling') is defined and app.enableBilling %}
        function setExpireDateModal(obj){
            $('#modalbox .modal-header-name span').text('{{ 'Expire billing date'|trans }}');
            $('#modalbox .devoops-modal-inner').html($("#expire_date_template").html());
            $('#modalbox input[name="userid"]').val(obj.data('userid'));
            $('#modalbox .devoops-modal-bottom').html($("#modal_form_button_template").html());
            $('#modalbox button[type="reset"]').removeClass('pull-right').addClass('pull-left').parent('div').removeClass('pull-right').removeClass('no-padding');
            $('#modalbox button[type="submit"]').text("{{ 'Set date'|trans }}");

            $('#modalbox .devoops-modal').width(400);
            $("#expire_date_datepicker").datepicker($.extend(datepickerBaseOpt, {minDate: new Date(), onClose: null}));
            $("div[id*='datepicker']").addClass('dp_white');
            $(obj).closest('div.open').removeClass('open');
            $('#modalbox').show();
        }
        {% endif %}

        var addFilter = function(data){
            var last_filter_block = $('#filter_block div[data-tvfilter]:last');

            var filtervalStr = '<div class="br '+(data.filter.values_set && data.filter.values_set.length > 0 ? "filter_s": "filter") +'" data-tvfilter="'+ data.filter.text_id +'" data-filterval="'+(data.filter.type == 'DATETIME' ? '|':'')+ '">';

            if (last_filter_block.length) {
                last_filter_block.after(filtervalStr);
            } else {
                $("#filter_block").append(filtervalStr);
            }
            if (data.filter.values_set && data.filter.values_set.length > 0) {
                createFilterList(data.filter);
            } else if (data.filter.type == 'STRING'){
                createFilterText(data.filter)
            } else if (data.filter.type == 'DATETIME'){
                createFilterDate(data.filter)
            }
            $("#filter_param").removeClass('open');
            $('div[data-tvfilter="'+ data.filter.text_id +'"]').addClass('open').find("input:first-of-type").trigger("focus").trigger("click");
        };

        var saveFilterData = function(data){
            if (data.return_id) {
                $("#form_filter_button").data('filter_set_id', data.return_id);
            }
            JSSuccessModalBox(data);
        };

        var saveFilterDataError = function(data){
            JSErrorModalBox(data);
        };

        var addFilterError = function(data){
            JSErrorModalBox(data);
            if (typeof(data) != 'undefined' && typeof(data.filter) != 'undefined' && typeof(data.filter.text_id) != 'undefined' ) {
                $("li[data-filter='" + data.filter.text_id + "'] input[type='checkbox']").prop('disabled', 'disabled').attr('checked', false);
            }
        };

        function createFilterList(filter_data){
            var filter_bloc = $('div[data-tvfilter="'+ filter_data.text_id +'"]');
            filter_bloc.append('<a data-toggle="dropdown" class="dropdown-toggle" href="#"><span class="no-padding">' + filter_data.title + ':</span><span>' + '{{ 'All'|trans }}' + '</span><i class="fa fa-caret-down"></i><i class="fa fa-times-circle"></i></a>')
                    .append('<div class="dropdown-menu">');
            filter_bloc.find("div.dropdown-menu").append('<select class="populate placeholder" name="'+ filter_data.text_id +'" id="filter_s2_'+ filter_data.text_id +'" data-postponed="1" multiple>');
            var list = filter_bloc.find('select');
            list.append('<option value="0" >' + '{{ 'All'|trans }}' + '</option>');
            for (var i in filter_data.values_set) {
                list.append('<option value="' + filter_data.values_set[i].value + '">' + filter_data.values_set[i].title + '</option>');
            }

            if ($("#filter_s2_"+ filter_data.text_id).find('option:selected').length == 0) {
                $($("#filter_s2_"+ filter_data.text_id).find('option').get(0)).prop('selected', 'selected');
            }

            $("#filter_s2_"+ filter_data.text_id).select2(select2Opt);
        }

        function createFilterText(filter_data){
            var filter_bloc = $('div[data-tvfilter="'+ filter_data.text_id +'"]');
            filter_bloc.append('<a data-toggle="dropdown" class="dropdown-toggle" href="#"><span class="no-padding">' + filter_data.title + ':</span><span></span><i class="fa fa-caret-down"></i><i class="fa fa-times-circle"></i></a>');
            filter_bloc.append('<div class="dropdown-menu">' +
            '<input type="text" class="filter_string autocomplete" value="" id="filter_string_'+ filter_data.text_id +'" name="'+ filter_data.text_id +'">' +
            '<button type="button" class="btn btn-success filter_string"  data-postponed="1"><i class="fa fa-check"></i></button>' +
            '</div>');
            var _this = $( '#filter_string_'+ filter_data.text_id );
            _this.autocomplete(autoCompleteInit(_this));
        }

        function createFilterDate(filter_data){
            var filter_bloc = $('div[data-tvfilter="'+ filter_data.text_id +'"]');
            filter_bloc.append('<a data-toggle="dropdown" class="dropdown-toggle" href="#"><span class="no-padding">' + filter_data.title + ':</span><span></span><i class="fa fa-caret-down"></i><i class="fa fa-times-circle"></a>');
            filter_bloc.append('<div class="dropdown-menu">' +
            '<input type="text" class="datepicker filter_string" data-date-format="dd-mm-yy" name="'+ filter_data.text_id +'[from]" id="filter_string_'+ filter_data.text_id +'_from" value="">' +
            '<input type="text" class="datepicker filter_string" data-date-format="dd-mm-yy" name="'+ filter_data.text_id +'[to]" id="filter_string_'+ filter_data.text_id +'_to" value="">' +
            '<button type="button" class="btn btn-success filter_string" data-postponed="1"></i><i class="fa fa-check"></button>' +
            '</div>');
            $('[id^="filter_string_'+ filter_data.text_id + '"]').datepicker($.extend(datepickerBaseOpt, {minDate: null}));
        }

        function autoCompleteInit(targetObj) {
            return {
                source: "{{app.request_context.baseUrl}}/{{app.controller_alias}}/get-autocomplete-" + targetObj.prop('name').replace("_", "-"),
                minLength: 3,
                messages:{
                    noResults: "{{ 'No search results'|trans }}"
                },
                close: function( event, ui ) {
                    targetObj.closest('[data-filterval]').data('filterval', targetObj.val());
                    targetObj.closest('[data-filterval]').find('a.dropdown-toggle span:nth-child(2)').text(targetObj.val());
                }
            }
        }
