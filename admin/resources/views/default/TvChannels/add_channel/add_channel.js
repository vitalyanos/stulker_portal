
        var select2Opt = {minimumResultsForSearch: -1, dropdownAutoWidth: false, width: '100%'};

        var conf = {
            form: '#form_',
            formContainer: '#add_channel',
            lang : '{{ app.js_validator_language }}',
            showHelpOnFocus : true,
            validateHiddenInputs: true,
            ignore: ['.ignore'],
            modules: 'jsconf',
            onSuccess: function () {
                if (this.form == '#form_') {
                    $(this.form).get(0).submit();
                }
                return false;
            },
            onError: function () {
                $(this.formContainer).find('span.form-error, div.bg-danger').each(function(){
                    if ($.trim($(this).text()) && !$(this).is(":visible")) {
                        $(this).closest('div.box').find('a.collapse-link').trigger('click');
                    }
                });
                return false;
            }
        };

        var linkTypeFields = [
                {% if attribute(app, 'httpTmpLink') is defined and app['httpTmpLink'] %}
                {% for row in app['httpTmpLink'] %}
                '{{ row.value }}'{% if not loop.last %},{% endif %}
                {% endfor %}
                {% endif %}
            ];

        function DemoSelect2() {
            $('#form_tv_genre_id').select2(select2Opt);
            $('#form_volume_correction').select2(select2Opt);
            $('#s2_priority').select2(select2Opt);
            $('#s2_use_http_tmp_link').select2(select2Opt);
            $('#s2_stream_server').select2(select2Opt);
            $('#form_pvr_storage_names').select2(select2Opt);
            $('#form_storage_names').select2(select2Opt);
            $('#form_flussonic_storage_names').select2(select2Opt);
            $('#form_wowza_storage_names').select2(select2Opt);
            $('#form_nimble_storage_names').select2(select2Opt);
            $("#form_enable_tv_archive, #form_allow_pvr").each(function () {
                checkEnableChkBox($(this).attr('id'));
            });
        }

        function initFileUploader(){
            $('#fileupload').fileupload({
                url: 'tv-channels/edit-logo?id=' + ($(this).prev('div').children('input').val() ? $(this).prev('div').children('input').val() : 'new'),
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
                $(this).prev('div').children('img').attr('src', response.pic + '?' + $.random(100000)).css('max-width', '100%');
                var val = response.pic.split('/');
                val = val[val.length - 1];
                $(this).prev('div').children('input').val(val);
                var imageName = val.split('.');
                if (imageName.length > 1) {
                    imageName.length -= 1;
                }
                imageName = imageName.join('.');
                var postUrl = 'tv-channels/edit-logo?id=' + (typeof (imageName) != 'undefined' && imageName != '' ? imageName : 'new');
                $(this).fileupload('option', {url: postUrl});

                $("#deletelogolink a").data("logo_id", (imageName.search('new') != -1 ? val: imageName));

                return false;
            }).bind('fileuploadfail', function (e, data) {
                var errMSG = '';
                if (data && data.jqXHR && data.jqXHR.responseJSON) {
                    errMSG = data.jqXHR.responseJSON.msg ? data.jqXHR.responseJSON.msg : (data.jqXHR.responseJSON.error ? data.jqXHR.responseJSON.error: '');
                }
                JSErrorModalBox({msg: errMSG});
            });
            return true;
        }

        function yelp() {
            $(document).ready(function () {

                LoadSelect2Script(DemoSelect2);

                $("#form_enable_tv_archive, #form_allow_pvr").on('change', function () {
                    checkEnableChkBox($(this).attr('id'));
                });

                $("input[id$='_dvr']").on('change, click', function () {
                    var _this = $(this);
                    if (_this.is(':visible') && _this.is(':checked')) {
                        $("input[id$='_dvr']").filter("[id!='"+$(this).attr('id')+"']").prop("checked", false).removeAttr('checked');
                        toggleChkSelect(_this.attr('id'));
                    } else {
                        toggleChkSelect('form_enable_tv_archive');
                    }
                });

                $(document).on('click', '#fileupload input[type="file"]', function(e){
                    var imgItem = $(this).closest('.form-group').find('img');
                    if (imgItem.attr('src') && !confirm('{{ 'Do you really want to delete or replace this image?'|trans }}')) {
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }
                });

                if (typeof (loadFileUploadScripts) != 'function' || !loadFileUploadScripts(initFileUploader)){
                    JSErrorModalBox({msg: "{{ 'Cannot load File Upload plugin'|trans }}"})
                }

                $.validate(conf);
                $("#form_save").on('click', function (e) {

                    e.stopPropagation();
                    e.preventDefault();
                    var ignore = new Array();
                    if (!$("#form_enable_tv_archive").prop('checked')) {
                        ignore.push($("#form_tv_archive_duration").prop('name'));
                        if (!$("#form_allow_pvr").prop('checked')) {
                            ignore.push($("#form_mc_cmd").prop('name'));
                        }
                    }

                    if($("#form_correct_time").val().length == 0) {
                        $("#form_correct_time").val(0);
                    }

                    conf.ignore = ignore;
                    conf.form = '#form_';
                    conf.formContainer = '#add_channel';
                    if ($(conf.form).isValid({}, conf, true)) {
                        conf.onSuccess();
                    } else {
                        conf.onError();
                    }
                    return false;
                });
                $("#form_reset").on('click', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).closest('form').get(0).reset();
                    return false;
                });
                
                $("#add_channel > form> .row > .box:not(:first-of-type), #modalbox_ad > div > form>.devoops-modal-inner > .box:not(:first-of-type)").children('div.box-content').hide('fast');
                
                $("#modalbox_ad > .channel-form .box-header .box-name .toggle-switch, #add_channel_base #cmd_data .toggle-switch").off('click');
                $("#modalbox_ad > .channel-form .box-header .box-name .toggle-switch, #add_channel_base #cmd_data .toggle-switch").on('click', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                });

                $(document).on('click', "#add_channel #add_broadcasting_link", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var tmp_id = $('#cmd_data tr:last').attr('id');
                    if (!tmp_id) {
                        tmp_id = "tr_" + $.randString();
                        $('#cmd_data tr:last').attr('id', tmp_id);
                    }
                    $("#modalbox_ad").data('tr_id', tmp_id);

                    $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Add streaming link'|trans }}');
                    $("#modalbox_ad").find("input, select").prop("disabled", false).removeAttr('disabled');
                    $("#modalbox_ad").find('form').each(function(){
                        this.reset();
                    });
                    $("#s2_stream_server option").prop('selected', false).removeAttr('selected');
                    $("#s2_stream_server").prop('disabled', 'disabled');
                    $("#s2_stream_server").closest(".form-group").hide();
                    $("#s2_use_http_tmp_link").val('').trigger('change');
                    $("#add_channel_load_balancing input[type='checkbox'][name*='enable_balancer_monitoring']").prop('checked', false).closest(".form-group").hide();
                    $("#add_channel_link_monitoring input[type='checkbox'][name*='enable_monitoring']").prop('checked', false);
                    $("#add_channel_link_monitoring input[type='text'][name*='monitoring_url']").prop('disabled', 'disabled').closest(".form-group").hide();
                    $("#modalbox_ad").show();
                    return false;
                });

                $(document).on("click", "#cmd_data .channel_url_remove_data", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var parentTable = $(this).closest('tbody');
                    $(this).closest('tr').remove();
                    parentTable.find('tr:visible').each(function(i){
                        $(this).find('input').each(function(){
                            $(this).attr('name', $(this).attr('name').replace(/\d+?/ig, i+1));
                            $(this).attr('id', $(this).attr('id').replace(/\d+?/ig, i+1));
                        })
                    });

                    return false;
                });

                $(document).on("click", "#cmd_data .channel_url_change_data", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $("#modalbox_ad #add_channel_url_base input[name*='cmd']").closest('div').next('span.duplicate').remove();
                    var data = channelUrlDataGet($(this).closest('tr'));
                    var tmp_id = $(this).closest('tr').attr('id');
                    if (!tmp_id) {
                        tmp_id = "tr_" + $.randString();
                        $(this).closest('tr').attr('id', tmp_id);
                    }
                    $("#modalbox_ad").data('tr_id', tmp_id);
                    $("#modalbox_ad").find('input, select').each(function () {
                        var name = (typeof ($(this).attr('name')) != 'undefined') ? $(this).attr('name').replace(/\[\d*?\]/ig, '') : false;
                        if (typeof (data[name]) == 'undefined') {
                            return true;
                        }

                        $(this).prop("disabled", false).removeAttr("disabled");

                        var shortName = name.replace(/[^\[]*\[([^\]]*).*$/ig, '$1');
                        if ($("#s2_use_http_tmp_link").attr('name').search(shortName) != -1) {
                            $.each(linkTypeFields, function(i, linkVal){
                                var fieldName = 'form[' + linkVal + ']';
                                if (data[fieldName] && (('' + data[fieldName].value) == '1' || data[fieldName].value == 'on')) {
                                    $("#s2_use_http_tmp_link").val(linkVal).trigger('change');
                                }
                            });
                            return true;
                        }

                        var type = typeof ($(this).attr('type')) != 'undefined' ? $(this).attr('type') : $(this).get(0).tagName.toLowerCase();
                        if (type == 'select') {
                            var lSelect = $(this);
                            lSelect.find('option').prop('selected', false).removeAttr('selected');
                            $.each(data[name].value.split(';'), function (i, lValue) {
                                lSelect.find("option[value='" + lValue + "']").prop('selected', 'selected');
                            });
                            if (lSelect.attr('id').search('s2') != -1) {
                                lSelect.select2(select2Opt);
                            }
                        } else if (type == 'checkbox') {
                            $(this).prop('checked', (data[name].value == 'on' || data[name].value == '1'));
                        } else if (type == 'radio') {
                            if ($(this).val() == data[name].value) {
                                $(this).prop('checked', 'checked');
                            } else {
                                $(this).prop('checked', false).removeAttr('checked');
                            }
                        } else {
                            $(this).val(data[name].value);
                        }
                    });

                    if (!$("#add_channel_load_balancing input[type='checkbox'][name*='use_load_balancing']").is(':checked')) {
                        $("#s2_stream_server option").prop('selected', false).removeAttr('selected');
                        $("#s2_stream_server").prop('disabled', 'disabled');
                        $("#s2_stream_server").closest(".form-group").hide();
                        $("#add_channel_load_balancing input[type='checkbox'][name*='enable_balancer_monitoring']").prop('checked', false).closest(".form-group").hide();
                    } else {
                        $("#s2_stream_server").prop('disabled', false).removeAttr('disabled');
                        $('#s2_stream_server').select2(select2Opt);
                        $("#s2_stream_server").closest(".form-group").show();
                        $("#add_channel_load_balancing input[type='checkbox'][name*='enable_balancer_monitoring']").closest(".form-group").show();
                    }

                    if (!$("#add_channel_link_monitoring input[type='checkbox'][name*='enable_monitoring']").is(':checked')) {
                        $("#add_channel_link_monitoring input[type='text'][name*='monitoring_url']").prop('disabled', 'disabled').closest(".form-group").hide();
                    } else {
                        $("#add_channel_link_monitoring input[type='text'][name*='monitoring_url']").prop('disabled', false).closest(".form-group").show();
                    }

                    $("#modalbox_ad").find(".modal-header-name").children('span').text('{{ 'Edit streaming link'|trans }}');
                    $("#modalbox_ad").show();
                    $(this).closest('.open').removeClass('open');
                    return false;
                });

                $("#cover_container").on('click', 'a', function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    JSshowModalBox();
                    ajaxPostSend($(this).attr('href'), {logo_id: $(this).data('logo_id')});
                    return false;
                });

                $("#modalbox_ad").on('change', "input[name*='enable_balancer_monitoring']", function(e){
                    var enable_monitoring = $("#modalbox_ad input[name*='enable_monitoring']:checked");
                    if ( this.checked && (enable_monitoring.length == 0 || enable_monitoring.val() == 'off') ){
                        e.stopPropagation();
                        e.preventDefault();
                        $(this).prop('checked', false);
                        showModalBox();
                        return false;
                    }
                });

                $("#s2_use_http_tmp_link").on('select2:select', function(e){
                    if ($(this).find('option[value="' + $(this).val() + '"]').data('check-module') == '0' ) {
                        JSErrorModalBox({msg: "{{ 'For enabling this option you need enable mcrypt php-extension'|trans}}"});
                        $(this).val('').trigger('change');
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }
                });

                $("#add_channel .form-group").each(function(i){
                    var errorDiv = $(this).find('.bg-danger, .form-error');
                    if (errorDiv.length && !errorDiv.is(":visible") && $.trim(errorDiv.text()) != '') {
                        $(this).closest('div.box').find('a.collapse-link').trigger('click');
                    }
                });

                $("#add_channel_load_balancing").on("change", "input[type='checkbox'][name*='use_load_balancing']", function(e){
                    if (!$(this).is(':checked')) {
                        $("#s2_stream_server option").prop('selected', false).removeAttr('selected');
                        $("#s2_stream_server").prop('disabled', 'disabled');
                        $("#s2_stream_server").closest(".form-group").hide();
                        $("#add_channel_load_balancing input[type='checkbox'][name*='enable_balancer_monitoring']").prop('checked', false).closest(".form-group").hide();
                    } else {
                        $("#s2_stream_server").prop('disabled', false).removeAttr('disabled');
                        $('#s2_stream_server').select2(select2Opt);
                        $("#s2_stream_server").closest(".form-group").show();
                        $("#add_channel_load_balancing input[type='checkbox'][name*='enable_balancer_monitoring']").closest(".form-group").show();
                    }
                });

                $("#add_channel_link_monitoring").on('change',  "input[type='checkbox'][name*='enable_monitoring']", function(e){
                    if (!$(this).is(':checked')) {
                        $("#add_channel_link_monitoring input[type='text'][name*='monitoring_url']").prop('disabled', 'disabled').closest(".form-group").hide();
                    } else {
                        $("#add_channel_link_monitoring input[type='text'][name*='monitoring_url']").prop('disabled', false).closest(".form-group").show();
                    }
                });

                $(document).on('click submit', "#modalbox_ad .channel-form button[type='submit']", function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    if (typeof(conf) == 'object' && typeof(conf.form) != 'undefined') {
                        conf.form = '#add_channel_link_form';
                        conf.formContainer = '#modalbox_ad';
                        $(conf.form).prop('novalidate', 0).removeAttr('novalidate');
                        if ($(conf.form).isValid({}, conf, true)) {
                            conf.onSuccess();
                            $(conf.form).prop('novalidate', 1);
                        } else {
                            conf.onError();
                            return false;
                        }
                    }

                    var tmp_id = $("#modalbox_ad").data('tr_id');
                    var dataObj = {};

                    var currentCMD = $("#modalbox_ad #add_channel_url_base input[name*='cmd']");
                    var currentCMDVal = $(currentCMD).val();
                    currentCMDVal = currentCMDVal.replace(/\s/ig, '');
                    var duplicate = false;

                    $('#cmd_data tr:visible td:first-of-type input[name*="cmd"]').each(function(){
                        var existsCMDVal = $(this).val();
                        existsCMDVal = existsCMDVal.replace(/\s/ig, '');
                        var currID = $(this).closest('tr').attr('id') || false;
                        if (existsCMDVal == currentCMDVal &&  currID != tmp_id) {
                            duplicate = true;
                            return false;
                        }
                    });

                    if (duplicate) {
                        currentCMD.closest('div').after('<span class="help-inline col-xs-12 col-sm-12 duplicate"><span class="txt-danger">' + words['CMD_Exists'] + "</span></span>");
                        $("#modalbox_ad").scrollTo(0);
                        currentCMD.focus();
                        return false;
                    } else {
                        currentCMD.closest('div').next('span.duplicate').remove();
                    }

                    $('#modalbox_ad').find('input, select').each(function () {
                        var name = (typeof ($(this).attr('name')) != 'undefined') ? $(this).attr('name').replace(/\[\d*?\]/ig, '') : false;
                        if (!name) {
                            return true;
                        }
                        var type = typeof ($(this).attr('type')) != 'undefined' ? $(this).attr('type') : $(this).get(0).tagName.toLowerCase();
                        var value = $(this).val() || '';
                        if (value instanceof Array) {
                            value = value.join(';');
                        }
                        if (type == 'checkbox') {
                            dataObj[name] = {'value': ($(this).prop('checked') ? 'on' : 'off'), 'type': type};
                        } else if (type == 'radio') {
                            if ($(this).prop('checked')) {
                                dataObj[name] = {'value': $(this).val(), 'type': type};
                            }
                        } else if (type == 'select' && $(this).attr('multiple')) {
                            dataObj[name] = {'value': value, 'type': type};
                        } else {
                            dataObj[name] = {'value': value, 'type': type};
                        }
                    });
                    channelUrlDataUpdate("#" + tmp_id, dataObj);
                    $("#modalbox_ad").find("input, select").prop("disabled", "disabled");
                    $("#modalbox_ad").find("form").each(function () {
                        this.reset();
                    });
                    $("#modalbox_ad").hide();
                    return false;
                });

            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);

        function channelUrlDataGet(container){
            var dataObj = {};
            $(container).find('input').each(function(){
                var name = $(this).attr('name').replace(/\[\d*?\]/ig, '');
                var value = $(this).val();
                var type = $(this).attr('type');
                if (type != 'checkbox') {
                    dataObj[name] = {'value': value, 'type': type};
                } else {
                    dataObj[name] = {'value': ($(this).prop('checked') ? 'on': 'off'), 'type': type};
                }
            });
            return dataObj;
        }

        function channelUrlDataUpdate(container, data){
            if ($(container).css('display') == 'none'){
                var clonContainer = $(container).clone(true, true);
                clonContainer.removeAttr('id');
                $(clonContainer).insertAfter(container);
                $(container).css("display", "table-row");
                var countRow = $(container).parent().find($(container).get(0).tagName+":visible").length;
                $(container).find('input').each(function(){
                    $(this).attr('name', $(this).attr('name').replace(/\d+?/ig, countRow));
                    $(this).attr('id', $(this).attr('id').replace(/\d+?/ig, countRow));
                });
            }
            $(container).find('input').each(function(){
                $(this).prop("disabled", false).removeAttr("disabled");
                var name = $(this).attr('name').replace(/\[\d*?\]/ig, '');
                var type = $(this).attr('type');

                var shortName = name.replace(/[^\[]*\[([^\]]*).*$/ig, '$1');
                if (linkTypeFields.indexOf(shortName) != -1) {
                    if (type == 'checkbox') {
                        $(this).prop('checked', $("#s2_use_http_tmp_link").val() == shortName);
                    } else {
                        $(this).val($("#s2_use_http_tmp_link").val() == shortName ? 'on': 'off');
                    }
                    return true;
                } else if (typeof (data[name]) == 'undefined') {
                    return true;
                }
                if (type == 'checkbox') {
                    if ($(this).attr('name').search('enable_monitoring') != -1) {
                        var targetLabel = $(this).closest('td').next('td').find('label');
                        if (targetLabel.text() != '-' && $(this).prop('checked') != (data[name].value == 'on')) {
                            targetLabel.text('-');
                            targetLabel.removeClass();
                        }
                    }
                    $(this).prop('checked', (data[name].value == 'on'));
                } else {
                    $(this).val(data[name].value);
                }
                var label = $(this).prev("label[data-field='"+name+"']");
                if (label) {
                    label.text(data[name].value);
                }
            });

            $(container).find('input[name*="use_http_tmp_link"]').prop('checked', $("#s2_use_http_tmp_link").val() ? true: false);

        }

        function toggleChkSelect(objId){
            var relations = {
                'form_enable_tv_archive': 'form_storage_names',
                'form_wowza_dvr': 'form_wowza_storage_names',
                'form_flussonic_dvr': 'form_flussonic_storage_names',
                'form_nimble_dvr': 'form_nimble_storage_names'
            };
            $.each(relations, function(key, val){
                var currObj = $("#" + val);
                if (key !== objId) {
                    currObj.next('span').hide();
                    currObj.prop("disabled", 'disabled').attr('disabled', "disabled");
                } else {
                    currObj.next('span').show();
                    currObj.select2(select2Opt);
                    currObj.prop("disabled", false).removeAttr('disabled');
                }
            });
        }

        function checkEnableChkBox(chkBoxId){
            var _this = $("#" + chkBoxId);
            var parent = _this.closest('div.form-group');
            if (_this.prop("checked")) {
                parent.next().show().find('input select').prop("disabled", false).removeAttr('disabled');
            } else {
                parent.next().hide().find('input select').prop("disabled", "disabled").attr('disabled', "disabled");
            }
            if (_this.attr('id') == 'form_enable_tv_archive') {
                if (_this.prop("checked")) {
                    $("div[id$='_dvr']").show('fast').find('input').prop("disabled", false).removeAttr('disabled');
                    var checkID = $("input[id$='_dvr']").filter(':checked').attr('id');
                    toggleChkSelect(checkID ? checkID: 'form_enable_tv_archive');
                } else {
                    $("div[id$='_dvr']").hide('fast').find('input').prop("disabled", 'disabled').attr('disabled', 'disabled').prop("checked", false).removeAttr('checked');
                    toggleChkSelect('');
                }
            }
        }

        var closeModalBox = function(){
            $("#modalbox").hide();
            $('#modalbox').find('.modal-header-name span').empty();
            $('#modalbox').find('.devoops-modal-inner').empty();
            $('#modalbox').find('.devoops-modal-bottom').empty();
        };

        function showModalBox(){
            $('#modalbox').find('.modal-header-name span').text('{{ 'Pay attention.'|trans }}');
            $('#modalbox').find('.devoops-modal-inner').html('<span>{{ 'For activating this option, you must enable "Enable monitoring" in the "Monitoring" section'|trans }}</span>');
            $("#modalbox").show();
        }

        var deleteLogo = function(data){
            $('#form_logo').val('');
            $('#cover_container img').attr('src', '');
            JSSuccessModalBox(data);
        };

        var deleteLogoError = function(data){
            JSErrorModalBox(data);
        };
