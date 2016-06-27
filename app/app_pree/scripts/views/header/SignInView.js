'use strict';

var template = require('ejs!./signIn.ejs'),
    loader = require('../../loader'),
    sessionActions = require('../../actions/sessionActions'),
    h = require('../../globalHelpers'),
    SignUpView = require('./SignUpView');

var SignInView = Mn.ItemView.extend({
    template: template,

    className: 'modal fade signin',

    username: 'input[name="username"]',
    password: 'input[name="password"]',

    ui: {
        submit: '.submit_button',
        signup: '.signup_button',
        close: '.close_button'
    },

    events: {
        'click @ui.submit': 'submitForm',
        'click @ui.signup': 'openSignupView',
        'click @ui.close': 'close'
    },

    initialize: function(options) {
        this.parent = options.parent;
        this.$el.attr({
            'tabindex': '-1',
            'role': 'dialog'
        });
    },

    onShow: function() {
        this.$el.modal();
    },

    openSignupView: function(e) {
        this.$el.modal('hide');
        this.$el.on('hidden.bs.modal', function () {
            this.parent.popupRegion.show(new SignUpView());
        }.bind(this));
    },

    submitForm: function() {
        loader.show('');
        sessionActions.startSession(this.val().username, this.val().password)
            .then(function(response) {
                loader.showFlashMessage( 'successfully signed in as ' + response.username );
                setTimeout(this.callback, 1000);
                this.$el.modal('hide');
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
    },

    close: function() {
        this.hide();
    }
});

module.exports = SignInView;
