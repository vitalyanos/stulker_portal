
        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object' && json.data.length >0) {
                    var date;
                    for (var i in json.data) {
                        date = json.data[i]['added'];
                        if (date > 0) {
                            date = new Date(date * 1000);
                            json.data[i]['added'] = date.toLocaleFormat("%b %d, %Y %H:%M");
                        }
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/storages-logs-json"
                },
                "language": {
                    "url": "{{ app.datatable_lang_file }}"
                },
                {% if attribute(app, 'dropdownAttribute') is defined %}
                {{ main_macro.get_datatable_column(app['dropdownAttribute']) }}
                {% endif %}
                "bFilter": true,
                "bPaginate": true,
				"columnDefs": [{"searchable": false, "targets": [0]}],
                "bInfo": true,
                "order": [[ 0, "desc" ]]
            });
        }

        function yelp() {
            $(document).ready(function () {                               
                LoadDataTablesScripts(TestTable1);
            });
        }

        document.addEventListener("DOMContentLoaded", yelp, false);
              
        var manageLogsList = function (obj) {
            $('#datatable-1').DataTable().ajax.reload();
        };
        
        var logsListMsg = function(data){
            manageZoneList(data);
        }
