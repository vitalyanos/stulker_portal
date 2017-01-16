
        function TestTable1() {
            $('#datatable-1').on('xhr.dt', function (e, settings, json) {
                if (typeof (json.data) == 'object' && json.data.length >0) {
                    var date;
                    for (var i in json.data) {
                        var uid = json.data[i].uid;
                        var mac = json.data[i].mac;
                        json.data[i].mac = '<a href="{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/edit-users?'+(mac.indexOf(':') > 0 ? 'mac' : 'id')+'='+mac+'" >'+mac+'</a>';
                        date = json.data[i]['time'];
                        if (date > 0) {
                            date = new Date(date * 1000);
                            json.data[i]['time'] = date.toLocaleFormat("%b %d, %Y %H:%M");
                        }
                    }
                }
            }).dataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "{{ app.request_context.baseUrl }}/{{ app.controller_alias }}/users-consoles-logs-json"
                },
                "language": {
                    "url": "{{ app.datatable_lang_file }}"
                },
                
                {% if attribute(app, 'dropdownAttribute') is defined %}
                {{ main_macro.get_datatable_column(app['dropdownAttribute']) }}
                {% endif %}

                "bFilter": true,
                "bPaginate": true,
				"columnDefs": [  {"searchable": false, "targets": [-2, -3]}   ],
                "bInfo": true
            }).prev('.dataTables_processing').hide('');
        }

        function yelp() {
            $(document).ready(function () {
                LoadDataTablesScripts(TestTable1);
            });
        }
        
        document.addEventListener("DOMContentLoaded", yelp, false);
