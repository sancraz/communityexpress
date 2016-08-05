'use strict';

var template = require('ejs!../templates/signUp.ejs'),
    loader = require('../../../loader'),
    h = require('../../../globalHelpers'),
    sessionActions = require('../../../actions/sessionActions');

var SignUpView = Mn.ItemView.extend({
    template: template,

    className: 'modal fade signup',

    ui: {
        close: '.close_button',
        submit: '.submit_button'
    },

    events: {
        'click @ui.close': 'close',
        'click @ui.submit': 'submitForm'
    },

    onShow: function() {
        this.$el.modal();
    },

    submitForm: function(e) {
        e.preventDefault();
        var data = this.getFormData();

        loader.show('');

        sessionActions.registerNewMember(
          window.community.serviceAccommodatorId,
          window.community.serviceLocationId,
          data.username,
          data.email,
          data.password
                  ).then(this._onSignupSuccess.bind(this), this._onSignupError.bind(this));

        return false;
    },

    getFormData: function() {
        var values = {};
        $.each(this.$el.find('form').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });
        return values;
    },

    _onSignupSuccess: function(response) {
        loader.showFlashMessage( 'successfully signed up as ' + response.username );
        this.close();
    },

    _onSignupError: function(e) {
        if(e && e.responseJSON.error.type === 'unabletocomplyexception'){
            loader.showFlashMessage( e.responseJSON.error.message );
        } else {
            loader.showFlashMessage(h().getErrorMessage(e, 'Error signin up'));
        }
    },

    close: function() {
        this.$el.modal('hide');
    }
});

module.exports = SignUpView;
