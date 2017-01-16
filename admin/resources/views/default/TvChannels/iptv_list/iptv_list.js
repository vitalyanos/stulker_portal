

var select2Opt = {minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'};

function DemoSelect2() {
    $('#s2_channel').select2(select2Opt);
}

function TestTable1() {
    $('#datatable-1').on('xhr.dt', function (e, settings, json) {
        if (typeof (json.data) == 'object') {
            for (var i in json.data) {
                var status = json.data[i].status;
                var claimsCount = json.data[i].sound_counter + json.data[i].video_counter + json.data[i].no_epg + json.data[i].wrong_epg;
                json.data[i].logo = '<img class="img-rounded channel-logo" src="' + ( json.data[i].logo ? json.data[i].logo + "?" + $.random(100000) : '') + '" alt="">';
                json.data[i].name = '<a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/edit-channel?id=' + json.data[i].id + '">' + json.data[i].name + '</a>';
                json.data[i].enable_tv_archive = ( json.data[i].enable_tv_archive ? "{{ 'Yes'|trans }}" : "{{ 'No'|trans }}");
                json.data[i].status = ( json.data[i].status ? "{{ 'Published'|trans }}" : "{{ 'Unpublished'|trans }}");

                if (claimsCount) {
                    json.data[i].claims = [json.data[i].video_counter, json.data[i].sound_counter, json.data[i].no_epg, json.data[i].wrong_epg].join('/');
                } else {
                    json.data[i].claims = "///";
                }
                json.data[i].operations = '<div class="col-xs-3 col-sm-8 ddd">\n\
                                                <a href="#" class="dropdown-toggle" data-toggle="dropdown">\n\
                                                    <i class="pull-right fa fa-cog"></i>\n\
                                                </a>\n\
                                                <ul class="dropdown-menu pull-right">\n\
                                                    <li>\n\
                                                        <a class="" href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/edit-channel?id=' + json.data[i].id  + '">\n\
                                                            <span>{{ 'Edit'|trans }}</span>\n\
                                                        </a>\n\
                                                    </li>\n\
                                                    <li>\n\
                                                        <a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/move-channel">\n\
                                                            <span>{{ 'Move'|trans }}</span>\n\
                                                        </a>\n\
                                                    </li>\n\
                                                    <li>\n\
                                                        <a class="main_ajax no_context_menu" href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/remove-channel" data-id="' + json.data[i].id  + '">\n\
                                                            <span>{{ 'Delete'|trans }}</span>\n\
                                                        </a>\n\
                                                    </li>\n\
                                                    <li>\n\
                                                        <a class="main_ajax no_context_menu" href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/' + (status ? 'disable' : 'enable') + '-channel" data-id="' + json.data[i].id  + '">\n\
                                                            <span>' + (status ? "{{ 'Unpublish'|trans }}" : "{{ 'Publish'|trans }}") + '</span>\n\
                                                        </a>\n\
                                                    </li>\n\
                                                    <li>\n\
                                                        <a class="main_ajax no_context_menu" ' + (claimsCount ? '': 'disabled="disabled"') + ' href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/itv-reset-claims" data-media_id="' + json.data[i].id  + '" data-media_type="' + json.data[i].media_type  + '">\n\
                                                            <span>{{ 'Reset media-claims'|trans }}</span>\n\
                                                        </a>\n\
                                                    </li>\n\
                                                    <li>\n\
                                                        <a class="main_ajax no_context_menu" href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/get-channel-epg-item" data-id="' + json.data[i].id  + '">\n\
                                                            <span>{{ 'Manage EPG'|trans }}</span>\n\
                                                        </a>\n\
                                                    </li>\n\
                                                </ul>\n\
                                            </div>';

            }
        }
    }).dataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/iptv-list-json"
        },
        "language": {
            "url": "{{ app.datatable_lang_file }}"
        },
        "bFilter": true,
        "bPaginate": true,
        "bInfo":     true,

        //from macro
        "columns": [
        {% for key, item in app['dropdownAttribute'] %}
            {% if 'all' != item.name %}
            {"data": "{{ item.name }}" {% if not(item.checked) %}, visible: false, className: 'none'{% endif %}}{% if not loop.last %},{% endif %}
            {% endif %}
        {% endfor %}
        ],

        "aoColumnDefs": [ 
            { "targets": [ -1 ], "sortable": false},
            { "searchable": false, "targets": [ 2, 4, 5, 8, 9, 10, 11] },
            { "sortable": false, "targets": [8, 11] },
            { className: "action-menu", "targets": [ -1 ] }
        ]
    }).prev('.dataTables_processing').hide('');
}

function yelp() {
    $(document).ready(function () {

        LoadDataTablesScripts(TestTable1);
        LoadSelect2Script(DemoSelect2);

        $(".datepicker").datepicker({
            language    : '{% if attribute(app, 'locale') is defined and app['locale']|length == 2 %}{{ app['locale'] }}{% else %}en{% endif %}',
            dateFormat  : 'dd-mm-yy',
            firstDay    : 1,
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
            ]
        });

        $(document).on('click', "a.main_ajax", function (e) {
            e.stopPropagation();
            e.preventDefault();
            ajaxPostSend($(this).attr('href'), $(this).data());
            $(this).closest('div.open').removeClass('open');
            return false;
        });

        $(document).on('change', "#s2_channel", function(e){
            ajaxPostSend("{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/get-channel-epg-item?id=" + $(this).val(), {});
        });

        $(document).on('click', "#get_epg_button", function(e){
            e.stopPropagation();
            e.preventDefault();
            if ($("#s2_channel").val()) {
                ajaxPostSend("{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/get-channel-epg-item?id=" + $("#s2_channel").val(), {epg_date : $("#epg_date").val()});
            } else {
                JSErrorModalBox({msg: "{{ 'Channel not selected'|trans }}"})
            }
        });

        $("#modalbox_ad").on('click', "button[type='submit']", function(e){
            var sendData = {id:0, epg_data:'', epg_body: ''};
            sendData.id = $("#s2_channel").val();
            sendData.epg_date = $("#epg_date").val();
            sendData.epg_body = $("#epg_body").val();
            JSshowModalBox();
            ajaxPostSend($('#epg_form').attr('action'), sendData);
        });

        $(document).on('click', '#restart_archives_button', function(e){
            e.stopPropagation();
            e.preventDefault();
            JSshowModalBox();
            ajaxPostSend($(this).attr('href'), {});
            return false;
        });

        $("#datatable-1").on('click', "a[href$='itv-reset-claims']", function(e){
            e.stopPropagation();
            e.preventDefault();
            if ($(this).attr("disabled")) {
                JSErrorModalBox({msg: "{{ 'This action is unavailable'|trans }}"})
            } else {
                $(this).closest('.open').removeClass("open");
                $("#modalbox").data('complete', 1);
                $('#modalbox').find('.devoops-modal-header').html("\n\
                            <div class='row'>\n\
                                <div class='col-xs-10 col-sm-10'>\n\
                                    <span class='text-default'>{{ 'Reset claims counter?'|trans }}</span>\n\
                                </div>\n\
                            </div>");
                $('#modalbox').find('.devoops-modal-inner').html("\n\
                            <div class='row'>\n\
                                <div class='col-xs-10 col-sm-10'>\n\
                                    <span>{{ 'Do you really want to reset claims counter?'|trans }}</span>\n\
                                </div>\n\
                            </div>");
                $('#modalbox').find('.devoops-modal-bottom').html("\n\
                            <div class='col-xs-10 col-sm-6 pull-right'>\n\
                                <button type='submit' id='reset_claims_counter' class='btn btn-success col-sm-5 pull-right'>{{ 'Reset'|trans }}</button>\n\
                                <button type='reset' class='btn btn-default col-sm-5 pull-left' >{{ 'Cancel'|trans }}</button>\n\
                            </div>");
                $("#reset_claims_counter").data($(this).data());
                $('#modalbox').show();
            }
            return false;
        });

        $(document).on('click', '#reset_claims_counter', function(e){
            $('#modalbox').hide();

            ajaxPostSend("{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/itv-reset-claims", { media_id: $(this).data("media_id"), media_type: $(this).data("media_type")}, false, false);
        });
    });
}

document.addEventListener("DOMContentLoaded", yelp, false);

function showModalBox(data){
    fillEPGForm(data);
    $("#modalbox_ad").show();
}

function fillEPGForm(data){
    $('#s2_channel option[value="'+data.ch_id+'"]').prop('selected', 'selected');
    $('#s2_channel').select2(select2Opt);
    $("#epg_date").removeAttr('disabled').datepicker( "setDate", data.epg_date);
    $("#epg_body").val(data.epg_body);
}

var saveEPGSuccess = function(){
    JSSuccessModalBox();
};

var saveEPGSuccessError = function(){
    JSErrorModalBox();
};

var restartArchive = function(data){
    $("#modalbox").data('complete', 1);
    $('#modalbox').find('.devoops-modal-inner').html('<span>{{ 'Done'|trans }}! ' + (data.msg ? data.msg : '') +  '</span>');
};

var restartArchiveError = function(data){
    $('#modalbox').find('.devoops-modal-inner').html('<span>{{ 'Error'|trans }}! ' + (data.error? data.error: '') +  '</span>');
    $("#modalbox").data('complete', 1);
};

var manageChannelTable = function(obj){
    JSSuccessModalBox(obj);
    $('#datatable-1').DataTable().ajax.reload();
}
