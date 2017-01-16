
        var select2Opt = {/*minimumResultsForSearch: -1, minimumInputLength: 0,*/ dropdownAutoWidth: false, width: '100%'};

        var conf = {
            lang : '{{ app.js_validator_language }}',
            showHelpOnFocus : true,
            validateHiddenInputs: true,
            modules: 'jsconf',
            onSuccess: function () {
                if (this.form == '#track_form') {
                    var sendData = {};
                    $("#modalbox_ad input, #modalbox_ad select").each(function () {
                        sendData[this.name] = $(this).val();
                    });
                    sendData['album_id'] = {{ app['audioAlbumID'] }};
                    ajaxPostSend($("#modalbox_ad form").attr('action'), sendData, false, false);
                } else {
                    $("#form_").get(0).submit();
                }
                return false;
            },
            onError: function () {
                var _this = this;
                $(_this.form + " select").each(function(){
                    if ($(this).hasClass('error')) {
                        _this.highlight(this, _this.errorClass);
                    } else {
                        _this.unhighlight(this, _this.errorClass);
                    }
                });
                return false;
            },
            onkeyup: false,
            errorClass: "myErrorClass",

            errorPlacement: function (error, element) {
                var elem = $(element);
                error.insertAfter(element);
            },

            highlight: function (element, errorClass, validClass) {
                var elem = $(element);
                if (elem.hasClass("select2-offscreen")) {
                    $("#s2id_" + elem.attr("id") + " ul").addClass(errorClass);
                } else {
                    elem.addClass(errorClass);
                }
            },

            unhighlight: function (element, errorClass, validClass) {
                var elem = $(element);
                if (elem.hasClass("select2-offscreen")) {
                    $("#s2id_" + elem.attr("id") + " ul").removeClass(errorClass);
                    $("#s2id_" + elem.attr("id") + " a").removeClass(errorClass);
                } else {
                    elem.removeClass(errorClass).removeAttr('style');
                }
            }
        };

        function DemoSelect2() {

            $('#form_performer_id').select2(select2Opt);
            $('#form_year_id').select2(select2Opt);
            $('#form_country_id').select2(select2Opt);
            $('#form_genre_ids').select2({minimumResultsForSearch: -1, maximumSelectionSize: 4, dropdownAutoWidth: false, width: '100%'});
            $('#s2_track_lang').select2(select2Opt);

        }

        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object') {
                    for (var i in json.data) {
                        var id = json.data[i].id;
                        var status = json.data[i].status;
                        json.data[i].operations = "<div class='col-xs-3 col-sm-8'>\n\
                                                        <a href='#' class='dropdown-toggle no_context_menu' data-toggle='dropdown'>\n\
                                                            <i class='pull-right fa fa-cog'></i>\n\
                                                        </a>\n\
                                                        <ul class='dropdown-menu pull-right'>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/audio-albums-composition-list-json' data-trackid='" + id + "'>\n\
                                                                    <span>{{ 'Edit'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/toggle-audio-album-track' data-trackid='" + id + "' data-trackstatus='" + status + "'>\n\
                                                                    <span>" + (status != 0 ? "{{ 'Unpublish'|trans }}" : "{{ 'Publish'|trans }}") + "</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                            <li>\n\
                                                                <a class='main_ajax no_context_menu' href='{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/remove-audio-album-track' data-trackid='" + id + "'>\n\
                                                                    <span>{{ 'Delete'|trans }}</span>\n\
                                                                </a>\n\
                                                            </li>\n\
                                                        </ul>\n\
                                                    </div>";
                        json.data[i].status = status != 0 ? "<span class='txt-success'>{{ 'Published'|trans }}</span>" : "<span class='txt-danger'>{{ 'Unpublished'|trans }}</span>";

                        var name = json.data[i].name;

                        json.data[i].name = '<a class="main_ajax no_context_menu" href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/audio-albums-composition-list-json" data-trackid="' + id + '" >' + name + '</a>';
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/audio-albums-composition-list-json",
                    "data": function (d) {
                        d['album_id'] = $("#datatable-1").data("album_id");
                    }
                },
                "language": {
                    "url": "{{ app.datatable_lang_file }}"
                },
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                    nRow.setAttribute('id', aData.RowOrder);  //Initialize row id for every row
                },
                
                {% if attribute(app, 'dropdownAttribute') is defined %}
                {{ main_macro.get_datatable_column(app['dropdownAttribute']) }}
                {% endif %}
				
                "lengthMenu": [-1],
                "bFilter": true,
                "bPaginate": false,
                "bInfo": true,
                "ordering": false,
                "columnDefs": [
                    { className: "action-menu", "targets": [ -1 ] },
                    {"searchable": false, "targets": [-1, -2]},
                    {"sortable": false, "targets": [-1]},
                    {className: "data-filter-status", "targets": [-2]}
                ]
            }).rowReordering({
                iIndexColumn: 0,
                sURL: "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/audio-track-reorder"
            }).prev('.dataTables_processing').hide('');
        }

        function initFileUploader(){
            $('#fileupload').fileupload({
                url: '{{ app.controller_alias }}/edit-audio-cover?cover=' + ($('#form_cover').val() ? $('#form_cover').val() : 'new'),
                type: 'POST',
                autoUpload: true,
                multipart: true,
                acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
                maxFileSize: 1000000,
                maxNumberOfFiles: 1
            }).bind('fileuploaddone', function (e, data) {
                var response;
                if (data && data.jqXHR && data.jqXHR.status && data.jqXHR.status == 200 && data.jqXHR.responseJSON) {
                    response = data.jqXHR.responseJSON;
                } else {
                    JSErrorModalBox();
                    return false;
                }
                var newSrc = "{{app.workHost}}" + response.path + '/' + response.name + '?ver=' + $.random(100000);
                $('#cover_container img').attr('src', newSrc).css('max-width', '100%');
                $('#form_cover').val(response.name);

                $('#cover_container a').data('file_name', (typeof (response.name) != 'undefined' && response.name != '' ? response.name : 'new'));

                var postUrl = '{{ app.controller_alias }}/edit-audio-cover?cover=' + (typeof (response.name) != 'undefined' && response.name != '' ? response.name : 'new');
                $(this).fileupload('option', {url: postUrl});
                return false;

            });
            return true;
        }

        function yelp() {

            $(document).ready(function () {

                $(document).on("select2-opening", function (arg) {
                    var elem = $(arg.target);

                    if ($("#s2id_" + elem.attr("id") + " a").hasClass("myErrorClass")) {
                        //jquery checks if the class exists before adding.
                        $(".select2-drop a").addClass("myErrorClass");
                    } else {
                        $(".select2-drop a").removeClass("myErrorClass");
                    }
                });

                $.validate(conf);

                if (typeof (loadFileUploadScripts) != 'function' || !loadFileUploadScripts(initFileUploader)){
                    JSErrorModalBox({msg: "{{ 'Cannot load File Upload plugin'|trans }}"})
                }


                $("#form_reset").on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).closest('form').get(0).reset();
                    return false;
                });

                $("#add_track").on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Add track'|trans }}');
                    $("#modalbox_ad input").prop("disabled", false).removeAttr('disabled').val('');
                    $("#modalbox_ad select").prop("disabled", false).removeAttr('disabled').find('option').removeAttr('selected');
                    $('#s2_track_lang').select2(select2Opt);
                    conf.form = '#track_form';
                    $("#track_form").validate();
                    $("#track_form").find('input, select').each(function(){
                        conf.unhighlight(this, conf.errorClass);
                    });
                    $("#modalbox_ad").show();

                    return false;
                });

                $(document).on('click', "a.main_ajax", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var sendData = $(this).data();
                    sendData['album_id'] = {{ app['audioAlbumID'] }};
                    ajaxPostSend($(this).attr('href'), sendData, false, false);
                    $(this).closest('div.open').removeClass('open');
                    return false;
                });

                $("#modalbox_ad button[type='submit']").on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    conf.form = '#track_form';

                    if ($("#track_form").isValid({}, conf, true)) {
                        conf.onSuccess();
                    } else {
                        conf.onError();
                    }
                    return false;
                });

                $("#form_save").on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var tracksId = [];
                    $("#datatable-1 tr:has(td)").each(function () {
                        if (typeof($(this).attr('id')) != "undefined") {
                            tracksId.push($(this).attr('id').replace(/[^\d]/ig, ''));
                        }
                    });

                    $("#form_").append("<input type='hidden' name='album_tracks' value='" + JSON.stringify(tracksId) + "'>");
                    conf.form = '#form_';

                    if ($("#form_").isValid({}, conf, true)) {
                        conf.onSuccess();
                    } else {
                        conf.onError();
                    }
                    return false;
                });

                $("#cover_container").on('click', 'a', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    JSshowModalBox();
                    ajaxPostSend($(this).attr('href'), $(this).data());
                    return false;
                });

                $("#modalbox_ad").on('blur keypress', '#audio_url', function(e){
                    if (e && e.type && (e.type == "blur" || e.type == 'focusout' || (e.type == "keypress" && e.keyCode && e.keyCode == 13))) {

                        conf.form = '#' + $("#modalbox_ad form").attr('id');

                        if ($(conf.form).isValid({}, conf, true)) {
                            getMediaInfo();
                        } else {
                            conf.onError();
                            return false;
                        }
                    }
                });

                $("#modalbox_ad").on('click', '#media_info button', function(e){
                    e.stopPropagation();
                    e.preventDefault();

                    var fieldData = [{}];

                    $("#media_info span").each(function(){
                        if ($(this).data('info-key')) {
                            fieldData[0][$(this).data('info-key')] = $(this).data('info-val');
                        }
                    });

                    setCompositionModal({data: fieldData}, true);
                });

                $(document).on('hide', '#modalbox_ad', function(){
                    cleanMediaInfo();
                });

                LoadSelect2Script(DemoSelect2);
                LoadDataTablesScripts(TestTable1);
		
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);

        var setCompositionModal = function (data, localFilling) {
            $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Edit track'|trans }}');
            if (data.data.length == 1 ) {
                var row = data.data[0];
                for (var field_name in row) {
                    $("#modalbox_ad input[name='" + field_name + "']").val(row[field_name]);
                }
                $("#modalbox_ad select[name='language_id'] option").each(function () {
                    $(this).prop('selected', $(this).val().toString() == data.data[0]['language_id'].toString());
                });
            }
            $("#modalbox_ad input").removeAttr('disabled');
            $('#s2_track_lang').select2(select2Opt);
            conf.form = '#track_form';
            $("#track_form").validate();
            $("#track_form").find('input, select').each(function(){
                conf.unhighlight(this, conf.errorClass);
            });

            $("#modalbox_ad").show();
            if (!localFilling) {
                getMediaInfo();
            }
        };

        var setCompositionModalError = function (data) {
            JSErrorModalBox(data);
        };

        var audioTracksManage = function () {
            JScloseModalBox();
            $('#datatable-1').DataTable().ajax.reload();
        };

        var deleteCover = function(data){
            $('#form_cover').val('');
            $('#cover_container a').data('file_name', '');
            $('#cover_container img').attr('src', '');
            JSSuccessModalBox(data);
        };

        var deleteCoverError = function(data){
            JSErrorModalBox(data);
        };

        var getMediaInfo = function() {
            var sendData = {};
            $("#file_form_input_container").find("input,select").each(function(i){
                var val = this.tagName.toUpperCase() == 'INPUT' ? $(this).val(): $(this).find('option:selected').val();
                if (val) {
                    sendData[$(this).attr('name')] = val;
                }
            });
            $("#file_form_input_container").find('input,select').prop('readonly', 'readonly').prop('disabled', 'disabled');
            $("#modalbox_ad div.devoops-modal-bottom").find('button').addClass('disabled').prop('disabled', 'disabled');
            if (!$("#media_info").length) {
                $("#file_form_input_container").removeClass('col-sm-offset-2').after($("#media_info_body").html()).delay(1000).promise().done(function(){
                    $("#media_info").css({opacity: 1, width: '29%'});
                });
            } else {
                cleanMediaInfo();
            }

            ajaxPostSend("{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/get-media-info-json", sendData, false, false, true);

        };

        var cleanMediaInfo = function(){
            $("#file_form_input_container").find('input,select').prop('readonly', false).prop('disabled', false).removeAttr('readonly').removeAttr('disabled');
            $("#modalbox_ad div.devoops-modal-bottom").find('button').removeClass('disabled').prop('disabled', false).removeAttr('disabled');
            $("#media_info").removeClass('filled').find('button').addClass('disabled').prop('disabled', 'disabled');
            $("#media_info").children().not('button').remove();
        };

        var setMediaInfo = function(data){
            cleanMediaInfo();
            if (data.id && $('#file_id').length == 0) {
                $("#video_id").before("<input type='hidden' class='own_fields form-control' name='id' id='file_id' value='' readonly='readonly'>");
            }
            if($('#file_id').length && (!$('#file_id').val() || $('#file_id').val() == '0')) {
                $('#file_id').val(data.id ? data.id: 0);
            }
            if (data.data) {
                $("#media_info").addClass('filled').find('button').removeClass('disabled').prop('disabled', false).removeAttr('disabled');
                var infoField = $($("#media_info_info").html()).prependTo("#media_info");
                if (!data.error){
                    infoField.addClass('bg-default').addClass('txt-default').text("{{ 'Media info from source'|trans }}");
                }
                if (data.data.datatable) {
                    $("#" + data.data.datatable).DataTable().ajax.reload();
                    delete data.data.datatable;
                }
                for(var key in data.data){
                    var infoField = $($("#media_info_info").html()).insertAfter(infoField);
                    var textVal = data.data[key];
                    var textLabel = words && words[key] ? words[key]: key;
                    if (key == 'languages') {
                        textVal = [];
                        $.each(data.data[key], function(){
                            textVal.push($("#file_" + key + " option[value='" + this + "']").text());
                        });
                        textVal = textVal.join(', ');
                    } else if (key == 'quality') {
                        textVal = $("#file_" + key + " option[value='" + textVal + "']").text();
                    }
                    infoField.addClass('bg-default').addClass('txt-default').text(textLabel + ": " + textVal);
                    infoField.data({'info-key': key, 'info-val': data.data[key] instanceof Array? data.data[key].join(','): data.data[key]});
                }
            }
        };

        var setMediaInfoError = function(data) {
            setMediaInfo(data);
            $("#media_info").addClass('filled');
            var infoField = $($("#media_info_info").html()).prependTo("#media_info");
            infoField.addClass('bg-warning').addClass('txt-danger').text("{{ 'No media info'|trans }}");
            var addMessage = data.msg || data.error;
            if (addMessage) {
                var infoField2 = $($("#media_info_info").html()).insertAfter(infoField);
                infoField2.addClass('bg-warning').addClass('txt-danger').text(addMessage);
            }
        };

/*
{# this templates moved to .twig file and left for demonstrate purpose only 

    <script type="text/template" id="media_info_body">
        <div class="col-sm-4" id="media_info">
            <button class="btn btn-success btn-block disabled" disabled="disabled">{{ 'Autofill'|trans }}</button>
        </div>
    </script>

    <script type="text/template" id="media_info_info">
        <span class="col-sm-12 center" data-info-key="" data-info-val=""></span>
    </script>

#}*/
