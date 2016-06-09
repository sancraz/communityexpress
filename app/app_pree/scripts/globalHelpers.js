/*global define*/

'use strict';

var helpers = function() {

    return {

        startLogger: function(){
            $(document).on({
                ajaxError: this.logApiError,
                ajaxSuccess: this.logApiSuccess
            });
        },

        logApiSuccess: function(e, xhr, ajax){
            console.debug('========== API SUCCESS ==========\n');
            console.log( ajax.type + ' ' + ajax.url );
            try {
                console.log( JSON.parse( xhr.responseText ) );
            } catch (e) {}
            console.debug('=================================');
        },

        logApiError: function(event, jqXHR, textStatus, errorThrown) {
            var excp;
            switch (jqXHR.status) {
            case 400:
                // catching parseJSON errors
                try {
                    excp = $.parseJSON(jqXHR.responseText).error;
                    console.error('========== API ERROR ==========\n');
                    console.error('UnableToComplyException:' + excp.message + ' warning');
                    console.error('===============================');
                } catch(e) { console.error(e); }
                break;
            case 500:
                try {
                    excp = $.parseJSON(jqXHR.responseText).error;
                    console.error('========== API ERROR ==========\n');
                    console.error('PanicException:' + excp.message + ' panic');
                    console.error('===============================');
                } catch(e) { console.error(e); }
                break;
            default:
                console.log('HTTP status=' + jqXHR.status + ',' + textStatus + ',' + errorThrown + ',' + jqXHR.responseText);
            }
        }

    };
};

module.exports = helpers;
