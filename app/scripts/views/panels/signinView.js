 /*global define*/

'use strict';

var template = require('ejs!../../templates/signin.ejs'),
    loader = require('../../loader'),
    PopupView = require('../components/popupView'),
    sessionActions = require('../../actions/sessionActions'),
    h = require('../../globalHelpers');

var SigninView = PopupView.extend({

    template: template,

    username: 'input[name="username"]',
    password: 'input[name="password"]',

    initialize: function(options){

        options = options || {};

        this.callback = options.callback || function () {};

        this.renderData = {
            title: options.title
        };

        this.$el.attr('id', 'cmntyex_signin_panel');

        this.addEvents({
            'click .submit_button': 'submitForm',
            'click .signup_button': 'openSignupView'
        });
    },

    beforeShow: function () {
        var h = $( window ).height();
        var w = $( window ).width();
        this.$el.css({
            'max-height': 450,
            'max-width': 300,
            'width': w * 0.8
        });
    },

    openSignupView: function() {
        this.shut();
        this.$el.on('popupafterclose', function () {
            this.parent.openSubview('signup', this.model);
        }.bind(this));
    },

    submitForm: function() {
        loader.show();
        sessionActions.startSession(this.val().username, this.val().password)
            .then(function(response){
                loader.showFlashMessage( 'successfully signed in as ' + response.username );
                setTimeout(this.callback, 1000);
                this.shut();
            }.bind(this), function(jqXHR) {
                if( jqXHR.status === 400 ) {
                    this.showLoginError();
                    loader.hide();
                }else{
                    loader.showFlashMessage(h().getErrorMessage(jqXHR, 'Error signin in'));
                }
            }.bind(this));
        return false;
    },

    showLoginError: function() {
        this.$el.find('.login_error').show();
    },

    hideLoginError: function() {
        this.$el.find('.login_error').hide();
    },

    val: function () {
        return {
            username: $(this.username).val(),
            password: $(this.password).val()
        };
    }

});

module.exports = SigninView;