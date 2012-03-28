/**
 * Current weather widget.
 * Displayed in the main menu.
 */

(function(){
    
    var curweather = {
        
        dom_obj : {},
        
        init : function(){
            
            this.dom_obj = create_block_element('curweather_block', main_menu.dom_obj);
        },
        
        set : function(weather){
            _debug('curweather.set', weather);
            this.current = weather;
            
            if (main_menu){
                this.render();
            }
        },
        
        render : function(){
            _debug('curweather.render');

            if (!this.current){
                this.dom_obj.innerHTML = '<div class="curweather_descr"><span class="curweather_title">' + word['current_weather_unavailable'] + '</span></div>';

                var self = this;

                if (!this.dom_obj.isHidden()){
                    window.setTimeout(function(){
                        self.dom_obj.hide();
                    }, 60000);
                }

                return;
            }

            if (this.dom_obj.isHidden()){
                this.dom_obj.show();
            }
            
            var cur = '<div class="curweather_img"><img src="i' + resolution_prefix + '/' + this.current.pict + '"/></div>';
            cur += '<div class="city">' + this.current.city + '</div>';
            cur += '<div class="curweather_descr">' + this.current.t +'&deg; C<br>';
            cur += this.current.cloud_str + '<br>';
            cur += '<span class="curweather_title">' + word['weather_comfort'] + ':</span> ' + this.current.t_flik +'&deg; C<br>';
            cur += '<span class="curweather_title">' + word['weather_pressure'] + ':</span> ' + this.current.p + ' ' + word['weather_mmhg'] +'<br>';
            cur += '<div class="curweather_title" style="float: left">' + word['weather_wind'] + ':</div><div class="wind_direction_'+this.current.w_rumb_str+'">&uarr;</div> <div style="float: left;"> ' + this.current.w + ' ' + word['weather_speed'] + '</div><br>';
            cur += '<span class="curweather_title">' + word['weather_humidity'] + ':</span> '+ this.current.h + '%<br>';
            cur += '</div>';
            
            this.dom_obj.innerHTML = cur;
        }
        
    };
    
    curweather.init();
    
    module.curweather = curweather;
    
    loader.next();
    
})();