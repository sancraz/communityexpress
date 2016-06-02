//maintaining namespace
if (typeof com === 'undefined') {
    com = {};
}
if (typeof com.faralam === 'undefined') {
    com.faralam = {};
}
if (typeof com.faralam.registration === 'undefined') {
    com.faralam.registration = {};
}
if (typeof com.faralam.common === 'undefined') {
    com.faralam.common = {};
}

com.faralam.base_url = window.location.protocol + '//' + window.location.host + window.location.pathname;
//com.faralam.serverURL = 'http://appointment-service.com:80/apptsvc/rest/';
//com.faralam.serverURL = 'http://communitylive.ws:80/apptsvc/rest/';
//com.faralam.serverURL = 'http://localhost:8080/apptsvc/rest/';

com.faralam.serverURL = '';
//com.faralam.serverURL = 'http://communitylive.co/apptsvc/rest/';
//com.faralam.serverURL = 'http://communitylive.ws/apptsvc/rest/';

com.faralam.serverURL = sessionStorage.accessMode;

com.faralam.fire_count = 0;

com.faralam.newsletterMembers = [];

com.faralam.Editor_MaxLength = 1000;
com.faralam.custom_img_path = com.faralam.base_url + '/resources/Image/';
com.faralam.CongratsPageMsg = 'The new business has been submitted. You must login again to continue';
com.faralam.CongratsPageMsgNote = 'NOTE: Your new business still needs to be approved. Once approved it will be live on the Community System. However, you can already start to edit, add photos etc.';
com.faralam.plugin_path = com.faralam.base_url + '/resources/plugins/';

//com.faralam.uploadURL = "http://appointment-service.com/apptsvc/rest/";

// ########################## Common Section ###############################
com.faralam.common.sendAjaxRequest = function (url, type, data, onsuccess, onerror, msg_status, content_type) {
    if (msg_status != 'slider') {
        com.faralam.loginMask = new Ext.LoadMask(Ext.getBody(), {
            msg: "Please wait ..."
        });
        com.faralam.loginMask.show();
    }
    if (content_type) {
        com.faralam.content_type = content_type;
    } else {
        com.faralam.content_type = 'application/json; charset=UTF-8';
    }

    Ext.Ajax.request({
        url: url,
        method: type,
        headers: {
            'Content-Type': com.faralam.content_type
        },
        params: data,
        success: function (response, textStatus, jqXHR) {
            if (msg_status != 'slider') {
                com.faralam.loginMask.hide();
            }
            if (response.responseText) {
                try {
                    var data = Ext.decode(response.responseText);
                } catch (e) {
                    var data = response.responseText;
                }

            } else {
                var data = response.responseText;
            }

            onsuccess(data, textStatus, jqXHR);
        },
        failure: function (jqXHR, textStatus, errorThrown) {
            if (msg_status != 'slider') {
                com.faralam.loginMask.hide();
            }
            com.faralam.common.ErrorHandling(jqXHR.responseText);
            onerror(data, textStatus, jqXHR);
        }
    });
};

com.faralam.common.ErrorHandling = function (data, pop_task, cmp) {
    if (data) {
        var response = data.replace(/\n/g, "");
        var excp = Ext.decode(response);
        if (excp.error != null) {
            switch (excp.error.type) {

                case "unabletocomplyexception":
                    com.faralam.registration.showPopup(excp.error.type, excp.error.message, pop_task, cmp);
                    break;

                case "panicexception":
                    com.faralam.registration.showPopup(excp.error.type, excp.error.message, pop_task, cmp);
                    break;

                default:
                    com.faralam.registration.showPopup("Error", "There has been an error", pop_task, cmp);
                    break;
            }
        } else {
            com.faralam.registration.showPopup("Error", "There has been an error", pop_task, cmp);
        }
    } else {
        com.faralam.registration.showPopup("Error", "Server is not responding/Network not Available", pop_task, cmp);
    }
}

com.faralam.registration.showPopup = function (title, msg, msg_status, cmp) {
    Ext.MessageBox.alert(title, msg);
    /*Ext.MessageBox.alert(title, msg, function(){			
     if(msg_status){				
     cmp.queue.clearUploadedItems();				
     cmp.updateStatusBar();
     if(cmp.queue.getUploadedItems().length > 0){
     var str = JSON.parse(Ext.getCmp('mediametadata').getValue());			
     com.faralam.common.retrieveMediaMetaDataBySASL(str.serviceAccommodatorId, str.serviceLocationId);
     }
     cmp.onAbortUpload();				
     }
     });*/
}

com.faralam.getLoginStatus = function () {

    com.faralam.getLoginStatusURL = com.faralam.serverURL + "authentication/getRegistrationStatus?";
    var LoginStatusURL = com.faralam.getLoginStatusURL + encodeURI('UID=' + sessionStorage.UID);

	var accessMode = "";
    var onsuccess = function (data, textStatus, jqXHR) {

		if(sessionStorage.themeDemo == 1){
			accessMode = "demo";
		}

        if (sessionStorage.UID) {
            if (sessionStorage.active_tab == 'settings') {
                Ext.getCmp('settings_user_id_hidden').setValue(data.userName);
                Ext.getCmp('settings_email_hidden').setValue(data.email);
                Ext.getCmp('settings_mobile_number_hidden').setValue(data.phoneNumber);

                Ext.getCmp('main_tab').down('#gallery').setDisabled(false);
                Ext.getCmp('main_tab').down('#other_info').setDisabled(false);
                Ext.getCmp('main_tab').down('#promotion').setDisabled(false);
                Ext.getCmp('main_tab').down('#open_hrs').setDisabled(false);
                Ext.getCmp('main_tab').down('#settings').setDisabled(false);
            } else
            /* if(sessionStorage.active_tab == 'verify'){
            					com.faralam.evaluateEmailMobileVerificationStatus(data);
            				}else*/
            if (sessionStorage.active_tab == 'name_address') {
                if ( /*data.registrationState == 'LEVEL3' && */ data.isOwner) {
                    Ext.getCmp('main_tab').down('#gallery').setDisabled(false);
                    Ext.getCmp('main_tab').down('#other_info').setDisabled(false);
                    Ext.getCmp('main_tab').down('#open_hrs').setDisabled(false);
                    Ext.getCmp('main_tab').down('#settings').setDisabled(false);
                    Ext.getCmp('main_tab').setActiveTab(4);
                    Ext.getCmp('main_tab').down('#name_address').setDisabled(true);
                }
            } else {
                if ( /*data.registrationState == 'LEVEL3' && */ data.isOwner) {
                    Ext.getCmp('main_tab').down('#gallery').setDisabled(false);
                    Ext.getCmp('main_tab').down('#other_info').setDisabled(false);
                    Ext.getCmp('main_tab').down('#promotion').setDisabled(false);
                    Ext.getCmp('main_tab').down('#open_hrs').setDisabled(false);
                    Ext.getCmp('main_tab').down('#settings').setDisabled(false);

                    // for UID as query param
                    if (sessionStorage.active_tab == 'login') {
                        com.faralam.getBusinessStatus(accessMode);
                    }
                } else {
                    /*if(sessionStorage.VCODE){
                     com.faralam.common.VerifyEmail(sessionStorage.VCODE);
                     }*/
                    // for UID as query param
                    /*if(data.registrationState == 'LEVEL3'){ 	
                     Ext.getCmp('main_tab').down('#login').setDisabled(true);
                     Ext.getCmp('main_tab').down('#name_address').setDisabled(false);
                     Ext.getCmp('main_tab').setActiveTab(3);
                     }else{
                     com.faralam.evaluateEmailMobileVerificationStatus(data);
                     }*/
                    Ext.getCmp('main_tab').down('#login').setDisabled(true);
                    Ext.getCmp('main_tab').down('#name_address').setDisabled(false);
                    Ext.getCmp('main_tab').setActiveTab(3);
                }
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(LoginStatusURL, "GET", {}, onsuccess, onerror);
}

com.faralam.evaluateEmailMobileVerificationStatus = function (data) {

    /*if(data.isOwner){
     Ext.getCmp('main_tab').down('#gallery').setDisabled(false);
     Ext.getCmp('main_tab').down('#other_info').setDisabled(false);
     Ext.getCmp('main_tab').down('#promotion').setDisabled(false);
     Ext.getCmp('main_tab').down('#open_hrs').setDisabled(false);
     Ext.getCmp('main_tab').down('#settings').setDisabled(false);
     Ext.getCmp('main_tab').setActiveTab(4);
     }else{
     Ext.getCmp('main_tab').down('#verify').setDisabled(true);
     Ext.getCmp('success_register').setDisabled(false);
     Ext.getCmp('main_tab').setActiveTab(10);	
     }*/

    /*if (data.registrationState == "LEVEL0" || data.registrationState == "LEVEL1" || data.registrationState == "LEVEL2") {
     Ext.getCmp('main_tab').down('#verify').setDisabled(false);
     Ext.getCmp('main_tab').setActiveTab(2);
     
     if(data.emailVerified){
     Ext.getCmp('email_verified_txt').setValue("<span style=\"color:#fff;\">Verified :</span> <span style='color: green; font-weight:bold;'>YES</span>");
     Ext.getCmp('email_section').el.setStyle({visibility: 'hidden'});				
     Ext.getCmp('verify_resend_email').el.setStyle({visibility: 'hidden'});	
     Ext.getCmp('verify_email_notify').el.setStyle({visibility: 'hidden'});	
     }else{
     Ext.getCmp('email_verified_txt').setValue("<span style=\"color:#fff;\">Verified :</span> <span style='color: red; font-weight:bold;'>NO</span>");
     Ext.getCmp('email_section').el.setStyle({visibility: 'visible'});				
     Ext.getCmp('verify_resend_email').el.setStyle({visibility: 'visible'});	
     Ext.getCmp('verify_email_notify').el.setStyle({visibility: 'visible'});
     }
     
     if(data.mobileVerified){
     Ext.getCmp('mobile_verified_txt').setValue("<span style=\"color:#fff;\">Verified :</span> <span style='color: green; font-weight:bold;'>YES</span>");
     Ext.getCmp('mobile_section').el.setStyle({visibility: 'hidden'});	
     Ext.getCmp('verify_resend_mobile').el.setStyle({visibility: 'hidden'});	
     Ext.getCmp('verify_mobile_notify').el.setStyle({visibility: 'hidden'});	
     }else{
     Ext.getCmp('mobile_left_section').el.setStyle({visibility: 'visible'});
     Ext.getCmp('mobile_verified_txt').setValue("<span style=\"color:#fff;\">Verified :</span> <span style='color: red; font-weight:bold;'>NO</span>");
     Ext.getCmp('mobile_verified_txt').el.setStyle({visibility: 'visible'});
     Ext.getCmp('mobile_section').el.setStyle({visibility: 'visible'});	
     Ext.getCmp('verify_resend_mobile').el.setStyle({visibility: 'visible'});	
     Ext.getCmp('verify_mobile_notify').el.setStyle({visibility: 'visible'});	
     }			
     } else if (data.registrationState == "LEVEL3") {
     if(data.isOwner){
     Ext.getCmp('main_tab').down('#gallery').setDisabled(false);
     Ext.getCmp('main_tab').down('#other_info').setDisabled(false);
     Ext.getCmp('main_tab').down('#promotion').setDisabled(false);
     Ext.getCmp('main_tab').down('#open_hrs').setDisabled(false);
     Ext.getCmp('main_tab').down('#settings').setDisabled(false);
     Ext.getCmp('main_tab').setActiveTab(4);
     }else{
     Ext.getCmp('main_tab').down('#verify').setDisabled(true);
     Ext.getCmp('success_register').setDisabled(false);
     Ext.getCmp('main_tab').setActiveTab(10);	
     }
     }*/
};

/*com.faralam.ShowServerOption = function(){
 
 var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
 var win_server;
 var form = Ext.widget('form', {
 layout: {
 type: 'vbox',
 align: 'stretch'
 },
 border: false,
 bodyPadding: 10,
 fieldDefaults: {
 labelAlign: 'side',
 labelWidth: 150,
 labelStyle: 'font-weight:bold'
 },
 defaultType: 'radio',
 items: [								
 {
 boxLabel: '<span style="color:#000;">communitylive.ws</span>',
 name: 'server_name',
 inputValue: '0'
 }, {
 boxLabel: '<span style="color:#000;">communityLive.co</span>',
 name: 'server_name',
 inputValue: '1'				
 }, {
 boxLabel: '<span style="color:#000;">appt-svc</span>',
 name: 'server_name',
 inputValue: '2',
 checked: true
 },{
 boxLabel: '<span style="color:#000;">localhost</span>',
 name: 'server_name',
 inputValue: '4'
 }],
 buttons: [{
 text: 'Submit',
 handler: function() {					
 var values = form.getForm().getValues();					
 sessionStorage.server_index = values.server_name;
 if(com.faralam.registration.setServerURL(values.server_name)){
 win_server.close();	
 }
 }
 }]
 });		
 
 if(sessionStorage.server_index){			
 form.items.items[sessionStorage.server_index].setValue(true);
 }
 
 win_server = Ext.widget('window', {
 title: 'Change Server',
 closeAction: 'hide',
 layout: 'fit',
 resizable: true,
 modal: true,
 width: 200,
 items: form
 });
 win_server.show();
 }
 
 com.faralam.registration.setServerURL = function(server) {
 
 if(server == '0'){
 com.faralam.serverURL = 'http://communitylive.ws:80/apptsvc/rest/';
 }else if(server == '1'){
 com.faralam.serverURL = 'http://communityLive.co:80/apptsvc/rest/';
 }else if(server == '2'){
 com.faralam.serverURL = 'http://appointment-service.com:80/apptsvc/rest/';
 }else if (server == "3") {
 com.faralam.serverURL = 'http://localhost:8080/apptsvc/rest/';
 }
 return true;
 };*/

com.faralam.UserLogOut = function () {
    com.faralam.UserLogOutURL = com.faralam.serverURL + "authentication/logout?";
    var UserLogOutURL = com.faralam.UserLogOutURL + encodeURI('UID=' + sessionStorage.UID);
	var redirectUrl = sessionStorage.ignorehistory=="true"?"http://sitelettes.com":"http://sitelettes.com/business";
	console.log(sessionStorage.ignorehistory);
	console.log(redirectUrl);
    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.Msg.show({
            title: 'Success',
            buttons: Ext.MessageBox.OK,
            msg: 'Your session has ended. Please press the Manage Site to relogin.',
            fn: function (btn) {
                if (btn == 'ok') {
                    Ext.Ajax.request({
                        url: redirectUrl, //again
                        callback: function () {
                            window.top.location.href = redirectUrl;
                        }
                    });
                }
            }
        });
        Ext.getCmp('main_tab').down('#login').setTitle('Login');
        for (var i = 0; i < Ext.getCmp('main_tab').items.length; i++) {
            if (Ext.getCmp('main_tab').down('#' + Ext.getCmp('main_tab').items.items[i].itemId).isDisabled()) {
                Ext.getCmp('main_tab').down('#' + Ext.getCmp('main_tab').items.items[i].itemId).setDisabled(true);
            }
        }

        //Ext.getCmp('main_tab').down('#login').setDisabled(false);
        //Ext.getCmp('main_tab').setActiveTab(0);
        sessionStorage.clear();

    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(UserLogOutURL, "GET", {}, onsuccess, onerror);

}

/*com.faralam.inIframe = function() {
 try {
 return window.self !== window.top;
 } catch (e) {
 return true;
 }
 }*/

/*com.faralam.FirstVisit = function(){
 if(com.faralam.inIframe()){
 //var url = (window.location != window.parent.location) ? document.referrer: document.location;
 var frame = parent.document.getElementsByTagName('iframe');
 var url = frame[0].src;
 
 var getParams = url.split("?");
 var params = Ext.urlDecode(getParams[getParams.length - 1]);
 
 return params;
 }else{
 //var url = document.URL;
 return false;
 }		
 }*/

com.faralam.FirstVisit = function () {
    var queryParams = $.url().param();

    if (Object.keys(queryParams).length > 0) {
        return queryParams;
    } else {
        return false;
    }
}

Array.prototype.AllValuesSame = function () {

    if (this.length > 0) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == this[0] && this[i] == true) {
                return true;
            } else {
                return false;
            }
        }
    }
    return true;
}

com.faralam.getFieldValues = function (combo, nameIn, nameOut) {
    try {
        var r = combo.getStore().find(nameIn, combo.getValue());
        return combo.getStore().getAt(r).get(nameOut);
    } catch (err) {
        return 'error';
    }
}

com.faralam.FormatPhone = function (e, input) {

    /* to prevent backspace, enter and other keys from  
     interfering w mask code apply by attribute  
     onkeydown=FormatPhone(control) 
     */

    evt = e || window.event; /* firefox uses reserved object e for event */
    var pressedkey = evt.which || evt.keyCode;
    var BlockedKeyCodes = new Array(8, 27, 13, 9); //8 is backspace key 
    var len = BlockedKeyCodes.length;
    var block = false;
    var str = '';
    for (i = 0; i < len; i++) {
        str = BlockedKeyCodes[i].toString();
        if (str.indexOf(pressedkey) >= 0)
            block = true;
    }
    if (block)
        return true;

    s = input.value;
    if (s.charAt(0) == '+')
        e.stopEvent();
    filteredValues = '"`!@#$%^&*()_+|~-=\QWERT YUIOP{}ASDFGHJKL:ZXCVBNM<>?qwertyuiop[]asdfghjkl;zxcvbnm,./\\\'';
    var i;
    var returnString = '';

    /* Search through string and append to unfiltered values  
     to returnString. */

    for (i = 0; i < s.length; i++) {

        var c = s.charAt(i);
        if ((filteredValues.indexOf(c) == -1) & (returnString.length < 13)) {
            if (returnString.length == 0)
                returnString += '(';
            if (returnString.length == 4)
                returnString += ')';
            if (returnString.length == 5)
                returnString += '-';
            if (returnString.length == 9)
                returnString += '-';
            returnString += c;
        }

    }

    input.setValue(returnString);

    return false;
}

com.faralam.getBusinessList = function () {

    com.faralam.get_user_community = com.faralam.serverURL + 'usersasl/getUserAndCommunity';
    com.faralam.get_user_community = com.faralam.get_user_community + "?" + encodeURI('UID=' + sessionStorage.UID);

    var onsuccess = function (data, textStatus, jqXHR) {

        Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
        Ext.getCmp('main_tab').down('#business_list').setDisabled(false);
        Ext.getCmp('main_tab').setActiveTab(13);

        if (data.community[0].sasls.length > 0) {

            var columns = new Array();
            var fields = new Array();
            var datam = new Array();

            columns.push({
                header: 'Business Name',
                dataIndex: 'name',
                width: 165,
                align: 'center',
                sortable: false
            }, {
                header: 'Description',
                dataIndex: 'description',
                width: 165,
                align: 'center',
                sortable: false
            }, {
                dataIndex: 'sa',
                hidden: true

            }, {
                dataIndex: 'sl',
                hidden: true
            }, {
                menuDisabled: true,
                sortable: false,
                xtype: 'actioncolumn',
                width: 50,
                align: 'right',
                items: [{
                    icon: com.faralam.custom_img_path + 'edit.png',
                    tooltip: 'Edit',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        sessionStorage.EDITEDSA = rec.get('sa');
                        sessionStorage.EDITEDSL = rec.get('sl');
                        Ext.getCmp('main_tab').down('#business_list').setDisabled(true);
                        Ext.getCmp('main_tab').down('#edit_name_address').setDisabled(false);
                        Ext.getCmp('main_tab').setActiveTab(14);
                    }
                    }]
            });

            fields.push({
                name: 'name'
            }, {
                name: 'description'
            }, {
                name: 'sa'
            }, {
                name: 'sl'
            });

            for (var k = 0; k < data.community[0].sasls.length; k++) {
                var obj = {};
                obj['name'] = data.community[0].sasls[k].saslName;
                obj['description'] = data.community[0].sasls[k].saslName;
                obj['sa'] = data.community[0].sasls[k].sa;
                obj['sl'] = data.community[0].sasls[k].sl;

                datam.push(
                    obj
                );
            }

            var store = Ext.create('Ext.data.Store', {
                fields: fields,
                data: datam
            });

            Ext.getCmp('business_list_grid').reconfigure(store, columns);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_user_community, "GET", {}, onsuccess, onerror);
}

com.faralam.ShowResetPassword = function (val, val1) {

    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
    var win_reset_password;

    var form = Ext.widget('form', {
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        border: false,
        bodyPadding: 10,
        fieldDefaults: {
            labelAlign: 'side',
            labelWidth: 160,
            labelStyle: 'font-weight:bold'
        },
        defaultType: 'textfield',
        items: [
            {
                fieldLabel: 'New Password',
                afterLabelTextTpl: required,
                labelStyle: 'color: #000 !important;',
                allowBlank: false,
                emptyText: '(enter New Password)',
                name: 'new_password',
                fieldStyle: "color:#000 !important;",
                id: 'reset_new_password',
                inputType: 'password'
            },
            {
                fieldLabel: 'Re-enter Password',
                afterLabelTextTpl: required,
                labelStyle: 'color: #000 !important;',
                allowBlank: false,
                emptyText: '(reenter Password)',
                fieldStyle: "color:#000 !important;",
                inputWidth: 190,
                inputType: 'password',
                validator: function (v) {
                    if (Ext.getCmp('reset_new_password').getValue() != v) {
                        return "password does not match.";
                    }
                    return true;
                }
            },
            {
                xtype: 'toolbar',
                items: [{
                        text: 'OK',
                        handler: function () {
                            if (this.up('form').getForm().isValid()) {
                                var values = this.up('form').getForm().getValues();
                                var new_password = values.new_password;
                                com.faralam.ResetPassword(new_password, val, val1);
                            }
                        }
                    },
                    '->',
                    {
                        text: 'Cancel',
                        handler: function () {
                            win_reset_password.close();
                        }
                    }]
            }]
    });

    win_reset_password = Ext.widget('window', {
        title: 'Reset Password',
        closeAction: 'hide',
        id: 'win_reset_password',
        layout: 'fit',
        resizable: true,
        modal: true,
        items: form,
        defaultFocus: 'old_password',
        listeners: {
            close: function () {
                form.getForm().reset();
            }
        }
    });
    win_reset_password.show();
}

com.faralam.ResetPassword = function (val, val1, val2) {

    com.faralam.reset_password = com.faralam.serverURL + 'authentication/resetPassword';

    var data = {
        uid: val1,
        password: val,
        email: val2
    }
    data = JSON.stringify(data);

    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'You have reset the password successfully.', function () {
            Ext.getCmp('win_reset_password').close();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.reset_password, "POST", data, onsuccess, onerror);
}

com.faralam.getUserEmail = function (uid) {

    com.faralam.get_user_email = com.faralam.serverURL + "authentication/getRegistrationStatus?";
    com.faralam.get_user_email = com.faralam.get_user_email + encodeURI('UID=' + uid);

    var onsuccess = function (data, textStatus, jqXHR) {
        com.faralam.ShowResetPassword(uid, data.email);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_user_email, "GET", {}, onsuccess, onerror);
}

com.faralam.getCropPicURLs = function (URL) {

    com.faralam.get_crop_pic_urls = com.faralam.serverURL + "html/getCroppicURLs?";

    var onsuccess = function (data, textStatus, jqXHR) {
        sessionStorage.uploadURL = data.uploadURL;
        sessionStorage.cropURL = data.cropURL;

        Ext.Ajax.request({
            url: URL,
            method: 'GET',
            success: function (data, textStatus, jqXHR) {
                modal.open({
                    content: data.responseText
                });
            }
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_crop_pic_urls, "GET", {}, onsuccess, onerror);
}

com.faralam.getImgStatus = function (STATUS) {

    var overlay_img = '';
    if (STATUS == 'PROPOSED') {
        overlay_img = com.faralam.custom_img_path + 'PROPOSED.png';
    } else if (STATUS == 'REJECTED') {
        overlay_img = com.faralam.custom_img_path + 'REJECTED.png';
    } else if (STATUS == 'APPROVED') {
        overlay_img = com.faralam.custom_img_path + 'APPROVED.png';
    }

    return overlay_img;
}

com.faralam.common.getMobileAppURL = function (sa, sl) {
    com.faralam.get_mobile_app_url = com.faralam.serverURL + 'sasl/getMobileAppURL';
    com.faralam.get_mobile_app_url = com.faralam.get_mobile_app_url + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (data, textStatus, jqXHR) {
        //console.log(data.mobileURL);
        Ext.getCmp('mobile_url').update('');
        if (data) {
            html = '<span style="color:#fff;font-family: arial !important;font-size: 14px;">' + data.mobileURL + '</span>';
            Ext.getCmp('mobile_url').update(html);

            html = '<a href="https://www.facebook.com/sharer.php?u=' + data.mobileURL + '" target="_blank"><img src="' + com.faralam.custom_img_path + '/share_button.png" height="24" width="60"></a>'
            Ext.getCmp('shareApp_fb').update(html);

            html = '<a href="https://twitter.com/share?url=' + data.mobileURL + '" target="_blank"><img src="' + com.faralam.custom_img_path + '/tweet-button_withoutbg.png" height="24" width="60"></a>'
            Ext.getCmp('shareApp_tweet').update(html);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_mobile_app_url, "GET", {}, onsuccess, onerror);
}
com.faralam.common.getMobileAppURLforSMS = function (sa, sl) {
    com.faralam.get_mobile_app_url = com.faralam.serverURL + 'sasl/getMobileAppURL';
    com.faralam.get_mobile_app_url = com.faralam.get_mobile_app_url + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (data, textStatus, jqXHR) {
        //console.log(data.mobileURL);
        Ext.getCmp('mobile_url').update('');
        if (data) {
            html = '<span style="color:#fff;font-family: arial !important;font-size: 14px;">' + data.mobileURL + '</span>';
            Ext.getCmp('shareSiteByText_url').update(html);

            html = '<a href="https://www.facebook.com/sharer.php?u=' + data.mobileURL + '" target="_blank"><img src="' + com.faralam.custom_img_path + '/share_button.png" height="24" width="60"></a>'
            Ext.getCmp('shareAppByText_fb').update(html);

            html = '<a href="https://twitter.com/share?url=' + data.mobileURL + '" target="_blank"><img src="' + com.faralam.custom_img_path + '/tweet-button_withoutbg.png" height="24" width="60"></a>'
            Ext.getCmp('shareAppByText_tweet').update(html);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_mobile_app_url, "GET", {}, onsuccess, onerror);
}
com.faralam.common.getMobileAppURLStartScreen = function (sa, sl) {
	
    com.faralam.get_mobile_app_url_start = com.faralam.serverURL + 'sasl/getMobileAppURL';
    com.faralam.get_mobile_app_url_start = com.faralam.get_mobile_app_url_start + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

var splitString = "";
	var addURL = "";
	
    var onsuccess = function (data, textStatus, jqXHR) {
        var splitString = data.mobileURL.split("?");

        if(splitString.length>1){
			addURL = "&desktopiframe=true";
		}
		else{
			addURL = "?desktopiframe=true";
		}
        
        Ext.getCmp('mobile_url_start').update('');
        Ext.getCmp('mobile_url_end').update('');
        if (data) {
            urlhtml = '<div style="  background: #CCCCCC; height: 25px; width: 320px; display: table-cell;vertical-align: middle;text-align: center;"><p style="color:#000;font-family: arial !important;font-size: 12px;">' + data.mobileURL + '</p></div>';
            html = '<iframe src="' + data.mobileURL + addURL + '" frameborder="0" height="472px" width="320px" style="margin-top: 22px;"></iframe>';
            
            Ext.getCmp('mobile_url_start').update(html);
            Ext.getCmp('mobile_url_end').update(urlhtml);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_mobile_app_url_start, "GET", {}, onsuccess, onerror);
}

com.faralam.getServiceConfigurations = function (URL) {


    var timestamp = new Date().getTime();

    if (sessionStorage.SASLNAME) {
        Ext.getCmp('with_img_header_logo').show();
        Ext.getCmp('without_img_header_logo').hide();
        Ext.getCmp('start_screen_business_name').setSrc(com.faralam.serverURL + 'sasl/retrieveLogoJPGbySASL?serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&ver=' + timestamp);
        /*Ext.getCmp('start_screen_combo').getStore().removeAll();
         Ext.getCmp('start_screen_combo').getStore().proxy.url = com.faralam.serverURL+'liveupdate/getServiceStatusOptions?&serviceAccommodatorId='+sessionStorage.SA+'&serviceLocationId='+sessionStorage.SL;
         Ext.getCmp('start_screen_combo').getStore().reload();
         Ext.getCmp('start_screen_combo').setDisabled(false);*/
        //Ext.getCmp('start_screen_back_btn').show();
    } else {
        Ext.getCmp('with_img_header_logo').hide();
        Ext.getCmp('without_img_header_logo').show();
        /*Ext.getCmp('start_screen_combo').setDisabled(true);*/
        //Ext.getCmp('start_screen_back_btn').hide();
    }

    com.faralam.get_server_config = com.faralam.serverURL + "sasl/getServiceConfigurations?";
    com.faralam.get_server_config = com.faralam.get_server_config + encodeURI('serviceLocationId=' + sessionStorage.SL + '&serviceAccommodatorId=' + sessionStorage.SA + '&UID=' + sessionStorage.UID);

    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.getCmp('user_setting_menu').removeAll();
        Ext.getCmp('start_screen_first_part').removeAll();

        var item1 = [];
        var settingMenu = [];

        //var config_arr = ['reservationService', 'mediaservice', 'messagingService', 'promotionService', 'appointmentService', 'userSASLService', 'emailService', 'smsService', 'addEditSASL', 'catalog', 'onlineOrder', 'openingHours', 'saslLogoIcon', 'saslAppIcon', 'saslMetadata', 'saslPreview', 'customerCare', 'userSettings', 'servicestatus' , 'adAlertService','htmlEmailService','widgetService','pollingContestService','photoContestService','checkinContestService','wallService','orderSiteCardsService','drivingDirectionsService','clickToCallService','version'];
        var config_arr = ['mediaservice', 'promotionService', 'userSASLService', 'messagingService', 'onlineOrder', 'openingHours', 'saslMetadata', 'saslLogoIcon', 'saslAppIcon', 'emailService', 'smsService', 'servicestatus', 'catalog', 'pollingContestService', 'photoContestService', 'wallService', 'adAlertService', 'htmlEmailService', 'widgetService', 'orderSiteCardsService', 'drivingDirectionsService', 'clickToCallService', 'qrCodeScanService', 'themeSelectionService', 'loyaltyService', 'eventsService', 'videoService', 'customerCare', 'userSettings','saslPreview'];

        for (var i = 0; i < config_arr.length; i++) {
            if (data['' + config_arr[i] + '']) {
                if (data['' + config_arr[i] + ''].masterEnabled) {
                    var section_header = '';
                    section_header = config_arr[i];
                    if (section_header == 'servicestatus') {
                        var btn_bg = data['' + config_arr[i] + ''].configurationEnum.color;
                        var r = btn_bg.replace('R:', '');
                        var g = r.replace('G:', '');
                        var b = g.replace('B:', '');
                        item1.push({
                            xtype: 'container',
                            layout: 'hbox',
                            cls: 'start_screen_hover',
                            //id: data[''+config_arr[i]+''].displayText,
                            id: section_header,
                            scope: this,
                            style: 'cursor:pointer;border-top: 5px solid rgb(' + b + ') !important; background: #2D2D39 !important;',
                            listeners: {
                                click: {
                                    element: 'el',
                                    fn: function () {
                                        com.faralam.StartScreenNavigate(this.id);
                                    }
                                }
                            },
                            items: [{
                                    xtype: 'image',
                                    width: 35,
                                    height: 35,
                                    src: data['' + config_arr[i] + ''].buttonURL
                                },
                                {
                                    xtype: 'hiddenfield',
                                    id: section_header + '_pageHeader',
                                    name: '',
                                    value: data['' + config_arr[i] + ''].displayText
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: '<p style="margin: -1px;color: #fff;font-size: 15px;font-weight: bold;">' + data['' + config_arr[i] + ''].displayText + '</p>',
                                    //label: '<p style="margin: 0;padding: 5px 5px 5px 15px;color: #000;font-size: 15px">' + data['' + config_arr[i] + ''].displayText + '</p>',
                                    labelStyle: 'color:#fff !important;',
                                    labelSeparator: '',
                                    labelAlign: 'top',
                                    name: 'start_screen_combo',
                                    emptyText: 'No Wait',
                                    id: 'start_screen_combo',
                                    queryMode: 'local',
                                    displayField: 'value',
                                    valueField: 'value1',
                                    autoSelect: true,
                                    forceSelection: false,
                                    width: 230,
                                    margin: '0 0 0 15',
                                    editable: false,
                                    store: Ext.create('Ext.data.ArrayStore', {
                                        fields: ['id', 'value', 'value1'],
                                        autoLoad: false,
                                        proxy: {
                                            type: 'ajax',
                                            url: '',
                                            reader: {
                                                type: 'json',
                                                root: 'serviceStatusOption',
                                                getData: function (data) {
                                                    var temparray = [];
                                                    var count = 0;
                                                    Ext.each(data.serviceStatusOption, function (rec) {
                                                        temparray.push([]);
                                                        temparray[count].push(new Array(1));
                                                        temparray[count]['id'] = rec.enumText + ',' + rec.color + ',' + rec.id;
                                                        temparray[count]['value'] = rec.displayText;
                                                        temparray[count]['value1'] = rec.enumText + ',' + rec.color + ',' + rec.id;
                                                        count = count + 1;
                                                    });
                                                    data = temparray;
                                                    console.log("New test form AQB - " + data);
                                                    return data;
                                                }
                                            },
                                            listeners: {
                                                exception: function (proxy, response, operation) {
                                                    com.faralam.common.ErrorHandling(response.responseText);
                                                }
                                            }
                                        }
                                    }),
                                    listeners: {
                                        select: function () {
                                            var n = this.getValue().split(',');
                                            this.inputEl.dom.style.backgroundColor = n[1];
                                            this.inputEl.dom.style.backgroundImage = 'none';
                                            this.inputEl.removeCls('x-form-text');
                                            this.inputEl.addCls('text-dynamic');
                                            com.faralam.common.updateServiceStatus(n[2]);
                                        }
                                    }
                                }
                            ]
                        });

                    } else {
                        if (section_header == 'saslMetadata') {
                            sessionStorage.EditAppSettingVisibility = data['' + config_arr[i] + ''].domain.isPrivate;
                        }

                        //if (section_header == 'mediaservice' || section_header == 'promotionService') {
                        if (section_header == 'customerCare' || section_header == 'userSettings') {
                            //                            var btn_bg = data['' + config_arr[i] + ''].configurationEnum.color;
                            //                            var r = btn_bg.replace('R:', '');
                            //                            var g = r.replace('G:', '');
                            //                            var b = g.replace('B:', '');
                            settingMenu.push({
                                xtype: 'container',
                                layout: 'hbox',
                                cls: 'menu_screen_hover',
                                style: 'cursor:pointer;background: #CCC !important;',
                                //id: data[''+config_arr[i]+''].displayText,
                                id: section_header,
                                scope: this,
                                listeners: {
                                    click: {
                                        element: 'el',
                                        fn: function () {
                                            com.faralam.StartScreenNavigate(this.id);
                                        }
                                    }
                                },
                                items: [
//                                    {
//                                        xtype: 'image',
//                                        width: 35,
//                                        height: 35,
//                                        src: data['' + config_arr[i] + ''].buttonURL
//                                    },
                                    {
                                        xtype: 'component',
                                        html: '<p style="margin: 0;padding: 5px 5px 5px 15px;color: #fff;font-size: 15px;font-weight: bold;">' + section_header + '</p>'
                                    }]
                            });
                        } else {
                            if(section_header != '' || section_header != null){
                            var btn_bg = data['' + config_arr[i] + ''].configurationEnum.color;
                            var r = btn_bg.replace('R:', '');
                            var g = r.replace('G:', '');
                            var b = g.replace('B:', '');
                            item1.push({
                                xtype: 'container',
                                layout: 'hbox',
                                cls: 'start_screen_hover',
                                style: 'cursor:pointer;border-top: 5px solid rgb(' + b + ') !important; background: #2D2D39 !important;',
                                //id: data[''+config_arr[i]+''].displayText,
                                id: section_header,
                                scope: this,
                                listeners: {
                                    click: {
                                        element: 'el',
                                        fn: function () {
                                            com.faralam.StartScreenNavigate(this.id);
                                        }
                                    }
                                },
                                items: [{
                                        xtype: 'image',
                                        width: 35,
                                        height: 35,
                                        src: data['' + config_arr[i] + ''].buttonURL
                                    },
                                    {
                                        xtype: 'hiddenfield',
                                        id: section_header + '_pageHeader',
                                        name: '',
                                        value: data['' + config_arr[i] + ''].displayText
                                    },
                                    {
                                        xtype: 'component',
                                        width: 240,
                                        html: '<p style="margin: 0;padding: 5px 5px 5px 15px;color: #fff;font-size: 15px;font-weight: bold;">' + data['' + config_arr[i] + ''].displayText + '</p>'
                                    }]
                            });
                        }
                    }


                    }


                    /*if(item1.length%1 != 0){
                     item1.push({
                     xtype: 'container',
                     id:'',
                     width: 300
                     });
                     }*/
                }
            }
            var section_header = '';
            section_header = config_arr[i];
            if (section_header == 'customerCare' || section_header == 'userSettings' || section_header == 'version') {
                var displayText = "";
                if (section_header == "customerCare") {
                    displayText = "Support";
                } else if (section_header == "userSettings") {
                    displayText = "Settings";
                }
                //                            var btn_bg = data['' + config_arr[i] + ''].configurationEnum.color;
                //                            var r = btn_bg.replace('R:', '');
                //                            var g = r.replace('G:', '');
                //                            var b = g.replace('B:', '');
                settingMenu.push({
                    xtype: 'container',
                    layout: 'hbox',
                    cls: 'menu_screen_hover',
                    style: 'cursor:pointer;background: #FFFFFF !important; border-top:1px solid #565656;',
                    //id: data[''+config_arr[i]+''].displayText,
                    id: section_header,
                    scope: this,
                    listeners: {
                        click: {
                            element: 'el',
                            fn: function () {
                                com.faralam.StartScreenNavigate(this.id);
                            }
                        }
                    },
                    items: [
//                                    {
//                                        xtype: 'image',
//                                        width: 35,
//                                        height: 35,
//                                        src: data['' + config_arr[i] + ''].buttonURL
//                                    },
                        {
                            xtype: 'component',
                            html: '<p style="margin: 0;padding: 5px 5px 5px 15px;color: #000;font-size: 15px;font-weight: bold;">' + displayText + '</p>'
                                    }]
                });
            }
        }

        Ext.getCmp('user_setting_menu').add(settingMenu);
        $('#user_setting_menu').css('opacity', '0');
        Ext.getCmp('start_screen_first_part').add(item1);

        if (config_arr.indexOf('servicestatus')) {
            if (Ext.getCmp('start_screen_combo')) {
                Ext.getCmp('start_screen_combo').getStore().removeAll();
                Ext.getCmp('start_screen_combo').getStore().proxy.url = com.faralam.serverURL + 'liveupdate/getServiceStatusOptions?&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL;
                Ext.getCmp('start_screen_combo').getStore().reload();
                console.log(Ext.getCmp('start_screen_combo').getStore());
                Ext.getCmp('start_screen_combo').setDisabled(false);

                com.faralam.common.getStatusSelected();
            }
        }


        //$('#setting-content').empty();
        //$('#setting-content').append(menu_html);
        $('#start_screen_first_part_table').perfectScrollbar('destroy');
        $('#start_screen_first_part_table').perfectScrollbar();

    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_server_config, "GET", {}, onsuccess, onerror);
}

com.faralam.common.getStatusSelected = function () {
    com.faralam.getStatusSelected = com.faralam.serverURL + 'liveupdate/getStatus';
    com.faralam.getStatusSelected = com.faralam.getStatusSelected + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (data, textStatus, jqXHR) {
        console.log(data);
        //console.log(data.servicestatus);
        //console.log(Ext.getCmp('start_screen_combo'));
        if (data) {
            Ext.getCmp('start_screen_combo').setValue(data.servicestatus.text);
            Ext.getCmp('start_screen_combo').inputEl.dom.style.backgroundColor = data.servicestatus.color;
            Ext.getCmp('start_screen_combo').inputEl.dom.style.backgroundImage = 'none';
            Ext.getCmp('start_screen_combo').inputEl.removeCls('x-form-text');
            Ext.getCmp('start_screen_combo').inputEl.addCls('text-dynamic');
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.getStatusSelected, "GET", {}, onsuccess, onerror);
}

com.faralam.StartScreenNavigate = function (config) {
	try{
    var pageHeader = Ext.getCmp(config + '_pageHeader').getValue();
	}
	catch(err){
		var pageHeader = "Settings";	
	}
    //sessionStorage.PAGEHEADER = Ext.getCmp(config+'_pageHeader').getValue();
    if (config == 'mediaservice') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#gallery').setDisabled(false);
            Ext.getCmp('gallery_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(5);
        }
    } else if (config == 'promotionService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#promotion').setDisabled(false);
            Ext.getCmp('promotion_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(7);
        }
    } else if (config == 'openingHours') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#open_hrs').setDisabled(false);
            Ext.getCmp('open_hrs_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(8);
        }
    } else if (config == 'addEditSASL') {
        if (sessionStorage.SA && sessionStorage.SL) {
            com.faralam.getBusinessList();
        } else {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#name_address').setDisabled(false);
            Ext.getCmp('main_tab').setActiveTab(3);
        }
    } else if (config == 'saslMetadata') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#other_info').setDisabled(false);
            Ext.getCmp('other_info_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(6);
        }
    } else if (config == 'userSettings') {
        Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
        Ext.getCmp('main_tab').down('#settings').setDisabled(false);
        Ext.getCmp('main_tab').setActiveTab(9);
    } else if (config == 'saslLogoIcon') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#UpdateLogoIcon').setDisabled(false);
            Ext.getCmp('UpdateLogoIcon_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(15);
        }
    /* } else if(config == 'Share App by Email'){
         if(sessionStorage.SASLNAME){
         Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
         Ext.getCmp('main_tab').down('#share_app_by_email').setDisabled(false);
         Ext.getCmp('main_tab').setActiveTab(16);
         }*/
     } else if (config == 'smsService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#shareAppByText').setDisabled(false);
            Ext.getCmp('shareAppByText_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(42);
        }
    } else if (config == 'emailService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#shareApp').setDisabled(false);
            Ext.getCmp('shareApp_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(18);
        }
    } else if (config == 'customerCare') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#SupportSection').setDisabled(false);
            Ext.getCmp('main_tab').setActiveTab(19);
        }
    } else if (config == 'saslAppIcon') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#UpdateAppIcon').setDisabled(false);
            Ext.getCmp('UpdateAppIcon_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(20);
        }
    } else if (config == 'catalog') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#CatalogMenu').setDisabled(false);
            Ext.getCmp('CatalogMenu_pageHeader').update('<span style="color:#E5FFFF;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(21);
        }
    } else if (config == 'onlineOrder') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#OnlineOrder').setDisabled(false);
            Ext.getCmp('OnlineOrder_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(22);
        }
    } else if (config == 'userSASLService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#MyAppMembers').setDisabled(false);
            Ext.getCmp('MyAppMembers_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(25);
        }
    } else if (config == 'adAlertService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#AdAlertService').setDisabled(false);
            Ext.getCmp('AdAlertService_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(27);
        }
    } else if (config == 'htmlEmailService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#HtmlEmailService').setDisabled(false);
            Ext.getCmp('HtmlEmailService_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(28);
            //com.faralam.common.newsLetterPopup();
        }
    } else if (config == 'pollingContestService') {
        if (sessionStorage.SASLNAME) {
            sessionStorage.nxt_prev_id='';
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#PollContest').setDisabled(false);
            
            Ext.getCmp('PollContest_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(29);
        }
    } else if (config == 'messagingService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#MyAppMessages').setDisabled(false);
            Ext.getCmp('MyAppMessages_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(30);
        }
    } else if (config == 'photoContestService') {
        if (sessionStorage.SASLNAME) {
            sessionStorage.photo_nxt_prev_id='';
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#PhotoContest').setDisabled(false);
            Ext.getCmp('PhotoContest_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(33);
        }
    } else if (config == 'wallService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#wall').setDisabled(false);
            Ext.getCmp('wall_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(35);
        }
    } else if (config == 'clickToCallService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#clickToCall').setDisabled(false);
            Ext.getCmp('clickToCall_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(36);
        }
    } else if (config == 'drivingDirectionsService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#drivingDirections').setDisabled(false);
            Ext.getCmp('drivingDirections_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(37);
        }
    } else if (config == 'orderSiteCardsService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#orderSiteCards').setDisabled(false);
            Ext.getCmp('orderSiteCards_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(38);
        }
    } else if (config == 'widgetService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#widget').setDisabled(false);
            Ext.getCmp('widget_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(39);
        }
    } else if (config == 'qrCodeScanService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#QrCode').setDisabled(false);
            Ext.getCmp('QrCode_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(40);
        }
    } else if (config == 'themeSelectionService') {
        if (sessionStorage.SASLNAME) {
            /*var url = "http://sitelettes.com/themes?UID=" + sessionStorage.UID + "&serviceAccommodatorId=" + sessionStorage.SA + "&serviceLocationId=" + sessionStorage.SL;
            window.open(url);*/
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#themeSelector').setDisabled(false);
            Ext.getCmp('QrCode_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(44);
        }
    } else if (config == 'loyaltyService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#createLoyaltyProgram').setDisabled(false);
            Ext.getCmp('createLoyaltyProgram_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(41);
        }
    } else if (config == 'eventsService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#EventsService').setDisabled(false);
            Ext.getCmp('EventsService_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(43);
        }
    }else if (config == 'videoService') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#videos').setDisabled(false);
            Ext.getCmp('videos_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(45);
        }
    }
    else if (config == 'saslPreview') {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
            Ext.getCmp('main_tab').down('#AppPreview').setDisabled(false);
            Ext.getCmp('AppPreview_pageHeader').update('<span style="color:#000;font-size:20px; font-weight: bold;">' + JSON.stringify(pageHeader).replace(/"/g, '') + '</span>');
            Ext.getCmp('main_tab').setActiveTab(48);
        }
    }
}

// ################################# Ends ###################################

// ################################# Login Section ################################
com.faralam.registration.login = function (username, password, access_mode) {
    var data = {
        "userid": username,
        "password": password
    }
    data = JSON.stringify(data);

    console.log(username + "<>" + access_mode + "<>" + password);

    if (access_mode == 'demo') {
        //sessionStorage.accessMode = 'http://communitylive.co/apptsvc/rest/';
        sessionStorage.accessMode = 'https://simfel.com/apptsvc/rest/';
    } else {
        sessionStorage.accessMode = 'http://communitylive.ws/apptsvc/rest/';
        //sessionStorage.accessMode = 'https://simfel.com/apptsvc/rest/';
    }

    com.faralam.serverURL = sessionStorage.accessMode;

    var onsuccess = function (data, textStatus, jqXHR) {
        sessionStorage.UID = data.uid;
        if (data.isOwner) {
            com.faralam.getBusinessStatus(access_mode);
        } else {
            Ext.getCmp('main_tab').down('#login').setDisabled(true);
            Ext.getCmp('main_tab').down('#name_address').setDisabled(false);
            Ext.getCmp('main_tab').setActiveTab(3);

            /*if(data.registrationState == 'LEVEL3'){					
             Ext.getCmp('main_tab').down('#login').setDisabled(true);
             Ext.getCmp('main_tab').down('#name_address').setDisabled(false);
             Ext.getCmp('main_tab').setActiveTab(3);
             }else{
             com.faralam.evaluateEmailMobileVerificationStatus(data);
             }*/
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.loginWithUserNameURL = com.faralam.serverURL + 'authentication/login/';

    com.faralam.common.sendAjaxRequest(com.faralam.loginWithUserNameURL, "POST", data, onsuccess, onerror);

};

com.faralam.getBusinessStatus = function (access_mode) {
    com.faralam.get_business_status = com.faralam.serverURL + 'usersasl/getUserAndCommunity';
    com.faralam.get_business_status_msg = com.faralam.get_business_status + "?" + encodeURI('UID=' + sessionStorage.UID);
    console.log(access_mode);
    var onsuccess = function (data, textStatus, jqXHR) {

        if (data.community[0].sasls.length > 1) {
            if (access_mode == 'demo') {
				sessionStorage.themeDemo = 1;
			} else {
				sessionStorage.themeDemo = 0;
			}
            Ext.getCmp('main_tab').down('#select_business').setDisabled(false);
            Ext.getCmp('main_tab').down('#login').setDisabled(true);
            Ext.getCmp('main_tab').setActiveTab(11);
        } else {
		if (access_mode == 'demo') {
				//sessionStorage.accessMode = 'http://communitylive.co/apptsvc/rest/';
				sessionStorage.themeDemo = 1;
			} else {
				sessionStorage.themeDemo = 0;
				//sessionStorage.accessMode = 'https://simfel.com/apptsvc/rest/';
			}

            sessionStorage.SA = data.community[0].sasls[0].sa;
            sessionStorage.SL = data.community[0].sasls[0].sl;
            sessionStorage.SASLNAME = data.community[0].sasls[0].saslName;

            Ext.getCmp('main_tab').down('#start_screen').setDisabled(false);
            Ext.getCmp('main_tab').down('#login').setDisabled(true);
            Ext.getCmp('main_tab').setActiveTab(4);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_business_status_msg, "GET", {}, onsuccess, onerror);
}

com.faralam.SendEmailForResetPassword = function (val) {

        com.faralam.send_email_for_reset_password = com.faralam.serverURL + 'authentication/sendEmailForResetPassword';

        var data = {
            email: val
        }
        data = JSON.stringify(data);

        var onsuccess = function (data, textStatus, jqXHR) {
            Ext.MessageBox.alert('Success', 'A Temporary password sent to your mail box, please verify.', function () {
                Ext.getCmp('win_frwrd').close();
            });
        }

        var onerror = function (jqXHR, textStatus, errorThrown) {}

        com.faralam.common.sendAjaxRequest(com.faralam.send_email_for_reset_password, "POST", data, onsuccess, onerror);
    }

com.faralam.common.checkLogin = function(username, password,fl){
	com.faralam.checkLogin = com.faralam.serverURL + 'authentication/login';
	var data = {
        "userid": username,
        "password": password
    }
    data = JSON.stringify(data);
	
	var onsuccess = function (data, textStatus, jqXHR) {
        if(fl=="PAYPAL")
            {
             Ext.getCmp('log_paypal').close();   
		com.faralam.common.open_Paypal_modal();
            }
        else
            {
                Ext.getCmp('win5').close();
               com.faralam.common.ChangeBankDetailsLoginNew(); 
            }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {
		//Ext.MessageBox.alert('Error', 'Invalid Login Details.');
	}

    com.faralam.common.sendAjaxRequest(com.faralam.checkLogin, "POST", data, onsuccess, onerror);
}
com.faralam.common.open_Paypal_modal = function(){
    
	var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
    if (Ext.getCmp('win_paypal')) {
             
        var modal = Ext.getCmp('win_paypal');
        modal.destroy(modal, new Object());
    }
	var form_paypal = Ext.widget('form', {
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				border: false,
				bodyPadding: 10,

				fieldDefaults: {
					labelAlign: 'side',
					labelWidth: 150,
					labelStyle: 'font-weight:bold'
				},
				defaultType: 'textfield',
				items: [
				{
					xtype: 'toolbar',
					items: ['->',{
						text: 'Update',
						handler: function(){
                             var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            var acc_holder=Ext.getCmp('accountholder_paypal').getValue();
                            var email=Ext.getCmp('paypal_acc_holder_email').getValue();
                            if(acc_holder.trim()=='')
                                {
                                   Ext.MessageBox.alert('Error', 'Please Enter Account Holders Name.'); 
                                }
                            else if(email=='')
                                {
                                   Ext.MessageBox.alert('Error', 'Please Enter Account Holders Email.');  
                                }
                            else if(!re.test(email))
                                {
                                  Ext.MessageBox.alert('Error', 'Please enter a valid email.');  
                                }
                            else
                                {
                                    com.faralam.common.createFundSourcePaypal(acc_holder,email);
                                    
                                }
						}
					}]
				},
				{
						xtype: 'component',
						width:40,
						height:40,
						html: '<img style="padding-top:3px;" id="redLockImage" src="'+com.faralam.custom_img_path+'greenLock.png" height="40" data-qtip="Unlock">'
				},
                                                      {
                                                                    xtype: 'displayfield',
                                                                    fieldLabel: 'Paypal Account',
                                                                    labelStyle: 'color: #000 !important; width: 200px !important; font-weight: bold !important;',
                                                                    name: 'bank_account',
                                                                    id: 'bank_account',
                                                                    value: ''
                                                                },
                                                                {
                                                                    fieldLabel: 'Account Holder',
                                                                    afterLabelTextTpl: required,
                                                                    labelStyle: 'color: #000 !important;',
                                                                    allowBlank: false,
                                                                    itemId: 'accountholder_paypal',
                                                                    id: 'accountholder_paypal',
                                                                    name: 'accountholder_paypal',
                                                                    fieldStyle : "color:#000 !important;",
                                                                    inputWidth: 200,
                                                                    inputeight: 200,
                                                                    maxLength: 30,
                                                                    enableKeyEvents: true
                                                                },
                                                                {
                                                                    fieldLabel: 'Email',
                                                                    afterLabelTextTpl: required,
                                                                    labelStyle: 'color: #000 !important;',
                                                                    allowBlank: false,
                                                                    itemId: 'paypal_acc_holder_email',
                                                                    id: 'paypal_acc_holder_email',
                                                                    name: 'paypal_acc_holder_email',
                                                                    fieldStyle : "color:#000 !important;",
                                                                    inputWidth: 200,
                                                                    maxLength: 30,
                                                                    enableKeyEvents: true
                                                                }]
			});
			
	win_paypal = Ext.widget('window', {
		title: 'Pay Pal account ',
		id: 'win_paypal',
		closeAction: 'destroy',
		layout: 'fit',
		resizable: true,
		modal: true,
		items: form_paypal,
		defaultFocus: 'accountholder_paypal',
		listeners:{
			close:function(){
				form_paypal.getForm().reset();
			}
		}
	});
	win_paypal.show();
}
com.faralam.common.ChangeBankDetailsLoginNew = function (){
	var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
    if (Ext.getCmp('win6')) {
             
        var modal = Ext.getCmp('win6');
        modal.destroy(modal, new Object());
    }
	var form = Ext.widget('form', {
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				border: false,
				bodyPadding: 10,

				fieldDefaults: {
					labelAlign: 'side',
					labelWidth: 150,
					labelStyle: 'font-weight:bold'
				},
				defaultType: 'textfield',
				items: [
				{
					xtype: 'toolbar',
					items: ['->',{
						text: 'Update',
						handler: function(){
							/*if (this.up('form').getForm().isValid()) {
								var values = this.up('form').getForm().getValues();
								var usernameBankAccount = values.username_bank_account;
								var passwordBankAccount = values.password_bank_account;
								com.faralam.common.checkLogin(usernameBankAccount, passwordBankAccount);
							}*/
                            
                            com.faralam.common.createFundSource();
                            
						}
					}]
				},
				{
						xtype: 'component',
						width:40,
						height:40,
						html: '<img style="padding-top:3px;" id="redLockImage" src="'+com.faralam.custom_img_path+'greenLock.png" height="40" data-qtip="Unlock">'
				},
                    /*{
                                            xtype: 'fieldset',
                                            title: '<span style="color:black;font-weight:bold">Address</span>',
                                            collapsible: false,
                                            height:300,
                                            width:500,
                                            style: 'text-align:center;border:3px double #000',
                                            items: [{
                                                            xtype: 'container',
                                                            layout: 'vbox',
                                                            margin: '0 0 10 0',
                                                            height:280,
                                                            width:480,
                                                            items: []}]
                    }*/
                                                                {
                                                                    xtype: 'displayfield',
                                                                    fieldLabel: 'Address',
                                                                    labelStyle: 'color: #000 !important; width: 200px !important; font-weight: bold !important;',
                                                                    name: 'bank_account',
                                                                    id: 'bank_account',
                                                                    value: ''
                                                                },
                                                                {
                                                                    fieldLabel: 'Number',
                                                                    afterLabelTextTpl: required,
                                                                    labelStyle: 'color: #000 !important;',
                                                                    allowBlank: false,
                                                                    itemId: 'address_number',
                                                                    id: 'address_number',
                                                                    name: 'address_number',
                                                                    fieldStyle : "color:#000 !important;",
                                                                    inputWidth: 200,
                                                                    inputeight: 200,
                                                                    maxLength: 30,
                                                                    enableKeyEvents: true
                                                                },
                                                                {
                                                                    fieldLabel: 'Street',
                                                                    afterLabelTextTpl: required,
                                                                    labelStyle: 'color: #000 !important;',
                                                                    allowBlank: false,
                                                                    itemId: 'address_Street',
                                                                    id: 'address_Street',
                                                                    name: 'address_Street',
                                                                    fieldStyle : "color:#000 !important;",
                                                                    inputWidth: 200,
                                                                    maxLength: 30,
                                                                    enableKeyEvents: true
                                                                },
                                                                {
                                                                    fieldLabel: 'Street(line2)',
                                                                    labelStyle: 'color: #000 !important;',
                                                                    allowBlank: true,
                                                                    itemId: 'address_Street2',
                                                                    id: 'address_Street2',
                                                                    name: 'address_Street2',
                                                                    fieldStyle : "color:#000 !important;",
                                                                    inputWidth: 200,
                                                                    maxLength: 30,
                                                                    enableKeyEvents: true
                                                                },
                                                                {
                                                                    fieldLabel: 'City',
                                                                    afterLabelTextTpl: required,
                                                                    labelStyle: 'color: #000 !important;',
                                                                    allowBlank: false,
                                                                    itemId: 'address_City',
                                                                    id: 'address_City',
                                                                    name: 'address_City',
                                                                    fieldStyle : "color:#000 !important;",
                                                                    inputWidth: 200,
                                                                    maxLength: 30,
                                                                    enableKeyEvents: true
                                                                },
                                                                {
                                                                    fieldLabel: 'State',
                                                                    afterLabelTextTpl: required,
                                                                    labelStyle: 'color: #000 !important;',
                                                                    allowBlank: false,
                                                                    itemId: 'address_State',
                                                                    id: 'address_State',
                                                                    name: 'address_State',
                                                                    fieldStyle : "color:#000 !important;",
                                                                    inputWidth: 200,
                                                                    maxLength: 30,
                                                                    enableKeyEvents: true
                                                                },
                                                                {
                                                                    fieldLabel: 'Zip/Postal code',
                                                                    afterLabelTextTpl: required,
                                                                    labelStyle: 'color: #000 !important;',
                                                                    allowBlank: false,
                                                                    itemId: 'address_Zip',
                                                                    id: 'address_Zip',
                                                                    name: 'address_Zip',
                                                                    fieldStyle : "color:#000 !important;",
                                                                    inputWidth: 200,
                                                                    maxLength: 30,
                                                                    enableKeyEvents: true
                                                                },
                                                                {
                                                                    fieldLabel: 'Country',
                                                                    afterLabelTextTpl: required,
                                                                    labelStyle: 'color: #000 !important;',
                                                                    allowBlank: false,
                                                                    itemId: 'address_Country',
                                                                    id: 'address_Country',
                                                                    name: 'address_Country',
                                                                    fieldStyle : "color:#000 !important;",
                                                                    inputWidth: 200,
                                                                    maxLength: 30,
                                                                    enableKeyEvents: true
                                                                },                                      
                    {
					xtype: 'displayfield',
					fieldLabel: 'Back Account',
					labelStyle: 'color: #000 !important; width: 200px !important; font-weight: bold !important;',
					name: 'bank_account',
					id: 'bank_account',
					value: ''
				}, {
					fieldLabel: 'Account Holder',
					afterLabelTextTpl: required,
					labelStyle: 'color: #000 !important;',
					allowBlank: false,
					itemId: 'accountholder_bank_account',
					id: 'accountholder_bank_account',
					emptyText: '(Enter Account Holder Name)',
					name: 'accountholder_bank_account',
					fieldStyle : "color:#000 !important;",
					inputWidth: 200,
					maxLength: 30,
					enableKeyEvents: true
				},{
					fieldLabel: 'Bank Name',
					afterLabelTextTpl: required,
					labelStyle: 'color: #000 !important;',
					allowBlank: false,
					itemId: 'bankname_bank_account',
					id: 'bankname_bank_account',
					emptyText: '(Enter Bank Name)',
					name: 'bankname_bank_account',
					fieldStyle : "color:#000 !important;",
					inputWidth: 200,
					maxLength: 30,
					enableKeyEvents: true
				},{
					fieldLabel: 'Account Number',
					afterLabelTextTpl: required,
					labelStyle: 'color: #000 !important;',
					allowBlank: false,
					itemId: 'accountnumber_bank_account',
					id: 'accountnumber_bank_account',
					emptyText: '(Enter Account Number)',
					name: 'accountnumber_bank_account',
					fieldStyle : "color:#000 !important;",
					inputWidth: 200,
					maxLength: 30,
					enableKeyEvents: true,
					maskRe: /[0-9.]/
				},{
					fieldLabel: 'Bank routing',
					labelStyle: 'color: #000 !important;',
					allowBlank: false,
					itemId: 'bank_routing',
					id: 'bank_routing',
					emptyText: '(Enter Bank routing)',
					name: 'bank_routing',
					fieldStyle : "color:#000 !important;",
					inputWidth: 200,
					maxLength: 30,
					enableKeyEvents: true
				},{
					fieldLabel: 'IBAN',
					labelStyle: 'color: #000 !important;',
					allowBlank: false,
					itemId: 'iban_bank_account',
					id: 'iban_bank_account',
					emptyText: '(Enter IBAN Number)',
					name: 'iban_bank_account',
					fieldStyle : "color:#000 !important;",
					inputWidth: 200,
					maxLength: 30,
					enableKeyEvents: true
				},{
					fieldLabel: 'BIC',
					labelStyle: 'color: #000 !important;',
					allowBlank: false,
					itemId: 'BIC_bank_account',
					id: 'BIC_bank_account',
					name: 'BIC_bank_account',
					fieldStyle : "color:#000 !important;",
					inputWidth: 200,
					maxLength: 30,
					enableKeyEvents: true
				},{
					fieldLabel: 'SWIFT',
					labelStyle: 'color: #000 !important;',
					allowBlank: false,
					itemId: 'SWIFT_bank_account',
					id: 'SWIFT_bank_account',
					name: 'SWIFT_bank_account',
					fieldStyle : "color:#000 !important;",
					inputWidth: 200,
					maxLength: 30,
					enableKeyEvents: true
				},{
					fieldLabel: 'Other Number',
					labelStyle: 'color: #000 !important;',
					allowBlank: true,
					itemId: 'othertnumber_bank_account',
					id: 'othertnumber_bank_account',
					emptyText: '(Enter Other Number)',
					name: 'othertnumber_bank_account',
					fieldStyle : "color:#000 !important;",
					inputWidth: 200,
					maxLength: 30,
					enableKeyEvents: true
				},{
					fieldLabel: 'Branch City',
					labelStyle: 'color: #000 !important;',
					allowBlank: true,
					itemId: 'branchcity_bank_account',
					id: 'branchcity_bank_account',
					emptyText: '(Enter Branch City)',
					name: 'branchcity_bank_account',
					fieldStyle : "color:#000 !important;",
					inputWidth: 200,
					maxLength: 30,
					enableKeyEvents: true
				}]
			});
			
	win6 = Ext.widget('window', {
		title: 'Bank Account',
		id: 'win6',
		closeAction: 'hide',
		layout: 'fit',
		resizable: true,
		modal: true,
        width: 500,
		items: form,
		defaultFocus: 'accountholder_bank_account',
		listeners:{
			close:function(){
				form.getForm().reset();
			}
		}
	});
	win6.show();
}

com.faralam.common.createFundSource = function(name,email){
    com.faralam.createFundSource = com.faralam.serverURL + 'retail/createFundSource';
    com.faralam.createFundSource = com.faralam.createFundSource + "?" + encodeURI('UID=' + sessionStorage.UID );
    
                            var add_Number=Ext.getCmp('accountholder_bank_account').getValue();
                            var add_Street=Ext.getCmp('address_Street').getValue();
                            var add_Street2=Ext.getCmp('address_Street2').getValue();
                            var add_City=Ext.getCmp('address_City').getValue();
                            var add_State=Ext.getCmp('address_State').getValue();
                            var add_Zip=Ext.getCmp('address_Zip').getValue();
                            var add_Country=Ext.getCmp('address_Country').getValue();
                            
                            var acc_holder=Ext.getCmp('accountholder_bank_account').getValue();
                            var bank_name=Ext.getCmp('bankname_bank_account').getValue();
                            var acc_no=Ext.getCmp('accountnumber_bank_account').getValue();
                            var bank_routing=Ext.getCmp('bank_routing').getValue();
                            var iban=Ext.getCmp('iban_bank_account').getValue();
                            var BIC=Ext.getCmp('BIC_bank_account').getValue();
                            var SWIFT=Ext.getCmp('SWIFT_bank_account').getValue();
                            var other_no=Ext.getCmp('othertnumber_bank_account').getValue();
                            var branchcity=Ext.getCmp('branchcity_bank_account').getValue();
                            
                            var data={
                                    "number":add_Number,
                                    "street":add_Street,
                                    "city":add_City,
                                    "state":add_State,
                                    "zip":add_Zip,
                                    "country":add_Country,
                                    "firstName": "",
                                    "lastName": "",
                                    "name": "",
                                    "email": "",
                                    "accountNumber": acc_no,
                                    "bankNumber": "",
                                    "bankName": bank_name,
                                    "serviceCompany": "",
                                    "creditCardNumber": "",
                                    "expirationMonth": '',
                                    "expirationYear": '',
                                    "cvc": "",
                                    "telephone": "",
                                    "type":"BANK_US",
                                    "status":"PENDING",
                                    "newAddress":true,
                                    "iban":iban,
                                    "bic":BIC,
                                    "swift":SWIFT,
                                    "routing":bank_routing,
                                    "comments": ""
                            };
                            data=JSON.stringify(data);
                            console.log(data);
    console.log("url="+com.faralam.createFundSource);
    var onsuccess = function (data, textStatus, jqXHR) {
		
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {
		//Ext.MessageBox.alert('Error', 'Saving failed.');
	}
    com.faralam.common.sendAjaxRequest(com.faralam.createFundSource, "POST", data, onsuccess, onerror);
}
com.faralam.common.createFundSourcePaypal = function(acc_holder,email){
    com.faralam.createFundSourcePaypal = com.faralam.serverURL + 'retail/createFundSourcePaypal';
    com.faralam.createFundSourcePaypal = com.faralam.createFundSourcePaypal + "?" + encodeURI('UID=' + sessionStorage.UID );
    var data={ 
 "email":email,
 "name":acc_holder, 
 "type":"EMAIL_PAYPAL"
 };
    data=JSON.stringify(data);
    console.log(data);
    var onsuccess = function (data, textStatus, jqXHR) {
		Ext.MessageBox.alert('Success', data.explanation);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {
		//Ext.MessageBox.alert('Error', 'Saving failed.');
	}
    com.faralam.common.sendAjaxRequest(com.faralam.createFundSourcePaypal, "POST", data, onsuccess, onerror);
}
    // ###################### Ends # #######################

// ################################# Sign Up Section ##############################
/*com.faralam.registration.DrawCaptcha = function(){
 var text = "";		
 var possible = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
 for( var i=0; i < 6; i++ ){
 text += possible.charAt(Math.floor(Math.random() * possible.length));
 }		
 return text;
 };
 
 com.faralam.registration.registerFormValues = function(){
 com.faralam.loginValues = com.faralam.SignupForm.up('form').getValues();
 com.faralam.UserName = com.faralam.loginValues.signup_username;
 com.faralam.PassWord = com.faralam.loginValues.signup_password;
 com.faralam.Email = com.faralam.loginValues.signup_email;
 com.faralam.Mobile = com.faralam.loginValues.signup_phone;
 com.faralam.PromoCode = com.faralam.loginValues.signup_promo;
 
 com.faralam.registerURL = com.faralam.serverURL + 'authentication/registerNewOwner/';
 com.faralam.tempregisterURL =com.faralam.registerURL+ "?" + encodeURI('username=' + com.faralam.UserName + '&password=' + com.faralam.PassWord + '&email=' + com.faralam.Email + '&mobile=' + com.faralam.Mobile+'&promoCode='+com.faralam.PromoCode);
 
 var onsuccess=function (data, textStatus, jqXHR){
 sessionStorage.UID = data.uid;
 com.faralam.evaluateEmailMobileVerificationStatus(data);
 }        	
 
 var onerror =function(jqXHR, textStatus, errorThrown){
 }
 
 com.faralam.common.sendAjaxRequest(com.faralam.tempregisterURL, "POST", {}, onsuccess, onerror);
 
 }	
 
 com.faralam.registration.isEmailCheck = function(data){
 com.faralam.ereg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
 if(com.faralam.ereg.test(data)){
 return true;
 }else{
 Ext.getCmp('signup_email_err').setValue('<span>&nbsp;</span>');
 return false;
 }
 }
 
 com.faralam.registration.isEmailValid = function (data) {		
 Ext.getCmp('signup_email_err').setValue('<span>&nbsp;</span>');
 var onsuccess=function (data, textStatus, jqXHR){
 if(data.success){		
 Ext.getCmp('signup_email_err').setValue('<span style="color:green">Email ID Available</span>');				
 }else{			
 Ext.getCmp('signup_email_err').setValue('<span style="color:#CF4C35;">Email already used</span>');				
 }
 }
 
 var onerror=function() {					
 }
 
 com.faralam.emailURL = com.faralam.serverURL + 'authentication/isEmailAvailable/';
 com.faralam.common.sendAjaxRequest(com.faralam.emailURL, "GET", {email: data}, onsuccess, onerror);
 
 };
 
 com.faralam.registration.isUsernameValid = function (data) {
 Ext.getCmp('signup_username_err').setValue('<span>&nbsp;</span>');
 
 var data = {
 username: data
 }
 
 var onsuccess=function (data, textStatus, jqXHR){
 if(data.success){		
 Ext.getCmp('signup_username_err').setValue("<span style='color:green;'>Username Available</span>");				
 }else{			
 Ext.getCmp('signup_username_err').setValue("<span style='color:red;'>Invalid User Name. Already Exists</span>");				
 }
 }
 
 var onerror=function() {										
 }
 
 com.faralam.usernameURL = com.faralam.serverURL + 'authentication/isUserNameAvailable/';	
 com.faralam.common.sendAjaxRequest(com.faralam.usernameURL, "GET", data, onsuccess, onerror);
 
 };
 
 com.faralam.registration.isPhoneValid = function (data) {
 Ext.getCmp('signup_phone_err').setValue('<span>&nbsp;</span>');
 Ext.getCmp('mobileflag').setValue(0);
 
 var data =  {
 mobilenumber: data
 };
 
 var onsuccess=function (data, textStatus, jqXHR){
 if(data.success){				  											
 Ext.getCmp('signup_phone_err').setValue("<span style='color:green;'>Mobile Number Available.</span>");
 Ext.getCmp('mobileflag').setValue(1);
 }else{				  					
 Ext.getCmp('signup_phone_err').setValue("<span style='color:#CF4C35;'>Mobile Number Already used</span>");
 }
 } 
 
 var onerror=function() {			 
 }
 
 com.faralam.phoneURL = com.faralam.serverURL + 'authentication/isMobilePhoneAvailable/';
 com.faralam.common.sendAjaxRequest(com.faralam.phoneURL, "GET", data, onsuccess, onerror);				   
 
 };
 // ################################# Ends #####################################
 
 // ########################## Verify Section ###################################
 com.faralam.common.VerifyEmail = function(data){
 com.faralam.verifyEmailURL = com.faralam.serverURL	+ "authentication/verifyEmail?";
 
 var tempVerifyEmailURL =com.faralam.verifyEmailURL+ encodeURI('UID=' + sessionStorage.UID + '&code=' + data);		
 
 var onsuccess=function (data, textStatus, jqXHR){
 sessionStorage.VCODE = '';
 com.faralam.evaluateEmailMobileVerificationStatus(data);
 }
 
 var onerror =function(jqXHR, textStatus, errorThrown){
 }
 
 com.faralam.common.sendAjaxRequest(tempVerifyEmailURL, "PUT", {}, onsuccess, onerror);
 
 }
 
 com.faralam.common.VerifyMobile = function(data){
 com.faralam.verifyMobileURL = com.faralam.serverURL	+ "authentication/verifyMobile?";
 var tempVerifyMobileURL =com.faralam.verifyMobileURL+ encodeURI('UID=' + sessionStorage.UID + '&smsCode=' + data);
 
 var onsuccess=function (data, textStatus, jqXHR){
 com.faralam.evaluateEmailMobileVerificationStatus(data);
 }
 
 var onerror =function(jqXHR, textStatus, errorThrown){
 }
 
 com.faralam.common.sendAjaxRequest(tempVerifyMobileURL, "PUT", {}, onsuccess, onerror);
 
 }
 
 com.faralam.common.reSendEmailVerification = function(){
 com.faralam.reSendEmailVerificationURL = com.faralam.serverURL	+ "authentication/resendEmailVerificationCode?";
 var resendEmailVerificationCode = com.faralam.reSendEmailVerificationURL+ encodeURI('UID=' + sessionStorage.UID);
 
 var onsuccess=function (data, textStatus, jqXHR){
 }
 
 var onerror =function(jqXHR, textStatus, errorThrown){
 }
 
 com.faralam.common.sendAjaxRequest(resendEmailVerificationCode, "GET", {}, onsuccess, onerror);
 
 }
 
 com.faralam.common.reSendMobileVerification = function(){
 com.faralam.reSendMobileVerificationURL = com.faralam.serverURL	+ "authentication/resendMobileVerificationCode?";
 var resendMobileVerificationCode = com.faralam.reSendMobileVerificationURL+ encodeURI('UID=' + sessionStorage.UID);
 
 var onsuccess=function (data, textStatus, jqXHR){
 }
 
 var onerror =function(jqXHR, textStatus, errorThrown){
 }
 
 com.faralam.common.sendAjaxRequest(resendMobileVerificationCode, "GET", {}, onsuccess, onerror);
 
 }*/
// ##################################### Ends ################################	

// #################################### Restaurant Section ###############################
com.faralam.UpdateSaSlInfo = function (data) {

    com.faralam.update_sasl_info = com.faralam.serverURL + 'sasl/updateSASLInfo';
    com.faralam.update_sasl_info = com.faralam.update_sasl_info + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.EDITEDSA + '&serviceLocationId=' + sessionStorage.EDITEDSL);

    com.faralam.formValues = data;

    street2 = com.faralam.formValues.line2;
    zip = com.faralam.formValues.zip;
    street = com.faralam.formValues.street;
    state = com.faralam.formValues.state;
    number = com.faralam.formValues.house_number;
    res_email = com.faralam.formValues.res_email_addr;
    tel_number = com.faralam.formValues.res_tel_number;
    country = com.faralam.formValues.country;
    city = com.faralam.formValues.city;
    custom_url = com.faralam.formValues.custom_url;

    var datam = {
        "name": Ext.getCmp('edit_hidden_business_entry').getValue(),
        //"domain": Ext.getCmp('hidden_restaurant_business').getValue(),
        "friendlyURL": custom_url,
        "businessPhoneNumber": tel_number,
        "businessEmail": res_email,
        "promoCode": Ext.getCmp('edit_restaurant_promo_code').getValue(),
        "address": {
            //"degreeOfMatch":null,
            //"rating":null,
            "city": city,
            "country": country,
            "county": "",
            "number": number,
            "postalCode": "",
            "province": "",
            "state": state,
            "street": street,
            "street2": street2,
            "timeZone": null,
            "zip": zip
        },
        "contact": {
            "emailMain": res_email,
            "firstName": null,
            "lastName": null,
            "telephoneMain": null,
            "telephoneMobile": tel_number,
            "telephoneAux": null
        },
        "contactInfo": null,
        "themeColor": null
    }

    datam = JSON.stringify(datam);

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            com.faralam.registration.showPopup('Status', data.explanation);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.update_sasl_info, "POST", datam, onsuccess, onerror);
}

com.faralam.RetrieveSaSlInfo = function () {
    com.faralam.retrieve_sasl_info = com.faralam.serverURL + 'sasl/retrieveSASLInfo';
    com.faralam.retrieve_sasl_info = com.faralam.retrieve_sasl_info + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.EDITEDSA + '&serviceLocationId=' + sessionStorage.EDITEDSL);

    var onsuccess = function (data, textStatus, jqXHR) {

        Ext.getCmp('edit_friendly_url').setValue(data.friendlyURL);
        Ext.getCmp('edit_res_email_addr').setValue(data.businessEmail);
        Ext.getCmp('edit_res_tel_number').setValue(data.businessPhoneNumber);

        Ext.getCmp('edit_hidden_field_for_friendly_url').setValue('0');
        Ext.getCmp('edit_house_number').setValue(data.address.number);
        Ext.getCmp('edit_street').setValue(data.address.street);
        Ext.getCmp('edit_line2').setValue(data.address.street2);
        Ext.getCmp('edit_city').setValue(data.address.city);
        Ext.getCmp('edit_restaurant_state').setValue(data.address.state);
        Ext.getCmp('edit_restaurant_zip').setValue(data.address.zip);
        Ext.getCmp('edit_country').setValue(data.address.country);
        Ext.getCmp('edit_restaurant_promo_code').setValue()

        Ext.getCmp('edit_hidden_business_entry').setValue(data.name);
        Ext.getCmp('edit_hidden_restaurant_business').setValue(data.domain.enumText);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieve_sasl_info, "GET", {}, onsuccess, onerror);
}

com.faralam.claimOwnership = function (data1, data2) {

    com.faralam.restaurantClaimURL = com.faralam.serverURL + 'sasl/cloneAndClaimOwnership';
    com.faralam.restaurantClaimURL = com.faralam.restaurantClaimURL + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + data1 + '&serviceLocationId=' + data2 + '&friendlyURL=' + Ext.getCmp('friendly_url').getValue() + '&promoCode=' + Ext.getCmp('restaurant_promo_code').getValue());

    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.getCmp('main_tab').down('#new_business_success').setDisabled(false);
        Ext.getCmp('main_tab').setActiveTab(12);
        Ext.getCmp('main_tab').down('#name_address').setDisabled(true);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.restaurantClaimURL, "POST", {}, onsuccess, onerror);
}

com.faralam.createAndClaimOwnership = function () {

    com.faralam.formValues = Ext.getCmp('form').getValues();

    street2 = com.faralam.formValues.line2;
    zip = com.faralam.formValues.zip;
    street = com.faralam.formValues.street;
    state = com.faralam.formValues.state;
    number = com.faralam.formValues.house_number;
    res_email = com.faralam.formValues.res_email_addr;
    tel_number = com.faralam.formValues.res_tel_number;
    country = com.faralam.formValues.country;
    city = com.faralam.formValues.city;
    custom_url = com.faralam.formValues.custom_url;

    var params = com.faralam.FirstVisit();

    if (params) {
        if (params.domain) {
            com.faralam.restaurantClaimURL = com.faralam.serverURL + params.domain + '/createAndClaimOwnership';
        } else {
            com.faralam.restaurantClaimURL = com.faralam.serverURL + 'sasl/createAndClaimOwnership';
        }
    } else {
        com.faralam.restaurantClaimURL = com.faralam.serverURL + 'sasl/createAndClaimOwnership';
    }
    com.faralam.restaurantClaimURL = com.faralam.restaurantClaimURL + "?" + encodeURI('UID=' + sessionStorage.UID);

    var data = {
        "name": Ext.getCmp('business_entry').getValue(),
        "domain": Ext.getCmp('restaurant_business').getValue(),
        "friendlyURL": custom_url,
        "businessPhoneNumber": tel_number,
        "businessEmail": res_email,
        "promoCode": Ext.getCmp('restaurant_promo_code').getValue(),
        "address": {
            "city": city,
            "country": country,
            "county": "",
            "number": number,
            "postalCode": "",
            "province": "",
            "state": state,
            "street": street,
            "street2": street2,
            "timeZone": null,
            "zip": zip
        },
        "contact": {
            "emailMain": res_email,
            "firstName": null,
            "lastName": null,
            "telephoneMain": tel_number,
            "telephoneMobile": null,
            "telephoneAux": null
        },
        "contactInfo": null,
        "themeColor": null
    }

    data = JSON.stringify(data);

    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.getCmp('main_tab').down('#new_business_success').setDisabled(false);
        Ext.getCmp('main_tab').setActiveTab(12);
        Ext.getCmp('main_tab').down('#name_address').setDisabled(true);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.restaurantClaimURL, "POST", data, onsuccess, onerror);
}

Ext.apply(Ext.form.VTypes, {
    GalleryfileUploadAppIcon: function (val, field) {
        var fileName = /^.*\.(gif|png|jpg|jpeg)$/i;
        var file = Ext.getCmp('from_computer_gallery_app_icon').getEl().down('input[type=file]').dom.files[0];
        if (!fileName.test(val)) {
            Ext.getCmp('from_computer_gallery_app_icon').vtypeText = 'Image must be in .gif,.png,.jpg,.jpeg format';
            return false;
        } else if (file.size > 1024 * 1024) {
            Ext.getCmp('from_computer_gallery_app_icon').vtypeText = 'Maximun size for image 1MB';
            return false;
        } else {
            return true;
        }
    }
});

Ext.apply(Ext.form.VTypes, {
    GalleryfileUpload: function (val, field) {
        var fileName = /^.*\.(gif|png|jpg|jpeg)$/i;
        var file = Ext.getCmp('from_computer_gallery').getEl().down('input[type=file]').dom.files[0];
        if (!fileName.test(val)) {
            Ext.getCmp('from_computer_gallery').vtypeText = 'Image must be in .gif,.png,.jpg,.jpeg format';
            return false;
        } else if (file.size > 1024 * 1024) {
            Ext.getCmp('from_computer_gallery').vtypeText = 'Maximun size for image 1MB';
            return false;
        } else {
            return true;
        }
    }
});

Ext.apply(Ext.form.VTypes, {
    fileGalleryUploadByURLAppIcon: function (val, field) {
        var fileName = /^.*\.(gif|png|jpg|jpeg)$/i;
        if (!fileName.test(val)) {
            Ext.getCmp('image_url_gallery_app_icon').vtypeText = 'Must be in .gif,.png,.jpg,.jpeg format';
            return false;
        } else {
            return true;
        }
    }
});

Ext.apply(Ext.form.VTypes, {
    fileGalleryUploadByURL: function (val, field) {
        var fileName = /^.*\.(gif|png|jpg|jpeg)$/i;
        if (!fileName.test(val)) {
            Ext.getCmp('image_url_gallery').vtypeText = 'Must be in .gif,.png,.jpg,.jpeg format';
            return false;
        } else {
            return true;
        }
    }
});

/*com.faralam.common.setSASLLogo = function(sa, sl, file){
 
 com.faralam.loginMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait ..."});
 com.faralam.loginMask.show();
 
 var xhr = new XMLHttpRequest(),
 method = 'POST',
 url = com.faralam.serverURL+'sasl/setSASLLogo?serviceAccommodatorId='+sa+'&serviceLocationId='+sl+'&UID='+sessionStorage.UID;			
 
 var formData = new FormData();				
 formData.append(file.name, file);
 
 var onLoadHandler = function(event) {
 com.faralam.loginMask.hide();
 if(event.target.readyState == 4){
 if(event.target.status == 200){
 com.faralam.registration.showPopup('Success', 'You have successfully updated the Logo.');					
 }else{								
 com.faralam.common.ErrorHandling(event.target.responseText);
 return false;
 }					
 }				  
 }
 
 xhr.open(method, url, true);
 xhr.onload = onLoadHandler;
 xhr.send(formData);
 }
 
 com.faralam.common.setAppIcon = function(sa, sl, file){
 
 com.faralam.loginMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait ..."});
 com.faralam.loginMask.show();
 
 var xhr = new XMLHttpRequest(),
 method = 'POST',
 url = com.faralam.serverURL+'sasl/setATC60bySASL?serviceAccommodatorId='+sa+'&serviceLocationId='+sl+'&UID='+sessionStorage.UID;			
 
 var formData = new FormData();				
 formData.append(file.name, file);
 
 var onLoadHandler = function(event) {
 com.faralam.loginMask.hide();
 if(event.target.readyState == 4){
 if(event.target.status == 200){
 com.faralam.registration.showPopup('Success', 'You have successfully updated the App Icon.');					
 }else{								
 com.faralam.common.ErrorHandling(event.target.responseText);
 return false;
 }					
 }				  
 }
 
 xhr.open(method, url, true);
 xhr.onload = onLoadHandler;
 xhr.send(formData);
 }*/

// ############################### Ends ####################################

// ############################ Gallery Section #############################

com.faralam.common.activateMedia = function (sa, sl, ID, target_id) {

    //com.faralam.activate_media = com.faralam.serverURL + 'media/activateMediaById';	
    com.faralam.activate_media = com.faralam.serverURL + 'media/activateMediaByIdAfterId';
    com.faralam.activate_media = com.faralam.activate_media + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl + '&id=' + ID + '&insertAfterId=' + target_id);
    //com.faralam.activate_media = com.faralam.activate_media+ "?" + encodeURI('UID='+sessionStorage.UID+'&serviceAccommodatorId='+sa + '&serviceLocationId=' + sl + '&id='+ID);

    var datam = "[]";
    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'The selected image activated successfully', function () {
            com.faralam.common.retrieveMediaMetaDataBySASL(sa, sl);
            com.faralam.common.retrieveMobileGalleryInfo(sa, sl);
            com.faralam.common.retrieveMemberMediaMetaDataBySASL(sa, sl);
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.activate_media, "PUT", datam, onsuccess, onerror);
}

com.faralam.common.deActivateMedia = function (sa, sl, ID) {

    com.faralam.deactivate_media = com.faralam.serverURL + 'media/deActivateMediaById';
    com.faralam.deactivate_media = com.faralam.deactivate_media + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl + '&id=' + ID);

    var datam = "[]";
    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'The selected image deactivated successfully', function () {
            com.faralam.common.retrieveMediaMetaDataBySASL(sa, sl);
            com.faralam.common.retrieveMobileGalleryInfo(sa, sl);
            com.faralam.common.retrieveMemberMediaMetaDataBySASL(sa, sl);
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.deactivate_media, "PUT", datam, onsuccess, onerror);
}

com.faralam.common.retrieveMobileGalleryInfo = function (sa, sl) {

    com.faralam.retrieve_mobile_info = com.faralam.serverURL + 'media/retrieveMediaMetaDataBySASL';
    com.faralam.retrieve_mobile_info = com.faralam.retrieve_mobile_info + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl + '&status=ACTIVE');

    var onsuccess = function (data, textStatus, jqXHR) {
        var html1 = '';
        if (data.length > 0) {
            var timestamp = new Date().getTime();
            for (var i = 0; i < data.length; i++) {
                var description = '' + encodeURI(data[i].message) + '';
                var title = '' + encodeURI(data[i].title) + '';
                var params = data[i].id + '~' + title + '~' + description + '~' + data[i].url;
                var param = data[i].id + ',' + data[i].serviceAccommodatorId + ',' + data[i].serviceLocationId + ',' + data[i].type;
                var data_value = data[i].index + ',' + data[i].serviceAccommodatorId + ',' + data[i].serviceLocationId;

                html1 += '<li ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)"><img total_count = "' + data.length + '" img_id = "' + data[i].id + '" selector = "' + data[i].index + '" data-value = "' + data_value + '" params="' + param + '" param="' + params + '" id="gallery_drag_zone_active" class="before_dragging" ondragend="com.faralam.dragEnd(event)" ondragstart="com.faralam.dragStart(event)" onclick="com.faralam.showGalleryImage(this)" src=' + data[i].thumbURL + '&ver=' + timestamp + ' style="margin:1px 3px;"></li>';
            }

            Ext.getCmp('gallery_show_image_title').setValue(data[0].title);
            Ext.getCmp('gallery_show_image').setSrc(data[0].url + '&ver=' + timestamp);
            Ext.getCmp('gallery_textarea').setValue(data[0].message);
            Ext.getCmp('gallery_picture_id').setValue(data[0].id);
        } else {
            html1 = '<li ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)" id="mobile_gallery"></li>';
            Ext.getCmp('gallery_save_pic_txt').setDisabled(true);
        }
        html1 = '<ul class="wrapper" ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)" id="mobile_gallery">' + html1 + '</ul>';

        Ext.getCmp('mobile_gallery').update(html1);
        $('ul#mobile_gallery').perfectScrollbar({
            suppressScrollX: true
        });
        //$('div#slide_panel_promotion-innerCt').perfectScrollbar('destroy');
        //$("div#slide_panel_promotion-innerCt").perfectScrollbar();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieve_mobile_info, "GET", {}, onsuccess, onerror, 'slider');
}

com.faralam.common.retrieveMediaMetaDataBySASL = function (sa, sl) {
    com.faralam.retrieveMediaMetaDataBySASL = com.faralam.serverURL + 'media/retrieveMediaMetaDataBySASL';
    com.faralam.retrieveMediaMetaDataBySASL = com.faralam.retrieveMediaMetaDataBySASL + "?" + encodeURI('serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl + '&mediaType=GALLERY_OWNER&status=ALL');

    var onsuccess = function (response, textStatus, jqXHR) {

        var html = '';
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].status != 'ACTIVE') {
                    var timestamp = new Date().getTime();
                    var del_params = response[i].index + ',' + sa + ',' + sl;
                    var del_param = response[i].id + ',' + sa + ',' + sl;

                    var overlay_img = '';
                    /*if(response[i].status == 'PROPOSED'){
                     overlay_img = com.faralam.custom_img_path+'PROPOSED.png';
                     }else if(response[i].status == 'REJECTED'){
                     overlay_img = com.faralam.custom_img_path+'REJECTED.png';
                     }else if(response[i].status == 'APPROVED'){
                     overlay_img = com.faralam.custom_img_path+'APPROVED.png';
                     }*/

                    overlay_img = com.faralam.getImgStatus(response[i].status);

                    var description = '' + encodeURI(response[i].message) + '';
                    var title = '' + encodeURI(response[i].title) + '';
                    var params_owner = response[i].id + '~' + title + '~' + description + '~' + response[i].url;
                    var param_owner = response[i].id + ',' + response[i].serviceAccommodatorId + ',' + response[i].serviceLocationId + ',' + response[i].type;

                    html += '<li ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)"><img width="53" height="40" data-qtip=' + response[i].status + ' param=' + del_param + ' params=' + del_params + ' param_owner=' + param_owner + ' params_owner=' + params_owner + ' id="gallery_drag_zone_owner" onclick="com.faralam.showGalleryImage(this)" class="before_dragging" ondragend="com.faralam.dragEnd(event)" ondragstart="com.faralam.dragStart(event)" src=' + response[i].thumbURL + '&ver=' + timestamp + '><div class="gallery_overlay"><span><img src="' + overlay_img + '" alt="" /></span></div></li>';
                }
            }
            if (html) {
                html = '<ul style="position:relative;" ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)" id="deactivate_zone" class="images">' + html + '</ul>';
            } else {
                html = '<ul ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)" id="deactivate_zone" class="images" style="text-align:center;height:60px;"><li ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)" id="deactivate_zone">No image(s) available</li></ul>';
            }
        } else {
            html = '<ul ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)" id="deactivate_zone" class="images" style="text-align:center;height:60px;"><li ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)" id="deactivate_zone">No image(s) available</li></ul>';
        }

        Ext.getCmp('slide_panel').update(html);

        $('ul#deactivate_zone').perfectScrollbar('destroy');
        $('ul#deactivate_zone').perfectScrollbar();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieveMediaMetaDataBySASL, "GET", {}, onsuccess, onerror, 'slider');
}
com.faralam.getRating = function (e) {
    Ext.getCmp('userrating_value').setValue(e.getAttribute('value'));
}
com.faralam.common.setRating = function (e) {
    var rate = Ext.getCmp('userrating_value').getValue();
    if (rate != 0) {
        com.faralam.setRating = com.faralam.serverURL + 'usersasl/setRating';
        com.faralam.setRating = com.faralam.setRating + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID + '&ratingInt=' + rate + '&userName=' + sessionStorage.userName);
        console.log(rate);
        var onsuccess = function (response, textStatus, jqXHR) {
            if (response.success) {
                Ext.MessageBox.alert('Success', 'Rating Submitted successfully.');
            }
        }
        var onerror = function (jqXHR, textStatus, errorThrown) {}
        com.faralam.common.sendAjaxRequest(com.faralam.setRating, "PUT", {}, onsuccess, onerror);
    } else {
        Ext.MessageBox.alert('Error', 'Please Rate First.');
    }
}

com.faralam.common.retrieveMemberMediaMetaDataBySASL = function (sa, sl) {
    com.faralam.retrieveMediaMetaDataBySASL = com.faralam.serverURL + 'media/retrieveMediaMetaDataBySASL';
    com.faralam.retrieveMediaMetaDataBySASL = com.faralam.retrieveMediaMetaDataBySASL + "?" + encodeURI('serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl + '&mediaType=GALLERY_MEMBER&status=ALL');

    var onsuccess = function (response, textStatus, jqXHR) {

        var html = '';
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].status != 'ACTIVE') {
                    var timestamp = new Date().getTime();
                    var del_params = response[i].index + ',' + sa + ',' + sl;
                    var del_param = response[i].id + ',' + sa + ',' + sl;

                    var overlay_img = '';
                    /*if(response[i].status == 'PROPOSED'){
                     overlay_img = com.faralam.custom_img_path+'PROPOSED.png';
                     }else if(response[i].status == 'REJECTED'){
                     overlay_img = com.faralam.custom_img_path+'REJECTED.png';
                     }else if(response[i].status == 'APPROVED'){
                     overlay_img = com.faralam.custom_img_path+'APPROVED.png';
                     }*/

                    overlay_img = com.faralam.getImgStatus(response[i].status);

                    var description = '' + encodeURI(response[i].message) + '';
                    var title = '' + encodeURI(response[i].title) + '';
                    var params_member = response[i].id + '~' + title + '~' + description + '~' + response[i].url;
                    var param_member = response[i].id + ',' + response[i].serviceAccommodatorId + ',' + response[i].serviceLocationId + ',' + response[i].type;

                    html += '<li ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)"><img width="53" height="40" data-qtip=' + response[i].status + ' param=' + del_param + ' params=' + del_params + ' param_member=' + param_member + ' params_member=' + params_member + ' id="gallery_drag_zone_member" onclick="com.faralam.showGalleryImage(this)" class="before_dragging" ondragend="com.faralam.dragEnd(event)" ondragstart="com.faralam.dragStart(event)" src=' + response[i].thumbURL + '&ver=' + timestamp + '><div class="gallery_overlay"><span><img src="' + overlay_img + '" alt="" /></span></div></li>';
                }
            }
            if (html) {
                html = '<ul ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)" style="position:relative;" class="images" id="member_scroll">' + html + '</ul>';
            } else {
                html = '<ul ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)" class="images" style="text-align:center;height:60px;" id="member_scroll"><li>No image(s) available</li></ul>';
            }
        } else {
            html = '<ul ondrop="com.faralam.drop(event)" ondragover="com.faralam.allowDrop(event)" class="images" style="text-align:center;height:60px;" id="member_scroll"><li>No image(s) available</li></ul>';
        }

        Ext.getCmp('slide_panel1').update(html);

        $('ul#member_scroll').perfectScrollbar('destroy');
        $('ul#member_scroll').perfectScrollbar();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieveMediaMetaDataBySASL, "GET", {}, onsuccess, onerror, 'slider');
}

com.faralam.common.RemoveGalleryImage = function (index, sa, sl, status, id) {

    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete the selected image?', function (e) {
        if (e == 'yes') {

            //com.faralam.remove_image = com.faralam.serverURL + 'media/deleteMediaByIndex';	
            //com.faralam.remove_image = com.faralam.remove_image+ "?" + encodeURI('UID=' + sessionStorage.UID + '&index=' + index + '&serviceAccommodatorId='+sa + '&serviceLocationId=' + sl);

            com.faralam.remove_image = com.faralam.serverURL + 'media/retireMediaById';
            com.faralam.remove_image = com.faralam.remove_image + "?" + encodeURI('UID=' + sessionStorage.UID + '&id=' + id + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl);

            var onsuccess = function (data, textStatus, jqXHR) {
                Ext.MessageBox.alert('Success', 'The selected image deleted successfully', function () {
                    com.faralam.common.retrieveMediaMetaDataBySASL(sa, sl);
                    com.faralam.common.retrieveMobileGalleryInfo(sa, sl);
                    com.faralam.common.retrieveMemberMediaMetaDataBySASL(sa, sl);
                });
            }

            var onerror = function (jqXHR, textStatus, errorThrown) {}

            com.faralam.common.sendAjaxRequest(com.faralam.remove_image, "DELETE", {}, onsuccess, onerror);
        }
    });

}

com.faralam.common.updateAboutUs = function (sa, sl) {
    com.faralam.updateAboutUs = com.faralam.serverURL + 'sasl/updateAboutUsHTML';
    com.faralam.updateAboutUs = com.faralam.updateAboutUs + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl);

    datam = Ext.getCmp('editor_content').getValue();

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            Ext.MessageBox.alert('Success', 'Saved successfully.', function () {
                com.faralam.common.retrieveAboutUs(sa, sl);
            });
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.updateAboutUs, "PUT", datam, onsuccess, onerror, false, 'text/plain');
}

com.faralam.common.retrieveAboutUs = function (sa , sl) {
    com.faralam.retrieveAboutUs = com.faralam.serverURL + 'sasl/retrieveAboutUsHTML';
    com.faralam.retrieveAboutUs = com.faralam.retrieveAboutUs + "?" + encodeURI('serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl);

    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.getCmp('editor_content').setValue('');
        if (!data) {
            console.log("pass1");
            Ext.getCmp('gallery_limit').setValue(com.faralam.Editor_MaxLength + ' character(s) left');
        } else {
            
            //Ext.getCmp('about_us_btn').setText('Save');
            console.log("pass2");
            Ext.getCmp('editor_content').setValue(data);
            var text = Ext.util.Format.stripTags(data);
            Ext.getCmp('gallery_limit').setValue(parseInt(com.faralam.Editor_MaxLength) - parseInt(text.length) + ' character(s) left');
            //Ext.getCmp('about_us_btn').setText('Save');
            console.log("pass3");
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieveAboutUs, "GET", {}, onsuccess, onerror);
}

com.faralam.allowDrop = function (ev) {
    ev.preventDefault();
}

com.faralam.dragStart = function (ev) {
    if (ev.target.id == 'gallery_drag_zone_active' || ev.target.id == 'gallery_drag_zone_owner' || ev.target.id == 'gallery_drag_zone_member') {
        ev.dataTransfer.setData('Text', ev.target.id);
        ev.dataTransfer.setData('img_params', ev.target.getAttribute('params'));
        ev.dataTransfer.setData('img_param', ev.target.getAttribute('param'));
        ev.dataTransfer.setData('data_value', ev.target.getAttribute('data-value'));
        ev.target.className = 'after_dragging';
        com.faralam.fire_count = 0;
    }
}

com.faralam.ChangeGalleryImageOrder = function (id, insertafterid, source_index, destiny_index, sa, sl, total_count) {

    var insertafterid;
    if (destiny_index == 1) { // moving to top
        insertafterid = '0';
    } else {
        if (source_index > destiny_index) { // moving upwards
            var select = $("ul").find("[selector='" + destiny_index + "']").parent().prev().children();
            insertafterid = $(select).attr('img_id');
        } else if (source_index < destiny_index) { // moving downwards
            if (source_index == destiny_index - 1) { // for adjacent images
                insertafterid = insertafterid;
            } else if (destiny_index == total_count) { // for last image
                insertafterid = insertafterid;
            } else {
                var select = $("ul").find("[selector='" + destiny_index + "']").parent().prev().children();
                insertafterid = $(select).attr('img_id');
            }
        }
    }

    com.faralam.change_gallery_image_order = com.faralam.serverURL + 'media/positionIdAfterId';
    com.faralam.change_gallery_image_order = com.faralam.change_gallery_image_order + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl + '&id=' + id + '&insertAfterId=' + insertafterid);

    var onsuccess = function (data, textStatus, jqXHR) {
        com.faralam.common.retrieveMobileGalleryInfo(sessionStorage.SA, sessionStorage.SL);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.change_gallery_image_order, "PUT", {}, onsuccess, onerror);
}

com.faralam.drop = function (ev) {

    ev.preventDefault();
    var drag_data = ev.dataTransfer.getData('Text');

    if (ev.target.id == 'drop_element') {
        if (drag_data == 'gallery_drag_zone_owner' || drag_data == 'gallery_drag_zone_member') {
            var img_params = ev.dataTransfer.getData('img_params').split(',');
            var del_id = ev.dataTransfer.getData('img_param').split(',');
            com.faralam.common.RemoveGalleryImage(img_params[0], img_params[1], img_params[2], drag_data, del_id[0]);
        } else if (drag_data == 'gallery_drag_zone_active') {
            var img_params = ev.dataTransfer.getData('data_value').split(',');
            var del_id = ev.dataTransfer.getData('img_param').split('~');
            com.faralam.common.RemoveGalleryImage(img_params[0], img_params[1], img_params[2], drag_data, del_id[0]);
        }
    } else if (ev.target.id == 'deactivate_zone') {
        if (drag_data == 'gallery_drag_zone_active') {
            var img_params = ev.dataTransfer.getData('img_params').split(',');
            if (img_params[3] == 'GALLERY_OWNER') {
                com.faralam.common.deActivateMedia(img_params[1], img_params[2], img_params[0]);
            } else {
                com.faralam.registration.showPopup('Status', 'You can not drop image to this section as it is Member image.');
            }
        }
    } else if (ev.target.id == 'member_scroll') {
        if (drag_data == 'gallery_drag_zone_active') {
            var img_params = ev.dataTransfer.getData('img_params').split(',');
            if (img_params[3] == 'GALLERY_MEMBER') {
                com.faralam.common.deActivateMedia(img_params[1], img_params[2], img_params[0]);
            } else {
                com.faralam.registration.showPopup('Status', 'You can not drop image to this section as it is Owner Image.');
            }
        }
    } else if (ev.target.id == 'mobile_gallery') {
        if (drag_data == 'gallery_drag_zone_owner') {
            var img_param = ev.dataTransfer.getData('img_param').split(',');

            if ($(ev.target).attr('img_id')) {
                var target_id = $(ev.target).attr('img_id');
            } else {
                if ($('ul#mobile_gallery li').first().html()) {
                    var target_id = $('ul#mobile_gallery li').last().children().attr('param').split('~')[0];
                } else {
                    var target_id = 0;
                }
            }
            com.faralam.common.activateMedia(img_param[1], img_param[2], img_param[0], target_id);
        } else if (drag_data == 'gallery_drag_zone_member') {
            var img_param = ev.dataTransfer.getData('img_param').split(',');
            if ($('ul#mobile_gallery li').first().html()) {
                var target_id = $('ul#mobile_gallery li').last().children().attr('param').split('~')[0];
            } else {
                var target_id = 0;
            }
            com.faralam.common.activateMedia(img_param[1], img_param[2], img_param[0], target_id);
        }
    } else if (ev.target.id == 'gallery_drag_zone_active' && com.faralam.fire_count == 0) {
        if (drag_data == 'gallery_drag_zone_owner') {
            var img_param = ev.dataTransfer.getData('img_param').split(',');
            var target_id;
            if ($(ev.target).attr('selector') == 1) {
                target_id = 0;
            } else {
                target_id = $(ev.target).parent().prev().children().attr('img_id');
            }
            com.faralam.common.activateMedia(img_param[1], img_param[2], img_param[0], target_id);
        } else if (drag_data == 'gallery_drag_zone_member') {
            var img_param = ev.dataTransfer.getData('img_param').split(',');
            var target_id;
            if ($(ev.target).attr('selector') == 1) {
                target_id = 0;
            } else {
                target_id = $(ev.target).parent().prev().children().attr('img_id');
            }
            com.faralam.common.activateMedia(img_param[1], img_param[2], img_param[0], target_id);
        } else {
            var img_params = ev.dataTransfer.getData('img_params').split(',');
            var img_param = ev.target.getAttribute('params').split(',');
            var source_params = ev.dataTransfer.getData('data_value').split(',');
            var destiny_params = ev.target.getAttribute('data-value').split(',');
            var total_count = ev.target.getAttribute('total_count').split(',');
            if (img_params[0] != img_param[0]) {
                com.faralam.ChangeGalleryImageOrder(img_params[0], img_param[0], source_params[0], destiny_params[0], img_param[1], img_param[2], total_count);
            }
        }
        com.faralam.fire_count++;
    }
}

com.faralam.dragEnd = function (ev) {
    ev.target.className = 'before_dragging';
}

com.faralam.showGalleryImage = function (e) {

    if (e.getAttribute('param')) {
        var n = e.getAttribute('param').split('~');
    }
    if (e.getAttribute('params_owner')) {
        var n = e.getAttribute('params_owner').split('~');
    }
    if (e.getAttribute('params_member')) {
        var n = e.getAttribute('params_member').split('~');
    }

    Ext.getCmp('gallery_show_image_title').setValue(decodeURI(n[1]));
    Ext.getCmp('gallery_show_image').setSrc(n[3]);
    Ext.getCmp('gallery_textarea').setValue(decodeURI(n[2]));
    Ext.getCmp('gallery_picture_id').setValue(n[0]);
}

com.faralam.common.setGalleryTitle = function (id, sa, sl, data) {

    com.faralam.update_media_title = com.faralam.serverURL + 'media/updateMediaTitle';
    com.faralam.update_media_title = com.faralam.update_media_title + "?" + encodeURI('id=' + id + '&UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl);

    //console.log(data);
    //data = JSON.stringify(data);
    //console.log(data);

    var onsuccess = function (data, textStatus, jqXHR) {
        //if(jqXHR.status){
        if (data) {
            com.faralam.common.retrieveMobileGalleryInfo(sa, sl);
            com.faralam.common.retrieveMediaMetaDataBySASL(sa, sl);
            com.faralam.common.retrieveMemberMediaMetaDataBySASL(sa, sl);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.update_media_title, "PUT", data, onsuccess, onerror);
}

com.faralam.common.setGalleryMessage = function (id, sa, sl, data) {

        com.faralam.update_media_message = com.faralam.serverURL + 'media/updateMediaMessage';
        com.faralam.update_media_message = com.faralam.update_media_message + "?" + encodeURI('id=' + id + '&UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl);

        //data = JSON.stringify(data);
        //console.log(data);

        var onsuccess = function (data, textStatus, jqXHR) {
            //if(jqXHR.status){
            if (data) {
                com.faralam.common.retrieveMobileGalleryInfo(sa, sl);
                com.faralam.common.retrieveMediaMetaDataBySASL(sa, sl);
                com.faralam.common.retrieveMemberMediaMetaDataBySASL(sa, sl);
            }
        }

        var onerror = function (jqXHR, textStatus, errorThrown) {}

        com.faralam.common.sendAjaxRequest(com.faralam.update_media_message, "PUT", data, onsuccess, onerror);
    }
    // ############################# Ends #################################

// ############################ Other Info Section ##########################
com.faralam.retrieveOtherInfo = function (sa, sl) {

    com.faralam.retrieveSASLMetaDataPortal = com.faralam.serverURL + 'sasl/retrieveSASLMetaDataPortal';
    com.faralam.retrieveSASLMetaDataPortal = com.faralam.retrieveSASLMetaDataPortal + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl);

    var onsuccess = function (data, textStatus, jqXHR) {
         
        if (Ext.getCmp('other_info_first_part').items.length > 0) {
            Ext.getCmp('other_info_first_part').removeAll();
        }

        var label_width = 250;

        // for select section
        if (data.multiValueOptions) {
            if (data.multiValueOptions.length > 0) {

                var container_select = new Ext.Container({
                    layout: {
                        type: 'table',
                        columns: 1
                    },
                    //margin: '0 0 20 0',
                    items: []
                });

                for (var i = 0; i < data.multiValueOptions.length; i++) {

                    var states = '';
                    states = Ext.create('Ext.data.Store', {
                        fields: ['key', 'value'],
                        data: []
                    });

                    for (var k = 0; k < data.multiValueOptions[i].options.length; k++) {
                        var other_info_combo_store_val = '';
                        other_info_combo_store_val = {
                            "key": data.multiValueOptions[i].options[k].id,
                            "value": data.multiValueOptions[i].options[k].displayText
                        };
                        states.add(other_info_combo_store_val);
                    }

                    if (data.multiValueOptions[i].visible) {
                        var field_combo = new Ext.form.ComboBox({
                            fieldLabel: data.multiValueOptions[i].key.displayText,
                            name: 'combo_' + data.multiValueOptions[i].key.id,
                            id: 'combo_' + data.multiValueOptions[i].key.id,
                            labelAlign: 'right',
                            labelWidth: label_width,
                            labelSeparator: '  ',
                            queryMode: 'local',
                            store: states,
                            displayField: 'value',
                            valueField: 'key',
                            autoSelect: true,
                            forceSelection: false,
                            editable: false,
                            inputWidth: 480,
                            value: ''
                        });
                    } else {
                        var field_combo = new Ext.form.ComboBox({
                            fieldLabel: data.multiValueOptions[i].key.displayText,
                            name: 'combo_' + data.multiValueOptions[i].key.id,
                            id: 'combo_' + data.multiValueOptions[i].key.id,
                            labelAlign: 'right',
                            labelWidth: label_width,
                            labelSeparator: '  ',
                            queryMode: 'local',
                            store: states,
                            hidden: true,
                            displayField: 'value',
                            valueField: 'key',
                            autoSelect: true,
                            forceSelection: false,
                            editable: false,
                            inputWidth: 480,
                            value: ''
                        });
                    }
                    field_combo.setValue(data.multiValueOptions[i].value.displayText);
                    container_select.add(field_combo);
                }
                Ext.getCmp('other_info_first_part').add(container_select);
            }
        }

        // for radio section
        if (data.booleanValueOptions) {
            if (data.booleanValueOptions.length > 0) {

                var container_radio = new Ext.Container({
                    layout: {
                        type: 'table',
                        columns: 1
                    },
                    //margin: '0 0 20 0',
                    items: []
                });

                for (var i = 0; i < data.booleanValueOptions.length; i++) {

                    if (data.booleanValueOptions[i].visible) {
                        var field_radio = '';
                        field_radio = new Ext.form.FieldContainer({
                            items: [{
                                xtype: 'radiogroup',
                                fieldLabel: data.booleanValueOptions[i].key.displayText,
                                id: 'other_info_radio_' + i,
                                labelAlign: 'right',
                                labelWidth: label_width,
                                width: 695,
                                items: []
                                }]
                        });
                    } else {
                        var field_radio = '';
                        field_radio = new Ext.form.FieldContainer({
                            items: [{
                                xtype: 'radiogroup',
                                fieldLabel: data.booleanValueOptions[i].key.displayText,
                                id: 'other_info_radio_' + i,
                                labelAlign: 'right',
                                labelWidth: label_width,
                                hidden: true,
                                width: 695,
                                items: []
                                }]
                        });
                    }

                    for (var j = 0; j < data.booleanValueOptions[i].options.length; j++) {
                        var radio_item = '';
                        if (data.booleanValueOptions[i].options[j]) {
                            radio_item = {
                                boxLabel: 'Yes',
                                name: 'radio_' + data.booleanValueOptions[i].key.id,
                                inputValue: data.booleanValueOptions[i].options[j],
                                checked: false
                            };
                        } else {
                            radio_item = {
                                boxLabel: 'No',
                                name: 'radio_' + data.booleanValueOptions[i].key.id,
                                inputValue: data.booleanValueOptions[i].options[j],
                                checked: false
                            };
                        }
                        Ext.getCmp('other_info_radio_' + i).add(radio_item);
                    }
                    if (data.booleanValueOptions[i].value) {
                        Ext.getCmp('other_info_radio_' + i).items.items[0].setValue(true);
                    } else {
                        Ext.getCmp('other_info_radio_' + i).items.items[1].setValue(true);
                    }
                    container_radio.add(field_radio);
                }
                Ext.getCmp('other_info_first_part').add(container_radio);
            }
        }
        // for textbox section
        if (data.namedValueOptions) {
            if (data.namedValueOptions.length > 0) {

                var container = new Ext.Container({
                    layout: {
                        type: 'table',
                        columns: 1
                    },
                    items: []
                });

                for (var i = 0; i < data.namedValueOptions.length; i++) {

                    if (data.namedValueOptions[i].visible) {

                        var field = '';
                        field = new Ext.form.TextField({
                            id: 'text_' + data.namedValueOptions[i].key.id,
                            fieldLabel: data.namedValueOptions[i].key.displayText,
                            name: 'text_' + data.namedValueOptions[i].key.id,
                            labelAlign: 'right',
                            labelWidth: label_width,
                            labelSeparator: '  ',
                            inputWidth: 480,
                            value: data.namedValueOptions[i].value
                        });

                    } else {
                        var field = '';
                        field = new Ext.form.TextField({
                            id: 'text_' + idata.namedValueOptions[i].key.id,
                            fieldLabel: data.namedValueOptions[i].key.displayText,
                            name: 'text_' + data.namedValueOptions[i].key.id,
                            labelAlign: 'right',
                            labelWidth: label_width,
                            labelSeparator: '  ',
                            hidden: true,
                            inputWidth: 480,
                            value: data.namedValueOptions[i].value
                        });
                    }
                    container.add(field);
                }
                Ext.getCmp('other_info_first_part').add(container);
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieveSASLMetaDataPortal, "GET", {}, onsuccess, onerror);
}

com.faralam.updateOtherInfo = function (sa, sl) {

    com.faralam.updateSASLMetaData = com.faralam.serverURL + 'sasl/updateSASLMetaData';
    com.faralam.updateSASLMetaData = com.faralam.updateSASLMetaData + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl);

    var form_values = Ext.getCmp('other_info_first_parts').getForm().getValues();

    var arr_keys = Object.keys(form_values);
    var combo_arr = [];
    var radio_arr = [];
    var text_arr = [];

    for (var i = 0; i < arr_keys.length; i++) {
        if (arr_keys[i].search('combo_') != -1) {
            var n = arr_keys[i].split('_');
            combo_arr.push(form_values[arr_keys[i]] + '_' + n[1]);
        }
        if (arr_keys[i].search('radio_') != -1) {
            radio_arr.push(form_values[arr_keys[i]]);
        }
        if (arr_keys[i].search('text_') != -1) {
            text_arr.push(form_values[arr_keys[i]]);
        }
    }

    var combo_array = [];
    if (combo_arr.length > 0) {
        for (var j = 0; j < combo_arr.length; j++) {
            var val;
            var n = combo_arr[j].split('_');
            if (!isNaN(n[0])) {
                val = n[0];
            } else {
                if (com.faralam.getFieldValues(Ext.getCmp('combo_' + n[1]), 'value', 'key') != 'error') {
                    val = com.faralam.getFieldValues(Ext.getCmp('combo_' + n[1]), 'value', 'key');
                }
            }
            combo_array.push({
                "value": val,
                "key": n[1]
            });
        }
    }


    var radio_array = [];
    if (combo_arr.length > 0) {
        for (var j = 0; j < radio_arr.length; j++) {
            radio_array.push({
                "value": radio_arr[j],
                "key": j
            });
        }
    }

    var text_array = [];
    if (text_arr.length > 0) {
        for (var j = 0; j < text_arr.length; j++) {
            text_array.push({
                "value": text_arr[j],
                "key": j
            });
        }
    }

    var myJSONObject = {
        "multiValueSelections": combo_array,
        "booleanValueSelections": radio_array,
        "nameValueSelections": text_array
    };

    datam = JSON.stringify(myJSONObject);

    var onsuccess = function (data, textStatus, jqXHR) {
        com.faralam.registration.showPopup('Success', 'Successfully Updated');
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.updateSASLMetaData, "PUT", datam, onsuccess, onerror);
}
com.faralam.common.showSeoTabs = function(tabId){
	Ext.getCmp('aboutUsContainer').hide();
	Ext.getCmp('seoContainer').hide();
	Ext.getCmp('BusinessListingContainer').hide();
	Ext.getCmp('passwordContainer').hide();

	Ext.getCmp('aboutusTab').setText('<span style="color:#fff;">About Us</span>');
	Ext.getCmp('seoTab').setText('<span style="color:#fff;">Search Optimization</span>');
	Ext.getCmp('blTab').setText('<span style="color:#fff;">Business Listing</span>');
	Ext.getCmp('passwordTab').setText('<span style="color:#fff;">Visitor Password</span>');
	tabId=parseInt(tabId);
	if(tabId == 1){
		Ext.getCmp('aboutusTab').setText('<span style="color:#FFFF00;">About Us</span>');
		/*Ext.getCmp('aboutusTab').setStyle('background-color', '#FFFFFF');*/
		
		Ext.getCmp('aboutUsContainer').show();
		/*Ext.getCmp('aboutUsContainer').getEl().slideIn('l', {
        stopAnimation: true,
        duration: 200
    });*/
        
        com.faralam.common.retrieveAboutUs(sessionStorage.SA, sessionStorage.SL);
	}else if(tabId == 2){
        console.log("seo_on");
		Ext.getCmp('seoTab').setText('<span style="color:#FFFF00;">Search Optimization</span>');
		Ext.getCmp('seoContainer').show();
		Ext.getCmp('seoContainer').getEl().slideIn('l', {
        stopAnimation: true,
        duration: 200
    	});	
	}else if(tabId == 3){
		Ext.getCmp('blTab').setText('<span style="color:#FFFF00;">Business Listing</span>');
		/*Ext.getCmp('blTab').setStyle('background', '#FFFFFF');*/
		Ext.getCmp('BusinessListingContainer').show();
		Ext.getCmp('BusinessListingContainer').getEl().slideIn('l', {
        stopAnimation: true,
        duration: 200
    	});
        com.faralam.common.getBusinessNameSEO(sessionStorage.SA, sessionStorage.SL);
        com.faralam.common.getBusinessEmailSEO(sessionStorage.SA, sessionStorage.SL);
        com.faralam.common.getBusinessTelephoneSEO(sessionStorage.SA, sessionStorage.SL);
        com.faralam.common.getBusinessAddressSEO(sessionStorage.SA, sessionStorage.SL);
        com.faralam.common.getVisitorPasswordSEO(sessionStorage.SA, sessionStorage.SL);
	}else if(tabId == 4){
		Ext.getCmp('passwordTab').setText('<span style="color:#FFFF00;">Visitor Password</span>');
		/*Ext.getCmp('passwordTab').setStyle('background', '#FFFFFF');*/
		Ext.getCmp('passwordContainer').show();
		Ext.getCmp('passwordContainer').getEl().slideIn('l', {
        stopAnimation: true,
        duration: 200
    	});
	}
}
com.faralam.common.getBusinessNameSEO = function (sa, sl) {
    com.faralam.get_business_name = com.faralam.serverURL + 'sasl/getBusinessName';
    com.faralam.get_business_name = com.faralam.get_business_name + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (data, textStatus, jqXHR) {
        //console.log(data);
        if (data) {
            Ext.getCmp('title_mobile_app').setValue(data.businessName);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_business_name, "GET", {}, onsuccess, onerror);
}

com.faralam.common.getBusinessEmailSEO = function (sa, sl) {
    com.faralam.get_business_email = com.faralam.serverURL + 'sasl/getBusinessEmail';
    com.faralam.get_business_email = com.faralam.get_business_email + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (data, textStatus, jqXHR) {
        //console.log(data);
        if (data) {
            Ext.getCmp('business_mail').setValue(data.businessEmail);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_business_email, "GET", {}, onsuccess, onerror);
}

com.faralam.common.getBusinessTelephoneSEO = function (sa, sl) {
    com.faralam.get_business_telephone = com.faralam.serverURL + 'sasl/getBusinessTelephone';
    com.faralam.get_business_telephone = com.faralam.get_business_telephone + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (data, textStatus, jqXHR) {
        //console.log(data);
        if (data) {
            Ext.getCmp('business_telephone').setValue(data.businessTelephone);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_business_telephone, "GET", {}, onsuccess, onerror);
}

com.faralam.setBusinessNameSEO = function (sa, sl) {
    com.faralam.set_business_name = com.faralam.serverURL + 'sasl/setBusinessName';
    com.faralam.set_business_name = com.faralam.set_business_name + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "businessName": Ext.getCmp('title_mobile_app').getValue()
    }
    data = JSON.stringify(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.success) {
            //console.log(response);
            if (response.success) {
                Ext.MessageBox.alert('Success', 'Submitted successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.set_business_name, "PUT", data, onsuccess, onerror);
}

com.faralam.setBusinessEmailSEO = function (sa, sl) {
    com.faralam.set_business_email = com.faralam.serverURL + 'sasl/setBusinessEmail';
    com.faralam.set_business_email = com.faralam.set_business_email + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "businessEmail": Ext.getCmp('business_mail').getValue()
    }
    data = JSON.stringify(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.success) {
            //console.log(response);
            if (response.success) {
                Ext.MessageBox.alert('Success', 'Submitted successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.set_business_email, "PUT", data, onsuccess, onerror);
}

com.faralam.setBusinessTelephoneSEO = function (sa, sl) {
    com.faralam.set_business_telephone = com.faralam.serverURL + 'sasl/setBusinessTelephone';
    com.faralam.set_business_telephone = com.faralam.set_business_telephone + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "businessTelephone": Ext.getCmp('business_telephone').getValue()
    }
    data = JSON.stringify(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.success) {
            //console.log(response);
            if (response.success) {
                Ext.MessageBox.alert('Success', 'Submitted successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.set_business_telephone, "PUT", data, onsuccess, onerror);
}

com.faralam.common.getBusinessAddressSEO = function (sa, sl) {
    com.faralam.get_business_address = com.faralam.serverURL + 'sasl/getBusinessAddress';
    com.faralam.get_business_address = com.faralam.get_business_address + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (data, textStatus, jqXHR) {
        //console.log(data);
        if (data) {
            Ext.getCmp('street').setValue(data.street);
            Ext.getCmp('address_line2').setValue(data.street2);
            Ext.getCmp('city').setValue(data.city);
            Ext.getCmp('state').setValue(data.state);
            Ext.getCmp('zip').setValue(data.zip);
            Ext.getCmp('country').setValue(data.country);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_business_address, "GET", {}, onsuccess, onerror);
}
com.faralam.setBusinessAddress = function () {
    com.faralam.set_business_address = com.faralam.serverURL + 'sasl/setBusinessAddress';
    com.faralam.set_business_address = com.faralam.set_business_address + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "number": Ext.getCmp('drivingNumber').getValue(),
        "street": Ext.getCmp('drivingStreet').getValue(),
        "street2": Ext.getCmp('drivingStreet2').getValue(),
        "state": Ext.getCmp('drivingState').getValue(),
        "zip": Ext.getCmp('drivingzip').getValue(),
        "city": Ext.getCmp('drivingCity').getValue(),
        "country": Ext.getCmp('drivingCountry').getValue()

    }
    data = JSON.stringify(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.success) {
            //console.log(response);
            if (response.success) {
                Ext.MessageBox.alert('Success', 'Submitted successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.set_business_address, "PUT", data, onsuccess, onerror);
}

com.faralam.setBusinessAddressSEO = function (sa, sl) {
    com.faralam.set_business_address = com.faralam.serverURL + 'sasl/setBusinessAddress';
    com.faralam.set_business_address = com.faralam.set_business_address + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "street": Ext.getCmp('street').getValue(),
        "street2": Ext.getCmp('address_line2').getValue(),
        "city": Ext.getCmp('city').getValue(),
        "state": Ext.getCmp('state').getValue(),
        "zip": Ext.getCmp('zip').getValue(),
        "country": Ext.getCmp('country').getValue()

    }
    data = JSON.stringify(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.success) {
            //console.log(response);
            if (response.success) {
                Ext.MessageBox.alert('Success', 'Submitted successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.set_business_address, "PUT", data, onsuccess, onerror);
}

com.faralam.common.getVisitorPasswordSEO = function (sa, sl) {
    com.faralam.get_visitor_password = com.faralam.serverURL + 'sasl/getVisitorPassword';
    com.faralam.get_visitor_password = com.faralam.get_visitor_password + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (data, textStatus, jqXHR) {
        //console.log(data);
        if (data) {
            Ext.getCmp('visitor_password').setValue(data.membersPassword);
            if (data.membersOnlyMedia == true) {
                Ext.get('enable_visitor_password-inputEl').removeCls("inactive_checkbox");
                Ext.get('enable_visitor_password-inputEl').addCls("active_checkbox");
            } else {
                Ext.get('enable_visitor_password-inputEl').removeCls("active_checkbox");
                Ext.get('enable_visitor_password-inputEl').addCls("inactive_checkbox");
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_visitor_password, "GET", {}, onsuccess, onerror);
}

com.faralam.setVisitorPasswordSEO = function (sa, sl) {
        com.faralam.set_visitor_password = com.faralam.serverURL + 'sasl/setVisitorPassword';
        com.faralam.set_visitor_password = com.faralam.set_visitor_password + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

        var data = {
            "membersPassword": Ext.getCmp('visitor_password').getValue(),
            "membersOnlyMedia": Ext.getCmp('enable_visitor_password').getValue()
        }
        data = JSON.stringify(data);
        var onsuccess = function (response, textStatus, jqXHR) {
            if (response.success) {
                //console.log(response);
                if (response.success) {
                    Ext.MessageBox.alert('Success', 'Submitted successfully.');
                }
            }
        }

        var onerror = function (jqXHR, textStatus, errorThrown) {}

        com.faralam.common.sendAjaxRequest(com.faralam.set_visitor_password, "PUT", data, onsuccess, onerror);
    }
    // ################################### Ends ################################		

// #################################### Promotion Section #############################
com.faralam.UpdatePromotionMetaData = function (promouuid, sa, sl, index) {

    com.faralam.update_promotion_meta_data = com.faralam.serverURL + 'promotions/updatePromotionSATierMetaData';
    com.faralam.update_promotion_meta_data = com.faralam.update_promotion_meta_data + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl + '&promoUUID=' + promouuid);

    /*var localonly, bookable;
     
     if(Ext.getCmp('promo_location'+index).getValue().location == 'local'){
     localonly = true;
     }else{
     localonly = false;
     }
     
     if(Ext.getCmp('promo_bookable'+index).getValue().bookable == 'yes'){
     bookable = true; 
     }else{
     bookable = false;
     }
     
     if(Ext.getCmp('promo_duration'+index).getValue().duration == 'yes'){			
     var activationDate = Ext.getCmp('duration_date_from'+index).getSubmitValue();
     var expirationDate = Ext.getCmp('duration_date_to'+index).getSubmitValue();
     }else{
     var activationDate = '';
     var expirationDate = '';
     }
     
     if(!Ext.getCmp('promo_valid_times_hr_start'+index).getValue()){
     var startclock_hr = '0';
     }else{
     var startclock_hr = Ext.getCmp('promo_valid_times_hr_start'+index).getValue();
     }
     
     if(!Ext.getCmp('promo_valid_times_min_start'+index).getValue()){
     var startclock_min = '0';
     }else{
     var startclock_min = Ext.getCmp('promo_valid_times_min_start'+index).getValue();
     }
     
     if(!Ext.getCmp('promo_valid_times_hr_end'+index).getValue()){
     var endclock_hr = '23';
     }else{
     var endclock_hr = Ext.getCmp('promo_valid_times_hr_end'+index).getValue();
     }
     
     if(!Ext.getCmp('promo_valid_times_min_end'+index).getValue()){
     var endclock = '59';
     }else{
     var endclock = Ext.getCmp('promo_valid_times_min_end'+index).getValue();
     }*/

    if (Ext.getCmp('promo_valid_days' + index).getValue().valid_day instanceof Array) {
        var opening_day = Ext.getCmp('promo_valid_days' + index).getValue().valid_day;
    } else {
        var opening_day = [Ext.getCmp('promo_valid_days' + index).getValue().valid_day];
    }


    data = {
        "promoPictureId": "1",
        "messageText": Ext.getCmp('promo_add_text' + index).getValue(),
        "timeRestricted": "true",
        "keywords": "",
        "promotionStatus": "PROPOSED",
        "promotionType": Ext.getCmp('promo_type' + index).getValue(),
        "promotionCode": Ext.getCmp('promo_code' + index).getValue(),
        "promoPictureServiceAccommodatorId": "3",
        //"bookable": bookable,
        "promotionSASLName": Ext.getCmp('promo_identifier' + index).getValue(),
        "displayText": Ext.getCmp('promo_add_text' + index).getValue(),
        "pictStatus": "APPROVED",
        "serviceAccommodatorId": sa,
        "serviceLocationId": sl,
        "tierId": "1",
        "levelType": "DEFAULT",
        "floorId": "1",
        "promoUUID": promouuid,
        //"localOnly": localonly,
        "roleType": "DEFAULT",
        "messageLocation": {
            "y": "20",
            "x": "20"
        },
        "classTimeSlotPolicyEntry": {
            "reservationType": "PSEUDO",
            "timeRange": {
                "isExpired": "false",
                "expirationDate": expirationDate,
                "openingDays": [
                    opening_day
                ],
                "openingHours": {
                    "startClock": {
                        "minute": startclock_min,
                        "hour": startclock_hr
                    },
                    "endClock": {
                        "minute": endclock,
                        "hour": endclock_hr
                    }
                },
                "activationDate": activationDate
            },
            "maxHeadCountPerSeat": "3",
            "timeSlotType": "FIXED_60MIN_INTERVALS",
            "maxSeatCount": "40"
        }
    };
    var data = JSON.stringify(data);

    var onsuccess = function (data, textStatus, jqXHR) {

    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.update_promotion_meta_data, "POST", data, onsuccess, onerror);
}

com.faralam.retrievePromotion = function (sa, sl) {
    com.faralam.get_promotion = com.faralam.serverURL + 'promotions/retrievePromotionSATierPromoUUIDs';
    com.faralam.get_promotion = com.faralam.get_promotion + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl);

    var onsuccess = function (data, textStatus, jqXHR) {
        for (var i = 1; i < com.faralam.Promotion_first_part.items.items.length; i++) {
            if (com.faralam.Promotion_first_part.items.items[1]) {
                com.faralam.Promotion_first_part.remove(com.faralam.Promotion_first_part.items.items[1], true);
                com.faralam.Promotion_first_part.doLayout();
            }
        }

        if (data.promoCount > 0) {
            for (var i = 0; i < data.promoCount; i++) {
                var items = [];
                var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

                items.push({
                    xtype: 'form',
                    layout: {
                        type: 'table',
                        columns: 2,
                        tableAttrs: {
                            style: {
                                width: '100%'
                            }
                        }
                    },
                    id: 'promotion_parent_container' + i,
                    items: [{
                            xtype: 'container',
                            layout: {
                                type: 'table',
                                columns: 1,
                                tableAttrs: {
                                    style: {
                                        width: '100%'
                                    }
                                }
                            },
                            tdAttrs: {
                                style: {
                                    width: '75%'
                                }
                            },
                            items: [{
                                    xtype: 'container',
                                    layout: {
                                        type: 'table',
                                        columns: 3,
                                        tableAttrs: {
                                            style: {
                                                width: '100%'
                                            }
                                        }
                                    },
                                    items: [{
                                            xtype: 'fieldset',
                                            title: 'Pick a Photo',
                                            collapsible: false,
                                            style: 'text-align:center;',
                                            items: [{
                                                xtype: 'image',
                                                padding: '10 10 10 10',
                                                width: 100,
                                                height: 100,
                                                margin: '0 0 5 0',
                                                src: '',
                                                id: 'thumb_img' + i,
                                                style: 'border: 2px solid #00a234;'
                                                }]
                                        },
                                        {
                                            xtype: 'filefield',
                                            tdAttrs: {
                                                style: {
                                                    width: '33%'
                                                }
                                            },
                                            style: 'margin:0 auto;',
                                            buttonText: 'Upload New Picture',
                                            buttonOnly: true,
                                            scope: this,
                                            id: 'promo_upload' + i,
                                            listeners: {
                                                change: function (field, value, eOpts) {
                                                    if (value) {
                                                        var index = this.id.slice(-1);
                                                        var file = this.getEl().down('input[type=file]').dom.files[0];
                                                        var reader = new FileReader();
                                                        reader.onload = (function (theFile) {
                                                            return function (e) {
                                                                Ext.getCmp('thumb_img' + index).setSrc(e.target.result);
                                                                Ext.getCmp('big_img' + index).setSrc(e.target.result);
                                                            };
                                                        })(file);
                                                        reader.readAsDataURL(file);
                                                    }
                                                },
                                                afterrender: function (cmp) {
                                                    cmp.fileInputEl.set({
                                                        accept: 'image/*'
                                                    });
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'fieldset',
                                            title: 'Add Text',
                                            collapsible: false,
                                            tdAttrs: {
                                                style: {
                                                    width: '33%'
                                                }
                                            },
                                            items: [{
                                                xtype: 'textarea',
                                                style: {
                                                    width: '100%'
                                                },
                                                id: 'promo_add_text' + i
                                                }]
                                        }]
                                },
                                {
                                    xtype: 'fieldset',
                                    title: 'Details',
                                    collapsible: false,
                                    items: [{
                                        xtype: 'container',
                                        layout: {
                                            type: 'table',
                                            columns: 2,
                                            tableAttrs: {
                                                style: {
                                                    width: '100%'
                                                }
                                            }
                                        },
                                        items: [{
                                                tdAttrs: {
                                                    style: {
                                                        width: '20%'
                                                    }
                                                },
                                                xtype: 'image',
                                                padding: '10 10 10 10',
                                                width: 150,
                                                height: 200,
                                                id: 'big_img' + i,
                                                src: '',
                                                style: 'border: 2px solid #00a234; margin: 0 10px 0 0;'
                                                },
                                            {
                                                tdAttrs: {
                                                    style: {
                                                        width: '80%'
                                                    }
                                                },
                                                xtype: 'container',
                                                layout: {
                                                    type: 'table',
                                                    columns: 2,
                                                    tableAttrs: {
                                                        style: {
                                                            width: '100%'
                                                        }
                                                    }
                                                },
                                                items: [{
                                                        xtype: 'fieldset',
                                                        title: 'Identifier',
                                                        collapsible: false,
                                                        colspan: 2,
                                                        layout: 'hbox',
                                                        items: [{
                                                            xtype: 'container',
                                                            layout: 'hbox',
                                                            margin: '0 0 10 0',
                                                            items: [{
                                                                    xtype: 'textfield',
                                                                    fieldLabel: 'Name',
                                                                    emptyText: '(Promo name)',
                                                                    id: 'promo_identifier' + i,
                                                                    labelAlign: 'right',
                                                                    labelWidth: 50
                                                                        },
                                                                {
                                                                    xtype: 'container',
                                                                    layout: 'vbox',
                                                                    defaults: {
                                                                        labelAlign: 'right',
                                                                        labelWidth: 50
                                                                    },
                                                                    items: [{
                                                                            xtype: 'combo',
                                                                            fieldLabel: 'Type',
                                                                            name: 'promo_type' + i,
                                                                            id: 'promo_type' + i,
                                                                            queryMode: 'local',
                                                                            displayField: 'value',
                                                                            valueField: 'value',
                                                                            autoSelect: true,
                                                                            forceSelection: true,
                                                                            editable: false,
                                                                            allowBlank: false,
                                                                            afterLabelTextTpl: required,
                                                                            store: Ext.create('Ext.data.ArrayStore', {
                                                                                fields: ['value'],
                                                                                autoLoad: false,
                                                                                proxy: {
                                                                                    type: 'ajax',
                                                                                    url: '',
                                                                                    reader: {
                                                                                        type: 'json',
                                                                                        getData: function (data) {
                                                                                            var temparray = [];
                                                                                            var count = 0;
                                                                                            Ext.each(data, function (rec) {
                                                                                                temparray.push([]);
                                                                                                temparray[count].push(new Array(1));
                                                                                                temparray[count]['value'] = rec.enumText;
                                                                                                count = count + 1;
                                                                                            });
                                                                                            data = temparray;
                                                                                            return data;
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }),
                                                                            listeners: {
                                                                                'validitychange': function (e, isValid, eOpts) {
                                                                                    var index = e.id.slice(-1);
                                                                                    var errUI = Ext.getCmp('promotion_type_err' + index);
                                                                                    errUI.setValue('');
                                                                                    if (!isValid) {
                                                                                        errUI.setValue('<span style="color:#CF4C35;">' + e.getErrors() + '</span>');
                                                                                    }
                                                                                }
                                                                            }
                                                                                },
                                                                        {
                                                                            xtype: 'displayfield',
                                                                            name: 'promotion_type_err' + i,
                                                                            id: 'promotion_type_err' + i,
                                                                            fieldLabel: '&nbsp;',
                                                                            value: '',
                                                                            labelSeparator: ''
                                                                                }]
                                                                        }]
                                                                }]
                                                        },
                                                        /*{
                                                         xtype: 'fieldset',					
                                                         title: 'Location',			
                                                         collapsible: false,
                                                         margin: '0 10 10 0',
                                                         disabled: true,
                                                         height: 84,
                                                         items: [{
                                                         xtype: 'radiogroup',
                                                         cls: 'x-check-group-alt',
                                                         style: 'width:100%;',
                                                         margin: '10 0 0 0',
                                                         id: 'promo_location'+i,
                                                         items: [
                                                         {boxLabel: 'Local only', name: 'location', inputValue: 'local'},
                                                         {boxLabel: 'Everywhere', name: 'location', inputValue: 'everywhere'}
                                                         ]
                                                         }]
                                                         },
                                                         {
                                                         xtype: 'fieldset',					
                                                         title: 'Duration',			
                                                         collapsible: false,
                                                         disabled: true,
                                                         items: [{
                                                         xtype: 'container',
                                                         layout: 'vbox',
                                                         items: [{
                                                         xtype: 'radiogroup',
                                                         cls: 'x-check-group-alt',
                                                         id: 'promo_duration'+i,
                                                         listeners: {
                                                         change: function(val){
                                                         var i = this.id.slice(-1);
                                                         if(val.getValue().duration == 'yes'){
                                                         Ext.getCmp('duration_date_from'+i).setDisabled(false);
                                                         Ext.getCmp('duration_date_to'+i).setDisabled(false);
                                                         }else{
                                                         Ext.getCmp('duration_date_from'+i).reset();
                                                         Ext.getCmp('duration_date_to'+i).reset();
                                                         Ext.getCmp('duration_date_from'+i).setDisabled(true);
                                                         Ext.getCmp('duration_date_to'+i).setDisabled(true);
                                                         Ext.getCmp('promotion_date_from_err'+i).setValue('');
                                                         Ext.getCmp('promotion_date_to_err'+i).setValue('');
                                                         }
                                                         }
                                                         },
                                                         items: [
                                                         {boxLabel: 'No', name: 'duration', inputValue: 'no', width: 100, checked: true},
                                                         {boxLabel: 'Yes', name: 'duration', inputValue: 'yes'}
                                                         ]
                                                         },
                                                         {
                                                         xtype: 'container',
                                                         layout: 'hbox',
                                                         margin: '0 0 10 0',									
                                                         defaults :{
                                                         inputWidth: '125'
                                                         },
                                                         items: [{
                                                         xtype: 'datefield',
                                                         id: 'duration_date_from'+i,
                                                         format: 'Y-m-d',
                                                         editable: false,
                                                         disabled: true,
                                                         allowBlank: false,
                                                         listeners: {
                                                         'validitychange': function (e, isValid, eOpts) {
                                                         var i = this.id.slice(-1);
                                                         var errUI = Ext.getCmp('promotion_date_from_err'+i);
                                                         errUI.setValue('');
                                                         if (!isValid) {
                                                         errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -10px;">'+e.getErrors()+'</span>');
                                                         }
                                                         }	
                                                         }
                                                         },
                                                         {
                                                         xtype: 'component',
                                                         html: '-',
                                                         margin: '0 10 0 10'
                                                         },
                                                         {
                                                         xtype: 'datefield',
                                                         id: 'duration_date_to'+i,
                                                         format: 'Y-m-d',
                                                         editable: false,
                                                         disabled: true,
                                                         allowBlank: false,
                                                         listeners: {
                                                         'validitychange': function (e, isValid, eOpts) {
                                                         var i = this.id.slice(-1);
                                                         var errUI = Ext.getCmp('promotion_date_to_err'+i);
                                                         errUI.setValue('');
                                                         if (!isValid) {
                                                         errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -5px;">'+e.getErrors()+'</span>');
                                                         }
                                                         }	
                                                         }
                                                         }]
                                                         },
                                                         {
                                                         xtype: 'container',
                                                         layout: 'hbox',
                                                         items: [{
                                                         xtype: 'displayfield',
                                                         name: 'promotion_date_from_err'+i,
                                                         id: 'promotion_date_from_err'+i,
                                                         fieldLabel: '&nbsp;',
                                                         value: '',
                                                         labelSeparator: '',
                                                         labelWidth: 10
                                                         },
                                                         {
                                                         xtype: 'component',
                                                         html: '',
                                                         margin: '0 10 0 10'
                                                         },
                                                         {
                                                         xtype: 'displayfield',
                                                         name: 'promotion_date_to_err'+i,
                                                         id: 'promotion_date_to_err'+i,
                                                         fieldLabel: '&nbsp;',
                                                         value: '',
                                                         labelSeparator: '',
                                                         labelWidth: 10
                                                         }]
                                                         
                                                         }]
                                                         }]
                                                         },
                                                         {
                                                         xtype: 'fieldset',					
                                                         title: 'Visibility',			
                                                         collapsible: false,
                                                         disabled: true,
                                                         margin: '0 10 10 0',
                                                         items: [{
                                                         xtype: 'radiogroup',
                                                         cls: 'x-check-group-alt',
                                                         layout: 'column',
                                                         cls: 'promotion_visibility',
                                                         items: [
                                                         {boxLabel: 'All', name: 'visibility', inputValue: 'all', columnWidth: 0.30},
                                                         {boxLabel: 'First Time Guests', name: 'visibility', inputValue: 'guest', id: 'ftg'+i, columnWidth: 0.30},
                                                         {boxLabel: 'Members only', name: 'visibility', inputValue: 'member', id: 'member'+i, columnWidth: 0.25}
                                                         ]
                                                         }]
                                                         },
                                                         {
                                                         xtype: 'fieldset',					
                                                         title: 'Valid Times',			
                                                         collapsible: false,
                                                         disabled: true,
                                                         items: [{
                                                         xtype: 'container',
                                                         layout: 'vbox',
                                                         items: [{
                                                         xtype: 'radiogroup',
                                                         cls: 'x-check-group-alt',
                                                         id: 'promo_valid_times'+i,
                                                         listeners: {
                                                         change: function(val){
                                                         var i = this.id.slice(-1);
                                                         if(val.getValue().valid_times == 'any'){
                                                         Ext.getCmp('promo_valid_times_hr_start'+i).setValue();
                                                         Ext.getCmp('promo_valid_times_hr_end'+i).setValue();
                                                         Ext.getCmp('promo_valid_times_min_start'+i).setValue();
                                                         Ext.getCmp('promo_valid_times_min_end'+i).setValue();
                                                         
                                                         Ext.getCmp('promo_valid_times_hr_start'+i).setDisabled(true);
                                                         Ext.getCmp('promo_valid_times_hr_end'+i).setDisabled(true);
                                                         Ext.getCmp('promo_valid_times_min_start'+i).setDisabled(true);
                                                         Ext.getCmp('promo_valid_times_min_end'+i).setDisabled(true);
                                                         Ext.getCmp('promo_valid_times_meridian_start'+i).setDisabled(true);
                                                         Ext.getCmp('promo_valid_times_meridian_end'+i).setDisabled(true);
                                                         
                                                         Ext.getCmp('promo_valid_times_hr_start_err'+i).setValue('');
                                                         Ext.getCmp('promo_valid_times_min_start_err'+i).setValue('');
                                                         Ext.getCmp('promo_valid_times_hr_end_err'+i).setValue('');
                                                         Ext.getCmp('promo_valid_times_min_end_err'+i).setValue('');
                                                         }else{
                                                         Ext.getCmp('promo_valid_times_hr_start'+i).setDisabled(false);
                                                         Ext.getCmp('promo_valid_times_hr_end'+i).setDisabled(false);
                                                         Ext.getCmp('promo_valid_times_min_start'+i).setDisabled(false);
                                                         Ext.getCmp('promo_valid_times_min_end'+i).setDisabled(false);
                                                         
                                                         Ext.getCmp('promo_valid_times_hr_start'+i).reset();
                                                         Ext.getCmp('promo_valid_times_hr_end'+i).reset();
                                                         Ext.getCmp('promo_valid_times_min_start'+i).reset();
                                                         Ext.getCmp('promo_valid_times_min_end'+i).reset();
                                                         
                                                         Ext.getCmp('promo_valid_times_meridian_start'+i).setDisabled(false);
                                                         Ext.getCmp('promo_valid_times_meridian_end'+i).setDisabled(false);
                                                         }
                                                         }											
                                                         },
                                                         items: [
                                                         {boxLabel: 'Any', name: 'valid_times', inputValue: 'any', width: 100, checked: true},
                                                         {boxLabel: 'Fixed', name: 'valid_times', inputValue: 'fixed'}
                                                         ]
                                                         },
                                                         {	
                                                         xtype: 'container',
                                                         layout: 'hbox',
                                                         margin: '0 0 10 0',
                                                         defaults :{
                                                         inputWidth: '50'
                                                         },
                                                         items: [{
                                                         xtype: 'numberfield',
                                                         minValue: 0,
                                                         maxValue: 23,
                                                         emptyText: 'H',
                                                         disabled: true,
                                                         margin: '0 5 0 0',
                                                         id: 'promo_valid_times_hr_start'+i,
                                                         disabled: true,
                                                         allowBlank: false,											
                                                         listeners: {
                                                         change: function(v){
                                                         var i = this.id.slice(-1);
                                                         if(v.getValue() > 11){
                                                         Ext.getCmp('promo_valid_times_meridian_start'+i).update('PM');
                                                         }else{
                                                         Ext.getCmp('promo_valid_times_meridian_start'+i).update('AM');	
                                                         }
                                                         },
                                                         'validitychange': function (e, isValid, eOpts) {
                                                         var i = this.id.slice(-1);
                                                         var errUI = Ext.getCmp('promo_valid_times_hr_start_err'+i);
                                                         errUI.setValue('');
                                                         if (!isValid) {
                                                         errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -5px;">Required</span>');
                                                         }
                                                         }
                                                         }
                                                         },
                                                         {
                                                         xtype: 'numberfield',
                                                         minValue: 0,
                                                         maxValue: 59,
                                                         emptyText: 'M',
                                                         disabled: true,
                                                         allowBlank: false,
                                                         id: 'promo_valid_times_min_start'+i,
                                                         disabled: true,
                                                         listeners: {
                                                         'validitychange': function (e, isValid, eOpts) {
                                                         var i = this.id.slice(-1);
                                                         var errUI = Ext.getCmp('promo_valid_times_min_start_err'+i);
                                                         errUI.setValue('');
                                                         if (!isValid) {
                                                         errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -5px;">Required</span>');
                                                         }
                                                         }	
                                                         }
                                                         },
                                                         {
                                                         xtype: 'component',
                                                         html: 'AM',
                                                         margin: '2 0 0 5',
                                                         id: 'promo_valid_times_meridian_start'+i,
                                                         disabled: true
                                                         },
                                                         {
                                                         xtype: 'component',
                                                         html: '-',
                                                         margin: '0 5 0 5'
                                                         },
                                                         {
                                                         xtype: 'numberfield',
                                                         minValue: 0,
                                                         maxValue: 23,
                                                         emptyText: 'H',
                                                         margin: '0 5 0 0',
                                                         disabled: true,
                                                         allowBlank: false,
                                                         id: 'promo_valid_times_hr_end'+i,
                                                         disabled: true,
                                                         listeners: {
                                                         change: function(v){
                                                         var i = this.id.slice(-1);													
                                                         if(v.getValue() > 11){
                                                         Ext.getCmp('promo_valid_times_meridian_end'+i).update('PM');
                                                         }else{
                                                         Ext.getCmp('promo_valid_times_meridian_end'+i).update('AM');	
                                                         }
                                                         },
                                                         'validitychange': function (e, isValid, eOpts) {
                                                         var i = this.id.slice(-1);
                                                         var errUI = Ext.getCmp('promo_valid_times_hr_end_err'+i);
                                                         errUI.setValue('');
                                                         if (!isValid) {
                                                         errUI.setValue('<span style="color:#CF4C35;">Required</span>');
                                                         }
                                                         }
                                                         }
                                                         },
                                                         {
                                                         xtype: 'numberfield',
                                                         minValue: 0,
                                                         maxValue: 59,
                                                         emptyText: 'M',
                                                         allowBlank: false,
                                                         disabled: true,
                                                         id: 'promo_valid_times_min_end'+i,
                                                         disabled: true,
                                                         listeners: {
                                                         'validitychange': function (e, isValid, eOpts) {
                                                         var i = this.id.slice(-1);
                                                         var errUI = Ext.getCmp('promo_valid_times_min_end_err'+i);
                                                         errUI.setValue('');
                                                         if (!isValid) {
                                                         errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -5px;">Required</span>');
                                                         }
                                                         }	
                                                         }
                                                         },
                                                         {
                                                         xtype: 'component',
                                                         html: 'AM',
                                                         margin: '2 0 0 5',
                                                         id: 'promo_valid_times_meridian_end'+i,
                                                         disabled: true
                                                         }]
                                                         },
                                                         {
                                                         xtype: 'container',
                                                         layout: 'hbox',
                                                         items: [{
                                                         xtype: 'displayfield',
                                                         name: 'promo_valid_times_hr_start_err'+i,
                                                         id: 'promo_valid_times_hr_start_err'+i,
                                                         labelWidth: 10,
                                                         fieldLabel: '&nbsp;',
                                                         value: '',
                                                         labelSeparator: '',
                                                         width: 80
                                                         },
                                                         {
                                                         xtype: 'displayfield',
                                                         name: 'promo_valid_times_min_start_err'+i,
                                                         id: 'promo_valid_times_min_start_err'+i,
                                                         labelWidth: 10,
                                                         fieldLabel: '&nbsp;',
                                                         value: '',
                                                         labelSeparator: '',
                                                         width: 100
                                                         },
                                                         {
                                                         xtype: 'displayfield',
                                                         name: 'promo_valid_times_hr_end_err'+i,
                                                         id: 'promo_valid_times_hr_end_err'+i,
                                                         labelWidth: 10,
                                                         fieldLabel: '&nbsp;',
                                                         value: '',
                                                         labelSeparator: '',
                                                         width: 100
                                                         },
                                                         {
                                                         xtype: 'displayfield',
                                                         name: 'promo_valid_times_min_end_err'+i,
                                                         id: 'promo_valid_times_min_end_err'+i,
                                                         labelWidth: 10,
                                                         fieldLabel: '&nbsp;',
                                                         value: '',
                                                         labelSeparator: ''
                                                         }]
                                                         }]									
                                                         }]
                                                         },
                                                         {
                                                         xtype: 'fieldset',					
                                                         title: 'Bookable',			
                                                         collapsible: false,
                                                         disabled: true,
                                                         margin: '0 10 10 0',
                                                         items: [
                                                         {
                                                         xtype: 'container',
                                                         layout: 'vbox',
                                                         items: [{
                                                         xtype: 'radiogroup',
                                                         cls: 'x-check-group-alt',
                                                         width: 150,
                                                         id: 'promo_bookable'+i,
                                                         listeners: {
                                                         change: function(val){																						var index = this.id.slice(-1);		
                                                         if(val.getValue().bookable == 'yes'){
                                                         Ext.getCmp('promo_code'+index).setDisabled(false);
                                                         }else{
                                                         Ext.getCmp('promo_code'+index).setDisabled(true);
                                                         Ext.getCmp('promo_code'+index).reset();
                                                         Ext.getCmp('promotion_code_err'+index).setValue('');
                                                         }
                                                         }
                                                         },
                                                         items: [
                                                         {boxLabel: 'No', name: 'bookable', inputValue: 'no', checked: true},
                                                         {boxLabel: 'Yes', name: 'bookable', inputValue: 'yes'}
                                                         ]
                                                         },
                                                         {
                                                         xtype: 'container',
                                                         layout: 'hbox',
                                                         margin: '0 0 5 0',
                                                         items: [
                                                         {
                                                         xtype: 'displayfield',
                                                         name: 'promotion_code_err'+i,
                                                         id: 'promotion_code_err'+i,
                                                         labelWidth: 10,
                                                         fieldLabel: '&nbsp;',
                                                         value: '',
                                                         labelSeparator: '',
                                                         width: 50
                                                         },
                                                         {
                                                         xtype: 'textfield',
                                                         inputWidth: 50,
                                                         fieldLabel: 'Code',
                                                         labelWidth: 0,
                                                         labelSeparator: '',
                                                         id: 'promo_code'+i,
                                                         disabled: true,
                                                         allowBlank: false,
                                                         listeners: {
                                                         'validitychange': function (e, isValid, eOpts) {
                                                         var index = this.id.slice(-1);		
                                                         var errUI = Ext.getCmp('promotion_code_err'+index);
                                                         errUI.setValue('');
                                                         if (!isValid) {
                                                         errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -5px;">'+e.getErrors()+'</span>');
                                                         }
                                                         }	
                                                         }
                                                         }]
                                                         }]
                                                         }]
                                                         },*/
                                                    {
                                                        xtype: 'fieldset',
                                                        title: 'Valid Days<span style="color: #FF0000;">*</span>',
                                                        collapsible: false,
                                                        //disabled: true,
                                                        items: [{
                                                                xtype: 'checkboxgroup',
                                                                margin: '10 0 0 0',
                                                                cls: 'x-check-group-alt',
                                                                id: 'promo_valid_days' + i,
                                                                allowBlank: false,
                                                                items: [
                                                                    {
                                                                        name: 'valid_day',
                                                                        inputValue: 'SUN'
                                                                    },
                                                                    {
                                                                        name: 'valid_day',
                                                                        inputValue: 'MON'
                                                                    },
                                                                    {
                                                                        name: 'valid_day',
                                                                        inputValue: 'TUE'
                                                                    },
                                                                    {
                                                                        name: 'valid_day',
                                                                        inputValue: 'WED'
                                                                    },
                                                                    {
                                                                        name: 'valid_day',
                                                                        inputValue: 'THU'
                                                                    },
                                                                    {
                                                                        name: 'valid_day',
                                                                        inputValue: 'FRI'
                                                                    },
                                                                    {
                                                                        name: 'valid_day',
                                                                        inputValue: 'SAT'
                                                                    }
                                                                    ],
                                                                listeners: {
                                                                    'validitychange': function (ev, isValid, eOpts) {
                                                                        var index = this.id.slice(-1);
                                                                        Ext.getCmp('promotion_valid_days_err' + index).setValue('');
                                                                        if (!isValid) {
                                                                            Ext.getCmp('promotion_valid_days_err' + index).setValue('<span style="color:#CF4C35;">' + ev.getErrors() + '</span>');
                                                                        }
                                                                    }
                                                                }
                                                                },
                                                            {
                                                                xtype: 'displayfield',
                                                                name: 'promotion_valid_days_err',
                                                                id: 'promotion_valid_days_err' + i,
                                                                labelWidth: 5,
                                                                fieldLabel: '&nbsp;',
                                                                value: '',
                                                                labelSeparator: ''
                                                                }]
                                                        }]
                                                }]
                                        }]
                                }]
                        },
                        {
                            xtype: 'hiddenfield',
                            value: '',
                            id: 'promouuid' + i
                        },
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            tdAttrs: {
                                style: {
                                    'width': '25%',
                                    'vertical-align': 'top',
                                    'padding-top': '55px'
                                }
                            },
                            items: [{
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [{
                                            xtype: 'button',
                                            text: 'Cancel',
                                            id: 'promotion_cancel' + i,
                                            margin: '0 10 0 10',
                                            handler: function () {
                                                var i = this.id.slice(-1);
                                                Ext.getCmp('thumb_img' + i).setSrc();
                                                Ext.getCmp('big_img' + i).setSrc();
                                                Ext.getCmp('promotion_parent_container' + i).getForm().reset();
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'Update',
                                            id: 'promotion_update' + i,
                                            handler: function () {

                                                /*var i = this.id.slice(-1);	
                                                 var flag;
                                                 var flag_bookable = true;
                                                 var flag_valid_times = true;
                                                 
                                                 if(Ext.getCmp('promo_duration'+i).getValue().duration == 'yes'){
                                                 if(Ext.getCmp('duration_date_from'+i).getSubmitValue() && Ext.getCmp('duration_date_to'+i).getSubmitValue()){
                                                 flag = true;
                                                 }else{
                                                 if(!Ext.getCmp('duration_date_from'+i).getSubmitValue()){
                                                 Ext.getCmp('promotion_parent_container'+i).isValid()
                                                 }
                                                 if(!Ext.getCmp('duration_date_to'+i).getSubmitValue()){
                                                 Ext.getCmp('promotion_parent_container'+i).isValid()
                                                 }
                                                 flag = false;
                                                 }
                                                 }else{
                                                 flag = true;
                                                 }
                                                 
                                                 if(Ext.getCmp('promo_bookable'+i).getValue().bookable == 'yes'){
                                                 if(!Ext.getCmp('promo_code'+i).isValid()){
                                                 flag_bookable = false;
                                                 Ext.getCmp('promotion_parent_container'+i).isValid()
                                                 }
                                                 }
                                                 
                                                 if(Ext.getCmp('promo_valid_times'+i).getValue().valid_times == 'fixed'){
                                                 
                                                 if(Ext.getCmp('promo_valid_times_hr_start'+i).isValid() && Ext.getCmp('promo_valid_times_hr_end'+i).isValid() && Ext.getCmp('promo_valid_times_min_start'+i).isValid() && Ext.getCmp('promo_valid_times_min_end'+i).isValid()){
                                                 flag_valid_times = true;
                                                 }else{
                                                 flag_valid_times = false;
                                                 Ext.getCmp('promotion_parent_container'+i).isValid()
                                                 }
                                                 }							
                                                 
                                                 if(flag && flag_bookable && flag_valid_times && Ext.getCmp('promotion_parent_container'+i).getForm().isValid()){																	
                                                 com.faralam.UpdatePromotionMetaData(Ext.getCmp('promouuid'+i).getValue(), sessionStorage.SA, sessionStorage.SL, i);
                                                 }*/
                                                if (Ext.getCmp('promotion_parent_container' + i).getForm().isValid()) {
                                                    com.faralam.UpdatePromotionMetaData(Ext.getCmp('promouuid' + i).getValue(), sessionStorage.SA, sessionStorage.SL, i);
                                                }
                                            }
                                        }]
                                },
                                {
                                    xtype: 'container',
                                    html: '<span style="color:#fff;">Optionally, you can create a promotion that will highlight your location on the map.<br><br>Upload a picture or choose from one of the pictures in your gallery.<br><br>Choose a text message for your promotion.<br><br>Choose a \'name\' for your promotion and a type.<br><br>The type of Promotion will determine the type of marker shown.</span>',
                                    cls: 'zip_notify',
                                    style: 'height: auto;margin-left:10px;margin-top:68px;'
                                }]
                        }]
                });

                com.faralam.Promotion_first_part.add(items);
                com.faralam.Promotion_first_part.doLayout();

                Ext.getCmp('promo_type' + i).setValue('');
                Ext.getCmp('promo_type' + i).getStore().removeAll();
                Ext.getCmp('promo_type' + i).getStore().proxy.url = com.faralam.serverURL + 'promotions/getPromotionTypes';
                Ext.getCmp('promo_type' + i).getStore().reload();
                Ext.getCmp('thumb_img' + i).setSrc();
                Ext.getCmp('big_img' + i).setSrc();

                com.faralam.retrieve_promotion_metadata(data.promoUUIDList[i], i);
            } // for ends
        } else {
            /*var arr_promotion = [];
             arr_promotion.push({
             xtype: 'container',
             layout: {
             type: 'table',
             columns: 2,
             tableAttrs: {
             style: {
             width: '100%'
             }
             }
             },
             items: [{
             xtype: 'container',
             layout: {
             type: 'table',
             columns: 1,
             tableAttrs: {
             style: {
             width: '100%'
             }
             }
             },
             tdAttrs: {
             style: {
             width: '75%'
             }
             },
             items: [{
             xtype: 'container',
             layout: {
             type: 'table',
             columns: 3,
             tableAttrs: {
             style: {
             width: '100%'
             }
             }
             },
             items: [{
             tdAttrs: {
             style: {
             width: '33%'
             }
             },
             xtype: 'fieldset',
             title: 'Pick a Photo',
             collapsible: false,
             style: 'text-align:center;',
             items: [{
             xtype: 'image',
             padding: '10 10 10 10',
             width: 100,
             height: 100,
             margin: '0 0 5 0',
             src: '',
             id: 'thumb_img',
             style: 'border: 2px solid #00a234;'
             }]
             },
             {
             xtype: 'filefield',
             tdAttrs: {
             style: {
             width: '33%'
             }
             },
             style: 'margin:0 auto;',
             buttonText: 'Upload New Picture',
             buttonOnly: true,
             scope: this,
             id: 'promo_upload',
             listeners: {
             change: function(field, value, eOpts){
             if(value){									
             var file = this.getEl().down('input[type=file]').dom.files[0]; 
             var reader = new FileReader();
             reader.onload = (function(theFile) {
             return function(e) {											
             Ext.getCmp('thumb_img').setSrc(e.target.result);
             Ext.getCmp('big_img').setSrc(e.target.result);
             };
             })(file);
             reader.readAsDataURL(file);
             }
             },
             afterrender:function(cmp){
             cmp.fileInputEl.set({
             accept:'image/*'
             });
             }
             }
             },
             {
             xtype: 'fieldset',
             title: 'Add Text',
             tdAttrs: {
             style: {
             width: '33%'
             }
             },
             collapsible: false,
             items: [{
             xtype: 'textarea',
             style: {
             width: '100%'
             },
             id: 'promo_add_text'
             }]
             }]
             },
             {
             xtype: 'fieldset',					
             title: 'Details',			
             collapsible: false,
             items: [{
             xtype: 'container',
             layout: {
             type: 'table',
             columns: 2,
             tableAttrs: {
             style: {
             width: '100%'
             }
             }
             },
             items: [{
             tdAttrs: {
             style: {
             width: '20%'
             }
             },
             xtype: 'image',
             padding: '10 10 10 10',
             width: 150,
             height:200,
             id: 'big_img',
             src: '',
             style: 'border: 2px solid #00a234; margin: 0 10px 0 0;'
             },
             {
             tdAttrs: {
             style: {
             width: '80%'
             }
             },
             xtype: 'container',
             layout: {
             type: 'table',
             columns: 2,
             tableAttrs: {
             style: {
             width: '100%'
             }
             }
             },
             items: [{
             xtype: 'fieldset',					
             title: 'Identifier',			
             collapsible: false,
             colspan:2,
             layout: 'hbox',
             items: [{
             xtype: 'textfield',
             fieldLabel: 'Name',
             emptyText: '(Promo name)',
             id: 'promo_identifier',
             labelAlign: 'right',
             labelWidth: 50
             },
             {
             xtype: 'container',
             layout: 'vbox',
             defaults: {
             labelAlign: 'right',
             labelWidth: 50
             },
             items: [{
             xtype:'combo',
             fieldLabel:'Type',
             name:'promo_type',
             id: 'promo_type',
             queryMode:'local',				
             displayField: 'value',
             valueField: 'value1',
             autoSelect:true,
             forceSelection:true	,
             editable: false,
             allowBlank: false,
             afterLabelTextTpl: required,
             store: Ext.create('Ext.data.ArrayStore', {
             fields : ['value', 'value1'],
             autoLoad: false,
             proxy: {
             type: 'ajax',
             url:  '',
             reader: {
             type: 'json',
             getData: function(data){
             var temparray = []; 
             var count = 0;
             Ext.each(data, function(rec) {
             temparray.push([]);
             temparray[count].push( new Array(1));
             temparray[count]['value'] = rec.displayText;
             temparray[count]['value1'] = rec.enumText;
             count=count+1;
             });									
             data = temparray;
             return data;
             }
             }
             }
             }),
             listeners: {
             'validitychange': function (e, isValid, eOpts) {
             var errUI = Ext.getCmp('promotion_type_err');
             errUI.setValue('');
             if (!isValid) {
             errUI.setValue('<span style="color:#CF4C35;">'+e.getErrors()+'</span>');
             }
             }
             }
             },
             {
             xtype: 'displayfield',
             name: 'promotion_type_err',
             id: 'promotion_type_err',
             fieldLabel: '&nbsp;',
             value: '',
             labelSeparator: ''		
             }]
             }]
             },
             /*{
             xtype: 'fieldset',					
             title: 'Location',			
             collapsible: false,
             margin: '0 10 10 0',
             height: 84,
             disabled: true,
             items: [{
             xtype: 'radiogroup',
             cls: 'x-check-group-alt',
             style: 'width:100%;',
             margin: '10 0 0 0',
             id: 'promo_location',
             items: [
             {boxLabel: 'Local only', name: 'location', inputValue: 'local'},
             {boxLabel: 'Everywhere', name: 'location', inputValue: 'everywhere'}
             ]
             }]
             },
             {
             xtype: 'fieldset',					
             title: 'Duration',
             //disabled: true,
             collapsible: false,
             items: [{
             xtype: 'container',
             layout: 'vbox',
             items: [{
             xtype: 'radiogroup',
             cls: 'x-check-group-alt',
             id: 'promo_duration',
             listeners: {
             change: function(val){												
             if(val.getValue().duration == 'yes'){
             Ext.getCmp('duration_date_from').setDisabled(false);
             Ext.getCmp('duration_date_to').setDisabled(false);
             }else{
             Ext.getCmp('duration_date_from').reset();
             Ext.getCmp('duration_date_to').reset();
             Ext.getCmp('duration_date_from').setDisabled(true);
             Ext.getCmp('duration_date_to').setDisabled(true);
             }
             }
             },
             items: [
             {boxLabel: 'No', name: 'duration', inputValue: 'no', width: 100, checked: true},
             {boxLabel: 'Yes', name: 'duration', inputValue: 'yes'}
             ]
             },
             {
             xtype: 'container',
             layout: 'hbox',
             margin: '0 0 10 0',									
             defaults :{
             inputWidth: '125'
             },
             items: [{
             xtype: 'datefield',
             id: 'duration_date_from',
             format: 'Y-m-d',
             editable: false,
             disabled: true,
             allowBlank: false,
             listeners: {
             'validitychange': function (e, isValid, eOpts) {
             var errUI = Ext.getCmp('promotion_date_from_err');
             errUI.setValue('');
             if (!isValid) {
             errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -10px;">'+e.getErrors()+'</span>');
             }
             }	
             }
             },
             {
             xtype: 'component',
             html: '-',
             margin: '0 10 0 10'
             },
             {
             xtype: 'datefield',
             id: 'duration_date_to',
             format: 'Y-m-d',
             editable: false,
             disabled: true,
             allowBlank: false,
             listeners: {
             'validitychange': function (e, isValid, eOpts) {
             var errUI = Ext.getCmp('promotion_date_to_err');
             errUI.setValue('');
             if (!isValid) {
             errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -5px;">'+e.getErrors()+'</span>');
             }
             }	
             }
             }]
             },
             {
             xtype: 'container',
             layout: 'hbox',
             items: [{
             xtype: 'displayfield',
             name: 'promotion_date_from_err',
             id: 'promotion_date_from_err',
             fieldLabel: '&nbsp;',
             value: '',
             labelSeparator: '',
             labelWidth: 10
             },
             {
             xtype: 'component',
             html: '',
             margin: '0 10 0 10'
             },
             {
             xtype: 'displayfield',
             name: 'promotion_date_to_err',
             id: 'promotion_date_to_err',
             fieldLabel: '&nbsp;',
             value: '',
             labelSeparator: '',
             labelWidth: 10
             }]
             
             }]
             }]
             },
             {
             xtype: 'fieldset',					
             title: 'Visibility',			
             collapsible: false,
             margin: '0 10 10 0',
             disabled: true,
             items: [{
             xtype: 'radiogroup',
             cls: 'x-check-group-alt',
             layout: 'column',
             items: [
             {boxLabel: 'All', name: 'visibility', inputValue: 'all', columnWidth: 0.20},
             {boxLabel: 'First Time Guests', name: 'visibility', inputValue: 'guest', id: 'ftg', columnWidth: 0.30},
             {boxLabel: 'Members only', name: 'visibility', inputValue: 'member', id: 'member', columnWidth: 0.30}
             ]
             }]
             },
             {
             xtype: 'fieldset',					
             title: 'Valid Times',			
             collapsible: false,
             disabled: true,
             items: [{
             xtype: 'container',
             layout: 'vbox',
             items: [{
             xtype: 'radiogroup',
             cls: 'x-check-group-alt',
             id: 'promo_valid_times',
             listeners: {
             change: function(val){
             if(val.getValue().valid_times == 'any'){
             Ext.getCmp('promo_valid_times_hr_start').setValue();
             Ext.getCmp('promo_valid_times_hr_end').setValue();
             Ext.getCmp('promo_valid_times_min_start').setValue();
             Ext.getCmp('promo_valid_times_min_end').setValue();
             
             Ext.getCmp('promo_valid_times_hr_start').setDisabled(true);
             Ext.getCmp('promo_valid_times_hr_end').setDisabled(true);
             Ext.getCmp('promo_valid_times_min_start').setDisabled(true);
             Ext.getCmp('promo_valid_times_min_end').setDisabled(true);
             Ext.getCmp('promo_valid_times_meridian_start').setDisabled(true);
             Ext.getCmp('promo_valid_times_meridian_end').setDisabled(true);
             }else{
             Ext.getCmp('promo_valid_times_hr_start').setDisabled(false);
             Ext.getCmp('promo_valid_times_hr_end').setDisabled(false);
             Ext.getCmp('promo_valid_times_min_start').setDisabled(false);
             Ext.getCmp('promo_valid_times_min_end').setDisabled(false);
             Ext.getCmp('promo_valid_times_meridian_start').setDisabled(false);
             Ext.getCmp('promo_valid_times_meridian_end').setDisabled(false);
             }
             }											
             },
             items: [
             {boxLabel: 'Any', name: 'valid_times', inputValue: 'any', width: 100, checked: true},
             {boxLabel: 'Fixed', name: 'valid_times', inputValue: 'fixed'}
             ]
             },
             {	
             xtype: 'container',
             layout: 'hbox',
             margin: '0 0 10 0',
             defaults :{
             inputWidth: '50'
             },
             items: [{
             xtype: 'numberfield',
             minValue: 0,
             maxValue: 23,
             emptyText: 'H',
             margin: '0 5 0 0',
             id: 'promo_valid_times_hr_start',
             disabled: true,
             allowBlank: false,											
             listeners: {
             change: function(v){
             if(v.getValue() > 11){
             Ext.getCmp('promo_valid_times_meridian_start').update('PM');
             }else{
             Ext.getCmp('promo_valid_times_meridian_start').update('AM');	
             }
             },
             'validitychange': function (e, isValid, eOpts) {
             var errUI = Ext.getCmp('promo_valid_times_hr_start_err');
             errUI.setValue('');
             if (!isValid) {
             errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -5px;">Required</span>');
             }
             }
             }
             },
             {
             xtype: 'numberfield',
             minValue: 0,
             maxValue: 59,
             emptyText: 'M',
             allowBlank: false,
             id: 'promo_valid_times_min_start',
             disabled: true,
             listeners: {
             'validitychange': function (e, isValid, eOpts) {
             var errUI = Ext.getCmp('promo_valid_times_min_start_err');
             errUI.setValue('');
             if (!isValid) {
             errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -5px;">Required</span>');
             }
             }	
             }
             },
             {
             xtype: 'component',
             html: 'AM',
             margin: '2 0 0 5',
             id: 'promo_valid_times_meridian_start',
             disabled: true
             },
             {
             xtype: 'component',
             html: '-',
             margin: '0 5 0 5'
             },
             {
             xtype: 'numberfield',
             minValue: 0,
             maxValue: 23,
             emptyText: 'H',
             margin: '0 5 0 0',
             allowBlank: false,
             id: 'promo_valid_times_hr_end',
             disabled: true,
             listeners: {
             change: function(v){													
             if(v.getValue() > 11){
             Ext.getCmp('promo_valid_times_meridian_end').update('PM');
             }else{
             Ext.getCmp('promo_valid_times_meridian_end').update('AM');	
             }
             },
             'validitychange': function (e, isValid, eOpts) {
             var errUI = Ext.getCmp('promo_valid_times_hr_end_err');
             errUI.setValue('');
             if (!isValid) {
             errUI.setValue('<span style="color:#CF4C35;">Required</span>');
             }
             }
             }
             },
             {
             xtype: 'numberfield',
             minValue: 0,
             maxValue: 59,
             emptyText: 'M',
             allowBlank: false,
             id: 'promo_valid_times_min_end',
             disabled: true,
             listeners: {
             'validitychange': function (e, isValid, eOpts) {
             var errUI = Ext.getCmp('promo_valid_times_min_end_err');
             errUI.setValue('');
             if (!isValid) {
             errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -5px;">Required</span>');
             }
             }	
             }
             },
             {
             xtype: 'component',
             html: 'AM',
             margin: '2 0 0 5',
             id: 'promo_valid_times_meridian_end',
             disabled: true
             }]
             },
             {
             xtype: 'container',
             layout: 'hbox',
             items: [{
             xtype: 'displayfield',
             name: 'promo_valid_times_hr_start_err',
             id: 'promo_valid_times_hr_start_err',
             labelWidth: 10,
             fieldLabel: '&nbsp;',
             value: '',
             labelSeparator: ''
             },
             {
             xtype: 'displayfield',
             name: 'promo_valid_times_min_start_err',
             id: 'promo_valid_times_min_start_err',
             labelWidth: 10,
             fieldLabel: '&nbsp;',
             value: '',
             labelSeparator: ''
             },
             {
             xtype: 'displayfield',
             name: 'promo_valid_times_hr_end_err',
             id: 'promo_valid_times_hr_end_err',
             labelWidth: 10,
             fieldLabel: '&nbsp;',
             value: '',
             labelSeparator: ''
             },
             {
             xtype: 'displayfield',
             name: 'promo_valid_times_min_end_err',
             id: 'promo_valid_times_min_end_err',
             labelWidth: 10,
             fieldLabel: '&nbsp;',
             value: '',
             labelSeparator: ''
             }]
             }]									
             }]
             },
             {
             xtype: 'fieldset',					
             title: 'Bookable',			
             collapsible: false,
             margin: '0 10 10 0',
             disabled: true,
             items: [
             {
             xtype: 'container',
             layout: 'vbox',
             items: [{
             xtype: 'radiogroup',
             cls: 'x-check-group-alt',
             width: 200,
             id: 'promo_bookable',
             listeners: {
             change: function(val){																								
             if(val.getValue().bookable == 'yes'){
             Ext.getCmp('promo_code').setDisabled(false);
             }else{
             Ext.getCmp('promo_code').setDisabled(true);
             Ext.getCmp('promo_code').reset();
             }
             }
             },
             items: [
             {boxLabel: 'No', name: 'bookable', inputValue: 'no', checked: true},
             {boxLabel: 'Yes', name: 'bookable', inputValue: 'yes'}
             ]
             },
             {
             xtype: 'container',
             layout: 'hbox',
             margin: '0 0 5 0',
             items: [
             {
             xtype: 'displayfield',
             name: 'promotion_code_err',
             id: 'promotion_code_err',
             labelWidth: 10,
             fieldLabel: '&nbsp;',
             value: '',
             labelSeparator: '',
             width: 100
             },
             {
             xtype: 'textfield',
             inputWidth: 50,
             fieldLabel: 'Code',
             labelWidth: 0,
             labelSeparator: '',
             id: 'promo_code',
             disabled: true,
             allowBlank: false,
             listeners: {
             'validitychange': function (e, isValid, eOpts) {
             var errUI = Ext.getCmp('promotion_code_err');
             errUI.setValue('');
             if (!isValid) {
             errUI.setValue('<span style="color:#CF4C35;margin:0 0 0 -5px;">Required</span>');
             }
             }	
             }
             }]
             }]
             }]
             },*/
            /*{
             xtype: 'fieldset',					
             title: 'Valid Days<span style="color: #FF0000;">*</span>',			
             collapsible: false,
             //disabled: true,
             items: [{           
             xtype: 'checkboxgroup',
             margin: '10 0 0 0',
             cls: 'x-check-group-alt',
             id: 'promo_valid_days',
             allowBlank: false,
             items: [
             {name: 'valid_day', inputValue: 'SUN', checked: true},
             {name: 'valid_day', inputValue: 'MON', checked: true},
             {name: 'valid_day', inputValue: 'TUE', checked: true},
             {name: 'valid_day', inputValue: 'WED', checked: true},
             {name: 'valid_day', inputValue: 'THU', checked: true},
             {name: 'valid_day', inputValue: 'FRI', checked: true},
             {name: 'valid_day', inputValue: 'SAT', checked: true}
             ],
             listeners: {
             'validitychange': function( ev, isValid, eOpts ){
             Ext.getCmp('promotion_valid_days_err').setValue('');
             if(!isValid){
             Ext.getCmp('promotion_valid_days_err').setValue('<span style="color:#CF4C35;">'+ev.getErrors()+'</span>');
             }
             }
             }
             },
             {
             xtype: 'displayfield',
             name: 'promotion_valid_days_err',
             id: 'promotion_valid_days_err',
             labelWidth: 5,
             fieldLabel: '&nbsp;',
             value: '',
             labelSeparator: ''
             }]
             }]
             }]
             }]
             }]
             },
             {
             xtype: 'container',
             layout: 'vbox',
             tdAttrs: {
             style: {
             'width': '25%'
             }
             },
             items: [{
             xtype: 'container',
             layout: 'hbox',
             id: 'promotion_right_btns',
             items: [{
             xtype: 'button',
             text: 'Cancel',
             margin: '0 10 0 10',
             handler: function(){
             Ext.getCmp('thumb_img').setSrc();
             Ext.getCmp('big_img').setSrc();
             Ext.getCmp('promo_sub').getForm().reset();
             }
             },
             {
             xtype: 'button',
             text: 'Submit',
             id: 'promotion_submit',
             handler: function(){
             /*var flag;
             var flag_bookable = true;
             var flag_valid_times = true;
             
             if(Ext.getCmp('promo_duration').getValue().duration == 'yes'){
             if(Ext.getCmp('duration_date_from').getSubmitValue() && Ext.getCmp('duration_date_to').getSubmitValue()){
             flag = true;
             }else{
             if(!Ext.getCmp('duration_date_from').getSubmitValue()){
             Ext.getCmp('promo_sub').getForm().isValid()
             }
             if(!Ext.getCmp('duration_date_to').getSubmitValue()){
             Ext.getCmp('promo_sub').getForm().isValid()
             }
             flag = false;
             }
             }else{
             flag = true;
             }
             
             if(Ext.getCmp('promo_bookable').getValue().bookable == 'yes'){
             if(!Ext.getCmp('promo_code').isValid()){
             flag_bookable = false;
             Ext.getCmp('promo_sub').getForm().isValid()
             }
             }
             
             if(Ext.getCmp('promo_valid_times').getValue().valid_times == 'fixed'){
             
             if(Ext.getCmp('promo_valid_times_hr_start').isValid() && Ext.getCmp('promo_valid_times_hr_end').isValid() && Ext.getCmp('promo_valid_times_min_start').isValid() && Ext.getCmp('promo_valid_times_min_end').isValid()){
             flag_valid_times = true;
             }else{
             flag_valid_times = false;
             Ext.getCmp('promo_sub').getForm().isValid()
             }
             }							
             
             if(flag && flag_bookable && flag_valid_times && Ext.getCmp('promo_sub').getForm().isValid()){
             com.faralam.PromotionSubmit(sessionStorage.SA, sessionStorage.SL);	
             }
             
             if(Ext.getCmp('promo_sub').getForm().isValid()){
             com.faralam.PromotionSubmit(sessionStorage.SA, sessionStorage.SL);
             }
             }
             }]
             },
             {
             xtype: 'container',
             html: '<span style="color:#fff;">Optionally, you can create a promotion that will highlight your location on the map.<br><br>Upload a picture or choose from one of the pictures in your gallery.<br><br>Choose a text message for your promotion.<br><br>Choose a \'name\' for your promotion and a type.<br><br>The type of Promotion will determine the type of marker shown.</span>',
             cls: 'zip_notify',
             id: 'promotion_right_notify',
             style: 'height: 228px;margin-left:10px;'
             }]
             }]
             });
             com.faralam.Promotion_first_part.add(arr_promotion);
             com.faralam.Promotion_first_part.doLayout();
             
             Ext.getCmp('promo_type').setValue('');
             Ext.getCmp('promo_type').getStore().removeAll();
             Ext.getCmp('promo_type').getStore().proxy.url = com.faralam.serverURL+'promotions/getPromotionTypes';
             Ext.getCmp('promo_type').getStore().reload();
             Ext.getCmp('thumb_img').setSrc();
             Ext.getCmp('big_img').setSrc();*/
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_promotion, "GET", {}, onsuccess, onerror);
}

com.faralam.retrieve_promotion_metadata = function (promouuid, index) {

    com.faralam.get_promotion_metadata = com.faralam.serverURL + 'promotions/getPromotionMetaDataPortalByPromoUUID';
    com.faralam.get_promotion_metadata = com.faralam.get_promotion_metadata + "?" + encodeURI('UID=' + sessionStorage.UID + '&promoUUID=' + promouuid);

    var onsuccess = function (data, textStatus, jqXHR) {
        var frm_values = data;
        Ext.getCmp('promo_add_text' + index).setValue(frm_values.displayText);
        /*if(frm_values.classTimeSlotPolicyEntry.timeRange.activationDate && frm_values.classTimeSlotPolicyEntry.timeRange.expirationDate){
         Ext.getCmp('promo_duration'+index).items.items[1].setValue(true);
         Ext.getCmp('duration_date_from'+index).setValue(frm_values.classTimeSlotPolicyEntry.timeRange.activationDate);
         Ext.getCmp('duration_date_to'+index).setValue(frm_values.classTimeSlotPolicyEntry.timeRange.expirationDate);
         }else{
         Ext.getCmp('promo_duration'+index).items.items[0].setValue(true);
         }*/

        Ext.getCmp('promo_identifier' + index).setValue(frm_values.promotionSASLName);
        Ext.getCmp('promo_type' + index).setValue(frm_values.promotionType.enumText);
        /*if(frm_values.localOnly){
         Ext.getCmp('promo_location'+index).items.items[0].setValue(true);
         }else{
         Ext.getCmp('promo_location'+index).items.items[1].setValue(true);
         }
         if(frm_values.bookable){					
         Ext.getCmp('promo_bookable'+index).items.items[1].setValue(true);
         Ext.getCmp('promo_code'+index).setValue(frm_values.promotionCode);
         }else{
         Ext.getCmp('promo_bookable'+index).items.items[0].setValue(true);					
         }
         if(frm_values.classTimeSlotPolicyEntry.timeRange.openingHours.startClock.hour > 0 && frm_values.classTimeSlotPolicyEntry.timeRange.openingHours.endClock.hour > 0){
         Ext.getCmp('promo_valid_times'+index).items.items[1].setValue(true);
         Ext.getCmp('promo_valid_times_hr_start'+index).setValue(frm_values.classTimeSlotPolicyEntry.timeRange.openingHours.startClock.hour);				
         Ext.getCmp('promo_valid_times_min_start'+index).setValue(frm_values.classTimeSlotPolicyEntry.timeRange.openingHours.startClock.minute);
         var meridian_status_start;
         if(frm_values.classTimeSlotPolicyEntry.timeRange.openingHours.startClock.hour > 12){
         meridian_status_start = 'PM';
         }else{
         meridian_status_start = 'AM';
         }
         Ext.getCmp('promo_valid_times_meridian_start'+index).update(meridian_status_start);
         Ext.getCmp('promo_valid_times_hr_end'+index).setValue(frm_values.classTimeSlotPolicyEntry.timeRange.openingHours.endClock.hour);
         Ext.getCmp('promo_valid_times_min_end'+index).setValue(frm_values.classTimeSlotPolicyEntry.timeRange.openingHours.endClock.minute);
         var meridian_status_end;
         if(frm_values.classTimeSlotPolicyEntry.timeRange.openingHours.endClock.hour > 12){
         meridian_status_end = 'PM';
         }else{
         meridian_status_end = 'AM';
         }
         Ext.getCmp('promo_valid_times_meridian_end'+index).update(meridian_status_end);
         }else{
         Ext.getCmp('promo_valid_times'+index).items.items[0].setValue(true);
         }*/
        Ext.getCmp('promo_valid_days' + index).setValue({
            valid_day: frm_values.classTimeSlotPolicyEntry.timeRange.openingDays
        });

        Ext.getCmp('thumb_img' + index).setSrc(com.faralam.serverURL + 'promotions/retrievePictureJPGByPromoUUID?promoUUID=' + promouuid);
        Ext.getCmp('big_img' + index).setSrc(com.faralam.serverURL + 'promotions/retrievePictureJPGByPromoUUID?promoUUID=' + promouuid);
        Ext.getCmp('promouuid' + index).setValue(promouuid);

    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_promotion_metadata, "GET", {}, onsuccess, onerror);
}

com.faralam.PromotionSubmit = function (sa, sl) {

    com.faralam.loginMask = new Ext.LoadMask(Ext.getBody(), {
        msg: "Please wait ..."
    });
    com.faralam.loginMask.show();

    /*var localonly, bookable;
     
     if(Ext.getCmp('promo_location').getValue().location == 'local'){
     localonly = true;
     }else{
     localonly = false;
     }
     
     if(Ext.getCmp('promo_bookable').getValue().bookable == 'yes'){
     bookable = true; 
     }else{
     bookable = false;
     }
     
     if(Ext.getCmp('promo_duration').getValue().duration == 'yes'){			
     var activationDate = Ext.getCmp('duration_date_from').getSubmitValue();
     var expirationDate = Ext.getCmp('duration_date_to').getSubmitValue();
     }else{
     var activationDate = '';
     var expirationDate = '';
     }
     
     if(!Ext.getCmp('promo_valid_times_hr_start').getValue()){
     var startclock_hr = '0';
     }else{
     var startclock_hr = Ext.getCmp('promo_valid_times_hr_start').getValue();
     }
     
     if(!Ext.getCmp('promo_valid_times_min_start').getValue()){
     var startclock_min = '0';
     }else{
     var startclock_min = Ext.getCmp('promo_valid_times_min_start').getValue();
     }
     
     if(!Ext.getCmp('promo_valid_times_hr_end').getValue()){
     var endclock_hr = '23';
     }else{
     var endclock_hr = Ext.getCmp('promo_valid_times_hr_end').getValue();
     }
     
     if(!Ext.getCmp('promo_valid_times_min_end').getValue()){
     var endclock = '59';
     }else{
     var endclock = Ext.getCmp('promo_valid_times_min_end').getValue();
     }*/

    if (Ext.getCmp('promo_valid_days').getValue().valid_day instanceof Array) {
        var opening_day = Ext.getCmp('promo_valid_days').getValue().valid_day;
    } else {
        var opening_day = [Ext.getCmp('promo_valid_days').getValue().valid_day];
    }

    var xhr = new XMLHttpRequest(),
        method = 'POST',
        /*url = com.faralam.serverURL+'promotions/createWNewPictureNewMetaDataExtJS?UID='+sessionStorage.UID;		
         
         var data = {
         "timeRestricted":true,
         "classTimeSlotPolicyEntry":
         {
         "reservationType":"PSEUDO",
         "timeSlotType":"FIXED_60MIN_INTERVALS",
         "maxSeatCount":40,
         "maxHeadCountPerSeat":3,
         "timeRange":
         {
         "activationDate": activationDate,
         "expirationDate": expirationDate,
         "openingHours":
         {
         "startClock":
         {
         "hour":startclock_hr,
         "minute":startclock_min
         },
         "endClock":
         {
         "hour":endclock_hr,
         "minute":endclock
         }
         },
         "openingDays":opening_day
         }
         },
         "bookable": bookable,
         "localOnly": localonly,
         "promotionCode": Ext.getCmp('promo_code').getValue(),
         "promotionSASLName":Ext.getCmp('promo_identifier').getValue(),
         "displayText": Ext.getCmp('promo_add_text').getValue(),
         "keywords":"",
         "promotionType": Ext.getCmp('promo_type').getValue(),
         "serviceAccommodatorId":sa,
         "serviceLocationId":sl,
         "floorId":1,
         "tierId":1
         };*/

        url = com.faralam.serverURL + 'promotions/createWNewPictureNewMetaData?UID=' + sessionStorage.UID;
    var data = {
        "classTimeSlotPolicyEntry": {
            "reservationType": "PSEUDO",
            "timeSlotType": "FIXED_60MIN_INTERVALS",
            "maxSeatCount": 40,
            "maxHeadCountPerSeat": 3,
            "timeRange": {
                //"activationDate": activationDate,
                //"expirationDate": expirationDate,
                "openingDays": opening_day
            }
        },
        "promotionSASLName": Ext.getCmp('promo_identifier').getValue(),
        "displayText": Ext.getCmp('promo_add_text').getValue(),
        "displayLocation": {
            "x": 0,
            "y": 0
        },
        "promotionType": Ext.getCmp('promo_type').getValue(),
        "serviceAccommodatorId": sa,
        "serviceLocationId": sl
    };
    data = JSON.stringify(data);

    var formData = new FormData();
    formData.append('promotionsaslmetadata', data);

    var file = Ext.getCmp('promo_upload').getEl().down('input[type=file]').dom.files[0];
    if (file) {
        formData.append(file.name, file);
    }

    var onLoadHandler = function (event) {
        if (event.target.readyState == 4) {
            com.faralam.loginMask.hide();
            if (event.target.status == 200) {
                com.faralam.registration.showPopup('Success', 'Updated successfully.');
            } else {
                com.faralam.common.ErrorHandling(event.target.responseText);
                return false;
            }
        }
    }

    xhr.open(method, url, true);
    xhr.onload = onLoadHandler;
    xhr.send(formData);
}

com.faralam.RetrievePromoInfo = function () {

    //com.faralam.retrieve_promo_info = com.faralam.serverURL + 'promotions/retrievePromoPictureMetadataBySA';
    com.faralam.retrieve_promo_info = com.faralam.serverURL + 'promotions/retrievePromotionSATiersMetaDataBySASL';
    com.faralam.retrieve_promo_info = com.faralam.retrieve_promo_info + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&status=ALL');

    var onsuccess = function (response, textStatus, jqXHR) {

        var html = '';
        var html1 = '';
        var first_type = '';
        var first_title = '';
        var first_pic = '';
        var first_desc = '';
        var first_share_url=';'
        var arr = new Array();
        var count = 0;
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].promotionStatus == "ACTIVE") {
                    var active_count = 1;
                    if (active_count == 1) {
                        first_type = response[i].promotionType.enumText;
                        first_title = response[i].promotionSASLName;
                        first_pic = response[i].url;
                        first_desc = response[i].messageText;
                        first_promo_UUID = response[i].promoUUID;
                        first_share_url=response[i].shareURL;
                        active_count++;
                    }

                    var del_params = response[i].promoPictureId + ',' + response[i].serviceAccommodatorId + ',' + response[i].promotionType.enumText + ',' + response[i].promotionSASLName + ',' + response[i].messageText + ',' + response[i].promoUUID;
                    var overlay_img = '';
                    overlay_img = com.faralam.custom_img_path + 'ACTIVE.png';

                    html += '<li><img id="promotion_drag_zone_active" class="before_dragging" ondragend="com.faralam.dragEnd_promotion(event)" ondragstart="com.faralam.dragStart_promotion(event)" onclick="com.faralam.SetPromoImageDesc(this)" status="ACTIVE" shareUrl="'+response[i].shareURL+'"  width="70" height="80" data-qtip=' + response[i].promotionStatus + ' params=' + del_params + ' src="' + response[i].url + '" promoUUID="' + response[i].promoUUID + '" promoId="' + response[i].promoPictureId + '" promoType="' + response[i].promotionType.enumText + '" promoTitle="' + response[i].promotionSASLName + '" imgUrl="' + response[i].url + '" promoDesc="' + response[i].messageText + '" ><div class="gallery_overlay"><span><img src="' + overlay_img + '" alt="" ondrop="com.faralam.drop_promotion(event)" ondragover="com.faralam.allowDrop_promotion(event)" /></span></div></li>';
                } else if (response[i].promotionStatus == "PROPOSED" || response[i].promotionStatus == "APPROVED") {

                    // var promo_fields = response[i].promoPictureId+','+response[i].serviceAccommodatorId+','+response[i].promotionType.enumText+','+response[i].promotionSASLName+','+response[i].messageText;
                    var overlay_img = '';
                    overlay_img = com.faralam.getImgStatus(response[i].promotionStatus);

                    html1 += '<div id="inactive_promo_parent"><div id="inactive_promo_parent_first"><div id="inactive_promo_parent_img"><img id="promotion_drag_zone_inactive" class="before_dragging" ondragend="com.faralam.dragEnd_promotion(event)" ondragstart="com.faralam.dragStart_promotion(event)" onclick="com.faralam.SetPromoImageDesc(this)" status="'+response[i].promotionStatus+'" shareUrl="'+response[i].shareURL+'" promoId="' + response[i].promoPictureId + '" promoType="' + response[i].promotionType.enumText + '" promoTitle="' + response[i].promotionSASLName + '" imgUrl="' + response[i].url + '" promoDesc="' + response[i].messageText + '" promoUUID="' + response[i].promoUUID + '" src="' + response[i].url + '" width="60" height="80" data-qtip=' + response[i].promotionStatus + '></div><div class="gallery_overlay1"><span><img src="' + overlay_img + '" alt="" /></span></div><div class="img_details_wrap"><p>' + response[i].promotionType.enumText + '</p><p>' + response[i].promotionSASLName + '</p><p>' + response[i].messageText + '</p></div><button id="' + response[i].promoUUID + '" class="promo_edit_btn" onclick="com.faralam.SetPromoImageDescEdit(this)" promoUUID="' + response[i].promoUUID + '" promoId="' + response[i].promoPictureId + '" promoType="' + response[i].promotionType.enumText + '" promoTitle="' + response[i].promotionSASLName + '" imgUrl="' + response[i].url + '" promoDesc="' + response[i].messageText + '" >Edit</button><button id="' + response[i].promoUUID + '" onclick="com.faralam.activate_promo(this);">Activate</button></div></div>';

                    count++;
                }
            }

            if (first_type) {
                Ext.getCmp('promo_show_image_type').setValue(first_type);
            }
            if (first_title) {
                Ext.getCmp('promo_show_image_title').setValue(first_title);
            }
            if (first_pic) {
                Ext.getCmp('promo_show_image').setSrc(first_pic);
            }

            if (first_desc) {
                Ext.getCmp('promo_textarea').setValue(first_desc);
            }
            if (first_share_url) {
                Ext.getCmp('promo_share_url').setValue(first_share_url);
                Ext.getCmp('promotion_share_btn').setDisabled(false);
            }
            if (first_promo_UUID) {
                 Ext.getCmp('promoUUID').setValue(first_promo_UUID);
            }
            
            if (html) {
                html = '<ul class="images">' + html + '</ul>';
            } else {
                html = '<ul class="images" style="text-align:center;height:87px;"><li>No image(s) available</li></ul>';
            }

            if (html1) {
                html1 = '<div id="inactive_promo_parent_container" style="max-height:266px;">' + html1 + '</div>';
                if (count == 3) {
                    arr = {
                        suppressScrollX: true,
                        suppressScrollY: true
                    };
                }
            } else {
                html1 = '<div id="inactive_promo_parent_container" style="height:88px;text-align:center;padding:5px;background:#252525;">No image(s) available</div>';
                arr = {
                    suppressScrollX: true,
                    suppressScrollY: true
                };
            }
        } else {
            Ext.getCmp('promo_show_image').setSrc('');

            html = '<ul class="images" style="text-align:center;height:87px;"><li>No image(s) available</li></ul>';
            html1 = '<div id="inactive_promo_parent_container" style="height:88px;text-align:center;padding:5px;background:#252525;">No image(s) available</div>';
            arr = {
                suppressScrollX: true,
                suppressScrollY: true
            };
        }

        Ext.getCmp('slide_panel_promotion').update(html);

        Ext.getCmp('slide_panel1_promotion').update(html1);

        $('div#slide_panel_promotion-innerCt').perfectScrollbar('destroy');
        $("div#slide_panel_promotion-innerCt").perfectScrollbar();

        $('div#inactive_promo_parent_container').perfectScrollbar('destroy');
        $("div#inactive_promo_parent_container").perfectScrollbar(arr);
        
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieve_promo_info, "GET", {}, onsuccess, onerror);

}

com.faralam.common.set_promo_image = function(e){
    var img=e.getAttribute('src');
    Ext.getCmp('promo_big_img').setSrc(img);
    var pid=e.getAttribute('pid');
    var p_sa=e.getAttribute('p_sa');
    Ext.getCmp('hid_promo_picture_id').setValue(pid);
    Ext.getCmp('promo_picture_SA').setValue(p_sa);
    Ext.getCmp('save_type').setValue("SAVED");
    
}

com.faralam.common.retrievePromoPictureMetadataBySA = function () {

    
    com.faralam.retrievePromoPictureMetadataBySA = com.faralam.serverURL + 'promotions/retrievePromoPictureMetadataBySA';
    com.faralam.retrievePromoPictureMetadataBySA = com.faralam.retrievePromoPictureMetadataBySA + "?" + encodeURI('count=10&keyword=&serviceAccommodatorId='+sessionStorage.SA+'&startIndex=0&status=ALL');

    var onsuccess = function (response, textStatus, jqXHR) {
        console.log(response);
        var html='<div id="promo_sel_image_div">';
        if(response.length>0)
            {
                for(var i=0;i<response.length;i++)
                    {
                        html+='<img onClick="com.faralam.common.set_promo_image(this)" pid="'+response[i].promoPictureId+'" p_sa="'+response[i].serviceAccommodatorId+'" src="'+response[i].url+'" >';
                    }
                html+="</div>";
                
            }
        console.log("html="+html);
        Ext.getCmp('promo_sel_image_sec').update(html);
        $('promo_sel_image_div').perfectScrollbar('destroy');
        $("promo_sel_image_div").perfectScrollbar();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrievePromoPictureMetadataBySA, "GET", {}, onsuccess, onerror);

}

com.faralam.SubmitPromotion = function () {
    com.faralam.submit_promotion = com.faralam.serverURL + 'promotions/createWNewPictureURLNewMetaData';
    //com.faralam.submit_promotion = com.faralam.submit_promotion+ "?" + encodeURI('UID='+ sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL +'&status=APPROVED');
    com.faralam.submit_promotion = com.faralam.submit_promotion + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "displayText": Ext.getCmp('promo_msg').getValue(),
        "promotionType": Ext.getCmp('promo_type').getValue(),
        "promotionSASLName": Ext.getCmp('promo_title').getValue(),
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL,
        "url": Ext.getCmp('promo_big_img').src
    };

    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Promotion Updated successfully.', function () {
            Ext.getCmp('promotion_modal').close();
            com.faralam.RetrievePromoInfo();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.submit_promotion, "POST", data, onsuccess, onerror);
}

com.faralam.common.createWRecyledPictureNewMetaData = function () {
    com.faralam.createWRecyledPictureNewMetaData = com.faralam.serverURL + 'promotions/createWRecyledPictureNewMetaData';
    com.faralam.createWRecyledPictureNewMetaData = com.faralam.createWRecyledPictureNewMetaData + "?" + encodeURI('UID=' + sessionStorage.UID);
   
var data={
    "promotionSASLName":Ext.getCmp('promo_title').getValue(),
    "displayText":Ext.getCmp('promo_msg').getValue(),
    "promotionType":Ext.getCmp('promo_type').getValue(),
    "serviceAccommodatorId":sessionStorage.SA,
    "serviceLocationId":sessionStorage.SL,
    "displayLocation":{
        "x":20,
        "y":20
    },
    "promoPictureId":Ext.getCmp('hid_promo_picture_id').getValue(),
    "promoPictureServiceAccommodatorId":Ext.getCmp('promo_picture_SA').getValue()
}
    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Promotion Added successfully.', function () {
            com.faralam.RetrievePromoInfo();
             Ext.getCmp('promotion_modal').close();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.createWRecyledPictureNewMetaData, "POST", data, onsuccess, onerror);
}

com.faralam.SubmitPromotionEdit = function () {

    com.faralam.submit_promotion = com.faralam.serverURL + 'promotions/updateWSamePictureModifiedMetaData';
    //com.faralam.submit_promotion = com.faralam.submit_promotion+ "?" + encodeURI('UID='+ sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL +'&status=APPROVED');
    com.faralam.submit_promotion = com.faralam.submit_promotion + "?" + encodeURI('promoUUID=' + Ext.getCmp('promoUUID').getValue() + '&UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    // var data = {"promoUUID":Ext.getCmp('promoUUID').getValue(),"promoPictureId":Ext.getCmp('promo_picture_id').getValue(),"displayText":Ext.getCmp('promo_textarea').getValue(),"promotionType":Ext.getCmp('promo_show_image_type').getValue(),"promotionSASLName": Ext.getCmp('promo_show_image_title').getValue(),"serviceAccommodatorId":sessionStorage.SA,"serviceLocationId":sessionStorage.SL};

    var data = {
        "displayLocation": {
            "x": 0,
            "y": 0
        },
        "promotionSASLName": Ext.getCmp('promo_show_image_title').getValue(),
        "displayText": Ext.getCmp('promo_textarea').getValue(),
        "promotionType": Ext.getCmp('promo_show_image_type').getValue()
    }

    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Promotion Updated successfully.', function () {
            com.faralam.RetrievePromoInfo();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.submit_promotion, "POST", data, onsuccess, onerror);
}

com.faralam.activate_promo = function (button) {

    button.innerHTML = 'Processing...';
    com.faralam.activate_promo_sa_tier = com.faralam.serverURL + 'promotions/activatePromotionSATier';
    com.faralam.activate_promo_sa_tier = com.faralam.activate_promo_sa_tier + "?" + encodeURI('promoUUID=' + button.id + '&UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            com.faralam.RetrievePromoInfo();
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {
        button.innerHTML = 'Activate';
    }

    com.faralam.common.sendAjaxRequest(com.faralam.activate_promo_sa_tier, "PUT", {}, onsuccess, onerror);
}

com.faralam.SetPromoImageDesc = function (e) {
    /* var n = e.getAttribute('params').split(',');
     //console.log(n);
     //console.log('id :' + n[0]); //console.log('other :' + n[1]); //console.log('Type :' + n[2]);  //console.log('Title :' + n[3]);
     Ext.getCmp('promo_show_image_type').setValue(n[2]);
     Ext.getCmp('promo_show_image_title').setValue(n[3]);
     Ext.getCmp('promo_show_image').setSrc(e.getAttribute('src'));
     Ext.getCmp('promo_textarea').setValue(n[4]);*/
    //Ext.getCmp('promo_textarea').setValue(decodeURI(n[1]));
    var status=e.getAttribute('status');
    var surl=e.getAttribute('shareUrl');
    if(status=="ACTIVE")
        {
            //Ext.getCmp('promotion_share_btn').show(); 
            Ext.getCmp('promotion_share_btn').setDisabled(false);
        }
    else
        {
            Ext.getCmp('promotion_share_btn').setDisabled(true);
            //Ext.getCmp('promotion_share_btn').hide(); 
        }
    Ext.getCmp('promo_share_url').setValue(surl);
    Ext.getCmp('promoUUID').setValue(e.getAttribute('promoUUID'));
    Ext.getCmp('promo_picture_id').setValue(e.getAttribute('promoId'));
    Ext.getCmp('promo_show_image_type').setValue(e.getAttribute('promoType'));
    Ext.getCmp('promo_show_image_title').setValue(e.getAttribute('promoTitle'));
    Ext.getCmp('promo_show_image').setSrc(e.getAttribute('imgUrl'));
    Ext.getCmp('promo_textarea').setValue(e.getAttribute('promoDesc'));
    Ext.getCmp('promo_meta_edit_btn').hide();
    
}

com.faralam.SetPromoImageDescEdit = function (e) {
    Ext.getCmp('promoUUID').setValue(e.getAttribute('promoUUID'));
    Ext.getCmp('promo_picture_id').setValue(e.getAttribute('promoId'));
    Ext.getCmp('promo_show_image_type').setValue(e.getAttribute('promoType'));
    Ext.getCmp('promo_show_image_title').setValue(e.getAttribute('promoTitle'));
    Ext.getCmp('promo_show_image').setSrc(e.getAttribute('imgUrl'));
    Ext.getCmp('promo_textarea').setValue(e.getAttribute('promoDesc'));
    Ext.getCmp('promo_meta_edit_btn').show();
}

com.faralam.ResetPromoImageDesc = function (e) {
    Ext.getCmp('promoUUID').setValue('');
    Ext.getCmp('promo_picture_id').setValue('');
    Ext.getCmp('promo_show_image_type').setValue('');
    Ext.getCmp('promo_show_image_title').setValue('');
    Ext.getCmp('promo_show_image').setSrc('');
    Ext.getCmp('promo_textarea').setValue('');
    Ext.getCmp('promo_meta_edit_btn').hide();
}

com.faralam.common.RemovePromotionImage = function (promoUUID) {

    //console.log(promoUUID);

    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete the selected image?', function (e) {
        if (e == 'yes') {

            com.faralam.remove_image_promotion = com.faralam.serverURL + 'promotions/deActivatePromotionSATier';
            com.faralam.remove_image_promotion = com.faralam.remove_image_promotion + "?" + encodeURI('promoUUID=' + promoUUID + '&UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

            var onsuccess = function (data, textStatus, jqXHR) {
                Ext.MessageBox.alert('Success', 'The selected image deleted successfully', function () {
                    com.faralam.ResetPromoImageDesc();
                    com.faralam.RetrievePromoInfo();
                });
            }

            var onerror = function (jqXHR, textStatus, errorThrown) {}

            com.faralam.common.sendAjaxRequest(com.faralam.remove_image_promotion, "PUT", {}, onsuccess, onerror);
        }
    });

}

com.faralam.drop_promotion = function (ev) {

    ev.preventDefault();
    var drag_data = ev.dataTransfer.getData('Text');

    if (ev.target.id == 'drop_element_promotion') {
        if (drag_data == 'promotion_drag_zone_active' || drag_data == 'promotion_drag_zone_inactive') {
            var promoUUID = ev.dataTransfer.getData('promoUUID');
            com.faralam.common.RemovePromotionImage(promoUUID);
        }
    }
}

com.faralam.allowDrop_promotion = function (ev) {
    ev.preventDefault();
}

com.faralam.dragStart_promotion = function (ev) {
    if (ev.target.id == 'promotion_drag_zone_active' || ev.target.id == 'promotion_drag_zone_inactive') {
        ev.dataTransfer.setData('Text', ev.target.id);
        ev.dataTransfer.setData('promoUUID', ev.target.getAttribute('promoUUID'));
        ev.target.className = 'after_dragging';
        com.faralam.fire_count = 0;
    }
}

com.faralam.dragEnd_promotion = function (ev) {
    ev.target.className = 'before_dragging';
}

com.faralam.common.open_promotion_share_sec = function () {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
    var promotion_url=Ext.getCmp('promo_share_url').getValue();
    var promoUUID = Ext.getCmp('promoUUID').getValue();
    var sharepromotion_modal;

    if (Ext.getCmp('sharepromotion_modal')) {
        var modal = Ext.getCmp('sharepromotion_modal');
        modal.destroy(modal, new Object());
    }
    if (!sharepromotion_modal) {
        var sharepromotion_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            style: 'background: #324F85 !important; width:850px !important;',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 1,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:850px !important;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            style: 'width:850px !important;',
                            items: [
                                {
                                    xtype: 'container',
                                    margin: '0 0 0 0',
                                    layout: 'hbox',
                                    style: 'width:850px !important;',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            value: '<h4 style="color: #fff;">Share URL</h4> ',
                                            width: 200,
                                            style: 'text-align: left;'
										},
                                        {
                                            xtype: 'component',
                                            width: 600,
                                            id: 'mobile_url_promotion',
                                            margin: '0 0 0 0',
                                            html: '<span style="color:#fff;font-family: arial !important;font-size: 14px;">' +promotion_url+ '</span>',
                                            style: 'text-align:left;'
										}
                                    ]
                                },
                                {
                                    xtype: 'component',
                                    //layout: 'hbox',
                                    height: 40,
                                    width: 845,
                                    margin: '10 0 10 0',
                                    html: '<table><tr><td style="width:180px;"><h4 style="color: #fff; width:135px;">Via Social Network</h4></td><td><a href="https://twitter.com/share?url='+encodeURIComponent(promotion_url)+'" target="_blank"><img id="tweet_btn_PollContest" src="' + com.faralam.custom_img_path + '/tweet-button_withoutbg.png" width="90" height="28" style="float: left; margin-left:20px;"></a></td><td><a href="https://www.facebook.com/sharer.php?u='+encodeURIComponent(promotion_url)+'" target="_blank"><img id="fb_btn_PollContest" src="' + com.faralam.custom_img_path + '/share_button.png" width="90" height="30" style="margin-left:30px;"></a></td></tr></table>'
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            id: 'share_sms_promotion',
                                            fieldLabel: 'Send URL to Mobile',
                                            name: 'share_sms',
                                            allowBlank: true,
                                            emptyText: '',
                                            msgTarget: 'none',
                                            margin: '0 0 0 0',
                                            labelAlign: 'left',
                                            labelWidth: 200,
                                            inputWidth: 250,
                                            emptyText: 'Enter mobile number',
                                            labelSeparator: '  ',
                                            style: ' border-radius: 3px !important;padding: 5px !important;',
                                            minValue: 0,
                                            minLength: 10,
                                            maxLength: 14,
                                            maskRe: /[0-9.]/,
                                            enableKeyEvents: true,
                                            listeners: {
                                                'keydown': function (me, e, eOpts) {
                                                }
                                            }
										},
                                        {
                                            xtype: 'button',
                                            text: '<span style="color:#fff;">Send Text Msg</span>',
                                            scale: 'medium',
                                            margin: '0 0 0 150',
                                            width: 130,
                                            style: 'cursor:pointer;background:#006FC0 !important;border:0px solid #000 !important;box-shadow:none !important; left:645px;',
                                            handler: function () {
                                                var mobNo = Ext.getCmp('share_sms_promotion').getValue();
                                                if (mobNo && mobNo != '') {
                                        var mode = Ext.getCmp('shareEmailSMS_access_mode').getValue();
                                                    if (mode === true) {
                                                        com.faralam.common.sendPromoURLToMobileviaSMS(mobNo,promoUUID)
                                                        
                                                    } else {
                                                        Ext.MessageBox.alert('Information', 'Please select the checkbox');
                                                    }
                                                } else {
                                                    Ext.MessageBox.alert('Information', 'Please enter a valid mobile no.');
                                                }
                                            }
										}
									]
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            id: 'share_email_promotion',
                                            fieldLabel: 'Send URL to E-Mail',
                                            name: 'share_email_promotion',
                                            allowBlank: true,
                                            emptyText: '',
                                            msgTarget: 'none',
                                            margin: '0 0 0 0',
                                            labelAlign: 'left',
                                            labelWidth: 200,
                                            inputWidth: 250,
                                            emptyText: 'Enter email address',
                                            labelSeparator: '  ',
                                            vtype: 'email',
                                            vtypeText: 'Email format is not valid',
                                            style: ' border-radius: 3px !important;padding: 5px !important;',
										},
                                        {
                                            xtype: 'button',
                                            text: '<span style="color:#fff;">Send E-Mail</span>',
                                            scale: 'medium',
                                            margin: '0 0 0 150',
                                            width: 130,
                                            style: 'cursor:pointer;background:#006FC0 !important;border:0px solid #000 !important;box-shadow:none !important; left:645px;',
                                            handler: function () {
                                                var emailAddress = Ext.getCmp('share_email_promotion').getValue();
                                                if (emailAddress && emailAddress != '') {
                                                    var mode = Ext.getCmp('shareEmailSMS_access_mode').getValue();
                                                    if (mode === true) {
                                                        //com.faralam.common.contest_share_email(emailAddress,);
                                                        com.faralam.common.sendPromoURLToEmail(emailAddress,promoUUID);
                                                        
                                                    } else {
                                                        Ext.MessageBox.alert('Information', 'Please select the checkbox');
                                                    }
                                                } else {
                                                    Ext.MessageBox.alert('Information', 'Please enter a valid email address.');
                                                }
                                            }
										}
									]
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '0 0 0 0',
                                    width: 500,
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            name: 'share_email_err',
                                            id: 'share_email_err_PollContest',
                                            fieldLabel: '&nbsp;',
                                            margin: '0 0 0 10',
                                            value: '',
                                            labelSeparator: ''
										}
									]
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    width: 900,
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            fieldLabel: '<h4 style="color: #ffff00;margin-right: 10px; text-align:center !important">"I certify that the recipient has agreed to receive this Text/E-Mail message"</h4>',
                                            defaultType: 'checkboxfield',
                                            msgTarget: 'none',
                                            /* inputWidth: 280,
											inputHeight: 32,*/
                                            margin: '0 0 0 20',
                                            labelAlign: 'right',
                                            //labelWidth: 375,
                                            labelWidth: 550,
                                            inputWidth: 80,
                                            labelSeparator: '  ',
                                            items: [
                                                {
                                                    name: 'shareEmailSMS_access_mode',
                                                    //inputValue: '1',
                                                    id: 'shareEmailSMS_access_mode',
                                                    listeners: {
                                                        click: {
                                                            element: 'el',
                                                            fn: function () {
                                                                var mode = Ext.getCmp('shareEmailSMS_access_mode').getValue();
                                                                //console.log(mode);
                                                                //console.log(Ext.getCmp('share_email_access_mode_PollContest').inputEl.dom.style.backgroundPosition);
                                                                if (mode === true) {
                                                                    Ext.get('shareEmailSMS_access_mode-inputEl').removeCls("inactive_checkbox");
                                                                    Ext.get('shareEmailSMS_access_mode-inputEl').addCls("active_checkbox");
                                                                } else {
                                                                    Ext.get('shareEmailSMS_access_mode-inputEl').removeCls("active_checkbox");
                                                                    Ext.get('shareEmailSMS_access_mode-inputEl').addCls("inactive_checkbox");
                                                                }
                                                            }
                                                        }
                                                    }
												}
											]
										}
									]
								}
							]
                        }
                    ]
                }
            ]
        });

        sharepromotion_modal = Ext.widget('window', {
            //title: '<div class="add_answer_text">Please enter your message</div>',
            id: 'sharepromotion_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 850,
            style: 'background: #324F85 !important; border: 3px solid #000 !important;',
            //cls: 'white_modal',
            //height:410,
            items: sharepromotion_modal_form,
            listeners: {
                close: function () {
                    sharepromotion_modal_form.getForm().reset(true);
                },
                show: function () {
                }

            }
        });
    }
    sharepromotion_modal.show();
}

com.faralam.common.sendPromoURLToMobileviaSMS = function(mobno,promoUUID){
    var ajxurl=com.faralam.serverURL;
    ajxurl+='html/sendPromoURLToMobileviaSMS?'+encodeURI('UID='+sessionStorage.UID+'&promoUUID='+ promoUUID +'&toTelephoneNumber=' + mobno + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
   
    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Send successfully.',function(){
            Ext.getCmp('share_sms_promotion').setValue('');
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(ajxurl, "GET", {}, onsuccess, onerror);
} 

com.faralam.common.sendPromoURLToEmail = function(emailAddress,promoUUID){
   
    var ajxurl=com.faralam.serverURL;
    ajxurl+='html/sendPromoURLToEmail?'+encodeURI('UID='+sessionStorage.UID+'&promoUUID='+ promoUUID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL+'&toEmail='+emailAddress);
    
       console.log(ajxurl) ;
    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Send successfully.',function(){
         Ext.getCmp('share_email_promotion').setValue('');   
        });
        
            }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(emailAddress))
      {
    Ext.MessageBox.alert('Information', 'Please enter a valid email.');
      }
    else
    {
    com.faralam.common.sendAjaxRequest(ajxurl, "GET", {}, onsuccess, onerror);
    }
}

com.faralam.common.AddNewPromotion =function() {
    var promotion_modal;
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
	 if (Ext.getCmp('promotion_modal')) {
         var   promotion_modal_win='';
         
        var modal = Ext.getCmp('promotion_modal');
        modal.destroy(modal, new Object());
    }
    
			if(!promotion_modal) {			
				var promotion_modal_form = Ext.widget('form', {
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					//cls: 'x-body',
                    cls: 'common_bg',
                    border: false,
					bodyPadding: 10,
					fieldDefaults: {
						labelAlign: 'side',
						labelWidth: 150,
						labelStyle: 'font-weight:bold'
					},
					defaultType: 'textfield',
					items: [
					{
					xtype: 'container',
					layout: {
						type: 'table',
						columns: 2,
						tableAttrs: {
							style: {
								width: '100%'
							}
						}
					},
					items: [
                       {
                           xtype:'container',
                           layout:'vbox',
                           width:620,
                           height:500,
                           items:[
                               /*{
                                           xtype:'component',
                                           width:200,
                                           height:50,
                                           html:'<span style="color:#fff>Select a picture</span>' 
                                       },*/
                                       {
                                            xtype: 'button',
                                            scale: 'medium',
                                            text: 'Upload New Picture',
                                            tdAttrs: {
                                                style: {
                                                    width: '30%',
                                                    background:'#2E4E87'
                                                }
                                            },
                                            style: 'margin:0 auto;',
                                            handler: function(){
                                                $('#modal').css({'z-index': '19002'});
                                                com.faralam.getCropPicURLs('resources/plugins/croppic/promo_crop.html');
                                            }
                                       },
                               {
                                xtype:'container',
                                width:600,
                                height:150,
                                style:'border:1px solid white;margin-top:10px',
                                id:'promo_sel_image_sec',
                                html:''
                               },
                               {
                                xtype:'container',
                                width:600,
                                height:250,
                                style:'border:none;margin-top:10px;padding: 41px 0 0 89px;',
                                id:'',
                                html:'<h3 style="color:#fff">To Add a New Promotion</h3><ol type="1" style="width:500px;color:#fff;font-family: Comic Sans MS;font-size: 15px;"><li>Select an existing picture or upload a new picture.</li><li>Add a title.</li><li>Add some description.</li><li>Choose type.</li><li>Click submit.</li></ol>'
                               },{
                            xtype:'hiddenfield',
                            id:'hid_promo_picture_id',
                            value:''
                        },
                            {
                            xtype:'hiddenfield',
                            id:'promo_picture_SA',
                            value:''
                        },{
                            xtype:'hiddenfield',
                            id:'save_type',
                            value:''
                        }
                               
                           ]
                       },
					{
						xtype: 'container',
						style: 'height: 428px;width:280px;',
						tdAttrs: {
							style: {
								'vertical-align': 'top'
							}
						},
						items: [
						{				
							xtype: 'form',
							layout: 'vbox',
							padding: '5 10 5 10',
							style: {
								border: '1px solid #fff;'
							},
							items: [
                            {
								xtype: 'textfield',
								emptyText: '(Title)',
								inputWidth: 240,
								margin: '10 0 0 0',
								name: '',
								value: '',
								id: 'promo_title',
								allowBlank: false
							},
                                {
										xtype:'combo',
										fieldLabel:'',
										name:'promo_type',
										id: 'promo_type',
                                        inputWidth: 240,
										queryMode:'local',
                                        emptyText:'Select promo type',
										displayField: 'value',
										valueField: 'value1',
										autoSelect:true,
                                        margin:'10 0 0 0',
										forceSelection:true	,
										editable: false,
										allowBlank: false,
										afterLabelTextTpl: required,
										store: Ext.create('Ext.data.ArrayStore', {
											fields : ['value', 'value1'],
											autoLoad: false,
											proxy: {
												type: 'ajax',
												url:  '',
												reader: {
													type: 'json',
													getData: function(data){
														var temparray = []; 
														var count = 0;
														Ext.each(data, function(rec) {
															temparray.push([]);
															temparray[count].push( new Array(1));
															temparray[count]['value'] = rec.displayText;
															temparray[count]['value1'] = rec.enumText;
															count=count+1;
														});									
														data = temparray;
														return data;
													}
												}
											}
										})/*,
										listeners: {
											'validitychange': function (e, isValid, eOpts) {
												var errUI = Ext.getCmp('promotion_type_err');
												errUI.setValue('');
												if (!isValid) {
													errUI.setValue('<span style="color:#CF4C35;">'+e.getErrors()+'</span>');
												}
											}
										}*/
									},
									/*{
										xtype: 'displayfield',
										name: 'promotion_type_err',
										id: 'promotion_type_err',
										fieldLabel: '&nbsp;',
										value: '',
										labelSeparator: ''		
									},*/
							{
								xtype: 'image',
                                width: 240,
                                height: 190,
								src: '',
								style: 'border: 1px solid #fff;margin: 3px 0 0 0;',
								id: 'promo_big_img'
							},
							{
								xtype: 'textareafield',
								emptyText: '(Description)',
								name: '',
								margin: '2px 0 0 0',
								value: '',
								width: 240,
								height: 130,
								id: 'promo_msg',
								allowBlank: false
							},
							{
								xtype: 'container',
								defaultType: 'button',
								width: 280,
								style: 'text-align:center;',
								margin: '5 0 0 0',
								items:[{
                                    text: '<span style="color:#000 !important;">Cancel</span>',
                                    style: 'background:#ccc !important; border:2px solid #000 !important;',
                                    margin: '5 0 0 10',
                                    handler: function () 
                                    {
										promotion_modal_form.getForm().reset(true);
                                        Ext.getCmp('promotion_modal').close();
									}
								},
								{
                                    text: '<span style="color:#000 !important;">Submit</span>',
                                    style: 'background:#374B86 !important; border:2px solid #000 !important;',
                                    id:'summery_message',
                                    margin: '5 0 0 10',
                                    handler: function () 
                                    {
                                        var title=Ext.getCmp('promo_title').getValue();
                                        var type=Ext.getCmp('promo_type').getValue();
                                        var src=Ext.getCmp('promo_big_img').src;
                                        var msg=Ext.getCmp('promo_msg').getValue();
										    if(title.trim()=='')
                                                {
                                                    Ext.MessageBox.alert('Error', 'please Add title');
                                                }
                                        else if(!type || type==null)
                                            {
                                               Ext.MessageBox.alert('Error', 'Please choose type'); 
                                            }
                                        else if(src==''){
												Ext.MessageBox.alert('Error', 'Please add image before saving');
											}
                                        else if(msg=='')
                                            {
                                               Ext.MessageBox.alert('Error', 'Please add message'); 
                                            }
											else{
                                                var tp=Ext.getCmp('save_type').getValue();
                                                if(tp=="SAVED")
                                                    {
                                                       com.faralam.common.createWRecyledPictureNewMetaData(); 
                                                    }
                                                if(tp=="NEW")
                                                    {
                                                        com.faralam.SubmitPromotion();
                                                    }
												
											}
										
									}
								}]
							}]				
						}]
					}]
					}]
				});
			
				promotion_modal = Ext.widget('window', {
					title: 'Add Promotion',
					id: 'promotion_modal',
					closeAction: 'destroy',
					layout: 'fit',
					resizable: false,
					modal: true,
					width: 980,
                    height:550,
					items: promotion_modal_form,
					listeners:{
						close:function(){							
							//Ext.getCmp('promo_big_img').setSrc('');
							//Ext.getCmp('thumb_img').setSrc('');
							promotion_modal_form.getForm().reset(true);
						},
                        show:function(){
                            com.faralam.common.retrievePromoPictureMetadataBySA();
                        }
					}
				});

				Ext.getCmp('promo_type').setValue('');
				Ext.getCmp('promo_type').getStore().removeAll();
				Ext.getCmp('promo_type').getStore().proxy.url = com.faralam.serverURL+'promotions/getPromotionTypes';
				Ext.getCmp('promo_type').getStore().reload();				
			}
			promotion_modal.show();
		}

// ############################### Ends ####################################

// ############################### Open Hours Section ############################
com.faralam.HourMinute = function (data) {
    var n = data.split(' ');
    var k = n[0].split(':');
    var hr, mint;
    if (n[1] == 'PM') {
        if (parseInt(k[0]) < 12) {
            hr = parseInt(k[0]) + 12;
        } else {
            hr = k[0];
        }
        mint = k[1];
    } else if (n[1] == 'AM') {
        hr = k[0];
        mint = k[1];
    }
    return hr + ',' + mint;
}

com.faralam.updateShiftTimeSlotPolicies = function (sa, sl) {

    var floorId = 1;
    var tierId = 1;

    com.faralam.updateClassTimeSlotPolicies = com.faralam.serverURL + 'reservations/updateShiftTimeSlotPolicies';
    com.faralam.updateClassTimeSlotPolicies = com.faralam.updateClassTimeSlotPolicies + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl + '&floorId=' + floorId + '&tierId=' + tierId);

    var form_data = Ext.getCmp('open_hrs_grid').getStore().data;

    day_data = {};
    var count = 1;
    var arr = new Array();
    var weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var DemoDay=['sunday', 'monday', 'tuesday', 'wednesday', 'thusday', 'friday', 'saturday'];
    // for daypolicies section
    for (var i = 0; i < Ext.getCmp('promotion_shift_policy_count').getValue(); i++) {
        var index = '' + i + '';
        val = 'open' + index;
        val1 = 'close' + index;
        week_data = {};
        var iscorrect=false;
        for (var j = 0; j < weekdays.length; j++) {
            if (iscorrect==false)
                {
            if (form_data.items[j].data.holiday) {
                var maxHeadCountPerSeat = -2;
                var maxSeatCount = -2;
            } else {
                var maxHeadCountPerSeat = -1;
                maxSeatCount = -1;
            }

            if (form_data.items[j].data['' + val + ''] && form_data.items[j].data['' + val1 + '']) {
                
                 /*=============================validation pradyut======================================*/
                var start_t=form_data.items[j].data['' + val + ''].replace(':',',').replace(' ',',');
                var str_t=start_t.split(',');
                if(str_t.length<3)
                    {
                      iscorrect=true;
                    Ext.MessageBox.alert('Error', 'Please Enter in valid format'+DemoDay[j]); 
                        break;
                    }
                if(isNaN(str_t[0]) || isNaN(str_t[1]) )
                    {
                      iscorrect=true;
                    Ext.MessageBox.alert('Error', 'The Value of Hour and munite are should be numeric on start time on '+DemoDay[j]); 
                        break;
                    }
                if(parseInt(str_t[0])<0 || parseInt(str_t[1])<0)
                    {
                       iscorrect=true;
                       Ext.MessageBox.alert('Error', 'Hours and seconds of start time can not be negative on '+DemoDay[j]);  
                        break;
                    }
                console.log("start="+str_t[2]);
                if(str_t[2]!="AM" && str_t[2]!="PM")
                    {
                       iscorrect=true;
                       Ext.MessageBox.alert('Error', 'Please enter either AM or PM on start time of '+DemoDay[j]);  
                        break;
                    }
                
                var en_tm=form_data.items[j].data['' + val1 + ''].replace(':',',').replace(' ',',');               
                en_tm=en_tm.trim();
                var en_tm=en_tm.split(',');
                if(en_tm.length<3)
                    {
                      iscorrect=true;
                    Ext.MessageBox.alert('Error', 'Please Enter in valid format'+DemoDay[j]); 
                        break;
                    }
                if(isNaN(en_tm[0]) || isNaN(en_tm[1]) )
                    {
                      iscorrect=true;
                    Ext.MessageBox.alert('Error', 'The Value of Hour and munite are should be numeric on end time on '+DemoDay[j]); 
                        break;
                    }
                if(parseInt(en_tm[0])<0 || parseInt(en_tm[1])<0)
                    {
                       iscorrect=true;
                       Ext.MessageBox.alert('Error', 'Hours and seconds of end time can not be negative on '+DemoDay[j]);  
                        break;
                    }
                console.log("end="+en_tm[2]);
                if(en_tm[2]!="AM" && en_tm[2]!="PM")
                    {
                       iscorrect=true;
                       Ext.MessageBox.alert('Error', 'Please enter either AM or PM on endtime of '+DemoDay[j]);
                        break;
                    }
                /*===================================================================*/
                var n = com.faralam.HourMinute(form_data.items[j].data['' + val + '']).split(',');
                var start_hr = parseInt(n[0]);
                var start_min = parseInt(n[1]);
                
                var m = com.faralam.HourMinute(form_data.items[j].data['' + val1 + '']).split(',');
                var end_hr = parseInt(m[0]);
                var end_min = parseInt(m[1]);
                var final_start=parseFloat(start_hr+'.'+start_min);
                var final_end=parseFloat(end_hr+'.'+end_min);
                if(start_hr<0 || start_hr>23 || start_min <0 || start_min >59)
                    {
                       iscorrect=true;
                       Ext.MessageBox.alert('Error', 'Invalid opening time format on '+DemoDay[j]);
                        break;
                    }
                else if(end_hr<0 || end_hr>23 || end_min <0 || end_min >59)
                    {
                       iscorrect=true;
                       Ext.MessageBox.alert('Error', 'Invalid closing time format on '+DemoDay[j]);
                        break;
                    }
                else if(final_start>=final_end)
                    {
                    iscorrect=true;
                    Ext.MessageBox.alert('Error', 'Opening time can not be greater or equal than  closing time on '+DemoDay[j]);
                        break;
                    }
            
                day_data[weekdays[j]] = {
                    "reservationType": "PSEUDO",
                    "forEditorShiftId": i + 1,
                    "timeRange": {
                        "isExpired": false,
                        "openingDays": [weekdays[j].toUpperCase()],
                        "expirationDate": null,
                        "temporalPriority": "DAY",
                        "openingHours": {
                            "startClock": {
                                "minute": start_min,
                                "hour": start_hr
                            },
                            "endClock": {
                                "minute": end_min,
                                "hour": end_hr
                            }
                        },
                        "activationDate": null
                    },
                    "maxHeadCountPerSeat": maxHeadCountPerSeat,
                    "timeSlotType": "FIXED_60MIN_INTERVALS",
                    "maxSeatCount": maxSeatCount,
                    "forEditorDayId": weekdays[j].toUpperCase()
                };
            } else {
                day_data[weekdays[j]] = null;
            }
        }}

        week_data['weekDayPolicies'] = day_data;
        week_data['shiftId'] = count;
        arr.push(
            week_data
        );
        count++;
    }

    // for datepolicies section
    if (form_data.items.length > 7) {
        for (var i = 0; i < Ext.getCmp('promotion_shift_policy_count').getValue(); i++) {
            var index = '' + i + '';
            val = 'open' + index;
            val1 = 'close' + index;

            if (form_data.items[7].data['' + val + ''] && form_data.items[7].data['' + val1 + '']) {
                var n = com.faralam.HourMinute(form_data.items[7].data['' + val + '']).split(',');
                var start_hr = n[0];
                var start_min = n[1];

                var m = com.faralam.HourMinute(form_data.items[7].data['' + val1 + '']).split(',');
                var end_hr = m[0];
                var end_min = m[1];
                var activation_date = new Date(form_data.items[7].data.day);

                date_data = {
                    "forEditorShiftId": 1,
                    "forEditorDayId": null,
                    "reservationType": "PSEUDO",
                    "timeSlotType": "FIXED_60MIN_INTERVALS",
                    "maxSeatCount": 10,
                    "maxHeadCountPerSeat": 4,
                    "timeRange": {
                        "activationDate": Ext.Date.format(activation_date, 'Y-m-d'),
                        "expirationDate": Ext.Date.format(activation_date, 'Y-m-d'),
                        "openingHours": {
                            "startClock": {
                                "hour": start_hr,
                                "minute": start_min
                            },
                            "endClock": {
                                "hour": end_hr,
                                "minute": end_min
                            }
                        },
                        "openingDays": [
                            "SUN",
                            "MON",
                            "TUE",
                            "WED",
                            "THU",
                            "FRI",
                            "SAT"
                        ],
                        "isExpired": false,
                        "temporalPriority": "DATE"
                    }
                }
            }
        }
        if (date_data) {
            var date_data = [date_data];
        } else {
            var date_data = null;
        }
    } else {
        var date_data = null;
    }

    datam = {};
    datam['datePolicies'] = date_data;
    datam['shiftPolicies'] = arr;

    data = JSON.stringify(datam);

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            Ext.MessageBox.alert('Success', 'Updated successfully.', function () {
                com.faralam.common.retrieveClassTimeSlotPolicies(sa, sl);
                Ext.getCmp('open_hrs_toggle').setText('<span style="color:#fff;">Edit</span>');
            });
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
    if(iscorrect==false)
        {
    com.faralam.common.sendAjaxRequest(com.faralam.updateClassTimeSlotPolicies, "PUT", data, onsuccess, onerror);
        }
}

com.faralam.common.retrieveClassTimeSlotPolicies = function (sa, sl) {

    var floorId = 1;
    var tierId = 1;

    com.faralam.retrieveClassTimeSlotPolicies = com.faralam.serverURL + 'sasl/retrieveShiftTimeSlotPolicies';
    com.faralam.retrieveClassTimeSlotPolicies = com.faralam.retrieveClassTimeSlotPolicies + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sa + '&serviceLocationId=' + sl + '&floorId=' + floorId + '&tierId=' + tierId);

    var onsuccess = function (data, textStatus, jqXHR) {

        Ext.getCmp('promotion_shift_policy_count').setValue(data.shiftPolicies.length);
        Ext.getCmp('open_hrs_toggle').setText('<span style="color:#fff;">Edit</span>');

        if (Object.keys(data.shiftPolicies).length > 0) {
            var columns = new Array();
            var fields = new Array();
            var datam = new Array();
            var weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

            columns.push({
                menuDisabled: true,
                xtype: 'actioncolumn',
                sortable: false,
                width: 50,
                items: [
                    {
                        getClass: function (v, meta, rec, rowIndex, colIndex, store) {
                            if (rec.get('day')) {
                                var val = '' + rec.get('day') + '';
                                if (weekdays.indexOf(val.toLowerCase()) == -1) {
                                    return 'sell-col';
                                } else {
                                    return '';
                                }
                            } else {
                                return '';
                            }
                        },
                        getTip: function (v, meta, rec) {
                            if (rec.get('day')) {
                                var val = '' + rec.get('day') + '';
                                if (weekdays.indexOf(val.toLowerCase()) == -1) {
                                    return 'Delete';
                                } else {
                                    return '';
                                }
                            } else {
                                return '';
                            }
                        },
                        handler: function (grid, rowIndex, colIndex) {
                            grid.getStore().remove(grid.getStore().getRange()[7]);
                            com.faralam.common.getUserAndCommunity(sessionStorage.active_tab, 'edit');
                        }
                    }]
            }, {
                header: 'Day',
                dataIndex: 'day',
                width: 165,
                align: 'center',
                sortable: false,
                getEditor: function (rec) {
                    var date = new Ext.create('Ext.grid.CellEditor', {
                        field: Ext.create('Ext.form.DateField', {
                            format: 'M d Y',
                            style: 'background-color: #000 !important;'
                        })
                    });
                    if (rec.get('day')) {
                        var val = '' + rec.get('day') + '';
                        if (weekdays.indexOf(val.toLowerCase()) == -1) {
                            return date;
                        }
                    } else {
                        return date;
                    }
                }
            }, {
                header: 'Holiday',
                xtype: 'checkcolumn',
                dataIndex: 'holiday',
                width: 165,
                align: 'center',
                sortable: false,
                listeners: {
                    checkchange: function (e, rowIndex, checked, eOpts) {
                        if (Ext.getCmp('open_hrs_toggle').getText() == '<span style="color:#fff;">Edit</span>') {
                            Ext.getCmp('open_hrs_toggle').setText('<span style="color:#fff;">Save</span>');
                        }
                    },
                    beforecheckchange: function (e, rowIndex, checked, eOpts) {
                        if (rowIndex == 7) {
                            return false;
                        }
                    }
                }
            });

            fields.push({
                name: 'day'
            }, {
                name: 'holiday'
            });

            for (var i = 0; i < Object.keys(data.shiftPolicies).length; i++) {
                columns.push({
                    header: data.shiftPolicies[i].shiftId + ' Shift',
                    columns: [{
                            header: 'Open',
                            dataIndex: 'open' + i,
                            align: 'center',
                            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                if (record.get('holiday') == true) {
                                    metaData.tdAttr = 'style="background-color:#9CA19E;color:#9CA19E;"';
                                }
                                return value;
                            },
                            field: {
                                type: 'textfield',
                                style: 'background-color: #000 !important;'
                            }
                        },
                        {
                            header: 'Close',
                            dataIndex: 'close' + i,
                            align: 'center',
                            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                if (record.get('holiday') == true) {
                                    metaData.tdAttr = 'style="background-color:#9CA19E;color:#9CA19E;"';
                                }
                                return value;
                            },
                            field: {
                                type: 'textfield',
                                style: 'background-color: #000 !important;'
                            }
                        }]
                });

                fields.push({
                    name: 'open' + i
                }, {
                    name: 'close' + i
                });
            }

            for (var k = 0; k < weekdays.length; k++) {
                var obj = {};
                obj['day'] = weekdays[k].toUpperCase();

                var arr_holidays = [];
                for (var i = 0; i < Object.keys(data.shiftPolicies).length; i++) {

                    if (data.shiftPolicies[i].weekDayPolicies['' + weekdays[k] + '']) {
                        if (data.shiftPolicies[i].weekDayPolicies['' + weekdays[k] + ''].maxSeatCount == '-2' && data.shiftPolicies[i].weekDayPolicies['' + weekdays[k] + ''].maxHeadCountPerSeat == '-2') {
                            arr_holidays.push(true);
                        } else {
                            arr_holidays.push(false);
                        }

                        n = com.faralam.TimeSlot(data.shiftPolicies[i].weekDayPolicies['' + weekdays[k] + ''].timeRange.openingHours.startClock.hour).split(",");
                        min = com.faralam.MinuteSlot(data.shiftPolicies[i].weekDayPolicies['' + weekdays[k] + ''].timeRange.openingHours.startClock.minute);

                        obj["open" + i] = n[0] + ':' + min + ' ' + n[1];

                        n = com.faralam.TimeSlot(data.shiftPolicies[i].weekDayPolicies['' + weekdays[k] + ''].timeRange.openingHours.endClock.hour).split(",");
                        min = com.faralam.MinuteSlot(data.shiftPolicies[i].weekDayPolicies['' + weekdays[k] + ''].timeRange.openingHours.endClock.minute);

                        obj["close" + i] = n[0] + ':' + min + ' ' + n[1];
                    } else {
                        arr_holidays.push(false);
                        obj["open" + i] = '';
                        obj["close" + i] = '';
                    }
                }

                if (arr_holidays.AllValuesSame()) {
                    obj['holiday'] = true;
                } else {
                    obj['holiday'] = false;
                }

                datam.push(
                    obj
                );
            }

            if (data.datePolicies) {

                Ext.getCmp('promotion_date_policy').setValue('1');
                if (data.datePolicies.length > 0) {
                    var dt = new Date(data.datePolicies[0].timeRange.activationDate);
                    var n = data.datePolicies[0].timeRange.activationDate.split('-');
                    var m = data.datePolicies[0].timeRange.expirationDate.split('-');
                    var date_diff = m[2] - n[2];

                    for (var k = 0; k < date_diff + 1; k++) {
                        var activation_date = data.datePolicies[0].timeRange.activationDate.split('-');
                        var activation_date_day = parseInt(activation_date[2]) + k;
                        activation_date_day = ("0" + activation_date_day).slice(-2);
                        var activation_date_month = ("0" + (dt.getMonth())).slice(-2);
                        var activation_date_year = '' + dt.getFullYear() + '';
                        var date = activation_date_year + '-' + activation_date_month + '-' + activation_date_day;
                        var dt1 = new Date(date);

                        var obj = {};
                        for (var i = 0; i < Object.keys(data.datePolicies).length; i++) {

                            n = com.faralam.TimeSlot(data.datePolicies[i].timeRange.openingHours.startClock.hour).split(",");
                            min = com.faralam.MinuteSlot(data.datePolicies[i].timeRange.openingHours.startClock.minute);

                            obj["open" + i] = n[0] + ':' + min + ' ' + n[1];

                            n = com.faralam.TimeSlot(data.datePolicies[i].timeRange.openingHours.endClock.hour).split(",");
                            min = com.faralam.MinuteSlot(data.datePolicies[i].timeRange.openingHours.endClock.minute);

                            obj["close" + i] = n[0] + ':' + min + ' ' + n[1];

                            obj['day'] = Ext.Date.format(dt1, 'M d Y');

                            datam.push(
                                obj
                            );
                        }
                    }
                } else {
                    Ext.getCmp('promotion_date_policy').setValue('0');
                    var extra_rows = 1;
                    for (var k = 0; k < extra_rows; k++) {
                        var obj = {};
                        for (var i = 0; i < Object.keys(data.shiftPolicies).length; i++) {
                            obj["open" + i] = '';
                            obj["close" + i] = '';
                            obj['day'] = '';
                        }
                        datam.push(
                            obj
                        );
                    }
                }
            } else {
                Ext.getCmp('promotion_date_policy').setValue('0');
                var extra_rows = 1;
                for (var k = 0; k < extra_rows; k++) {
                    var obj = {};
                    for (var i = 0; i < Object.keys(data.shiftPolicies).length; i++) {
                        obj["open" + i] = '';
                        obj["close" + i] = '';
                        obj['day'] = '';
                    }
                    datam.push(
                        obj
                    );
                }
            }

            var store = Ext.create('Ext.data.Store', {
                fields: fields,
                data: datam
            });

            Ext.getCmp('open_hrs_grid').reconfigure(store, columns);
        } else {
            Ext.getCmp('open_hrs_toggle').setDisabled(true);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieveClassTimeSlotPolicies, "GET", {}, onsuccess, onerror);
}

com.faralam.TimeSlot = function (hr) {

    var hour, time_type;
    if (parseInt(hr) > 12) {
        hour = parseInt(hr) - 12;
        time_type = 'PM';
    } else if (parseInt(hr) == 0) {
        hour = '12';
        time_type = 'AM';
    } else {
        hour = hr;
        time_type = 'AM';
    }
    var n = '' + hour + '';

    if (n.length == 1) {
        hour = '0' + hour;
    }
    return hour + "," + time_type;
}

com.faralam.MinuteSlot = function (min) {
        if (min == 0) {
            min = '00';
        } else {
            var p = '' + min + '';
            if (p.length == 1) {
                min = '0' + min;
            }
        }

        return min;
    }
    // ############################# Ends #####################################

// ################################# Settings Section #####################################
com.faralam.ChangeUserID = function (first_param, second_param) {
    com.faralam.change_user_id = com.faralam.serverURL + 'authentication/changeUserId';
    com.faralam.change_user_id = com.faralam.change_user_id + "?" + encodeURI('UID=' + sessionStorage.UID + '&newUserId=' + first_param + '&password=' + second_param);

    var onsuccess = function (data, textStatus, jqXHR) {

        Ext.MessageBox.alert('Success', 'You have successfully changed your UserId', function () {
            Ext.getCmp('win').close();
        });
        Ext.getCmp('settings_user_id').setValue(data.userName);
        Ext.getCmp('settings_user_id_hidden').setValue(data.userName);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.change_user_id, "PUT", {}, onsuccess, onerror);
}

com.faralam.ChangeEmail = function (first_param, second_param) {
    com.faralam.change_email = com.faralam.serverURL + 'authentication/changeEmail';
    com.faralam.change_email = com.faralam.change_email + "?" + encodeURI('UID=' + sessionStorage.UID + '&newEmail=' + first_param + '&password=' + second_param);

    var onsuccess = function (data, textStatus, jqXHR) {

        Ext.MessageBox.alert('Success', 'You have successfully changed your Email', function () {
            Ext.getCmp('win1').close();
        });
        Ext.getCmp('settings_email_id').setValue(data.email);
        Ext.getCmp('settings_email_hidden').setValue(data.email);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.change_email, "PUT", {}, onsuccess, onerror);
}

com.faralam.ChangePassword = function (old_password, new_password) {
    com.faralam.change_password = com.faralam.serverURL + 'authentication/changePassword';
    com.faralam.change_password = com.faralam.change_password + "?" + encodeURI('UID=' + sessionStorage.UID + '&oldPassword=' + old_password + '&newPassword=' + new_password);

    var onsuccess = function (data, textStatus, jqXHR) {

        Ext.MessageBox.alert('Success', 'You have successfully changed your Password', function () {
            if (Ext.getCmp('win2')) {
                Ext.getCmp('win2').close();
            }
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.change_password, "PUT", {}, onsuccess, onerror);
}

com.faralam.is_friendly_url_available = function (URL, page) {
    if (page == 'edit') {
        Ext.getCmp('edit_custom_url_msg').setValue('<span>&nbsp;</span>');
    } else {
        Ext.getCmp('custom_url_msg').setValue('<span>&nbsp;</span>');
    }

    com.faralam.friendly_url = com.faralam.serverURL + 'sasl/isFriendlyURLAvailable/';
    com.faralam.friendly_url = com.faralam.friendly_url + "?" + encodeURI('friendlyURL=' + URL);

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            if (page == 'edit') {
                Ext.getCmp('edit_custom_url_msg').setValue('<span style="color:green;">Friendly URL Available</span>');
                Ext.getCmp('edit_hidden_field_for_friendly_url').setValue('0');
            } else {
                Ext.getCmp('custom_url_msg').setValue('<span style="color:green;">Friendly URL Available</span>');
                Ext.getCmp('hidden_field_for_friendly_url').setValue('0');
            }
        } else {
            if (page == 'edit') {
                Ext.getCmp('edit_custom_url_msg').setValue('<span style="color:#CF4C35;">Friendly URL already exists</span>');
                Ext.getCmp('edit_hidden_field_for_friendly_url').setValue('1');
            } else {
                Ext.getCmp('custom_url_msg').setValue('<span style="color:#CF4C35;">Friendly URL already exists</span>');
                Ext.getCmp('hidden_field_for_friendly_url').setValue('1');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.friendly_url, "GET", {}, onsuccess, onerror);
}

com.faralam.ChangeMobileNumber = function (first_param, second_param) {

    com.faralam.change_mobile_number = com.faralam.serverURL + 'authentication/changePhonenumber';
    com.faralam.change_mobile_number = com.faralam.change_mobile_number + "?" + encodeURI('UID=' + sessionStorage.UID + '&newPhonenumber=' + first_param + '&password=' + second_param);

    var onsuccess = function (data, textStatus, jqXHR) {

        Ext.MessageBox.alert('Success', 'You have successfully changed your mobile number', function () {
            Ext.getCmp('win4').close();
        });
        Ext.getCmp('settings_mobile_number').setValue(data.phoneNumber);
        Ext.getCmp('settings_mobile_number_hidden').setValue(data.phoneNumber);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.change_mobile_number, "PUT", {}, onsuccess, onerror);
}

com.faralam.DeleteAccount = function () {

    com.faralam.delete_account = com.faralam.serverURL + 'authentication/deleteAccount';
    com.faralam.delete_account = com.faralam.delete_account + "?" + encodeURI('UID=' + sessionStorage.UID);

    var onsuccess = function (data, textStatus, jqXHR) {

        Ext.MessageBox.alert('Success', 'You have successfully deleted your account', function () {
            Ext.getCmp('win3').close();
            com.faralam.UserLogOut();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.delete_account, "PUT", {}, onsuccess, onerror);
}


// ################################# Share App Section #####################################
com.faralam.shareAppByEmail = function (email) {
    com.faralam.activate_shareAppByEmail = com.faralam.serverURL + 'html/sendAppURLForSASLToEmail';
    com.faralam.activate_shareAppByEmail = com.faralam.activate_shareAppByEmail + "?" + encodeURI('UID=' + sessionStorage.UID + '&toEmail=' + email + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            //console.log(data);
            if (data.success) {
                Ext.MessageBox.alert('Success', 'Send successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.activate_shareAppByEmail, "GET", {}, onsuccess, onerror);

};

com.faralam.shareAppBySMS = function (sms) {
    com.faralam.activate_shareAppBySMS = com.faralam.serverURL + 'html/sendAppURLForSASLToMobileviaSMS';
    com.faralam.activate_shareAppBySMS = com.faralam.activate_shareAppBySMS + "?" + encodeURI('UID=' + sessionStorage.UID + '&toTelephoneNumber=' + sms + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            //console.log(data);
            if (data.success == true) {
                Ext.MessageBox.alert('Success', 'Send successfully.');
            }
            if (data.success == false) {
                Ext.MessageBox.alert('Error', data.explanation);
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.activate_shareAppBySMS, "GET", {}, onsuccess, onerror);

};

com.faralam.shareAppURL = function () {
    com.faralam.activate_shareAppURL = com.faralam.serverURL + 'html/sendSupportEmail';
    com.faralam.activate_shareAppURL = com.faralam.activate_shareAppURL + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var data = {
        "topic": "Technical Related Questions",
        "description": Ext.getCmp('describe_problem').getValue(),
        "subject": Ext.getCmp('subject').getValue(),
        "replyToEmail": Ext.getCmp('replyEmail').getValue()
    }

    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.success) {
            //console.log(response);
            if (response.success) {
                Ext.MessageBox.alert('Success', 'Support Request Send successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.activate_shareAppURL, "POST", data, onsuccess, onerror);

};

com.faralam.common.copyCarouselHTML = function (sa, sl) {
    com.faralam.get_CarouselHTML_code = com.faralam.serverURL + 'html/retriveCarouselHTMLBySASL';
    com.faralam.get_CarouselHTML_code = com.faralam.get_CarouselHTML_code + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (data, textStatus, jqXHR) {
        //console.log(data);
        if (data) {
            Ext.getCmp('hiddenHtmlCode').setValue(data);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_CarouselHTML_code, "GET", {}, onsuccess, onerror);
}

com.faralam.sendEmailHTMLApp = function () {
    com.faralam.activate_sendEmailHTMLApp = com.faralam.serverURL + 'html/sendEmailHTMLBySASL';
    com.faralam.activate_sendEmailHTMLApp = com.faralam.activate_sendEmailHTMLApp + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var data = {
        "emailSubject": Ext.getCmp('hiddenHtmlCode').getValue(),
        "emailTo": Ext.getCmp('send_gallery_email').getValue()
    }

    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.success) {
            //console.log(response);
            if (response.success) {
                Ext.MessageBox.alert('Success', 'Send successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.activate_sendEmailHTMLApp, "POST", data, onsuccess, onerror);

};

com.faralam.common.getBrandedCard = function (sa, sl) {
        Ext.getCmp('cardImg').setSrc(com.faralam.serverURL + 'html/getSASLCoBrandedCardJPG?UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&emailTo=' + Ext.getCmp('send_gallery_email').getValue());
    }
    // ############################## Ends #####################################

// ################################# Support Section #####################################
com.faralam.supportApp = function () {
    com.faralam.activate_supportApp = com.faralam.serverURL + 'html/sendSupportEmail';
    com.faralam.activate_supportApp = com.faralam.activate_supportApp + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var data = {
        "description": Ext.getCmp('describe_problem').getValue(),
        "subject": Ext.getCmp('subject').getValue(),
        "replyToEmail": Ext.getCmp('replyEmail').getValue()
    }

    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.success) {
            //console.log(response);
            if (response.success) {
                /* Ext.MessageBox.show({
                 msg: "Support Request Send successfully.",
                 icon: Ext.MessageBox.INFO,
                 title: "Success",
                 buttons: Ext.Msg.OK,
                 listners : {
                 click :  {
                 element: 'OK',
                 fn: function(){
                 //console.log('click el');
                 
                 }
                 }
                 }
                 });*/
                Ext.MessageBox.alert('Success', 'Support Request Send successfully.');
                Ext.getCmp('main_tab').down('#start_screen').setDisabled(false);
                Ext.getCmp('main_tab').down('#SupportSection').setDisabled(true);
                Ext.getCmp('main_tab').setActiveTab(4);
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.activate_supportApp, "POST", data, onsuccess, onerror);

};
// ############################## Ends #####################################

com.faralam.common.updateServiceStatus = function (statusID) {
    com.faralam.activate_updateServiceStatus = com.faralam.serverURL + 'liveupdate/updateServiceStatus';
    com.faralam.activate_updateServiceStatus = com.faralam.activate_updateServiceStatus + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID + '&statusID=' + statusID);

    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.success) {
            //console.log(response);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.activate_updateServiceStatus, "PUT", {}, onsuccess, onerror);
}

// ############################## Catalog Section Start #####################################
com.faralam.retrieve_catalog_metadata = function (promouuid, index) {

    com.faralam.get_catalog_metadata = com.faralam.serverURL + 'promotions/getPromotionMetaDataPortalByPromoUUID';
    com.faralam.get_catalog_metadata = com.faralam.get_catalog_metadata + "?" + encodeURI('UID=' + sessionStorage.UID + '&promoUUID=' + promouuid);

    var onsuccess = function (data, textStatus, jqXHR) {
        var frm_values = data;
        Ext.getCmp('promo_add_text' + index).setValue(frm_values.displayText);

        Ext.getCmp('promo_identifier' + index).setValue(frm_values.promotionSASLName);
        Ext.getCmp('promo_type' + index).setValue(frm_values.promotionType.enumText);
        Ext.getCmp('promo_valid_days' + index).setValue({
            valid_day: frm_values.classTimeSlotPolicyEntry.timeRange.openingDays
        });

        Ext.getCmp('thumb_img' + index).setSrc(com.faralam.serverURL + 'promotions/retrievePictureJPGByPromoUUID?promoUUID=' + promouuid);
        Ext.getCmp('big_img' + index).setSrc(com.faralam.serverURL + 'promotions/retrievePictureJPGByPromoUUID?promoUUID=' + promouuid);
        Ext.getCmp('promouuid' + index).setValue(promouuid);

    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_catalog_metadata, "GET", {}, onsuccess, onerror);
}

/*com.faralam.CatalogSubmit = function(sa, sl){
 
 com.faralam.loginMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait ..."});
 com.faralam.loginMask.show();
 
 if (Ext.getCmp('promo_valid_days').getValue().valid_day instanceof Array) {
 var opening_day = Ext.getCmp('promo_valid_days').getValue().valid_day;
 } else {
 var opening_day = [Ext.getCmp('promo_valid_days').getValue().valid_day];
 }
 
 var xhr = new XMLHttpRequest(),
 method = 'POST',		   
 
 
 url = com.faralam.serverURL+'promotions/createWNewPictureNewMetaData?UID='+sessionStorage.UID;
 var data = {
 "classTimeSlotPolicyEntry":
 {
 "reservationType":"PSEUDO",
 "timeSlotType":"FIXED_60MIN_INTERVALS",
 "maxSeatCount":40,
 "maxHeadCountPerSeat":3,
 "timeRange":
 {
 //"activationDate": activationDate,
 //"expirationDate": expirationDate,
 "openingDays": opening_day
 }
 },
 "promotionSASLName": Ext.getCmp('promo_identifier').getValue(),
 "displayText": Ext.getCmp('promo_add_text').getValue(),
 "displayLocation":{
 "x":0,
 "y":0
 },
 "promotionType": Ext.getCmp('promo_type').getValue(),
 "serviceAccommodatorId": sa,
 "serviceLocationId": sl
 };
 data = JSON.stringify(data);
 
 var formData = new FormData();				
 formData.append('promotionsaslmetadata', data);
 
 var file = Ext.getCmp('promo_upload').getEl().down('input[type=file]').dom.files[0];
 if(file){
 formData.append(file.name, file);
 }
 
 var onLoadHandler = function(event) {			
 if(event.target.readyState == 4){
 com.faralam.loginMask.hide();
 if(event.target.status == 200){
 com.faralam.registration.showPopup('Success', 'Updated successfully.');
 }else{								
 com.faralam.common.ErrorHandling(event.target.responseText);
 return false;
 }					
 }				  
 }
 
 xhr.open(method, url, true);
 xhr.onload = onLoadHandler;
 xhr.send(formData);
 }*/

com.faralam.common.retrieveCatalog_func = function (catalogId) {

    com.faralam.retrieveCatalog_func = com.faralam.serverURL + 'retail/retrieveCatalog';
    com.faralam.retrieveCatalog_func = com.faralam.retrieveCatalog_func + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID + '&catalogId=' + catalogId);

    var onsuccess = function (response, textStatus, jqXHR) {
        //console.log(response);
        var html = '';
        var arr = new Array();
        if (response.groups.length > 0) {
            for (var i = 0; i < response.groups.length; i++) {
                html += '<li class="catalog_li groups_in_catalog_menu_li_set" id="groupsincatalog_list_'+i+'" style="background-color:#f6f6ff;border:1px solid #ffffdc; width: 98%;margin-left: 1%;border-radius:3px"><img grincat="groupsincatalog_list_'+i+'" id="groupList_catalog_drag_zone_active" class="before_dragging" ondragend="com.faralam.dragEnd_catalog(event)" ondragstart="com.faralam.dragStart_catalog(event)" onclick="com.faralam.SetCalatogGroupDescEdit(this)" groupId="' + response.groups[i].groupId + '" style="height: 30px;left: 0;opacity: 0;position: absolute;top: 0;width: 200px;" src="' + com.faralam.custom_img_path + 'trans_img.jpg"><span style="color:#000 !important;width:99%;height:30px;">' + response.groups[i].groupDisplayText + '</span><img class="edit_catalog_icon" onclick="com.faralam.SetCalatogGroupDescEditWindow(this)" groupId="' + response.groups[i].groupId + '" groupDisplayText="' + response.groups[i].groupDisplayText + '" description="' + response.groups[i].description + '" src="' + com.faralam.custom_img_path + 'icon_pencil.png" width="25" height="26" border="0"><img class="move_catalog_icon" catalogId="'+response.catalogId+'" groupId="' + response.groups[i].groupId + '" ondragend="com.faralam.dragEnd_catalog(event)" id="groupList_catalog_drag_zone_move_active" ondragstart="com.faralam.dragStart_catalog(event)" onclick="com.faralam.SetCalatogGroupMove(this)" src="' + com.faralam.custom_img_path + 'icon_move.png" width="25" height="26" border="0" style="cursor:move;z-index:999;height: 26px;position: absolute;right: 10px;top: 2px;width: 25px;border:none;"></li><li class="catalog_li" style="height: 8px;padding: 0;"><img id="groupList_catalog_drag_zone_middlebar_active" class="before_dragging" ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" groupId="' + response.groups[i].groupId + '" style="height: 8px;left: 0;position: absolute;top: 0;width: 270px;border:none;" src="' + com.faralam.custom_img_path + 'trans_img.jpg"></li>';
            }
        }
        if (html) {
            html = '<div id="group_list_parent_container" style="max-height: 120px;"><ul style="text-align:left;height:120px;margin-top: 5px;">' + html + '</ul></div><div class="drop_here_div_middle_panel">Drop group here<img ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" id="catalog_Group_panel_Section" src="' + com.faralam.custom_img_path + 'trans_img.jpg" class="drop_here_img_middle_panel"></div>';
            if (count == 3) {
                arr = {
                    suppressScrollX: true,
                    suppressScrollY: true
                };
            }
        } else {
            html = '<div id="group_list_parent_container" style="max-height: 120px;"><ul style="text-align:center;height:120px;"><li class="catalog_li">No group(s) available</li></ul></div><div class="drop_here_div_middle_panel">Drop group here<img ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" id="catalog_Group_panel_Section" src="' + com.faralam.custom_img_path + 'trans_img.jpg" class="drop_here_img_middle_panel"></div>';
            arr = {
                suppressScrollX: true,
                suppressScrollY: true
            };
        }
        var upitem='<ul style="text-align:left;height: 250px;"><li class="catalog_li">No item(s) available</li></ul><div class="drop_here_div_right_panel">Drop item here<img ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" id="catalog_itemGroup_panel_Section" src="'+com.faralam.custom_img_path+'trans_img.jpg" class="drop_here_img_right_panel"></div>';
        Ext.getCmp('catalog_group_panel').update(html);
        
        Ext.getCmp('catalog_itemGroup_panel').update(upitem);
        $('div#group_list_parent_container').perfectScrollbar('destroy');
        $("div#group_list_parent_container").perfectScrollbar(arr);
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrieveCatalog_func, "GET", {}, onsuccess, onerror);
}
com.faralam.common.retrieveCatalogs_func = function () {

    com.faralam.retrieveCatalogs_func = com.faralam.serverURL + 'retail/retrieveCatalogs';
    com.faralam.retrieveCatalogs_func = com.faralam.retrieveCatalogs_func + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (response, textStatus, jqXHR) {
        //console.log(response);
        var html = '';
        var arr = new Array();
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
				html += '<li class="catalog_li menu_list_li_set_bg" id="menu_li_'+i+'" style="background-color:#f6f6ff;border:1px solid #ffffdc; width: 98%;margin-left: 1%;border-radius:3px"><img mnid="menu_li_'+i+'" id="catalog_drag_zone_active" class="before_dragging catalog_drag_zone_active_overlay" onclick="com.faralam.SetCatalogDescEdit(this)" catalogId="' + response[i].catalogId + '" displayText="' + response[i].displayText + '" style="height: 30px;left: 0;opacity: 0;position: absolute;top: 0;width: 220px;" src="' + com.faralam.custom_img_path + 'trans_img.jpg"><span style="color:#000 !important;width:100%;height:30px;">' + response[i].displayText + '</span><img class="edit_catalog_icon_panel1" onclick="com.faralam.common.EditCatalog(this)" catalogId="' + response[i].catalogId + '" displayText="' + response[i].displayText + '" description="' + response[i].description + '" src="' + com.faralam.custom_img_path + 'icon_pencil.png" width="26" height="26" border="0"><img src="' + com.faralam.custom_img_path + 'icon_move.png" width="26" id="menu_rearrange" ondragstart="com.faralam.dragStart_catalog(event)" ondragend="com.faralam.dragEnd_catalog(event)" catalogId="'+response[i].catalogId+'" displayText="' + response[i].displayText + '" height="26" border="0" style="right: 41px;top: 2px;position: absolute;cursor:move;z-index:999" ></li><li style="height:20px"><div catalogId="'+response[i].catalogId+'"  ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" id="menu_drop_zone" style="height:100%; width:100%"></div></li>';
                /*<div catalogId="'+response[i].catalogId+'"  ondrop="com.faralam.drop_catalog(event)" id="menu_drop_zone" style="height:10px; width:100%"></div>*/
               /* html += '<li class="catalog_li" ><img id="catalog_drag_zone_active"  class="before_dragging catalog_drag_zone_active_overlay" ondragend="com.faralam.dragEnd_catalog(event)" ondragstart="com.faralam.dragStart_catalog(event)" onclick="com.faralam.SetCatalogDescEdit(this)" catalogId="' + response[i].catalogId + '" displayText="' + response[i].displayText + '" style="margin-left:35px;height: 30px;left: 0;opacity: 0;position: absolute;top: 0;width: 190px;" src="' + com.faralam.custom_img_path + 'trans_img.jpg"><span style="color:#000 !important; width:100%;height:30px;">' + response[i].displayText + '</span><img onclick="com.faralam.common.EditCatalog(this)" catalogId="' + response[i].catalogId + '" displayText="' + response[i].displayText + '" description="' + response[i].description + '" src="' + com.faralam.custom_img_path + 'icon_pencil.png" width="26" height="26" border="0"><img style="float:right" src="' + com.faralam.custom_img_path + 'icon_move.png" width="26" height="26" border="0"></li>';*/
            }
        }
        if (html) {
            html = '<ul id="catalog_list_parent_container" style="text-align:left;max-height: 150px;height: 150px;margin-top: 5px;">' + html + '</ul>';
            if (count == 5) {
                arr = {
                    suppressScrollX: true,
                    suppressScrollY: true
                };
            }
        } else {
            html = '<ul id="catalog_list_parent_container" style="text-align:center;height: 150px;"><li class="catalog_li">No catalog(s) available</li></ul>';
            arr = {
                suppressScrollX: true,
                suppressScrollY: true
            };
        }
        Ext.getCmp('catalog_single_panel').update(html);
       
        $('div#catalog_single_panel-innerCt').perfectScrollbar('destroy');
        $("div#catalog_single_panel-innerCt").perfectScrollbar(arr);
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrieveCatalogs_func, "GET", {}, onsuccess, onerror);
}

com.faralam.common.retrieveGroup_func = function (groupId) {

    com.faralam.retrieveGroup_func = com.faralam.serverURL + 'retail/retrieveGroup';
    com.faralam.retrieveGroup_func = com.faralam.retrieveGroup_func + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID + '&groupId=' + groupId);

    var onsuccess = function (response, textStatus, jqXHR) {
        //console.log(response.highlightedItem);
        var html = '';
        var arr = new Array();
		var highlightedItem = "";
        if (response.unSubgroupedItems.length > 0) {
            for (var i = 0; i < response.unSubgroupedItems.length; i++) {
				if(response.highlightedItem != null){
					if(response.highlightedItem.itemId == response.unSubgroupedItems[i].itemId){
						highlightedItem='checked="checked"';
					}
				}
                var move_item_btn='<img class="move_catalog_icon" draggable="true" itemId="' + response.unSubgroupedItems[i].itemId + '" itemVersion="' + response.unSubgroupedItems[i].itemVersion + '" priceId="' + response.unSubgroupedItems[i].priceId + '" ondragend="com.faralam.dragEnd_catalog(event)" id="groupedItemList_catalog_drag_zone_move_active" ondragstart="com.faralam.dragStart_catalog(event)" onclick="com.faralam.SetGroupItemMove(this)" src="' + com.faralam.custom_img_path + 'icon_move.png" width="25" height="26" border="0" style="height: 26px;position: absolute;right: 10px;top: 2px;width: 25px;border:none;cursor:move">';
                html += '<li class="catalog_li item_in_group_li_set" id="group_wise_item_li'+i+'" style="background-color:#f6f6ff;border:1px solid #ffffdc; width: 98%;margin-left: 1%;border-radius:3px"><div class="switch_email" style="padding:0px !important; float:left;"><input id="dish_of_the_day'+i+'" class="cmn-toggle cmn-toggle-rounds" type="checkbox" '+highlightedItem+' onclick="com.faralam.common.setGroupItemType(this)" itemId = "'+ response.unSubgroupedItems[i].itemId +'" itemVersion = "'+ response.unSubgroupedItems[i].itemVersion +'" priceId = "'+ response.unSubgroupedItems[i].priceId +'" groupId = "'+ response.groupId +'"><label for="dish_of_the_day'+i+'"></label></div><img id="groupedItemList_catalog_drag_zone_active" class="before_dragging" ondragend="com.faralam.dragEnd_catalog(event)" ondragstart="com.faralam.dragStart_catalog(event)" itmgrli=group_wise_item_li'+i+' onclick="com.faralam.common.set_Bg_In_Item(this)" itemId="' + response.unSubgroupedItems[i].itemId + '" style="height: 30px;left: 50px;opacity: 0;position: absolute;top: 0;width: 160px;" src="' + com.faralam.custom_img_path + 'trans_img.jpg"><span style="color:#000 !important;width:100%;height:30px; margin-left:5px;">' + response.unSubgroupedItems[i].itemName + '</span>'+move_item_btn+'</li><li class="catalog_li" style="height: 8px;padding: 0;"><img id="groupedItemList_catalog_drag_zone_middlebar_active" class="before_dragging" ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" itemId="' + response.unSubgroupedItems[i].itemId + '" itemVersion="' + response.unSubgroupedItems[i].itemVersion + '" priceId="' + response.unSubgroupedItems[i].priceId + '" style="height: 8px;left: 0;position: absolute;top: 0;width: 270px;border:none;" src="' + com.faralam.custom_img_path + 'trans_img.jpg"></li>';
				highlightedItem = '';
            }
        }
        if (html) {
            html = '<div id="groupedItemList_parent_container" style="max-height: 250px;"><ul style="text-align:left;height: 250px;margin-top: 5px;">' + html + '</ul></div><div class="drop_here_div_right_panel">Drop item here<img ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" id="catalog_itemGroup_panel_Section" src="' + com.faralam.custom_img_path + 'trans_img.jpg" class="drop_here_img_right_panel"></div>';
            if (count == 5) {
                arr = {
                    suppressScrollX: true,
                    suppressScrollY: true
                };
            }
        } else {
            html = '<div id="groupedItemList_parent_container" style="max-height: 250px;"><ul style="text-align:center;height: 250px;"><li class="catalog_li">No item(s) available</li></ul></div><div class="drop_here_div_right_panel">Drop item here<img ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" id="catalog_itemGroup_panel_Section" src="' + com.faralam.custom_img_path + 'trans_img.jpg" class="drop_here_img_right_panel"></div>';
            arr = {
                suppressScrollX: true,
                suppressScrollY: true
            };
        }
        Ext.getCmp('catalog_itemGroup_panel').update(html);
        $('div#groupedItemList_parent_container').perfectScrollbar('destroy');
        $("div#groupedItemList_parent_container").perfectScrollbar(arr);
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrieveGroup_func, "GET", {}, onsuccess, onerror);
}
com.faralam.common.set_Bg_In_Item = function(e){
   var li=e.getAttribute('itmgrli');
    $('.item_in_group_li_set').css({"background":"#f6f6ff","border":"1px solid #ffffdc"});
    $('#'+li).css({"background":"#bbbbbb","border":"1px solid #666"}); 
}
com.faralam.common.retrieveGroups_func = function () {

    com.faralam.retrieveGroups_func = com.faralam.serverURL + 'retail/retrieveGroups';
    com.faralam.retrieveGroups_func = com.faralam.retrieveGroups_func + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (response, textStatus, jqXHR) {
        //console.log(response);
        var html = '';
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                var edtbtn='<img id="all_group_move_icon"  ondragstart="com.faralam.dragStart_catalog(event)" ondragend="com.faralam.dragEnd_catalog(event)" src="'+com.faralam.custom_img_path+'icon_move.png" data-qtip=' + response[i].status.enumText + ' GroupId="' + response[i].groupId + '" style="position:absolute;right:1px;cursor:move;z-index:999">';
                html += '<li style="border:2px solid black;border-radious:5px"><img id="allGroup_catalog_drag_zone_active" class="before_dragging" ondragend="com.faralam.dragEnd_catalog(event)" ondragstart="com.faralam.dragStart_catalog(event)" onclick="com.faralam.SetAllItemDescEdit(this)" width="90" height="110" data-qtip=' + response[i].status.enumText + ' GroupId="' + response[i].groupId + '" src="' + com.faralam.custom_img_path + 'trans_img.jpg">'+edtbtn+'<span style="line-height:80px;font-size:14px;font-weight:bold">' + response[i].groupDisplayText + '</span></li>';
                /*<li style="height:110px;width:20px"><div  ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" id="all_groups_rearrange" style="height:100%; width:100%"></div></li>*/

            }
        }
        if (html) {
            html = '<ul id="all_groups_scroll" class="images" style="white-space: nowrap;height:94px;overflow:hidden">' + html + '</ul>';
        } else {
            html = '<ul class="images" style="text-align:center;height:87px;"><li>No group(s) available</li></ul>';
        }

        Ext.getCmp('slide_panel1_catalog').update(html);
        $("#all_groups_scroll").perfectScrollbar('destroy');
        $("#all_groups_scroll").perfectScrollbar();
         
        /*$("div#slide_panel1_catalog-innerCt").perfectScrollbar('destroy');
        $("div#slide_panel1_catalog-innerCt").perfectScrollbar();
*/
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrieveGroups_func, "GET", {}, onsuccess, onerror);
}

com.faralam.common.RetrieveCatalogInfo = function (p_id,txt,coi) {
    if(parseInt(coi)<0)
        {
            coi=0;
        }
    else
        {
           coi= parseInt(coi);
        }
    console.log("pre"+coi);
    var param="nextId&previousId&";
        txt=parseInt(txt);
    if(txt==0)
        {
         param="nextId="+p_id+"&previousId=0&";   
        }
    if(txt==1)
        {
        param="nextId=0&previousId="+p_id+"&";  
        }
    com.faralam.retrieve_catalog_info = com.faralam.serverURL + 'retail/retrieveItems';
    com.faralam.retrieve_catalog_info = com.faralam.retrieve_catalog_info + "?" + encodeURI('count=7&itemType=ALL&'+param+'UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&status=ALL');
   /* http://simfel.com:8080/apptsvc/rest/retail/retrieveItems?count=6&itemType=ALL&nextId&previousId&serviceAccommodatorId=FTRFCD1&serviceLocationId=FTRFCD1&status=ALL&UID=userid.owner34*/
    var onsuccess = function (response, textStatus, jqXHR) {
        //console.log(response);
        var html = '';
        var html1 = '';
        currency = '';
        groupId = '';
        itemId = '';
        itemName = '';
        itemStatus = '';
        itemTag = '';
        itemType = '';
        itemVersion = '';
        longDescription = '';
        mediaURLs = '';
        price = '';
        priceId = '';
        shortDescription = '';
        subGroupId = '';
        uUID = '';
        var arr = new Array();
        var count = 0;
        var del_params = '';
        var overlay_img = '';
        if (response.items.length > 0) {
            var flg=0;
            var fl=0;
            var kn=0;
            for(var k=0 ;k < response.items.length; k++)
                {
                   if (response.items[k].itemStatus.enumText == "ACTIVE") {
                       kn++;
                   }
                }
            console.log("length="+response.items.length);
            for (var j = 0; j < response.items.length; j++) {

                if (response.items[j].itemStatus.enumText == "ACTIVE") {
                    fl++;
                    /*if(fl>=parseInt(coi))
                        {*/
                    flg++;
                /*if(flg>7)
                    {
                        break;
                    }*/
                    var active_count = 1;
                    if (active_count == 1) {
                        currency = response.items[j].currency;
                        groupId = response.items[j].groupId;
                        itemId = response.items[j].itemId;
                        itemName = response.items[j].itemName;
                        itemStatus = response.items[j].itemStatus.enumText;
                        itemTag = response.items[j].itemTag;
                        itemType = response.items[j].itemType;
                        itemVersion = response.items[j].itemVersion;
                        longDescription = response.items[j].longDescription;
                        mediaURLs = response.items[j].mediaURLs[0];
                        price = response.items[j].price;
                        priceId = response.items[j].priceId;
                        shortDescription = response.items[j].shortDescription;
                        subGroupId = response.items[j].subGroupId;
                        uUID = response.items[j].uUID;
                        active_count++;
                        
                    }
                    del_params = response.items[j].itemId + ',' + response.items[j].uUID;
                    overlay_img = '';
                    overlay_img = com.faralam.custom_img_path + 'ACTIVE.png';

                   /* html += '<li><img id="mainItems_catalog_drag_zone_active" class="before_dragging" ondragend="com.faralam.dragEnd_catalog(event)" ondragstart="com.faralam.dragStart_catalog(event)" onclick="com.faralam.SetAllItemDescEdit(this)" width="70" height="80" data-qtip=' + response.items[j].itemStatus.enumText + ' params=' + del_params + ' src="' + response.items[j].mediaURLs[0] + '" itemName="' + response.items[j].itemName + '" longDescription="' + response.items[j].longDescription + '" itemVersion="' + response.items[j].itemVersion + '" price="' + response.items[j].price + '" priceId="' + response.items[j].priceId + '" itemId="' + response.items[j].itemId + '" itemTag="' + response.items[j].itemTag + '" imgUrl="' + response.items[j].mediaURLs[0] + '" shortDescription="' + response.items[j].shortDescription + '" ><div class="gallery_overlay"><span><img src="' + overlay_img + '" alt="" ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" /></span></div></li>';*/
                            var attr='';
                             $.each(response.items[j].attributes, function(key, value){
                                 attr=attr+' '+key+'='+value;
                                 
                             });
                    var editbtn='';
                            editbtn='<img src="'+com.faralam.custom_img_path+'icon_pencil.png" onclick="com.faralam.common.CATALOGS_EDIT_ITEMS(this)" itemId="'+response.items[j].itemId+'" itemVersion='+response.items[j].itemVersion+' priceId='+response.items[j].priceId+' price="'+response.items[j].price+'" shortDescription="'+response.items[j].shortDescription+'" longDescription="'+response.items[j].longDescription+'" itemName="'+response.items[j].itemName+'" itemTag="'+response.items[j].itemTag+'" '+attr+' imgUrl="' + response.items[j].mediaURLs[0]+'" style="position:absolute;left:92px;top:2;z-index:9999;cursor:pointer;left:0">';
                            
                    var movebtn='<img src="'+com.faralam.custom_img_path+'icon_move.png" data-qtip=' + response.items[j].itemStatus.enumText + ' params=' + del_params + ' src="' + response.items[j].mediaURLs[0] + '" itemName="' + response.items[j].itemName + '" longDescription="' + response.items[j].longDescription + '" itemVersion="' + response.items[j].itemVersion + '" price="' + response.items[j].price + '" priceId="' + response.items[j].priceId + '" itemId="' + response.items[j].itemId + '" itemTag="' + response.items[j].itemTag + '" imgUrl="' + response.items[j].mediaURLs[0] + '" shortDescription="' + response.items[j].shortDescription + '" ondragstart="com.faralam.dragStart_catalog(event)" ondragend="com.faralam.dragEnd_catalog(event)" id="all_item_rearrange_icon"  style="position:absolute;z-index:99;top:2;border:none;right:0;cursor:move" >';
                            
                    html += '<li  style="border:2px solid black"><img id="mainItems_catalog_drag_zone_active" class="before_dragging" onclick="com.faralam.SetAllItemDescEdit(this)" width="110" height="100" data-qtip=' + response.items[j].itemStatus.enumText + ' params=' + del_params + ' src="' + response.items[j].mediaURLs[0] + '" itemName="' + response.items[j].itemName + '" longDescription="' + response.items[j].longDescription + '" itemVersion="' + response.items[j].itemVersion + '" price="' + response.items[j].price + '" priceId="' + response.items[j].priceId + '" itemId="' + response.items[j].itemId + '" itemTag="' + response.items[j].itemTag + '" imgUrl="' + response.items[j].mediaURLs[0] + '" shortDescription="' + response.items[j].shortDescription + '" >'+editbtn+movebtn+'<div class="gallery_overlay" style="width:110px;overflow:hidden;line-height: 20px;"><center><span style="font-size:12px">'+itemName+'</span></center></div></li><li></li>';
                    /*'<div class="item_drop_zone" id="all_item_drop_zone"></div>'*/

/*<img src="' + com.faralam.custom_img_path + 'icon_move.png" width="26" id="menu_rearrange" ondragstart="com.faralam.dragStart_catalog(event)" ondragend="com.faralam.dragEnd_catalog(event)" catalogId="'+response[i].catalogId+'"  height="26" border="0" style="right: 41px;top: 2px;position: absolute;cursor:move;z-index:999" ></li><li style="height:20px"><div catalogId="'+response[i].catalogId+'"  ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" id="menu_drop_zone" style="height:100%; width:100%"></div></li>*/

                } else if (response.items[j].itemStatus.enumText == "PROPOSED" || response.items[j].itemStatus.enumText == "APPROVED") {
                    overlay_img = '';
                    overlay_img = com.faralam.getImgStatus(response.items[j].itemStatus.enumText);
                    // html1 += '<div id="inactive_catalog_parent"><div id="inactive_catalog_parent_first"><div id="inactive_catalog_parent_img"><img id="catalog_drag_zone_inactive" class="before_dragging" ondragend="com.faralam.dragEnd_catalog(event)" ondragstart="com.faralam.dragStart_catalog(event)"  src="'+response.items[j].mediaURLs[0]+'" itemVersion="'+response.items[j].itemVersion+'" price="'+response.items[j].price+'" priceId="'+response.items[j].priceId+'" itemId="'+response.items[j].itemId+'" width="60" height="80" data-qtip='+response.items[j].itemStatus.enumText+'></div><div class="gallery_overlay1"><span><img src="'+overlay_img+'" alt="" /></span></div><div class="img_details_wrap"><p>'+response.items[j].itemName+'</p><p>'+response.items[j].price+'</p><p>'+response.items[j].shortDescription+'</p></div><button id="'+response.items[j].itemId+'" class="catalog_edit_btn" onclick="com.faralam.SetCatalogImageDescEdit(this)" itemName="'+response.items[j].itemName+'" longDescription="'+response.items[j].longDescription+'" itemTag="'+response.items[j].itemTag+'" itemVersion="'+response.items[j].itemVersion+'" price="'+response.items[j].price+'" priceId="'+response.items[j].priceId+'" itemId="'+response.items[j].itemId+'" imgUrl="'+response.items[j].mediaURLs[0]+'" shortDescription="'+response.items[j].shortDescription+'" >Edit</button><button id="'+response.items[j].itemId+'" onclick="com.faralam.activate_catalog(this);" itemVersion="'+response.items[j].itemVersion+'" priceId="'+response.items[j].priceId+'" itemId="'+response.items[j].itemId+'">Activate</button></div></div>';

                    count++;
                }


            }
        }
        var BtnGrp_prv='';
        var BtnGrp_nxt='';
        var dis_pre='disabled="disabled"';
        var dis_nxt='disabled="disabled"';
        var nxtid=response.lastIdInWindow;
        var preid=response.firstIdInWindow;
        BtnGrp_prv='<input type="image" title="No items left" src="'+com.faralam.custom_img_path+'Back.png" style="display: inline-block; width: 50px; height: 51px; margin: 35px 0px 0px 10px;cursor:context-menu;opacity:0.3">';
        
        BtnGrp_nxt='<input type="image" title="No items left" src="'+com.faralam.custom_img_path+'Forward.png" style="display: inline-block; width: 50px; height: 51px; margin: 35px 0px 0px 3px;cursor:context-menu;opacity:0.3">';
         /*if((parseInt(coi)-7)>0)*/
        if(response.hasPrevious)
            {
             dis_pre='';
              var cnt="";
              cnt=parseInt(coi)-7;
              var str_i =(parseInt(coi-1))+" Items Left."
             BtnGrp_prv='<input type="image" src="'+com.faralam.custom_img_path+'Back.png" id="prv_btn" '+dis_pre+' style="display: inline-block; width: 50px; height: 51px; margin: 35px 0px 0px 10px;" onClick="com.faralam.common.RetrieveCatalogInfo('+preid+','+0+','+cnt+')" >';
                
            }
        /*if((parseInt(coi)+7)<=response.items.length)*/
        if(response.hasNext)
            {
              dis_nxt=''; 
              var cnt='';
              cnt=parseInt(coi)+7;
              var tot_n_items=kn-cnt;
              var str_i =(tot_n_items+1)+" Items Left.";
              BtnGrp_nxt='<input type="image" src="'+com.faralam.custom_img_path+'Forward.png" id="prv_btn" '+dis_nxt+' style="display: inline-block; width: 50px; height: 51px; margin: 35px 0px 0px 3px;" onClick="com.faralam.common.RetrieveCatalogInfo('+nxtid+','+1+','+cnt+')" >';
            }
        var blnk=" ";
        Ext.getCmp('previous_btn').update(BtnGrp_prv);
        Ext.getCmp('next_btn').update(BtnGrp_nxt);
        //     }
        // }

      
        if (html) {
            html = '<ul class="images" style="margin-bottom: 4px;padding-left: 5px;">' + html + '</ul>';
            
            
        } else {
            html = '<ul class="images" style="text-align:center;height:87px;"><li>No image(s) available</li></ul>';
        }

        /* if(html1){
         html1 = '<div id="inactive_catalog_parent_container" style="max-height:266px;">'+html1+'</div>';
         if(count == 3){arr = {suppressScrollX:true, suppressScrollY:true};}
         }else{
         html1 = '<div id="inactive_catalog_parent_container" style="height:88px;text-align:center;padding:5px;background:#252525;">No image(s) available</div>';
         arr = {suppressScrollX:true, suppressScrollY:true};
         }*/
        /*}		*/

        Ext.getCmp('slide_panel_catalog').update(html);

        $('div#slide_panel_catalog-innerCt').perfectScrollbar('destroy');
        $("div#slide_panel_catalog-innerCt").perfectScrollbar();

        /*$('div#inactive_catalog_parent_container').perfectScrollbar('destroy');
         $("div#inactive_catalog_parent_container").perfectScrollbar(arr);*/
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieve_catalog_info, "GET", {}, onsuccess, onerror);

}
com.faralam.common.enablecheck= function (e,field) {
        if (e != '') {
            console.log(field);
            Ext.getCmp(field).setValue($(e).is(':checked'));
            console.log(Ext.getCmp(field).getValue());
        }
}
com.faralam.common.AddNewItem = function () {
 var item_modal;
 var switch_html='<table style="border:2px solid black;margin:5px; heiht:auto !important; min-height:163px" width="95%"  cellspacing="10px" id="add_catalogs_attributes"><tr>';    
 var hid_feild_container = [];  
     if (Ext.getCmp('item_modal')) {
         var   edit_item_modal_win='';     
        var modal = Ext.getCmp('item_modal');
        modal.destroy(modal, new Object());
    }
            if(!item_modal) {
               com.faralam.getItemAttributeMap= com.faralam.serverURL + 'retail/getItemAttributeMap';
               com.faralam.getItemAttributeMap=com.faralam.getItemAttributeMap+ "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
                  
              var onsuccess = function (response, textStatus, jqXHR) {
                  var fl=0;
                  var all='';
                  $.each(response, function(key, value){
                      var ids='"add_'+key+'"';
                       hid_feild_container.push({
                                xtype: 'hiddenfield',
                                id: 'add_'+key,
                                name: 'add_'+key,
                                value:value
                                });
                       all=all+key+"*";
                      switch_html=switch_html+'<td>'+key+'</td><td><div class="switch_email" style="padding:0px !important; float:left;"><input id="'+key+'" class="cmn-toggle cmn-toggle-rounds" onclick="com.faralam.common.enablecheck(this,\'add_'+key+'\')" type="checkbox"><label for="'+key+'"></label></div></td>';
                      fl++;
                      if(fl%2==0)
                          {
                            switch_html=switch_html+'</tr><tr>'; 
                            
                          }
                      
                  });
                switch_html=switch_html+'</tr></table>';
                  console.log("log1="+all);
                Ext.getCmp('ratio_switch_component').update(switch_html);
                Ext.getCmp('hid_all_attr_val').setValue(all);
                Ext.getCmp('hid_feild_container').add(hid_feild_container); 
                $('#ratio_switch_component').perfectScrollbar('destroy');
                $('#ratio_switch_component').perfectScrollbar();
                  
              }
              var onerror = function (jqXHR, textStatus, errorThrown) {}  
              com.faralam.common.sendAjaxRequest(com.faralam.getItemAttributeMap, "GET", {}, onsuccess, onerror);  
                
                /*var check_switchs='<table style="border:2px solid black;margin:5px" width="95%" height="94%" cellspacing="10px" id="add_catalogs_attributes"><tr><td>Vegeterian</td><td><div class="switch_email" style="padding:0px !important; float:left;"><input id="vegeterian" class="cmn-toggle cmn-toggle-rounds" onclick="com.faralam.common.enablecheck(this,'+"'add_Vegeterian'"+')" type="checkbox"><label for="vegeterian"></label></div></td><td>Signature</td><td><div class="switch_email" style="padding:0px !important; float:left;"><input id="Signature" class="cmn-toggle cmn-toggle-rounds"  type="checkbox" onclick="com.faralam.common.enablecheck(this,'+"'add_Signature'"+')" ><label for="Signature"></label></div></td></tr><tr><td>Organic</td><td><div class="switch_email" style="padding:0px !important; float:left;"><input id="Organic" class="cmn-toggle cmn-toggle-rounds" type="checkbox" onclick="com.faralam.common.enablecheck(this,'+"'add_Organic'"+')"  ><label for="Organic"></label></div></td><td>New</td><td><div class="switch_email" style="padding:0px !important; float:left;"><input id="New" class="cmn-toggle cmn-toggle-rounds" type="checkbox" onclick="com.faralam.common.enablecheck(this,'+"'add_New'"+')" ><label for="New"></label></div></td></tr><tr><td>Vegan</td><td><div class="switch_email" style="padding:0px !important; float:left;"><input id="Vegan" class="cmn-toggle cmn-toggle-rounds" type="checkbox" onclick="com.faralam.common.enablecheck(this,'+"'add_Vegan'"+')" ><label for="Vegan"></label></div></td><td>Spicy</td><td><div class="switch_email" style="padding:0px !important; float:left;"><input id="Spicy" class="cmn-toggle cmn-toggle-rounds" type="checkbox" onclick="com.faralam.common.enablecheck(this,'+"'add_Spicy'"+')"  ><label for="Spicy"></label></div></td></tr><tr><td>Local</td><td><div class="switch_email" style="padding:0px !important; float:left;"><input id="Local" class="cmn-toggle cmn-toggle-rounds" type="checkbox" onclick="com.faralam.common.enablecheck(this,'+"'add_Local'"+')"  ><label for="Local"></label></div></td><td>&nbsp;</td><td>&nbsp;</td></tr></table>';*/
                var item_modal_form = Ext.widget('form', {
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    //cls: 'x-body',
                    cls: 'common_bg',
                    border: false,
                    bodyPadding: 10,
                    fieldDefaults: {
                        labelAlign: 'side',
                        labelWidth: 150,
                        labelStyle: 'font-weight:bold'
                    },
                    defaultType: 'textfield',
                    items: [
                        {
                            xtype: 'container',
                            layout:'hbox',
                            width:980,
                            /*layout: {
                                type: 'table',
                                columns: 2,
                                tableAttrs: {
                                    style: {
                                        width: '100%'
                                    }
                                }
                            },*/
                            items: [{
                                xtype: 'container',
                                layout: {
                                    type: 'table',
                                    columns: 1,
                                    tableAttrs: {
                                        style: {
                                            width: '100%'
                                        }
                                    }
                                },
                                tdAttrs: {
                                    style: {
                                        width: '75%'
                                    }
                                },
                                items: [

                                    {
                                    xtype: 'container',
                                    /*layout: {
                                        type: 'table',
                                        columns: 3,
                                        tableAttrs: {
                                            style: {
                                                width: '100%'
                                            }
                                        }
                                    },*/
                                    items: [

                                        {
                                            xtype: 'form',
                                            layout: 'vbox',
                                            padding: '10 10 5 10',
                                            style: {
                                                width:'550px;'
                                                /*border: '1px solid #fff;'*/
                                            },
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    id:'hid_feild_container',
                                                    width: 180,
                                                    items: []
                                                },
                                                {
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_all_attr_val',
                                                    name: 'hid_all_attr_val',
                                                    value:''
                                                    },
                                                /*{
                                                    xtype: 'hiddenfield',
                                                    id: 'add_Vegeterian',
                                                    name: 'add_Vegeterian',
                                                    value:false
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'add_Signature',
                                                    name: 'add_Signature',
                                                    value:false
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'add_Organic',
                                                    name: 'add_Organic',
                                                    value:false
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'add_New',
                                                    name: 'add_New',
                                                    value:false
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'add_Vegan',
                                                    name: 'add_Vegan',
                                                    value:false
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'add_Spicy',
                                                    name: 'add_Spicy',
                                                    value:false
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'add_Local',
                                                    name: 'add_Local',
                                                    value:false
                                                    }*/,
                                                {
                                                    xtype: 'container',
                                                    defaultType: 'button',
                                                    width: 180,
                                                    style: 'text-align:center;margin: 20px 0 0 365px; position: absolute;right: 0 !important;top: 20px;z-index: 9;left: initial !important;',
                                                    items:[{
                                                        text: 'Cancel',
                                                        handler: function(){
                                                            item_modal_form.getForm().reset(true);
                                                            Ext.getCmp('item_modal').close();
                                                        }
                                                    },
                                                        {
                                                            text: 'Create',
                                                            margin: '0 0 0 10',
                                                            handler: function(){
                                                                if(item_modal_form.getForm().isValid()){
                                                                    com.faralam.SubmitCatalog();
                                                                    /*if(Ext.getCmp('catalog_big_img').src){
                                                                        com.faralam.SubmitCatalog();
                                                                    }else{
                                                                        com.faralam.registration.showPopup('Error', 'Please add image before updating');
                                                                    }*/
                                                                }
                                                            }
                                                        }]
                                                },
                                                {
                                                    tdAttrs: {
                                                        style: {
                                                            width: '550px;'
                                                        }
                                                    },
                                                    xtype: 'fieldset',
                                                    title: '<span style="font-style: italic;font-weight: bold;font-size: 16px;">Item Details</span>',
                                                    collapsible: false,
                                                    style: 'text-align:left;',
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            fieldLabel: 'Name',
                                                            labelSeparator: '',
                                                            emptyText: '(Name of the item)',
                                                            inputWidth: 350,
                                                            margin: '4 0 2 0',
                                                            name: '',
                                                            value: '',
                                                            id: 'item_title',
                                                            allowBlank: false
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            fieldLabel: 'Summary',
                                                            labelSeparator: '',
                                                            emptyText: '(Summary)',
                                                            inputWidth: 350,
                                                            margin: '4 0 2 0',
                                                            name: '',
                                                            value: '',
                                                            id: 'item_summary',
                                                            allowBlank: false
                                                        },
                                                        {
                                                            xtype: 'textareafield',
                                                            fieldLabel: 'Description',
                                                            labelSeparator: '',
                                                            emptyText: '(Description)',
                                                            inputWidth: 350,
                                                            margin: '4 0 2 0',
                                                            name: '',
                                                            value: '',
                                                            width: 350,
                                                            height: 45,
                                                            id: 'catalog_msg',
                                                            allowBlank: false
                                                        },
                                                        /*{
                                                            xtype: 'textfield',
                                                            fieldLabel: 'Tags',
                                                            labelSeparator: '',
                                                            emptyText: '(Tags)',
                                                            inputWidth: 350,
                                                            margin: '4 0 2 0',
                                                            name: '',
                                                            value: '',
                                                            id: 'item_tags',
                                                            allowBlank: false
                                                        },*/{
                                                            xtype: 'container',
                                                            layout:'hbox',
                                                            style: 'display:inline',
                                                            width:506,
                                                           items: [
                                                            {
                                                            xtype: 'textfield',
                                                            fieldLabel: 'Price',
                                                            labelSeparator: '',
                                                            emptyText: '(Price)',
                                                            inputWidth: 180,
                                                            margin: '4 0 2 0',
                                                            name: '',
                                                            value: '',
                                                            id: 'item_price',
                                                            allowBlank: false
                                                        },
                                                        {
                                                            xtype: 'combo',
                                                            id: 'currency',
                                                            name: 'currency',
                                                            editable: true,
                                                            margin: '4 0 2 10',
                                                            labelWidth: 0,
                                                            labelAlign: 'top',
                                                            allowBlank: false,
                                                            emptyText:'Choose Currency',
                                                            inputWidth: 160,
                                                            inputHeight: 32,
                                                            value:'',
                                                            fieldLabel: '',
                                                            mode: 'remote',
                                                            value:'USD',
                                                            displayField: 'displayText',
                                                            valueField: 'enumText',
                                                            store: Ext.create('Ext.data.Store', {
                                                                fields: ['enumText','displayText'],
                                                               data : [
                                                            {"enumText":"USD", "displayText":"USD"}
                                                            ],
                                                                autoLoad: true
                                                            })
                                                        }
                                                        
                                                    ]}
                                                        ,
                                                        {
                                                            xtype: 'image',
                                                            width: 350,
                                                            height: 135,
                                                            src: '',
                                                            style: 'border: 1px solid #fff;margin: 3px 0 0 0;',
                                                            id: 'catalog_big_img',
                                                            hidden:true
                                                        }
                                                    ]
                                                }

                                            ]
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'small',
                                            text: 'Add New Picture',
                                            /*margin: '0 0 0 10',
                                             tdAttrs: {
                                             style: {
                                             width: '33%'
                                             }
                                             },*/
                                            style: 'margin: 0 auto; position: absolute;right: 10px;bottom: 138px;z-index: 9;',
                                            handler: function(){
                                                //$('#modal').css({'z-index': '19002', 'margin-top': '-5px'});
                                                $('#modal').css({'z-index': '19002'});
                                                com.faralam.getCropPicURLs('resources/plugins/croppic/catalog_crop.html');
                                                /*Ext.Ajax.request({
                                                 url: 'resources/plugins/croppic/catalog_crop.html',
                                                 method: 'GET',
                                                 success : function(data, textStatus, jqXHR) {
                                                 modal.open({
                                                 content : data.responseText
                                                 });
                                                 }
                                                 });*/
                                            }
                                        },
                                        {
                                        tdAttrs: {
                                            style: {
                                                width: '550px;'
                                            }
                                        },
                                        xtype: 'fieldset',
                                        title: '<span style="font-style: italic;font-weight: bold;font-size: 16px;">Item Pictures</span>',
                                        collapsible: false,
                                        style: 'text-align:center;',
                                        items: [
                                            {
                                                xtype: 'component',
                                                style:'float:left !important',
                                                margin: '93 30 0 5',
                                                id: 'delete_zone_item_add',
                                                html: '<span></span><img ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" id="delete_zone_item_add" src="'+com.faralam.custom_img_path+'dustbin.png" width="26" height="26" border="0">'
                                            },
                                            {
                                                xtype: 'image',
                                                padding: '5 5 5 5',
                                                width: 120,
                                                height: 120,
                                                margin: '0 0 5 0',
                                                src: '',
                                                id: 'thumb_img',
                                                style: 'border: 1px solid #00a234;'
                                            }
                                        ]
                                    }

                                    ]
                                    }
                                ]
                            },
                                /*{
                                    xtype: 'container',
                                    width:230,
                                    margin:'0 0 0 100',
                                    style: 'margin-left:50px;width:230px;',
                                    tdAttrs: {
                                        style: {
                                            'vertical-align': 'top'
                                        }
                                    },
                                    layout:'vbox',
                                    style:'border:2px solid #33ccff;padding:5px;',
                                    items: [
                                        {
                                            xtype:'component',
                                            html:'<div style="border-radius:3px;background-color:#ff9900 !important;width:220px;height: 200px;"></div>'
                                        },
                                        {
                                            xtype:'component',
                                            html:'<div style="background-color: #000 !important;width:230px;height: 50px;"><h4 style="line-height:50px;color:#fff;margin-left:65px; font-size:16px">Attributes</h4></div>'
                                        },
                                        {
                                            xtype:'component',
                                            html:'<div style="background-color: #ff9900 !important;width:220px;height: 200px; border:2px solid black;border-radius:3px"></div>'
                                        }
                                        ]
                                }*/
                                   {
                                    xtype: 'container',
                                    width:300,
                                    margin:'0 0 0 50',
                                    style: 'width:300px;',
                                    /*tdAttrs: {
                                        style: {
                                            'vertical-align': 'top'
                                        }
                                    },*/
                                    layout:'vbox',
                                    style:'border:2px solid #33ccff;padding:5px;',
                                    items: [
                                        {
                                            xtype:'component',
                                            id:'big_pic',
                                            html:'<div style="border-radius:3px;background-color:#ff9900 !important;width:290px;height: 200px;"></div>'
                                        },
                                        {
                                            xtype:'component',
                                            html:'<div style="width:290px;height: 50px;"><h4 style="line-height:50px;color:#fff;margin-left:100px; font-size:16px">Attributes</h4></div>'
                                        },
                                        {
                                            xtype:'component',
                                            id:'ratio_switch_component',
                                            style:'background-color: #ff9900 !important;width:278px ! important;min-height: 173px;height:auto !important; margin:5px; border:2px solid black;border-radius:3px',
                                            html:''
                                        }
                                        ]
                                }
                                   ]
                        }]
                });

                item_modal = Ext.widget('window', {
                    title: 'Add Item',
                    id: 'item_modal',
                    closeAction: 'hide',
                    layout: 'fit',
                    resizable: false,
                    modal: true,
                    width: 980,
                    //height:410,
                    items: item_modal_form,
                    listeners:{
                        close:function(){
                            Ext.getCmp('catalog_big_img').setSrc('');
                            Ext.getCmp('thumb_img').setSrc('');
                            item_modal_form.getForm().reset(true);
                        }
                    }
                });

//				Ext.getCmp('catalog_type').setValue('');
//				Ext.getCmp('catalog_type').getStore().removeAll();
//				Ext.getCmp('catalog_type').getStore().proxy.url = com.faralam.serverURL+'retail/retrieveSASLItems';
//				Ext.getCmp('catalog_type').getStore().reload();
            }
            item_modal.show();
        }
com.faralam.common.CATALOGS_EDIT_ITEMS = function (e) {
        var edit_item_modal;
        var swicth="";
        
            //====================================================================================
            var  switchs='<table style="border:2px solid black;margin:5px" width="95%" height="94%" cellspacing="10px" id="catalogs_attributes"><tr>';    
 var hid_feild_container = [];  
               com.faralam.getItemAttributeMap= com.faralam.serverURL + 'retail/getItemAttributeMap';
               com.faralam.getItemAttributeMap=com.faralam.getItemAttributeMap+ "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
                  
              var onsuccess = function (response, textStatus, jqXHR) {
                  var fl=0;
                  var all='';
                  $.each(response, function(key, value){
                      var ids='"add_'+key+'"';
                       
                       all=all+key+"*";
                      if(e.getAttribute(''+key+'')=='true')
                          {
                      switchs=switchs+'<td>'+key+'</td><td><div class="switch_email" style="padding:0px !important; float:left;"><input id="'+key+'" class="cmn-toggle cmn-toggle-rounds" onclick="com.faralam.common.enablecheck(this,\'hid_'+key+'\')" checked="checked" type="checkbox"><label for="'+key+'"></label></div></td>';
                        hid_feild_container.push({
                                xtype: 'hiddenfield',
                                id: 'hid_'+key,
                                name: 'hid_'+key,
                                value:true
                                });
                          }
                    else
                        {
                         switchs=switchs+'<td>'+key+'</td><td><div class="switch_email" style="padding:0px !important; float:left;"><input id="'+key+'" class="cmn-toggle cmn-toggle-rounds" onclick="com.faralam.common.enablecheck(this,\'hid_'+key+'\')" type="checkbox"><label for="'+key+'"></label></div></td>';
                         hid_feild_container.push({
                                xtype: 'hiddenfield',
                                id: 'hid_'+key,
                                name: 'hid_'+key,
                                value:false
                                });
                        }
                      
                      fl++;
                      if(fl%2==0)
                          {
                            switchs=switchs+'</tr><tr>'; 
                            
                          }
                      
                  });
                switchs=switchs+'</tr></table>';
                  switchs='<div id="ratio_switch_div" style="background-color: #ff9900 !important;width:278px;height: 173px; margin:5px; border:2px solid black;border-radius:3px;overflow:hidden">'+switchs+'</div>';
                  console.log("log1="+all);
                Ext.getCmp('ratio_grp').update(switchs);
                Ext.getCmp('hid_all_attr_val_edit').setValue(all);
                Ext.getCmp('hid_feild_container_edit').add(hid_feild_container); 
                $('#ratio_switch_div').perfectScrollbar('destroy');
                $('#ratio_switch_div').perfectScrollbar();
                  
              }
              var onerror = function (jqXHR, textStatus, errorThrown) {}  
              com.faralam.common.sendAjaxRequest(com.faralam.getItemAttributeMap, "GET", {}, onsuccess, onerror);
            
            //====================================================================================
            if (Ext.getCmp('edit_item_modal')) {    
        var modal = Ext.getCmp('edit_item_modal');
        modal.destroy(modal, new Object());
    }
            if (Ext.getCmp('item_modal')) {
         var   edit_item_modal_win='';     
        var modal = Ext.getCmp('item_modal');
        modal.destroy(modal, new Object());
    }
            
            if(!edit_item_modal) {
        
                var edit_item_modal = Ext.widget('form', {
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    //cls: 'x-body',
                    cls: 'common_bg',
                    border: false,
                    bodyPadding: 10,
                    fieldDefaults: {
                        labelAlign: 'side',
                        labelWidth: 150,
                        labelStyle: 'font-weight:bold'
                    },
                    defaultType: 'textfield',
                    items: [
                        {
                            xtype: 'container',
                            layout:'hbox',
                            width:980,
                            items: [{
                                xtype: 'container',
                                layout: {
                                    type: 'table',
                                    columns: 1,
                                    tableAttrs: {
                                        style: {
                                            width: '100%'
                                        }
                                    }
                                },
                                tdAttrs: {
                                    style: {
                                        width: '75%'
                                    }
                                },
                                items: [

                                    {
                                    xtype: 'container',
                                    /*layout: {
                                        type: 'table',
                                        columns: 3,
                                        tableAttrs: {
                                            style: {
                                                width: '100%'
                                            }
                                        }
                                    },*/
                                    items: [

                                        {
                                            xtype: 'form',
                                            layout: 'vbox',
                                            padding: '10 10 5 10',
                                            style: {
                                                width:'550px;'
                                                /*border: '1px solid #fff;'*/
                                            },
                                            items: [
                                                    {
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_itemId',
                                                    name: 'hid_itemId',
                                                    value:e.getAttribute('itemId')
                                                    },
                                                   {
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_itemVersion',
                                                    name: 'hid_itemVersion',
                                                    value:e.getAttribute('itemVersion')
                                                    },
                                                   {
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_priceId',
                                                    name: 'hid_priceId',
                                                    value:e.getAttribute('priceId')
                                                    },
                                                {
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_itemTag',
                                                    name: 'hid_itemTag',
                                                    value:e.getAttribute('itemTag')
                                                    },
                                                {
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_all_attr_val_edit',
                                                    name: 'hid_all_attr_val_edit',
                                                    value:''
                                                    },{
                                                    xtype: 'container',
                                                    id:'hid_feild_container_edit',
                                                    width: 180,
                                                    items: []
                                                }/*,
                                                   {
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_Vegeterian',
                                                    name: 'hid_Vegeterian',
                                                    value:value_Vegeterian
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_Signature',
                                                    name: 'hid_Signature',
                                                    value:value_Signature
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_Organic',
                                                    name: 'hid_Organic',
                                                    value:value_Organic
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_New',
                                                    name: 'hid_New',
                                                    value:value_New
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_Vegan',
                                                    name: 'hid_Vegan',
                                                    value:value_Vegan
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_Spicy',
                                                    name: 'hid_Spicy',
                                                    value:value_Spicy
                                                    },{
                                                    xtype: 'hiddenfield',
                                                    id: 'hid_Local',
                                                    name: 'hid_Local',
                                                    value:value_Local
                                                    }*/,
                                                {
                                                    xtype: 'container',
                                                    defaultType: 'button',
                                                    width: 180,
                                                    style: 'text-align:center;margin: 20px 0 0 365px; position: absolute;right: 0 !important;top: 20px;z-index: 9;left: initial !important;',
                                                    items:[{
                                                        text: 'Cancel',
                                                        handler: function(){
                                                            //edit_item_modal.getForm().reset(true);
                                                             Ext.getCmp('edit_item_modal').close();
                                                        }
                                                    },
                                                        {
                                                            text: 'Update',
                                                            margin: '0 0 0 10',
                                                            handler: function(){                                                                                if(edit_item_modal.getForm().isValid()){
                                                                com.faralam.common.updateItem();
                                                            }
                                                                }
                                                            
                                                        }]
                                                },
                                                {
                                                    tdAttrs: {
                                                        style: {
                                                            width: '550px;'
                                                        }
                                                    },
                                                    xtype: 'fieldset',
                                                    title: '<span style="font-style: italic;font-weight: bold;font-size: 16px;">Item Details</span>',
                                                    collapsible: false,
                                                    style: 'text-align:left;',
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            fieldLabel: 'Name',
                                                            labelSeparator: '',
                                                            emptyText: '(Name of the item)',
                                                            inputWidth: 350,
                                                            margin: '4 0 2 0',
                                                            name: '',
                                                            value: e.getAttribute('itemName'),
                                                            id: 'edit_item_title',
                                                            allowBlank: false
                                                        },
                                                        {
                                                            xtype: 'textfield',
                                                            fieldLabel: 'Summary',
                                                            labelSeparator: '',
                                                            emptyText: '(Summary)',
                                                            inputWidth: 350,
                                                            margin: '4 0 2 0',
                                                            name: '',
                                                            value: e.getAttribute('shortDescription'),
                                                            id: 'edit_item_summary',
                                                            allowBlank: false
                                                        },
                                                        {
                                                            xtype: 'textareafield',
                                                            fieldLabel: 'Description',
                                                            labelSeparator: '',
                                                            emptyText: '(Description)',
                                                            inputWidth: 350,
                                                            margin: '4 0 2 0',
                                                            name: '',
                                                            value: e.getAttribute('longDescription'),
                                                            width: 350,
                                                            height: 45,
                                                            id: 'edit_catalog_msg',
                                                            allowBlank: false
                                                        },
                                                        {
                                                            xtype: 'container',
                                                            layout:'hbox',
                                                            style: 'display:inline',
                                                            width:500,
                                                           items: [
                                                            {
                                                            xtype: 'textfield',
                                                            fieldLabel: 'Price',
                                                            labelSeparator: '',
                                                            emptyText: '(Price)',
                                                            inputWidth: 180,
                                                            margin: '4 0 2 0',
                                                            name: '',
                                                            value: e.getAttribute('price'),
                                                            id: 'edit_item_price',
                                                            allowBlank: false
                                                        },
                                                        {
                                                            xtype: 'combo',
                                                            id: 'edit_currency',
                                                            name: 'currency',
                                                            editable: true,
                                                            margin: '4 0 2 20',
                                                            labelWidth: 0,
                                                            labelAlign: 'top',
                                                            allowBlank: false,
                                                            emptyText:'Choose Currency',
                                                            inputWidth: 150,
                                                            inputHeight: 32,
                                                            value:'USD',
                                                            fieldLabel: '',
                                                            mode: 'remote',
                                                            displayField: 'displayText',
                                                            valueField: 'enumText',
                                                            
                                                            store: Ext.create('Ext.data.Store', {
                                                                fields: ['enumText','displayText'],
                                                               data : [
                                                            {"enumText":"USD", "displayText":"USD"}
                                                            ],
                                                                autoLoad: true
                                                            })
                                                        }
                                                        
                                                    ]}
                                                        ,
                                                        {
                                                            xtype: 'image',
                                                            width: 350,
                                                            height: 135,
                                                            src: '',
                                                            style: 'border: 1px solid #fff;margin: 3px 0 0 0;',
                                                            id: 'edit_catalog_big_img',
                                                            hidden:true
                                                        }
                                                    ]
                                                }

                                            ]
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'small',
                                            text: 'Add New Picture',
                                            /*margin: '0 0 0 10',
                                             tdAttrs: {
                                             style: {
                                             width: '33%'
                                             }
                                             },*/
                                            style: 'margin: 0 auto; position: absolute;right: 10px;bottom: 138px;z-index: 9;',
                                            handler: function(){
                                                //$('#modal').css({'z-index': '19002', 'margin-top': '-5px'});
                                                $('#modal').css({'z-index': '19002'});
                                                //com.faralam.getCropPicURLs('resources/plugins/croppic/catalog_crop.html');
                                                /*Ext.Ajax.request({
                                                 url: 'resources/plugins/croppic/catalog_crop.html',
                                                 method: 'GET',
                                                 success : function(data, textStatus, jqXHR) {
                                                 modal.open({
                                                 content : data.responseText
                                                 });
                                                 }
                                                 });*/
                                            }
                                        },
                                        {
                                        tdAttrs: {
                                            style: {
                                                width: '550px;'
                                            }
                                        },
                                        xtype: 'fieldset',
                                        title: '<span style="font-style: italic;font-weight: bold;font-size: 16px;">Item Pictures</span>',
                                        collapsible: false,
                                        style: 'text-align:center;',
                                        items: [
                                            {
                                                xtype: 'component',
                                                style:'float:left !important',
                                                margin: '93 30 0 5',
                                                id: 'edit_delete_zone_item_add',
                                                html: '<span></span><img ondrop="com.faralam.drop_catalog(event)" ondragover="com.faralam.allowDrop_catalog(event)" id="delete_zone_item_add" src="'+com.faralam.custom_img_path+'trash.png" width="26" height="26" border="0">'
                                            },
                                            {
                                                xtype: 'image',
                                                padding: '5 5 5 5',
                                                width: 120,
                                                height: 120,
                                                margin: '0 0 5 0',
                                                src: e.getAttribute('imgUrl'),
                                                id: 'edit_thumb_img',
                                                style: 'border: 1px solid #00a234;'
                                            }
                                        ]
                                    }

                                    ]
                                    }
                                ]
                            },
                                {
                                    xtype: 'container',
                                    width:300,
                                    margin:'0 0 0 50',
                                    style: 'width:300px;',
                                    /*tdAttrs: {
                                        style: {
                                            'vertical-align': 'top'
                                        }
                                    },*/
                                    layout:'vbox',
                                    style:'border:2px solid #33ccff;padding:5px;',
                                    items: [
                                        {
                                            xtype:'component',
                                            html:'<div style="border-radius:3px;background-color:#ff9900 !important;width:290px;height: 200px;"><img style="margin: 5px; border: 2px solid black; width: 280px; border-radius: 5px; height: 190px;" src="'+e.getAttribute('imgUrl')+'" ></div>'
                                        },
                                        {
                                            xtype:'component',
                                            html:'<div style="width:290px;height: 50px;"><h4 style="line-height:50px;color:#fff;margin-left:85px; font-size:16px">Attributes</h4></div>'
                                        },
                                        {
                                            xtype:'component',
                                            id:'ratio_grp',
                                            html:'<div id="ratio_switch_div" style="background-color: #ff9900 !important;width:278px;height: 173px; margin:5px; border:2px solid black;border-radius:3px;overflow:hidden"></div>'
                                        }
                                        ]
                                }]
                        }]
                });

                edit_item_modal_win = Ext.widget('window', {
                    title: 'Edit Item',
                    id: 'edit_item_modal',
                    closeAction: 'destroy',
                    layout: 'fit',
                    resizable: false,
                    modal: true,
                    width: 980,
                    //height:410,
                    items: edit_item_modal,
                    listeners:{
                        close:function(){
                            Ext.getCmp('edit_catalog_big_img').setSrc('');
                            Ext.getCmp('edit_thumb_img').setSrc('');
                            //edit_item_modal_form.getForm().reset(true);
                        }
                    }
                });

}
            edit_item_modal_win.show();
        }
com.faralam.common.updateItem = function(){
                                                        
                                    var itemName=Ext.getCmp('edit_item_title').getValue();
                                    var shortDescription=Ext.getCmp('edit_item_summary').getValue();
                                    var longDescription=Ext.getCmp('edit_catalog_msg').getValue();
                                    var price=Ext.getCmp('edit_item_price').getValue();                                                          if(itemName.trim()=='')
                                            {
                                    Ext.MessageBox.alert('Information', 'Please enter item name.');   
                                            }
                                    else if(shortDescription.trim()=='')
                                    {
                                    Ext.MessageBox.alert('Information', 'Please enter summery.'); 
                                    }
                                    else if(longDescription.trim()=='')
                                    {
                                    Ext.MessageBox.alert('Information', 'Please enter description.'); 
                                    }   
                                    else if(price.trim()=='')
                                    {
                                    Ext.MessageBox.alert('Information', 'Please enter Price.'); 
                                    } 
                                                                else
                                                                    {
                                var all=Ext.getCmp('hid_all_attr_val_edit').getValue();
                                console.log(all);
                                var all_att_arr=all.split("*");
                                var att_json="{";
                                for(var i=0;i<all_att_arr.length;i++)
                                    {

                                        if(all_att_arr[i].trim()!="")
                                            {
                                              var val=Ext.getCmp('hid_'+all_att_arr[i]).getValue();

                                              att_json=att_json+'"'+all_att_arr[i]+'":'+val+"," ;
                                            }
                                    }
                                      att_json=att_json.substring(0,att_json.length-1)
                                      att_json=att_json+"}";
                                                                         
                                     var data={ 
                                    "serviceAccommodatorId": sessionStorage.SA, 
                                    "serviceLocationId": sessionStorage.SL, 
                                    "item": { 
                                    "itemId": Ext.getCmp('hid_itemId').getValue(), 
                                    "itemVersion":Ext.getCmp('hid_itemVersion').getValue(), 
                                    "priceId": Ext.getCmp('hid_priceId').getValue() 
                                    }, 
                                    "price": price, 
                                    "shortDescription": shortDescription , 
                                    "longDescription": longDescription, 
                                    "itemName": itemName, 
                                    "itemTag": Ext.getCmp('hid_itemTag').getValue(), 
                                    "attributes":JSON.parse(att_json)
                                    } ;
                                                                        /* { 
                                    "Local": Ext.getCmp('hid_Local').getValue(), 
                                    "New": Ext.getCmp('hid_New').getValue(), 
                                    "Organic": Ext.getCmp('hid_Organic').getValue(), 
                                    "Spicy": Ext.getCmp('hid_Spicy').getValue(), 
                                    "Vegetarian": Ext.getCmp('hid_Vegeterian').getValue(), 
                                    "Signature": Ext.getCmp('hid_Signature').getValue() 
                                    } */
                                    data=JSON.stringify(data);
                                    console.log(data);
                                                        
                                                                        //com.faralam.SubmitCatalog
 com.faralam.updateItem = com.faralam.serverURL + 'retail/updateItem';                                                                       
com.faralam.updateItem = com.faralam.updateItem + "?" + encodeURI('UID=' + sessionStorage.UID); 
      var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Item updated successfully.', function () {
            Ext.getCmp('edit_item_modal').close();
            com.faralam.common.RetrieveCatalogInfo('','',1);
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.updateItem, "PUT", data, onsuccess, onerror);                                                              
}
}
com.faralam.common.addCatalog = function () {
    var catalog_id = Ext.getCmp('catalog_id').getValue();
    var catalog = '';
    var method='POST';
    var msg='updated';
    if (catalog_id == '') {
        msg='created';
        com.faralam.addCatalog = com.faralam.serverURL + 'retail/createCatalog';
        catalog = Ext.getCmp('catalog_title').getValue();
        var data = {
        "timeRange": {
            "isExpired": "false",
            "expirationDate": "2013-01-05T23:00:00Z",
            "openingDays": ["THU"],
            "openingHours": {
                "startClock": {
                    "minute": "0",
                    "hour": "0"
                },
                "endClock": {
                    "minute": "59",
                    "hour": "23"
                }
            },
            "activationDate": "2013-09-25T16:37:03Z"
        },
        "displayText": Ext.getCmp('catalog_title').getValue(),
        "description": Ext.getCmp('catalog_description').getValue(),
        "catalogId": catalog,
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL
    };
    } else {
        com.faralam.addCatalog = com.faralam.serverURL + 'retail/updateCatalog';
        method='PUT';
        catalog = Ext.getCmp('catalog_id').getValue();
        var data = {
        "timeRange":null,
        "displayText": Ext.getCmp('catalog_title').getValue(),
        "description": Ext.getCmp('catalog_description').getValue(),
        "catalogId": catalog,
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL
    };
    }


    com.faralam.addCatalog = com.faralam.addCatalog + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    /*var data =  {
     "catalogId":Ext.getCmp('catalog_title').getValue(),
     "serviceAccommodatorId":sessionStorage.SA,
     "serviceLocationId":sessionStorage.SL
     };*/

    


    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Catalog '+msg+' successfully.', function () {
            Ext.getCmp('catalog_modal').close();
            com.faralam.common.retrieveCatalogs_func();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.addCatalog, method, data, onsuccess, onerror);
}

com.faralam.common.addGroupCatalog = function (catalogId) {
    var gid=Ext.getCmp('catalog_group').getValue(),
        gid=gid.toUpperCase();
    
    var groupId = Ext.getCmp('group_id').getValue();
    var key="groupDisplayText"
    var data={};
    var msg1='Group added successfully.';
    if (groupId == '') {
        com.faralam.addGroupCatalog = com.faralam.serverURL + 'retail/createGroup';
        var data = {
        "groupId": gid,
        "groupDisplayText": Ext.getCmp('catalog_group').getValue(),
        "description":Ext.getCmp('catalog_group_description').getValue(),
        "catalogId":catalogId,
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL
    };
    } else {
        com.faralam.addGroupCatalog = com.faralam.serverURL + 'retail/updateGroup';
        msg1='Group updated successfully.';
        var data={
  "groupId": Ext.getCmp('hid_group_id').getValue(),
  "displayText": Ext.getCmp('catalog_group').getValue(),
  "description": Ext.getCmp('catalog_group_description').getValue(),
  "serviceAccommodatorId": sessionStorage.SA,
  "serviceLocationId": sessionStorage.SL
};
    }


    com.faralam.addGroupCatalog = com.faralam.addGroupCatalog + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    /*var data =  {
     "groupId":Ext.getCmp('group_id').getValue(),
     "groupDisplayText":Ext.getCmp('catalog_group').getValue(),
     //"description":Ext.getCmp('catalog_group_description').getValue(),
     "catalogId":Ext.getCmp('catalog_id_within_group').getValue(),
     "serviceAccommodatorId":sessionStorage.SA,
     "serviceLocationId":sessionStorage.SL
     };*/
    
    

    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', msg1, function () {
            Ext.getCmp('catalog_group_modal').close();
            var catalogId = Ext.getCmp('catalogId').getValue();
            if (catalogId != '') {
                com.faralam.common.retrieveCatalog_func(catalogId);
            }
            com.faralam.common.retrieveGroups_func();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}


    if (groupId == '') {
        com.faralam.common.sendAjaxRequest(com.faralam.addGroupCatalog, "POST", data, onsuccess, onerror);
    } else {
        com.faralam.common.sendAjaxRequest(com.faralam.addGroupCatalog, "PUT", data, onsuccess, onerror);//update group
    }
}

com.faralam.SubmitCatalog = function () {

    com.faralam.submit_catalog = com.faralam.serverURL + 'retail/createWNewPictureURLNewMetaData';
    com.faralam.submit_catalog = com.faralam.submit_catalog + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
 var src=null;
    if(Ext.getCmp('catalog_big_img').src)
        {
            src=Ext.getCmp('catalog_big_img').src;
        }
    var all=Ext.getCmp('hid_all_attr_val').getValue();
    console.log(all);
    var all_att_arr=all.split("*");
    var att_json="{";
    for(var i=0;i<all_att_arr.length;i++)
        {
            
            if(all_att_arr[i].trim()!="")
                {
                  var val=Ext.getCmp('add_'+all_att_arr[i]).getValue();
                    
           att_json=att_json+'"'+all_att_arr[i]+'":'+val+"," ;
        }
        }
          att_json=att_json.substring(0,att_json.length-1)
          att_json=att_json+"}";
        
    var data = {
        "itemName": Ext.getCmp('item_title').getValue(),
        "itemType": 1,
        "inventoryNotSold": 3,
        "serviceAccommodatorId": sessionStorage.SA,
        "mediaType": "GALLERY_OWNER",
        "url":src ,
        "serviceLocationId": sessionStorage.SL,
        "currency": "USD",
        "message": "Media Message1",
        "inventoryInWarehouse": 10,
        "title": Ext.getCmp('item_title').getValue(),
        "price": Ext.getCmp('item_price').getValue(),
        "shortDescription": Ext.getCmp('item_summary').getValue(),
        "longDescription": Ext.getCmp('catalog_msg').getValue(),
        "group": 0,
        "itemTag": "Tag1, Tag2",
        "attributes": JSON.parse(att_json)
    };
   /*{
                "Local": Ext.getCmp('add_Local').getValue(),
                "New": Ext.getCmp('add_New').getValue(),
                "Organic": Ext.getCmp('add_Organic').getValue(),
                "Spicy": Ext.getCmp('add_Spicy').getValue(),
                "Vegetarian": Ext.getCmp('add_Vegetarian').getValue(),
                "Signature": Ext.getCmp('add_Signature').getValue()
            }  */
    /*  var data = {"longDescription":Ext.getCmp('catalog_textarea').getValue(),
     "itemType":Ext.getCmp('catalog_type').getValue(),
     "title": Ext.getCmp('catalog_title').getValue(),
     "price": Ext.getCmp('catalog_price').getValue(),
     "serviceAccommodatorId":sessionStorage.SA,
     "serviceLocationId":sessionStorage.SL,
     "url":Ext.getCmp('catalog_big_img').src};*/

    data = JSON.stringify(data);
    console.log(data);
            
    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Item Created successfully.', function () {
            Ext.getCmp('item_modal').close();
            com.faralam.common.RetrieveCatalogInfo('','',1);
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.submit_catalog, "POST", data, onsuccess, onerror);
}

com.faralam.SubmitCatalogEdit = function () {

    com.faralam.submit_catalog = com.faralam.serverURL + 'retail/createWNewPictureURLNewMetaData';
    com.faralam.submit_catalog = com.faralam.submit_catalog + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "itemName": Ext.getCmp('catalog_show_image_title').getValue(),
        "itemType": 1,
        "inventoryNotSold": 3,
        "serviceAccommodatorId": sessionStorage.SA,
        "mediaType": "GALLERY_OWNER",
        "url": Ext.getCmp('catalog_big_img').src,
        "serviceLocationId": sessionStorage.SL,
        "currency": "USD",
        "message": "Media Message1",
        "inventoryInWarehouse": 10,
        "title": Ext.getCmp('catalog_show_image_title').getValue(),
        "price": Ext.getCmp('catalog_price').getValue(),
        "shortDescription": Ext.getCmp('catalog_textarea').getValue(),
        "longDescription": Ext.getCmp('catalog_textarea').getValue(),
        "group": 0,
        "itemTag": "Tag1, Tag2"
    };

    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Catalog updated successfully.', function () {
            com.faralam.RetrieveCatalogInfo();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.submit_catalog, "POST", data, onsuccess, onerror);
}
 
com.faralam.SetCatalogDescEdit = function (e) {
    var catalogId = e.getAttribute('catalogId');
    var displayText = e.getAttribute('displayText');
    var li=e.getAttribute('mnid');
    $('.menu_list_li_set_bg').css({"background":"#f6f6ff","border":"1px solid #ffffdc"});
    $('#'+li).css({"background":"#bbbbbb","border":"1px solid #666"});
    if (catalogId == '[default]') {
        catalogId = '';
    }
    com.faralam.common.retrieveCatalog_func(catalogId);
    Ext.getCmp('catalogId').setValue(e.getAttribute('catalogId'));
    Ext.getCmp('catalogName').setValue(e.getAttribute('displayText'));
    // $("img").parent().addClass("active").siblings().removeClass("active");
    $(this).parent().addClass('active').siblings().removeClass('active');
    //Ext.getCmp('catalog_title').setValue(e.getAttribute('displayText'));
}

com.faralam.common.SetCatalogDescEditWindow = function (e) {
    //AddNewCatalog();
    var catalogId = e.getAttribute('catalogId');
    //console.log(catalogId);
    var displayText = e.getAttribute('displayText');
    //console.log(displayText);
}

com.faralam.common.EditCatalog = function (e) {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var catalog_modal;

    if (Ext.getCmp('catalog_modal')) {
        var modal = Ext.getCmp('catalog_modal');
        modal.destroy(modal, new Object());
    }
    if (!catalog_modal) {
        var txt="Add";
        if(e)
            {
                txt="Update";
            }
       
        var catalog_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            //cls: 'x-body',
            cls: 'common_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:680px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            padding: '10 10 5 10',
                            style: {
                                border: '1px solid #fff;'
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'catalog_id',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Name',
                                            labelSeparator: '',
                                            emptyText: '(Name of the Catalog)',
                                            inputWidth: 180,
                                            margin: '0 0 0 0',
                                            name: '',
                                            value: '',
                                            id: 'catalog_title',
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'container',
                                            defaultType: 'button',
                                            width: 160,
                                            style: 'text-align:center;',
                                            margin: '0 0 0 10',
                                            items: [{
                                                    text: 'Cancel',
                                                    handler: function () {
                                                        catalog_modal_form.getForm().reset(true);
                                                    }
                                                },
                                                {
                                                    text: txt,
                                                    margin: '0 0 0 10',
                                                    handler: function () {
                                                        if (catalog_modal_form.getForm().isValid()) {
                                                            com.faralam.common.addCatalog();
                                                        }
                                                    }
                                                }]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Description',
                                    labelSeparator: '',
                                    emptyText: '(Description of the Catalog)',
                                    inputWidth: 180,
                                    margin: '20 0 0 0',
                                    name: '',
                                    value: '',
                                    id: 'catalog_description',
                                    allowBlank: false
                                }/*,
                                {
                                    xtype: 'radiogroup',
                                    width: 460,
                                    fieldLabel: 'Restrictions',
                                    id: 'catalog_restrictions',
                                    allowBlank: true,
                                    msgTarget: 'side',
                                    margin: '20 0 0 0',
                                    items: [
                                        {
                                            xtype: 'radiofield',
                                            name: 'Restrictions',
                                            boxLabel: 'No',
                                            width: 110,
                                            inputValue: 'no',
                                            checked: true
                                        },
                                        {
                                            xtype: 'radiofield',
                                            name: 'Restrictions',
                                            boxLabel: 'Yes',
                                            width: 110,
                                            inputValue: 'yes'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'vbox',
                                    width: 880,
                                    items: [
                                        {
                                            xtype: 'fieldset',
                                            layout: 'hbox',
                                            title: 'Dates',
                                            collapsible: false,
                                            width: 580,
                                            style: 'padding:10px;',
                                            items: [
                                                {
                                                    xtype: 'radiogroup',
                                                    width: 300,
                                                    fieldLabel: '',
                                                    id: 'catalog_date_option',
                                                    allowBlank: true,
                                                    msgTarget: 'side',
                                                    items: [
                                                        {
                                                            xtype: 'radiofield',
                                                            name: 'catalog_date_option',
                                                            boxLabel: 'No',
                                                            width: 50,
                                                            inputValue: 'no',
                                                            checked: true
                                                        },
                                                        {
                                                            xtype: 'radiofield',
                                                            name: 'catalog_date_option',
                                                            boxLabel: 'Yes',
                                                            width: 100,
                                                            inputValue: 'yes'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'datefield',
                                                    fieldLabel: '',
                                                    labelSeparator: '',
                                                    emptyText: '',
                                                    inputWidth: 100,
                                                    margin: '0 10 0 10',
                                                    name: '',
                                                    value: '',
                                                    id: 'catalog_start_date',
                                                    allowBlank: true,
                                                    minValue: new Date(),
                                                    value: new Date()
                                                },
                                                {
                                                    xtype: 'component',
                                                    html: '-'
                                                },
                                                {
                                                    xtype: 'datefield',
                                                    fieldLabel: '',
                                                    labelSeparator: '',
                                                    emptyText: '',
                                                    inputWidth: 100,
                                                    margin: '0 10 0 10',
                                                    name: '',
                                                    value: '',
                                                    id: 'catalog_end_date',
                                                    allowBlank: true,
                                                    minValue: new Date(),
                                                    value: new Date()
                                                }

                                            ]
                                        },
                                        {
                                            xtype: 'fieldset',
                                            layout: 'hbox',
                                            title: 'Times',
                                            collapsible: false,
                                            width: 580,
                                            style: 'padding:10px;',
                                            items: [
                                                {
                                                    xtype: 'radiogroup',
                                                    width: 300,
                                                    fieldLabel: '',
                                                    id: 'catalog_time_option',
                                                    allowBlank: true,
                                                    msgTarget: 'side',
                                                    items: [
                                                        {
                                                            xtype: 'radiofield',
                                                            name: 'catalog_time_option',
                                                            boxLabel: 'Any',
                                                            width: 50,
                                                            inputValue: 'any',
                                                            checked: true
                                                        },
                                                        {
                                                            xtype: 'radiofield',
                                                            name: 'catalog_time_option',
                                                            boxLabel: 'Fixed',
                                                            width: 100,
                                                            inputValue: 'fixed'
                                                        }
                                                    ]
                                                },
                                                {
                                                    xtype: 'timefield',
                                                    fieldLabel: '',
                                                    labelSeparator: '',
                                                    emptyText: '',
                                                    inputWidth: 100,
                                                    margin: '0 10 0 10',
                                                    name: '',
                                                    value: '',
                                                    id: 'catalog_start_time',
                                                    allowBlank: true,
                                                    minValue: '6:00 AM',
                                                    maxValue: '11:00 PM',
                                                    increment: 30
                                                },
                                                {
                                                    xtype: 'component',
                                                    html: 'to'
                                                },
                                                {
                                                    xtype: 'timefield',
                                                    fieldLabel: '',
                                                    labelSeparator: '',
                                                    emptyText: '',
                                                    inputWidth: 100,
                                                    margin: '0 10 0 10',
                                                    name: '',
                                                    value: '',
                                                    id: 'catalog_end_time',
                                                    allowBlank: true,
                                                    minValue: '6:00 AM',
                                                    maxValue: '11:00 PM',
                                                    increment: 30
                                                }

                                            ]
                                        },
                                        {
                                            xtype: 'fieldset',
                                            title: 'Days',
                                            collapsible: false,
                                            width: 580,
                                            items: [{
                                                    xtype: 'checkboxgroup',
                                                    margin: '10 0 0 0',
                                                    cls: 'x-check-group-alt',
                                                    id: 'catalog_valid_days',
                                                    allowBlank: true,
                                                    width: 580,
                                                    items: [
                                                        {
                                                            name: 'valid_day',
                                                            inputValue: 'SUN',
                                                            checked: true,
                                                            id: 'catalog_valid_sun',
                                                            listeners: {
                                                                click: {
                                                                    element: 'el',
                                                                    fn: function () {
                                                                        var mode = Ext.getCmp('catalog_valid_sun').getValue();
                                                                        if (mode === true) {
                                                                            Ext.get('catalog_valid_sun-inputEl').removeCls("inactive_sDay_checkbox");
                                                                            Ext.get('catalog_valid_sun-inputEl').addCls("active_sDay_checkbox");
                                                                        } else {
                                                                            Ext.get('catalog_valid_sun-inputEl').removeCls("active_sDay_checkbox");
                                                                            Ext.get('catalog_valid_sun-inputEl').addCls("inactive_sDay_checkbox");
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            name: 'valid_day',
                                                            inputValue: 'MON',
                                                            id: 'catalog_valid_mon',
                                                            listeners: {
                                                                click: {
                                                                    element: 'el',
                                                                    fn: function () {
                                                                        var mode = Ext.getCmp('catalog_valid_mon').getValue();
                                                                        if (mode === true) {
                                                                            Ext.get('catalog_valid_mon-inputEl').removeCls("inactive_mDay_checkbox");
                                                                            Ext.get('catalog_valid_mon-inputEl').addCls("active_mDay_checkbox");
                                                                        } else {
                                                                            Ext.get('catalog_valid_mon-inputEl').removeCls("active_mDay_checkbox");
                                                                            Ext.get('catalog_valid_mon-inputEl').addCls("inactive_mDay_checkbox");
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            name: 'valid_day',
                                                            inputValue: 'TUE',
                                                            checked: true,
                                                            id: 'catalog_valid_tue',
                                                            listeners: {
                                                                click: {
                                                                    element: 'el',
                                                                    fn: function () {
                                                                        var mode = Ext.getCmp('catalog_valid_tue').getValue();
                                                                        if (mode === true) {
                                                                            Ext.get('catalog_valid_tue-inputEl').removeCls("inactive_tDay_checkbox");
                                                                            Ext.get('catalog_valid_tue-inputEl').addCls("active_tDay_checkbox");
                                                                        } else {
                                                                            Ext.get('catalog_valid_tue-inputEl').removeCls("active_tDay_checkbox");
                                                                            Ext.get('catalog_valid_tue-inputEl').addCls("inactive_tDay_checkbox");
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            name: 'valid_day',
                                                            inputValue: 'WED',
                                                            id: 'catalog_valid_wed',
                                                            listeners: {
                                                                click: {
                                                                    element: 'el',
                                                                    fn: function () {
                                                                        var mode = Ext.getCmp('catalog_valid_wed').getValue();
                                                                        if (mode === true) {
                                                                            Ext.get('catalog_valid_wed-inputEl').removeCls("inactive_wDay_checkbox");
                                                                            Ext.get('catalog_valid_wed-inputEl').addCls("active_wDay_checkbox");
                                                                        } else {
                                                                            Ext.get('catalog_valid_wed-inputEl').removeCls("active_wDay_checkbox");
                                                                            Ext.get('catalog_valid_wed-inputEl').addCls("inactive_wDay_checkbox");
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            name: 'valid_day',
                                                            inputValue: 'THU',
                                                            checked: true,
                                                            id: 'catalog_valid_thu',
                                                            listeners: {
                                                                click: {
                                                                    element: 'el',
                                                                    fn: function () {
                                                                        var mode = Ext.getCmp('catalog_valid_thu').getValue();
                                                                        if (mode === true) {
                                                                            Ext.get('catalog_valid_thu-inputEl').removeCls("inactive_tDay_checkbox");
                                                                            Ext.get('catalog_valid_thu-inputEl').addCls("active_tDay_checkbox");
                                                                        } else {
                                                                            Ext.get('catalog_valid_thu-inputEl').removeCls("active_tDay_checkbox");
                                                                            Ext.get('catalog_valid_thu-inputEl').addCls("inactive_tDay_checkbox");
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            name: 'valid_day',
                                                            inputValue: 'FRI',
                                                            checked: true,
                                                            id: 'catalog_valid_fri',
                                                            listeners: {
                                                                click: {
                                                                    element: 'el',
                                                                    fn: function () {
                                                                        var mode = Ext.getCmp('catalog_valid_fri').getValue();
                                                                        if (mode === true) {
                                                                            Ext.get('catalog_valid_fri-inputEl').removeCls("inactive_fDay_checkbox");
                                                                            Ext.get('catalog_valid_fri-inputEl').addCls("active_fDay_checkbox");
                                                                        } else {
                                                                            Ext.get('catalog_valid_fri-inputEl').removeCls("active_fDay_checkbox");
                                                                            Ext.get('catalog_valid_fri-inputEl').addCls("inactive_fDay_checkbox");
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            name: 'valid_day',
                                                            inputValue: 'SAT',
                                                            checked: true,
                                                            id: 'catalog_valid_sat',
                                                            listeners: {
                                                                click: {
                                                                    element: 'el',
                                                                    fn: function () {
                                                                        var mode = Ext.getCmp('catalog_valid_sat').getValue();
                                                                        if (mode === true) {
                                                                            Ext.get('catalog_valid_sat-inputEl').removeCls("inactive_sDay_checkbox");
                                                                            Ext.get('catalog_valid_sat-inputEl').addCls("active_sDay_checkbox");
                                                                        } else {
                                                                            Ext.get('catalog_valid_sat-inputEl').removeCls("active_sDay_checkbox");
                                                                            Ext.get('catalog_valid_sat-inputEl').addCls("inactive_sDay_checkbox");
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ],
                                                    listeners: {
                                                        'validitychange': function (ev, isValid, eOpts) {
                                                            Ext.getCmp('catalog_valid_days_err').setValue('');
                                                            if (!isValid) {
                                                                Ext.getCmp('catalog_valid_days_err').setValue('<span style="color:#CF4C35;">' + ev.getErrors() + '</span>');
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'displayfield',
                                                    name: 'catalog_valid_days_err',
                                                    id: 'catalog_valid_days_err',
                                                    labelWidth: 5,
                                                    fieldLabel: '&nbsp;',
                                                    value: '',
                                                    labelSeparator: ''
                                                }]
                                        }
                                    ]
                                }*/

                            ]
                        }]
                }
            ]
        });

        catalog_modal = Ext.widget('window', {
            title: 'Add Catalog',
            id: 'catalog_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 680,
            //height:410,
            items: catalog_modal_form,
            listeners: {
                close: function () {
                    catalog_modal_form.getForm().reset(true);
                },
                show: function () {
                    if (e != '') {
                        /*var catalogId = e.getAttribute('catalogId');
                         //console.log(catalogId);
                         var displayText = e.getAttribute('displayText');
                         //console.log(displayText);*/
                        Ext.getCmp('catalog_id').setValue(e.getAttribute('catalogId'));
                        Ext.getCmp('catalog_title').setValue(e.getAttribute('displayText'));
                        Ext.getCmp('catalog_description').setValue(e.getAttribute('description'));
                    }
                }

            }
        });
    }
    catalog_modal.show();


}

com.faralam.SetCalatogGroupDescEditWindow = function (e) {

    var mode = 'edit_group';
    var catalogId = Ext.getCmp('catalogId').getValue();
    //console.log(catalogId);
    var catalogName = Ext.getCmp('catalogName').getValue();
    //console.log(catalogName);
    var groupId = e.getAttribute('groupId');
    //console.log(groupId);
    var groupName = e.getAttribute('groupDisplayText');
    //console.log(groupName);
    var groupDescription = e.getAttribute('description');
    //console.log(groupDescription);
    com.faralam.common.EditCatalogGroup(mode, catalogId, catalogName, groupId, groupName, groupDescription);
}

com.faralam.SetCalatogGroupDescEdit = function (e) {
    //AddCatalogGroup();
    var groupId = e.getAttribute('groupId');
    var li=e.getAttribute('grincat');
    $('.groups_in_catalog_menu_li_set').css({"background":"#f6f6ff","border":"1px solid #ffffdc"});
    $('#'+li).css({"background":"#bbbbbb","border":"1px solid #666"});
    //console.log(groupId);
    com.faralam.common.retrieveGroup_func(groupId);
    Ext.getCmp('groupId').setValue(e.getAttribute('groupId'));
    //Ext.getCmp('catalog_group').setValue(e.getAttribute('groupDisplayText'));
    //Ext.getCmp('catalog_name').setValue(e.getAttribute('groupDisplayText'));

}

com.faralam.common.EditCatalogGroup = function (mode, catalogId, catalogName, groupId, groupName, groupDescription) {
    console.log(groupId);
    var catalog_group_modal;
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
    var catalogId = Ext.getCmp('catalogId').getValue();
    var txt="Add";
    
    if (mode == 'add_group') {
    catalogId=null;
    } else if (mode == 'add_group_within_catalog') {
        if (catalogId == '') {
            Ext.MessageBox.alert('Error', 'Please select a catalog');
        }
        // exit;
    } else if (mode == 'edit_group') {
        txt="Update";
        if (catalogId == '') {
            Ext.MessageBox.alert('Error', 'Please select a catalog');
        }
        // exit;
    } else {

    }

    if (Ext.getCmp('catalog_group_modal')) {
        var modal = Ext.getCmp('catalog_group_modal');
        modal.destroy(modal, new Object());
    }


    if (!catalog_group_modal) {
        var catalog_group_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            //cls: 'x-body',
            cls: 'common_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:580px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            padding: '10 10 5 10',
                            /* style: {
                             border: '1px solid #fff;'
                             },*/
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'catalog_id_within_group',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'group_id',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'hid_group_id',
                                            name: '',
                                            value: groupId
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Name',
                                            labelSeparator: '',
                                            emptyText: '(Name of the Catalog Group)',
                                            inputWidth: 180,
                                            margin: '0 0 0 0',
                                            name: '',
                                            value: '',
                                            id: 'catalog_group',
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'container',
                                            defaultType: 'button',
                                            width: 160,
                                            style: 'text-align:center;',
                                            margin: '0 0 0 10',
                                            items: [{
                                                    text: 'Cancel',
                                                    handler: function () {
                                                        catalog_group_modal_form.getForm().reset(true);
                                                    }
                                                },
                                                {
                                                    text: txt,
                                                    margin: '0 0 0 10',
                                                    handler: function () {
                                                        if (catalog_group_modal_form.getForm().isValid()) {
                                                            com.faralam.common.addGroupCatalog(catalogId);
                                                        }
                                                    }
                                                }]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Description',
                                    labelSeparator: '',
                                    emptyText: '(Description of the Catalog Group)',
                                    inputWidth: 330,
                                    margin: '20 0 0 0',
                                    name: '',
                                    value: '',
                                    id: 'catalog_group_description',
                                    allowBlank: false
                                }/*,
                                {
                                    xtype: 'textfield',
                                    fieldLabel: '(Catalog)',
                                    labelSeparator: '',
                                    emptyText: '(Name of the Catalog)',
                                    inputWidth: 330,
                                    margin: '20 0 0 0',
                                    name: '',
                                    value: '',
                                    id: 'catalog_name',
                                    allowBlank: true,
                                    readOnly: true
                                }*/
                            ]
                        }]
                }
            ]
        });

        catalog_group_modal = Ext.widget('window', {
            title: 'Add New Group',
            id: 'catalog_group_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 480,
            //height:410,
            items: catalog_group_modal_form,
            listeners: {
                close: function () {
                    catalog_group_modal_form.getForm().reset(true);
                },
                show: function () {
                    Ext.getCmp('catalog_id_within_group').setValue(catalogId);
                    Ext.getCmp('group_id').setValue(groupId);
                    Ext.getCmp('catalog_group').setValue(groupName);
                    Ext.getCmp('catalog_group_description').setValue(groupDescription);
                    //Ext.getCmp('catalog_name').setValue(catalogName);
                }
            }
        });
    }
    catalog_group_modal.show();

}

//SetCatalogGroupedItemEdit

com.faralam.SetAllItemDescEdit = function (e) {
    //AddCatalogGroup();
    var groupId = e.getAttribute('groupId');
    //console.log(groupId);

}

com.faralam.common.RemoveCatalog = function (catalogId) {
    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete the selected catalog?', function (e) {
        if (e == 'yes') {

            com.faralam.deleteCatalog = com.faralam.serverURL + 'retail/deleteCatalog';
            com.faralam.deleteCatalog = com.faralam.deleteCatalog + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&catalogId=' + catalogId);

            var onsuccess = function (response, textStatus, jqXHR) {
                Ext.MessageBox.alert('Success', 'The selected catalog deleted successfully', function () {
                    com.faralam.common.retrieveCatalogs_func();
                });
            }

            var onerror = function (jqXHR, textStatus, errorThrown) {}

            com.faralam.common.sendAjaxRequest(com.faralam.deleteCatalog, "DELETE", {}, onsuccess, onerror);
        }
    });

}

com.faralam.common.RemoveCatalogGroup = function (groupId) {
    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete the selected group?', function (e) {
        if (e == 'yes') {

            var catalogId = Ext.getCmp('catalogId').getValue();

            com.faralam.deleteCatalogGroup = com.faralam.serverURL + 'retail/deleteGroup';
            com.faralam.deleteCatalogGroup = com.faralam.deleteCatalogGroup + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&catalogId=' + catalogId + '&groupId=' + groupId);

            var onsuccess = function (response, textStatus, jqXHR) {
                Ext.MessageBox.alert('Success', 'The selected group deleted successfully', function () {
                    if (catalogId != '') {
                        com.faralam.common.retrieveCatalog_func(catalogId);
                    }
                    com.faralam.common.retrieveGroups_func();
                });
            }

            var onerror = function (jqXHR, textStatus, errorThrown) {}

            com.faralam.common.sendAjaxRequest(com.faralam.deleteCatalogGroup, "DELETE", {}, onsuccess, onerror);
        }
    });

}

com.faralam.common.addItemAfterItemToGroup = function (itemId) {

    var groupId = Ext.getCmp('groupId').getValue();
    if (groupId != '') {
        com.faralam.addItemAfterItemToGroup = com.faralam.serverURL + 'retail/addItemAfterItemToGroup';
        com.faralam.addItemAfterItemToGroup = com.faralam.addItemAfterItemToGroup + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);


        var data = {
            "groupId": groupId,
            "item": {
                "itemVersion": 1,
                "priceId": 1,
                "itemId": itemId
            },
            "insertAfterItem": {
                "itemVersion": 1,
                "priceId": 1,
                "itemId": 1
            },
            "serviceAccommodatorId": sessionStorage.SA,
            "serviceLocationId": sessionStorage.SL
        };


        data = JSON.stringify(data);

        var onsuccess = function (response, textStatus, jqXHR) {
            Ext.MessageBox.alert('Success', 'Item added to group successfully.', function () {
                com.faralam.common.retrieveGroup_func(groupId);
            });
        }

        var onerror = function (jqXHR, textStatus, errorThrown) {}

        com.faralam.common.sendAjaxRequest(com.faralam.addItemAfterItemToGroup, "PUT", data, onsuccess, onerror);
    } else {
        Ext.MessageBox.alert('Error', 'Please select a group');
    }


}

com.faralam.common.addGroupAfterGroupToCatalog = function (groupId) {

    var catalogId = Ext.getCmp('catalogId').getValue();
    if (catalogId != '') {
        com.faralam.addGroupAfterGroupToCatalog = com.faralam.serverURL + 'retail/addGroupAfterGroupToCatalog';
        com.faralam.addGroupAfterGroupToCatalog = com.faralam.addGroupAfterGroupToCatalog + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);


        var data = {
            "groupId": groupId,
            "insertAfterGroupId": "",
            "catalogId": catalogId,
            "serviceAccommodatorId": sessionStorage.SA,
            "serviceLocationId": sessionStorage.SL
        };


        data = JSON.stringify(data);
        
        var onsuccess = function (response, textStatus, jqXHR) {
            Ext.MessageBox.alert('Success', 'Group added to catalog successfully.', function () {
                com.faralam.common.retrieveCatalog_func(catalogId);
            });
        }

        var onerror = function (jqXHR, textStatus, errorThrown) {}

        com.faralam.common.sendAjaxRequest(com.faralam.addGroupAfterGroupToCatalog, "PUT", data, onsuccess, onerror);
    } else {
        Ext.MessageBox.alert('Error', 'Please select a catalog');
    }


}
/*com.faralam.common.positionChangeCatalogGroup = function (groupId, insertAfterId,catalogId) {
    var catalogId = Ext.getCmp('catalogId').getValue();
    com.faralam.positionChangeCatalogGroup = com.faralam.serverURL + 'retail/positionGroupAfterGroupInCatalog';
    com.faralam.positionChangeCatalogGroup = com.faralam.positionChangeCatalogGroup + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);*/
com.faralam.common.positionGroupByIdAfterId = function (groupId, insertAfterId) {
    var catalogId = Ext.getCmp('catalogId').getValue();
    com.faralam.positionGroupByIdAfterId = com.faralam.serverURL + 'retail/positionGroupByIdAfterId';
    com.faralam.positionGroupByIdAfterId = com.faralam.positionGroupByIdAfterId + "?" + encodeURI('UID=' + sessionStorage.UID);
   console.log("attribute:"+catalogId);
    /*var data = {
        "id": groupId,
        "insertAfterId": insertAfterId,
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL
    };*/
    var data={
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL,
        "catalogId": catalogId,
        "groupId": groupId,
        "insertAfterGroupId": insertAfterId 
    };

    data = JSON.stringify(data);
    console.log(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        com.faralam.common.retrieveCatalog_func(catalogId);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.positionGroupByIdAfterId, "PUT", data, onsuccess, onerror);
}

/*com.faralam.common.positionChangeGroupItem = function (itemId, insertAfterId) {
    var groupId = Ext.getCmp('groupId').getValue();
    com.faralam.positionChangeGroupItem = com.faralam.serverURL + 'retail/positionItemAfterItemInGroup';
    com.faralam.positionChangeGroupItem = com.faralam.positionChangeGroupItem + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);


    var data = {
        "itemId": itemId,
        "insertAfterId": insertAfterId,
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL
    };


    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        com.faralam.common.retrieveGroup_func(groupId);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.positionChangeGroupItem, "PUT", data, onsuccess, onerror);
}*/
com.faralam.common.positionItemByIdAfterId = function (data) {
    var groupId = Ext.getCmp('groupId').getValue();
    com.faralam.positionItemByIdAfterId = com.faralam.serverURL + 'retail/positionItemByIdAfterId';
    com.faralam.positionItemByIdAfterId = com.faralam.positionItemByIdAfterId + "?" + encodeURI('UID=' + sessionStorage.UID);

/*
    var data = {
        "itemId": itemId,
        "insertAfterId": insertAfterId,
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL
    };*/


    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        com.faralam.common.retrieveGroup_func(groupId);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.positionItemByIdAfterId, "PUT", data, onsuccess, onerror);
}

com.faralam.SetCalatogGroupMove = function (e) {
    var groupId = e.getAttribute('groupId');
    //console.log(groupId);
}

com.faralam.SetGroupItemMove = function (e) {
    var itemId = e.getAttribute('itemId');
    //console.log(itemId);
}

com.faralam.drop_catalog = function (ev) {
    ev.preventDefault();
    
    var drag_data = ev.dataTransfer.getData('Text');

    if (ev.target.id == 'delete_zone_catalog') {
        if (drag_data == 'menu_rearrange') {
            var catalogId = ev.dataTransfer.getData('catalogId');
            //console.log(catalogId);
            com.faralam.common.RemoveCatalog(catalogId);
        }
    }
    if (ev.target.id == 'delete_zone_catalogInGroup') {
        if (drag_data == 'groupList_catalog_drag_zone_move_active') {
            var groupId = ev.dataTransfer.getData('groupId');
            //console.log(groupId);
            com.faralam.common.RemoveCatalogGroup(groupId);
        }
    }
    if (ev.target.id == 'catalog_itemGroup_panel_Section') {
        //console.log(drag_data);all_item_rearrange_icon
        //if (drag_data == 'mainItems_catalog_drag_zone_active') {
        if (drag_data == 'all_item_rearrange_icon') {
            var itemId = ev.dataTransfer.getData('itemId');
            //console.log(itemId);
            com.faralam.common.addItemAfterItemToGroup(itemId);
        }
    }
    if (ev.target.id == 'delete_zone_catalogGroupItem_img') {
        //console.log(drag_data);
        //if (drag_data == 'mainItems_catalog_drag_zone_active') {
        if (drag_data == 'all_item_rearrange_icon') {
            
    Ext.MessageBox.confirm('Confirm', 'Do you really want to delete this item?', function (e) {
        if (e == 'yes'){
            var itemId = ev.dataTransfer.getData('itemId');
            var itemVersion = ev.dataTransfer.getData('itemVersion');
            var priceId = ev.dataTransfer.getData('priceId');
            com.faralam.common.retirePriceSASLItem(itemId,itemVersion,priceId);
        }
    })
        }
    }
    if (ev.target.id == 'catalog_Group_panel_Section') {
        //console.log(drag_data);
        /*if (drag_data == 'allGroup_catalog_drag_zone_active')*/
        if (drag_data == 'all_group_move_icon')
        {
            var groupId = ev.dataTransfer.getData('groupId');
            //console.log(groupId);
            com.faralam.common.addGroupAfterGroupToCatalog(groupId);
        }
    }
    if (ev.target.id == 'delete_zone_group') {
        
        /*if (drag_data == 'allGroup_catalog_drag_zone_active')*/ 
        if (drag_data == 'all_group_move_icon')
        {
            var groupId = ev.dataTransfer.getData('groupId');
            //console.log(groupId);
            com.faralam.common.RemoveCatalogGroup(groupId);
        }
    }
    if (ev.target.id == 'groupList_catalog_drag_zone_middlebar_active') {
        //console.log(drag_data);
        if (drag_data == 'groupList_catalog_drag_zone_move_active') {
            var groupId = ev.dataTransfer.getData('groupId');
            console.log("groupid"+groupId);
            var insertAfterId = ev.target.getAttribute('groupId');
            console.log("insertafter"+insertAfterId);
            
            //com.faralam.common.positionChangeCatalogGroup(groupId, insertAfterId,catalogId);
            com.faralam.common.positionGroupByIdAfterId(groupId, insertAfterId);
        }
    }
    if (ev.target.id == 'groupedItemList_catalog_drag_zone_middlebar_active') {
        if (drag_data == 'groupedItemList_catalog_drag_zone_move_active') {
            var itemId = ev.dataTransfer.getData('itemId');
            var insertAfterId = ev.target.getAttribute('itemId');
            var data={
                        "groupId": Ext.getCmp("groupId").getValue(),
                        "item":{
                        "itemVersion": ev.dataTransfer.getData("itemVersion"),
                        "priceId": ev.dataTransfer.getData("priceId"),
                        "itemId": ev.dataTransfer.getData("itemId")
                      },
                      "insertAfterItem": {
                        "itemVersion": ev.target.getAttribute("itemVersion"),
                        "priceId":ev.target.getAttribute("priceId"),
                        "itemId": ev.target.getAttribute("itemId")
                      },
                      "serviceAccommodatorId": sessionStorage.SA,
                      "serviceLocationId": sessionStorage.SL
                    };
                    
            com.faralam.common.positionItemByIdAfterId(data);
        }
    }
    if (ev.target.id == 'delete_zone_catalogGroupItem_img') {
        if (drag_data == 'groupedItemList_catalog_drag_zone_move_active') {
                Ext.MessageBox.confirm('Confirm', 'Are you sure you want to remove the selected item?', function (e) {
        if (e == 'yes') {
            var data={  
                        "serviceAccommodatorId": sessionStorage.SA,
                        "serviceLocationId": sessionStorage.SL,
                        "groupId": Ext.getCmp("groupId").getValue(),
                        "item":{
                        "itemVersion": ev.dataTransfer.getData("itemVersion"),
                        "priceId": ev.dataTransfer.getData("priceId"),
                        "itemId": ev.dataTransfer.getData("itemId")
                      }};
            com.faralam.common.removeItemFromGroup(data);
        } });
    } }
    if (ev.target.id == 'menu_drop_zone') {
        if (drag_data == 'menu_rearrange') {
            var catalogId = ev.dataTransfer.getData('catalogId');
            var insertAfterId = ev.target.getAttribute('catalogId');
            com.faralam.common.positionCatalogByIdAfterId(catalogId, insertAfterId);
        }
    }
    
    
}

com.faralam.allowDrop_catalog = function (ev) {
    console.log("prevent");
    ev.preventDefault();
}

com.faralam.dragStart_catalog = function (ev) {
    if (ev.target.id == 'catalog_drag_zone_active') {
        ev.dataTransfer.setData('Text', ev.target.id);
        ev.dataTransfer.setData('catalogId', ev.target.getAttribute('catalogId'));
        ev.target.className = 'after_dragging';
        com.faralam.fire_count = 0;
    }
    if (ev.target.id == 'groupList_catalog_drag_zone_active') {
        ev.dataTransfer.setData('Text', ev.target.id);
        ev.dataTransfer.setData('groupId', ev.target.getAttribute('groupId'));
        ev.target.className = 'after_dragging';
        com.faralam.fire_count = 0;
    }
    if (ev.target.id == 'groupList_catalog_drag_zone_move_active') {
        ev.dataTransfer.setData('Text', ev.target.id);
        ev.dataTransfer.setData('groupId', ev.target.getAttribute('groupId'));
        ev.target.className = 'after_dragging';
        com.faralam.fire_count = 0;
    }
    if (ev.target.id == 'groupedItemList_catalog_drag_zone_move_active') {
        ev.dataTransfer.setData('Text', ev.target.id);
        ev.dataTransfer.setData('itemId', ev.target.getAttribute('itemId'));
        ev.dataTransfer.setData('itemVersion', ev.target.getAttribute('itemVersion'));
        ev.dataTransfer.setData('priceId', ev.target.getAttribute('priceId'));
        ev.target.className = 'after_dragging';
        com.faralam.fire_count = 0;
    }
    //if (ev.target.id == 'mainItems_catalog_drag_zone_active') 
    if (ev.target.id == 'all_item_rearrange_icon'){
        ev.dataTransfer.setData('Text', ev.target.id);
        ev.dataTransfer.setData('itemId', ev.target.getAttribute('itemId'));
        ev.dataTransfer.setData('itemVersion', ev.target.getAttribute('itemVersion'));
        ev.dataTransfer.setData('priceId', ev.target.getAttribute('priceId'));
        ev.target.className = 'after_dragging';
        com.faralam.fire_count = 0;
    }
    /*if (ev.target.id == 'allGroup_catalog_drag_zone_active')*/
    if (ev.target.id == 'all_group_move_icon')
    {
        ev.dataTransfer.setData('Text', ev.target.id);
        ev.dataTransfer.setData('groupId', ev.target.getAttribute('groupId'));
        ev.target.className = 'after_dragging';
        com.faralam.fire_count = 0;
    }
    if (ev.target.id == 'menu_rearrange') {
        console.log("start"+ev.target.id);
        ev.dataTransfer.setData('Text', ev.target.id);
        ev.dataTransfer.setData('catalogId', ev.target.getAttribute('catalogId'));
        ev.target.className = 'after_dragging';
        com.faralam.fire_count = 0;
    }
   
}

com.faralam.dragEnd_catalog = function (ev) {
    console.log("end");
        ev.target.className = 'before_dragging';
    }
com.faralam.common.removeItemFromGroup = function(data){
    var groupId = Ext.getCmp('groupId').getValue();
    console.log(groupId);
   com.faralam.removeItemFromGroup=com.faralam.serverURL +"retail/removeItemFromGroup?";
   com.faralam.removeItemFromGroup=com.faralam.removeItemFromGroup+encodeURI("UID="+ sessionStorage.UID);
    data = JSON.stringify(data);
     var onsuccess = function (response, textStatus, jqXHR) {
         com.faralam.common.retrieveGroup_func(groupId);
    }
    var onerror = function (jqXHR, textStatus, errorThrown) { 
    }
    
    com.faralam.common.sendAjaxRequest(com.faralam.removeItemFromGroup, "PUT", data, onsuccess, onerror);
    
}
com.faralam.common.positionCatalogByIdAfterId = function(catalogId, insertAfterId){
    com.faralam.positionCatalogByIdAfterId=com.faralam.serverURL +"retail/positionCatalogByIdAfterId?";
    com.faralam.positionCatalogByIdAfterId=com.faralam.positionCatalogByIdAfterId+encodeURI("UID="+ sessionStorage.UID);
    var sa=encodeURI(sessionStorage.SA);
    var sl=encodeURI(sessionStorage.SL);
   var data={
"serviceAccommodatorId":sa, 
"serviceLocationId":sl, 
"catalogId": catalogId, 
"insertAfterCatalogId": insertAfterId 
} ;
    data = JSON.stringify(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        com.faralam.common.retrieveCatalogs_func();
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {
        
    }
    
    com.faralam.common.sendAjaxRequest(com.faralam.positionCatalogByIdAfterId, "PUT", data, onsuccess, onerror);
}
com.faralam.common.retirePriceSASLItem=function(itemId,itemVersion,priceId){
   com.faralam.retirePriceSASLItem = com.faralam.serverURL + 'retail/retirePriceSASLItem';
   com.faralam.retirePriceSASLItem=com.faralam.retirePriceSASLItem+"?" +encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID)+"&itemId="+itemId+"&itemVersion="+itemVersion+"&priceId="+priceId;
    console.log(com.faralam.retirePriceSASLItem);
    var onsuccess = function (response, textStatus, jqXHR) {
        com.faralam.common.RetrieveCatalogInfo('','',1);
        
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retirePriceSASLItem, "DELETE", {}, onsuccess, onerror);
}
    // ############################## Catalog Section End #####################################

// ############################## Online Order Section Start #####################################
var order_fl=0;
com.faralam.common.rearrangr_by_num = function(){
    var arr=[];
        $("#order_sum_tab tr").each(function(index,element){
		var id=$(element).attr('id');
		var tmpid=id.split("_");
	    key=parseInt(tmpid[1]);
		arr[key]='<tr id="'+id+'">'+$(element).html()+'</tr>';
		});
		str="";
if(order_fl==0){
		for(var i=arr.length;i>=0;i--)
		{
		if(arr[i]!='')
		{
		str+=arr[i];
		}
		}
order_fl=1;
}
else if(order_fl==1){
		for(var i=0;i<arr.length;i++)
		{
		if(arr[i]!='')
		{
		str+=arr[i];
		}
		}
order_fl=0;
}
$("#order_sum_tab").html('');
$("#order_sum_tab").html(str);
}

com.faralam.common.updateOrderStatus_new= function (e){
 var  orderUUID=e.getAttribute('orderUUID');
   com.faralam.updateOrderStatus = com.faralam.serverURL + 'retail/updateOrderStatus';
   com.faralam.updateOrderStatus=com.faralam.updateOrderStatus+"?" +encodeURI('UID=' + sessionStorage.UID);
   var d = new Date();
   var data={
"serviceAccommodatorId":sessionStorage.SA,
"serviceLocationId":sessionStorage.SL,
"orderUUID":orderUUID,
"orderStatus":"IN_PROCESS",
"hour":d.getHours(),
"minute":d.getMinutes(),
"day":d.getDate(),
"month":parseInt(d.getMonth()+1),
"year":d.getFullYear()
};
    data=JSON.stringify(data);
    console.log(data);
    var onsuccess = function (response, textStatus, jqXHR) {
     com.faralam.common.retrieveOrders_func('');      
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.updateOrderStatus, "PUT", data, onsuccess, onerror);
 
}

com.faralam.common.retrieveOrders_func = function (sort) {
    var s_type=sort;
if(sort.trim()!='')
    {
     s_type="&sortby="+sort;
    }
    com.faralam.retrieveOrders_func = com.faralam.serverURL + 'retail/retrieveOrdersBySASL';
    com.faralam.retrieveOrders_func = com.faralam.retrieveOrders_func + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID+s_type);

    var onsuccess = function (response, textStatus, jqXHR) {
        var html = '';
        var arr = new Array();
        var edit_img = com.faralam.custom_img_path + 'icon_pencil.png';
        var count = 1;
        var className = 'order_table_row_odd';
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                if (count % 2 == 0) {
                    className = 'order_table_row_even';
                } else {
                    className = 'order_table_row_odd';
                }
                var items = '';
                var price = 0;
                for (var j = 0; j < response[i].items.length; j++) {
                    items += '<li>' + response[i].items[j].item.itemName + '</li>'
                    var sprice = response[i].items[j].item.price;
                    var quantity = response[i].items[j].quantity;
                    var item_price = sprice * quantity;
                    price += parseFloat(item_price);
                }
                price = parseFloat(price);
                price = parseFloat(Math.round(price * 100) / 100).toFixed(2);
                var ack="";
                if(response[i].orderStatus.enumText=="PROPOSED")
                    {
                    ack='<img src="'+com.faralam.custom_img_path+'green_star.png" style="height:22px;width:25px;float:left"><input orderUUID="' + response[i].orderUUID + '" onClick="com.faralam.common.updateOrderStatus_new(this)" type="button" style="padding: 2px 9px; background-color: rgb(52, 89, 160); border: 2px solid black; border-radius: 5px; margin-right: 3px; color: rgb(255, 255, 255); font-weight: 600;cursor:pointer" value="ACK">';
                    }
                
                html += '<tr id="orrw_'+response[i].localId+'"><td width="110px" class="' + className + '">' +ack+ response[i].localId + '</td><td width="90px" class="' + className + '">' + response[i].orderRecordLocator + '</td><td width="90px" class="' + className + '">' + response[i].userName + '</td><td width="198px" class="' + className + '"><div style="float:left;text-align:left;padding-left: 30px;"><ul class="order_table_row_ul">' + items + '</ul></div><div style="float:right;"><img style="cursor:pointer" src="' + edit_img + '" width="25" height="26" onclick="com.faralam.common.ShowOnlineOrderList(this)" order="'+response[i].orderRecordLocator+'" customer="'+response[i].userName+'" localId="' + response[i].localId + '" orderUUID="' + response[i].orderUUID + '"/></div></td><td width="108px" class="' + className + '">$ ' + price + '</td><td width="125px" class="' + className + '"><div style="float:left; padding-left: 10px;">' + response[i].orderStatus.displayText + '</div><div style="float:right;"><img style="cursor:pointer" src="' + edit_img + '" width="25" height="26" onclick="com.faralam.common.EditOrderStatus(this)" orderId="' + response[i].orderId + '" orderUUID="' + response[i].orderUUID + '" orderRecordLocator="' + response[i].orderRecordLocator + '" userName="' + response[i].userName + '" comment="' + response[i].comment + '" /></div></td><td width="134px" class="' + className + '"><div style="float:left; padding-left: 10px;">' + response[i].deliveryStatus.displayText + '</div><div style="float:right;"><img style="cursor:pointer" src="' + edit_img + '" width="25" height="26" onclick="com.faralam.common.EditOrderDeliveryStatus(this)" deliveryContactName="' + response[i].deliveryContactName + '" orderRecordLocator="' + response[i].orderRecordLocator + '" orderId="' + response[i].orderId + '" orderUUID="' + response[i].orderUUID + '"	userName="' + response[i].userName + '" comment="' + response[i].comment + '"  /></div></td><td width="135px" class="' + className + '"><div style="float:left;padding-left:10px;">' + response[i].comment + '</div><div style="float:right;"><img style="cursor:pointer" src="' + edit_img + '" width="25" height="26" onclick="com.faralam.common.EditNote(this)" orderUUID="' + response[i].orderUUID + '" orderRecordLocator="' + response[i].orderRecordLocator + '" comment="' + response[i].comment + '" /></div></td></tr>';
                count++;
            }
        }


        var header = '<table width="900px" height="45px" border="0" bgcolor="#324f85"><tr><td width="110px" align="left" valign="top" class="order_table_header">Number <span class="up-triangle" onClick="com.faralam.common.rearrangr_by_num()"></span></td><td width="110px" align="left" valign="top" class="order_table_header">Order <span class="up-triangle" onClick="com.faralam.common.retrieveOrders_func(\'SORT_BY_ORDER\')"></span></td><td width="100px" align="left" valign="top" class="order_table_header"><i style="font-size:13px;">Customer</i><span class="up-triangle" onClick="com.faralam.common.retrieveOrders_func(\'SORT_BY_USER_NAME\')"></span></td><td width="215px" align="left" valign="top" class="order_table_header">Items</td><td width="108px" align="left" valign="top" class="order_table_header">Due</td><td width="135px" align="left" valign="top" class="order_table_header">Order Status <span class="up-triangle" onClick="com.faralam.common.retrieveOrders_func(\'SORT_BY_ORDER_STATUS\')"></span></td><td width="144px" align="left" valign="top" class="order_table_header">Delivery status <span class="up-triangle" onClick="com.faralam.common.retrieveOrders_func(\'SORT_BY_DELIVERY_STATUS\')"></span></td><td width="135px" align="left" valign="top" class="order_table_header">Notes</td></tr></table>';
        if (html) {
            html = header + '<table id="order_sum_tab" width="900px" style="border: 1px solid white;border-collapse: collapse;height:12px;">' + html + '</table>';
        } else {
            html = '';
        }
        Ext.getCmp('slide_panel_order').update(html);

    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrieveOrders_func, "GET", {}, onsuccess, onerror);
}

com.faralam.common.editRetrieveOrders_func = function (localId) {

    com.faralam.editRetrieveOrders_func = com.faralam.serverURL + 'retail/retrieveOrdersBySASL';
    com.faralam.editRetrieveOrders_func = com.faralam.editRetrieveOrders_func + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (response, textStatus, jqXHR) {
        var html = '';
        var arr = new Array();
        var edit_img = com.faralam.custom_img_path + 'icon_pencil.png';
        var count = 1;
        var className = 'order_table_row_odd';
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].localId == localId) {
                    for (var j = 0; j < response[i].items.length; j++) {
                        if (count % 2 == 0) {
                            className = 'order_table_row_even';
                        } else {
                            className = 'order_table_row_odd';
                        }
                        var price = response[i].items[j].item.price;
                        var quantity = response[i].items[j].quantity;
                        var item_price = price * quantity;
                        var comment = '';
                        if (response[i].items[j].comment != null) {
                            comment = response[i].items[j].comment;
                        }
                        item_price = parseFloat(Math.round(item_price * 100) / 100).toFixed(2);
                        html += '<tr><td width="224px" class="' + className + '">' + response[i].items[j].item.itemName + '</td><td width="112px" class="' + className + '"><div style="float:left; padding-left: 10px;">$ ' + response[i].items[j].item.price + '</div><div style="float:right;"><img src="' + edit_img + '" width="25" height="26" onclick="com.faralam.common.populateOrderItem(this)" itemVersion="' + response[i].items[j].item.itemVersion + '" priceId="' + response[i].items[j].item.priceId + '" itemId="' + response[i].items[j].item.itemId + '" quantity="' + response[i].items[j].quantity + '" orderItemId="' + response[i].items[j].orderItemId + '"  /></div></td><td width="112px" class="' + className + '">' + response[i].items[j].quantity + '</td><td width="224px" class="' + className + '">$ ' + item_price + '</td><td width="224px" class="' + className + '"><div style="float:left; padding-left: 10px;">' + comment + '</div><div style="float:right;"><img src="' + edit_img + '" width="25" height="26"  /></div></td></tr>';
                        count++;
                    }
                }

            }
        }

        var header = '<table width="900px" height="45px" border="0" bgcolor="#994813"><tr><td width="224px" align="left" valign="top" class="order_table_header">Item</td><td width="112px" align="left" valign="top" class="order_table_header">Price</td><td width="112px" align="left" valign="top" class="order_table_header">Qty</td><td width="224px" align="left" valign="top" class="order_table_header">Total</td><td width="224px" align="left" valign="top" class="order_table_header">Comment</td></table>';
        if (html) {
            html = header + '<table width="900px" style="border: 1px solid white;border-collapse: collapse;height:12px;">' + html + '</table>';
        } else {
            html = '';
        }
        Ext.getCmp('edit_slide_panel_order').update(html);
        Ext.getCmp('order_com').update('<p style="color:#fff !important;font-weight:bold;line-height:32px">Order:&nbsp'+sessionStorage.order_order+' </p>');
        Ext.getCmp('customer_com').update('<p style="color:#fff !important;font-weight:bold;line-height:32px">Customer:&nbsp'+sessionStorage.order_customer+' </p>');
        Ext.getCmp('count_com').update('<p style="color:#fff !important;font-weight:bold;line-height:32px">Item Count:&nbsp'+parseInt(count-1)+' </p>');
        

    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.editRetrieveOrders_func, "GET", {}, onsuccess, onerror);
}

com.faralam.common.populateOrderItem = function (e) {
    var itemVersion = e.getAttribute('itemVersion');
    var priceId = e.getAttribute('priceId');
    var itemId = e.getAttribute('itemId');
    var quantity = e.getAttribute('quantity');
    var orderItemId = e.getAttribute('orderItemId');
    /*console.log(itemVersion);
     console.log(priceId);
     console.log(itemId);
     console.log(quantity);
     console.log(orderItemId);*/
    com.faralam.common.itemPopupSec('UpdateItem', itemVersion, priceId, itemId, quantity, orderItemId);
}

com.faralam.common.ShowOnlineOrderList = function (e) {
    sessionStorage.orderItem = e.getAttribute('localId');
    sessionStorage.orderUUID = e.getAttribute('orderUUID');
    sessionStorage.order_order = e.getAttribute('order');
    sessionStorage.order_customer = e.getAttribute('customer');
    Ext.getCmp('main_tab').down('#OnlineOrder').setDisabled(true);
    Ext.getCmp('main_tab').down('#EditOnlineOrder').setDisabled(false);
    Ext.getCmp('main_tab').setActiveTab(24);
    com.faralam.common.editRetrieveOrders_func(sessionStorage.orderItem);
}

com.faralam.getSliderPicURLs = function (step, itemId) {

    com.faralam.retrieve_item_info = com.faralam.serverURL + 'retail/retrieveItems';
    com.faralam.retrieve_item_info = com.faralam.retrieve_item_info + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&status=ALL');

    var onsuccess = function (response, textStatus, jqXHR) {
        //console.log(response);
        var slider = '';
        var slider_head = '';
        var html = '';
        var slider_tail = '';
        var position = 0;
        if (response.items.length > 0) {
            slider_head = '<div id="slider' + step + '"><a class="buttons next" href="#"></a><a class="buttons prev" href="#"></a><div class="viewport"><ul class="overview" id="overview_slider">';
            for (var j = 0; j < response.items.length; j++) {
                if (response.items[j].itemId == itemId) {
                    position = j - 1;
                    //console.log(position);
                }
                var itemOrder = j + 1;
                html += '<li id="item-' + itemOrder + '" itemName="' + response.items[j].itemName + '" price="' + response.items[j].price + '" itemVersion="' + response.items[j].itemVersion + '" priceId="' + response.items[j].priceId + '" itemId="' + response.items[j].itemId + '"><img src="' + response.items[j].mediaURLs[0] + '" width="170" height="87" /><div style="width:170px;"><span class="item_name">' + response.items[j].itemName + '</span><span class="item_price">$ ' + response.items[j].price + '</span></div></li>';
            }
            slider_tail = '</ul></div></div>';
        }

        slider = slider_head + html + slider_tail;

        Ext.getCmp('pic_panel' + step).update(slider);
        if (step == 'CreateItem') {
            $("#sliderCreateItem").tinycarousel({
                axis: "y"
            });
        } else if (step == 'AddItem') {
            $("#sliderAddItem").tinycarousel({
                axis: "y"
            });
        } else if (step == 'UpdateItem') {
            $("#sliderUpdateItem").tinycarousel({
                start: position,
                axis: "y"
            });
        }

        //document.getElementById("overview_slider").style.top = '-127px';


    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrieve_item_info, "GET", {}, onsuccess, onerror);
}

com.faralam.common.SubmitUserOrder = function () {
    com.faralam.SubmitUserOrder = com.faralam.serverURL + 'retail/createUserOrder';
    com.faralam.SubmitUserOrder = com.faralam.SubmitUserOrder + "?" + encodeURI('UID=' + sessionStorage.UID );
    var items='';
    $("#order_item_table tr").each(function(index,element){
        var pid=$(element).attr('priceid');
        var iid=$(element).attr('itemid');
        var iv=$(element).attr('itemversion');
        var qn=$(element).attr('quantity');
        items += '{'
       +'"serviceAccommodatorId" : "'+sessionStorage.SA+'",'
       +'"serviceLocationId"  : "'+sessionStorage.SL+'",'
       +'"priceId" : '+pid+','
       +'"itemId" : '+iid+','
       +'"itemVersion" :'+iv+','
       +'"quantity" :'+qn+''
       +'},';
    });
    items = items.substring(0, items.length - 1);
    var its='[' + items +']';
    var itjs=JSON.parse(its);
    
    var data={ 
    "serviceAccommodatorId": sessionStorage.SA,
    "serviceLocationId":sessionStorage.SL,
    "userName":'',
    "deliveryContactName":Ext.getCmp('custName').getValue(),
    "deliveryPhone":Ext.getCmp('custTelephone').getValue(),
    "deliveryEmail":Ext.getCmp('custEmail').getValue(),
    "adhoc":Ext.getCmp('adhoc_enable').getValue(),
    "firstName":Ext.getCmp('custName').getValue(),
    "serviceAccommodatorId":sessionStorage.SA,
    "serviceLocationId":sessionStorage.SL,
    "deliveryAddress":{
       "street":"",
       "city":  "",
       "state": "",
       "zip"  : ""
     },
     "items":itjs
};
    data = JSON.stringify(data);
    console.log(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Order added successfully.', function () {
             Ext.getCmp('CreateOrderForm').getForm().reset(true);
             $("#order_item_table").html();

        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.SubmitUserOrder, "POST", data, onsuccess, onerror);
}

com.faralam.common.EditNote = function (e) {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var editNote_modal;

    if (Ext.getCmp('editNote_modal')) {
        var modal = Ext.getCmp('editNote_modal');
        modal.destroy(modal, new Object());
    }
    if (!editNote_modal) {
        var editNote_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'blue_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:680px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'order_UUID',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'displayfield',
                                            id: 'order_no',
                                            value: '',
                                            width: 300

                                        },
                                        {
                                            xtype: 'container',
                                            defaultType: 'button',
                                            width: 160,
                                            style: 'text-align:center;',
                                            margin: '0 0 0 70',
                                            items: [
                                                {
                                                    text: '<span style="color:#fff !important;">Submit</span>',
                                                    style: 'background:#007AFF !important;border:2px solid #000 !important;',
                                                    margin: '0 0 0 10',
                                                    handler: function () {
                                                        if (editNote_modal_form.getForm().isValid()) {
                                                            com.faralam.common.updateOrderComment();
                                                        }
                                                    }
                                                }]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'textareafield',
                                    fieldLabel: 'Notes',
                                    labelSeparator: '',
                                    emptyText: '',
                                    inputWidth: 400,
                                    height: 150,
                                    margin: '20 0 0 0',
                                    name: '',
                                    value: '',
                                    id: 'note_description',
                                    allowBlank: false
                                }

                            ]
                        }]
                }
            ]
        });

        editNote_modal = Ext.widget('window', {
            title: 'Edit Note',
            id: 'editNote_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 540,
            cls: 'blue_modal',
            //height:410,
            items: editNote_modal_form,
            listeners: {
                close: function () {
                    editNote_modal_form.getForm().reset(true);
                },
                show: function () {
                    if (e != '') {
                        Ext.getCmp('order_UUID').setValue(e.getAttribute('orderUUID'));
                        Ext.getCmp('order_no').setValue('Order - ' + e.getAttribute('orderRecordLocator'));
                        Ext.getCmp('note_description').setValue(e.getAttribute('comment'));
                    }
                }

            }
        });
    }
    editNote_modal.show();


}

com.faralam.common.updateOrderComment = function () {
    com.faralam.updateOrderComment = com.faralam.serverURL + 'retail/updateOrderComment';
    com.faralam.updateOrderComment = com.faralam.updateOrderComment + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);


    var data = {
        "orderUUID": Ext.getCmp('order_UUID').getValue(),
        "comment": Ext.getCmp('note_description').getValue()
    };


    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Notes updated successfully.', function () {
            Ext.getCmp('editNote_modal').close();
            com.faralam.common.retrieveOrders_func('');
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.updateOrderComment, "PUT", data, onsuccess, onerror);
}

com.faralam.common.EditOrderDeliveryStatus = function (e) {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var editOrderDeliveryStatus_modal;

    if (Ext.getCmp('editOrderDeliveryStatus_modal')) {
        var modal = Ext.getCmp('editOrderDeliveryStatus_modal');
        modal.destroy(modal, new Object());
    }
    if (!editOrderDeliveryStatus_modal) {
        var editOrderDeliveryStatus_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'blue_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:680px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'deliveryStatus_order_UUID',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'deliveryStatus_day',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'deliveryStatus_month',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'deliveryStatus_year',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'deliveryStatus_deliveryContactName',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'deliveryStatus_orderId',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'displayfield',
                                            id: 'delivery_order_no',
                                            value: '',
                                            margin: '0 5 0 5',
                                            width: 130

                                        },
                                        {
                                            xtype: 'displayfield',
                                            id: 'delivery_userName',
                                            value: '',
                                            margin: '0 5 0 5',
                                            width: 130

                                        },
                                        {
                                            xtype: 'container',
                                            defaultType: 'button',
                                            width: 160,
                                            style: 'text-align:center;',
                                            margin: '0 0 0 70',
                                            items: [
                                                {
                                                    text: '<span style="color:#fff !important;">Submit</span>',
                                                    style: 'background:#007AFF !important;border:2px solid #000 !important;',
                                                    margin: '0 0 0 10',
                                                    handler: function () {
                                                        com.faralam.common.updateOrderDeliveryStatus();
                                                        
                                                    }
                                                }]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: 'Status',
                                    labelSeparator: '',
                                    name: 'deliveryStatus',
                                    emptyText: '',
                                    id: 'deliveryStatus',
                                    queryMode: 'local',
                                    displayField: 'value',
                                    valueField: 'value1',
                                    autoSelect: true,
                                    forceSelection: false,
                                    width: 485,
                                    margin: '20 0 0 0',
                                    editable: false,
                                    store: Ext.create('Ext.data.ArrayStore', {
                                        fields: ['id', 'value', 'value1'],
                                        autoLoad: false,
                                        proxy: {
                                            type: 'ajax',
                                            url: '',
                                            reader: {
                                                type: 'json',
                                                getData: function (data) {
                                                    //console.log(data);
                                                    var temparray = [];
                                                    var count = 0;
                                                    Ext.each(data, function (rec) {
                                                        temparray.push([]);
                                                        temparray[count].push(new Array(1));
                                                        temparray[count]['id'] = rec.enumText;
                                                        temparray[count]['value'] = rec.displayText;
                                                        temparray[count]['value1'] = rec.enumText;
                                                        count = count + 1;
                                                    });
                                                    data = temparray;
                                                    return data;
                                                }
                                            },
                                            listeners: {
                                                exception: function (proxy, response, operation) {
                                                    com.faralam.common.ErrorHandling(response.responseText);
                                                }
                                            }
                                        }
                                    })
                                },
                                {
                                    xtype: 'timefield',
                                    fieldLabel: 'Est. Time',
                                    labelSeparator: '',
                                    emptyText: '',
                                    inputWidth: 400,
                                    margin: '20 0 0 0',
                                    format: 'H:i',
                                    minValue: '00:05',
                                    maxValue: '23:55',
                                    increment: 5,
                                    name: '',
                                    value: '',
                                    id: 'orderDeliveryStatus_time',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '20 0 0 0',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            value: '<span style="float:left;color:#fff;width: 80px;margin-right: 5px;">Contact</span>'
                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'vbox',
                                            items: [
                                                {
                                                    xtype: 'displayfield',
                                                    value: '<span style="float:left;color:#fff;">Telephone</span>'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    id: 'custTelephoneEdit',
                                                    fieldLabel: '',
                                                    name: 'custTelephoneEdit',
                                                    allowBlank: false,
                                                    emptyText: 'Telephone',
                                                    msgTarget: 'none',
                                                    margin: '3 0 0 0',
                                                    labelWidth: 1,
                                                    inputWidth: 200,
                                                    labelSeparator: '  ',
                                                    style: ' border-radius: 3px !important;padding: 5px !important;'
                                                }
                                            ]

                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'vbox',
                                            margin: '0 0 0 5',
                                            items: [
                                                {
                                                    xtype: 'displayfield',
                                                    value: '<span style="float:left;color:#fff;">Email</span>'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    id: 'custEmailEdit',
                                                    fieldLabel: '',
                                                    name: 'custEmailEdit',
                                                    allowBlank: false,
                                                    emptyText: 'Email',
                                                    msgTarget: 'none',
                                                    margin: '3 0 0 0',
                                                    labelWidth: 1,
                                                    inputWidth: 200,
                                                    labelSeparator: '  ',
                                                    style: ' border-radius: 3px !important;padding: 5px !important;',
                                                    vtype: 'email',
                                                    vtypeText: 'Email format is not valid',
                                                    listeners: {
                                                        'errorchange': function (e, error, eOpts) {
                                                            var errUI = Ext.getCmp('custEmailEdit_err');
                                                            errUI.setValue('');
                                                            if (error) {
                                                                if (e.getValue().length > 0) {
                                                                    errUI.setValue('<span style="color:#CF4C35;">Enter valid email</span>');
                                                                } else {
                                                                    errUI.setValue('<span style="color:#CF4C35;">' + error + '</span>');
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype: 'displayfield',
                                                    name: 'custEmailEdit_err',
                                                    id: 'custEmailEdit_err',
                                                    fieldLabel: '&nbsp;',
                                                    margin: '3 0 0 0',
                                                    value: '',
                                                    labelSeparator: ''
                                                }
                                            ]

                                        }
                                    ]

                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Notes',
                                    labelSeparator: '',
                                    emptyText: '',
                                    inputWidth: 400,
                                    margin: '20 0 0 0',
                                    name: '',
                                    value: '',
                                    id: 'orderDeliveryStatus_note_description',
                                    allowBlank: true
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '20 0 0 0',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            value: '<span style="float:left;color:#fff;width: 80px;margin-right: 5px;">Address</span>'
                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'vbox',
                                            items: [
                                                {
                                                    xtype: 'displayfield',
                                                    value: '<span style="float:left;color:#fff;">Street</span>'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    id: 'custStreetEdit',
                                                    fieldLabel: '',
                                                    name: 'custStreetEdit',
                                                    allowBlank: false,
                                                    emptyText: 'Street',
                                                    msgTarget: 'none',
                                                    margin: '3 0 0 0',
                                                    labelWidth: 1,
                                                    inputWidth: 130,
                                                    labelSeparator: '  ',
                                                    style: ' border-radius: 3px !important;padding: 5px !important;'
                                                }
                                            ]

                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'vbox',
                                            margin: '0 0 0 5',
                                            items: [
                                                {
                                                    xtype: 'displayfield',
                                                    value: '<span style="float:left;color:#fff;">ZIP</span>'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    id: 'custZIPEdit',
                                                    fieldLabel: '',
                                                    name: 'custZIPEdit',
                                                    allowBlank: false,
                                                    emptyText: 'ZIP',
                                                    msgTarget: 'none',
                                                    margin: '3 0 0 0',
                                                    labelWidth: 1,
                                                    inputWidth: 130,
                                                    labelSeparator: '  ',
                                                    style: ' border-radius: 3px !important;padding: 5px !important;'
                                                }
                                            ]

                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'vbox',
                                            margin: '0 0 0 5',
                                            items: [
                                                {
                                                    xtype: 'displayfield',
                                                    value: '<span style="float:left;color:#fff;">State</span>'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    id: 'custStateEdit',
                                                    fieldLabel: '',
                                                    name: 'custStateEdit',
                                                    allowBlank: false,
                                                    emptyText: 'State',
                                                    msgTarget: 'none',
                                                    margin: '3 0 0 0',
                                                    labelWidth: 1,
                                                    inputWidth: 130,
                                                    labelSeparator: '  ',
                                                    style: ' border-radius: 3px !important;padding: 5px !important;'
                                                }
                                            ]

                                        }
                                    ]

                                }

                            ]
                        }]
                }
            ]
        });

        editOrderDeliveryStatus_modal = Ext.widget('window', {
            title: 'Update Delivery Status',
            id: 'editOrderDeliveryStatus_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 540,
            cls: 'blue_modal',
            //height:410,
            items: editOrderDeliveryStatus_modal_form,
            listeners: {
                close: function () {
                    editOrderDeliveryStatus_modal_form.getForm().reset(true);
                },
                show: function () {
                    if (e != '') {
                        Ext.getCmp('deliveryStatus_order_UUID').setValue(e.getAttribute('orderUUID'));
                        Ext.getCmp('deliveryStatus_orderId').setValue(e.getAttribute('orderId'));
                        Ext.getCmp('deliveryStatus_deliveryContactName').setValue(e.getAttribute('deliveryContactName'));
                        Ext.getCmp('delivery_order_no').setValue('Order: ' + e.getAttribute('orderRecordLocator'));
                        Ext.getCmp('delivery_userName').setValue('Customer: ' + e.getAttribute('userName'));
                        Ext.getCmp('orderDeliveryStatus_note_description').setValue(e.getAttribute('comment'));
                        Ext.getCmp('deliveryStatus').getStore().removeAll();
                        Ext.getCmp('deliveryStatus').getStore().proxy.url = com.faralam.serverURL + 'retail/getOrderDeliveryStatusOptions?&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL;
                        Ext.getCmp('deliveryStatus').getStore().reload();

                        com.faralam.common.retrieveOrderDeliveryStatus(e.getAttribute('orderUUID'));
                    }
                }

            }
        });
    }
    editOrderDeliveryStatus_modal.show();


}

com.faralam.common.updateOrderDeliveryStatus = function () {
    com.faralam.updateOrderDeliveryStatus = com.faralam.serverURL + 'retail/updateOrderDeliveryStatus';
    com.faralam.updateOrderDeliveryStatus = com.faralam.updateOrderDeliveryStatus + "?" + encodeURI('UID=' + sessionStorage.UID);

    var field = Ext.getCmp('orderDeliveryStatus_time');
    var value = field.getValue();
    //console.log(value);
    //console.log(field.getSubmitValue());

    var formattedValue = Ext.Date.format(value, 'H:i');
    //console.log(formattedValue);

    var n = formattedValue.split(':');
    //console.log(n);
    //console.log('hour :' + n[0]);
    //console.log('min :' + n[1]);

    var data = {
        "deliveryMonth": Ext.getCmp('deliveryStatus_month').getValue(),
        "deliveryYear": Ext.getCmp('deliveryStatus_year').getValue(),
        "deliveryContactName": Ext.getCmp('deliveryStatus_deliveryContactName').getValue(),
        "orderUUID": Ext.getCmp('deliveryStatus_order_UUID').getValue(),
        "deliveryHour": parseInt(n[0]),
        "deliveryDay": Ext.getCmp('deliveryStatus_day').getValue(),
        "deliveryPhone": Ext.getCmp('custTelephoneEdit').getValue(),
        "deliveryEmail": Ext.getCmp('custEmailEdit').getValue(),
        "comment": Ext.getCmp('orderDeliveryStatus_note_description').getValue(),
        "deliveryMinute": parseInt(n[1]),
        "deliveryStatus": Ext.getCmp('deliveryStatus').getValue(),
        "deliveryAddress": {
            "street2": "",
            "zip": Ext.getCmp('custZIPEdit').getValue(),
            "postalCode": "",
            "county": "",
            "street": Ext.getCmp('custStreetEdit').getValue(),
            "state": Ext.getCmp('custStateEdit').getValue(),
            "province": "",
            "timeZone": "",
            "number": "",
            "country": "",
            "city": ""
        },
        "orderId": Ext.getCmp('deliveryStatus_orderId').getValue()
    };

    data = JSON.stringify(data);
    //console.log(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Order delivery status updated successfully.', function () {
            Ext.getCmp('editOrderDeliveryStatus_modal').close();
            com.faralam.common.retrieveOrders_func('');
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.updateOrderDeliveryStatus, "PUT", data, onsuccess, onerror);
}

com.faralam.common.retrieveOrderDeliveryStatus = function (orderUUID) {
    com.faralam.retrieveOrderDeliveryStatus = com.faralam.serverURL + 'retail/retrieveOrderDeliveryStatus';
    com.faralam.retrieveOrderDeliveryStatus = com.faralam.retrieveOrderDeliveryStatus + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&orderUUID=' + orderUUID);

    var onsuccess = function (data, textStatus, jqXHR) {
        //console.log(data);
        if (data) {
            Ext.getCmp('deliveryStatus').setValue(data.deliveryStatus.enumText);
            Ext.getCmp('orderDeliveryStatus_time').setValue(data.deliveryHour + ':' + data.deliveryMinute);
            Ext.getCmp('deliveryStatus_day').setValue(data.deliveryDay);
            Ext.getCmp('deliveryStatus_month').setValue(data.deliveryMonth);
            Ext.getCmp('deliveryStatus_year').setValue(data.deliveryYear);

            Ext.getCmp('custTelephoneEdit').setValue(data.deliveryPhone);
            Ext.getCmp('custEmailEdit').setValue(data.deliveryEmail);
            Ext.getCmp('custStreetEdit').setValue(data.deliveryAddress.street);
            Ext.getCmp('custZIPEdit').setValue(data.deliveryAddress.zip);
            Ext.getCmp('custStateEdit').setValue(data.deliveryAddress.state);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieveOrderDeliveryStatus, "GET", {}, onsuccess, onerror);
}

com.faralam.common.EditOrderStatus = function (e) {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var editOrderStatus_modal;

    if (Ext.getCmp('editOrderStatus_modal')) {
        var modal = Ext.getCmp('editOrderStatus_modal');
        modal.destroy(modal, new Object());
    }
    if (!editOrderStatus_modal) {
        var editOrderStatus_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'blue_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:680px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'orderStatus_order_UUID',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'orderStatus_day',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'orderStatus_month',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'orderStatus_year',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'displayfield',
                                            id: 'orderStatus_order_no',
                                            value: '',
                                            margin: '0 5 0 5',
                                            width: 120

                                        },
                                        {
                                            xtype: 'displayfield',
                                            id: 'orderStatus_userName',
                                            value: '',
                                            margin: '0 5 0 5',
                                            width: 120

                                        },
                                        {
                                            xtype: 'container',
                                            defaultType: 'button',
                                            width: 160,
                                            style: 'text-align:center;',
                                            margin: '0 0 0 70',
                                            items: [
                                                {
                                                    text: '<span style="color:#fff !important;">Submit</span>',
                                                    style: 'background:#007AFF !important;border:2px solid #000 !important;',
                                                    margin: '0 0 0 10',
                                                    handler: function () {
                                                        if (editOrderStatus_modal_form.getForm().isValid()) {
                                                            com.faralam.common.updateOrderStatus();
                                                        }
                                                    }
                                                }]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: 'Status',
                                    labelSeparator: '',
                                    name: 'orderStatus',
                                    emptyText: '',
                                    id: 'orderStatus',
                                    queryMode: 'local',
                                    displayField: 'value',
                                    valueField: 'value1',
                                    autoSelect: true,
                                    forceSelection: false,
                                    width: 485,
                                    margin: '20 0 0 0',
                                    editable: false,
                                    store: Ext.create('Ext.data.ArrayStore', {
                                        fields: ['id', 'value', 'value1'],
                                        autoLoad: false,
                                        proxy: {
                                            type: 'ajax',
                                            url: '',
                                            reader: {
                                                type: 'json',
                                                getData: function (data) {
                                                    //console.log(data);
                                                    var temparray = [];
                                                    var count = 0;
                                                    Ext.each(data, function (rec) {
                                                        temparray.push([]);
                                                        temparray[count].push(new Array(1));
                                                        temparray[count]['id'] = rec.enumText + ',' + rec.color + ',' + rec.id;
                                                        temparray[count]['value'] = rec.displayText;
                                                        temparray[count]['value1'] = rec.enumText;
                                                        count = count + 1;
                                                    });
                                                    data = temparray;
                                                    return data;
                                                }
                                            },
                                            listeners: {
                                                exception: function (proxy, response, operation) {
                                                    com.faralam.common.ErrorHandling(response.responseText);
                                                }
                                            }
                                        }
                                    })
                                },
                                {
                                    xtype: 'timefield',
                                    fieldLabel: 'Est. Time',
                                    labelSeparator: '',
                                    emptyText: '',
                                    inputWidth: 400,
                                    margin: '20 0 0 0',
                                    format: 'H:i',
                                    minValue: '00:05',
                                    maxValue: '23:55',
                                    increment: 5,
                                    name: '',
                                    value: '',
                                    id: 'orderStatus_time',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Notes',
                                    labelSeparator: '',
                                    emptyText: '',
                                    inputWidth: 400,
                                    margin: '20 0 0 0',
                                    name: '',
                                    value: '',
                                    id: 'orderStatus_note_description',
                                    allowBlank: false
                                }

                            ]
                        }]
                }
            ]
        });

        editOrderStatus_modal = Ext.widget('window', {
            title: 'Update Order Status',
            id: 'editOrderStatus_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 540,
            cls: 'blue_modal',
            //height:410,
            items: editOrderStatus_modal_form,
            listeners: {
                close: function () {
                    editOrderStatus_modal_form.getForm().reset(true);
                },
                show: function () {
                    if (e != '') {
                        Ext.getCmp('orderStatus_order_UUID').setValue(e.getAttribute('orderUUID'));
                        Ext.getCmp('orderStatus_order_no').setValue('Order: ' + e.getAttribute('orderRecordLocator'));
                        Ext.getCmp('orderStatus_userName').setValue('Customer: ' + e.getAttribute('userName'));
                        Ext.getCmp('orderStatus_note_description').setValue(e.getAttribute('comment'));
                        Ext.getCmp('orderStatus').getStore().removeAll();
                        Ext.getCmp('orderStatus').getStore().proxy.url = com.faralam.serverURL + 'retail/getOrderStatusOptions?&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL;
                        Ext.getCmp('orderStatus').getStore().reload();

                        com.faralam.common.retrieveOrderStatus(e.getAttribute('orderUUID'));
                    }
                }

            }
        });
    }
    editOrderStatus_modal.show();


}

com.faralam.common.updateOrderStatus = function () {
    com.faralam.updateOrderStatus = com.faralam.serverURL + 'retail/updateOrderStatus';
    com.faralam.updateOrderStatus = com.faralam.updateOrderStatus + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var field = Ext.getCmp('orderStatus_time');
    var value = field.getValue();
    //console.log(value);
    //console.log(field.getSubmitValue());

    var formattedValue = Ext.Date.format(value, 'H:i');
    //console.log(formattedValue);

    var n = formattedValue.split(':');
    //console.log(n);
    //console.log('hour :' + n[0]);
    //console.log('min :' + n[1]);

    var data = {
        "minute": parseInt(n[1]),
        "orderUUID": Ext.getCmp('orderStatus_order_UUID').getValue(),
        "month": Ext.getCmp('orderStatus_month').getValue(),
        "year": Ext.getCmp('orderStatus_year').getValue(),
        "day": Ext.getCmp('orderStatus_day').getValue(),
        "hour": parseInt(n[0]),
        "notes": Ext.getCmp('orderStatus_note_description').getValue(),
        "orderStatus": Ext.getCmp('orderStatus').getValue(),
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL
    };


    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Order status updated successfully.', function () {
            Ext.getCmp('editOrderStatus_modal').close();
            com.faralam.common.retrieveOrders_func('');
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.updateOrderStatus, "PUT", data, onsuccess, onerror);
}

com.faralam.common.retrieveOrderStatus = function (orderUUID) {
    com.faralam.retrieveOrderStatus = com.faralam.serverURL + 'retail/retrieveOrderStatus';
    com.faralam.retrieveOrderStatus = com.faralam.retrieveOrderStatus + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&orderUUID=' + orderUUID);

    var onsuccess = function (data, textStatus, jqXHR) {
        //console.log(data);
        if (data) {
            Ext.getCmp('orderStatus').setValue(data.orderStatus.enumText);
            Ext.getCmp('orderStatus_time').setValue(data.hour + ':' + data.minute);
            Ext.getCmp('orderStatus_day').setValue(data.day);
            Ext.getCmp('orderStatus_month').setValue(data.month);
            Ext.getCmp('orderStatus_year').setValue(data.year);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieveOrderStatus, "GET", {}, onsuccess, onerror);
}

com.faralam.common.itemPopupSec = function (step, itemVersion, priceId, itemId, quantity, orderItemId) {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var itemPopupSec_modal;
    var itemQuantityBox;
    var itemQuantityButtonText;
    if (step == 'UpdateItem') {
        itemQuantityBox = 'orderItemCount2';
        itemQuantityButtonText = 'Update';
    } else if (step == 'AddItem') {
        itemQuantityBox = 'orderItemCount';
        itemQuantityButtonText = 'Add';
    }


    if (Ext.getCmp('itemPopupSec_modal')) {
        var modal = Ext.getCmp('itemPopupSec_modal');
        modal.destroy(modal, new Object());
    }
    if (!itemPopupSec_modal) {
        var itemPopupSec_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'white_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:540px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'form',
                                    layout: 'vbox',
                                    items: [
                                        {
                                            xtype: 'container',
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'panel',
                                                    style: 'max-width:256px !important;',
                                                    id: 'pic_panel' + step,
                                                    html: ''
                                                }
                                            ]
                                        }

                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'vbox',
                                    id: 'addItemRightContainer',
                                    style: 'width:300px;padding-left:20px;padding-bottom: 40px;margin-top:127px;',
                                    items: [
                                        {
                                            xtype: 'button',
                                            scale: 'small',
                                            cls: 'add_catalog_button',
                                            height: 26,
                                            width: 26,
                                            style: 'margin-top:20px;',
                                            handler: function () {
                                                var orderItem = Ext.getCmp('' + itemQuantityBox + '').getValue();
                                                Ext.getCmp('' + itemQuantityBox + '').setValue(orderItem + 1);
                                            }
                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'hbox',
                                            margin: '10 0 0 0',
                                            items: [
                                                {
                                                    xtype: 'numberfield',
                                                    id: itemQuantityBox,
                                                    fieldLabel: '',
                                                    name: 'orderItemCount',
                                                    allowBlank: false,
                                                    msgTarget: 'none',
                                                    labelWidth: 1,
                                                    inputWidth: 30,
                                                    labelSeparator: '  ',
                                                    hideTrigger: true,
                                                    minValue: 1,
                                                    value: 1,
                                                    readOnly: true,
                                                    style: ' background:#fff !important;border:none !important;box-shadow:none !important;color:#000 !important;'
                                                },
                                                {
                                                    xtype: 'button',
                                                    scale: 'large',
                                                    text: '<span style="color:#fff !important;">' + itemQuantityButtonText + '</span>',
                                                    style: ' border-radius: 5px !important;cursor:pointer;background:#007AFF !important;border:2px solid #000 !important;box-shadow:none !important;color:#006FC0;padding:0 5px;',
                                                    height: 26,
                                                    width: 110,
                                                    margin: '0 0 0 40',
                                                    handler: function () {
                                                        var selected_item = parseInt($(".overview")[0].style.top, 10);
                                                        //console.log(selected_item);
                                                        selected_item = Math.abs(selected_item);
                                                        selected_item = Math.round(selected_item);
                                                        var i = (selected_item / 127) + 2;

                                                        //console.log($("#overview_slider li:nth-child("+i+")"));

                                                        var itemName = $("#overview_slider li:nth-child(" + i + ")")[0].attributes[1].nodeValue;
                                                        var price = $("#overview_slider li:nth-child(" + i + ")")[0].attributes[2].nodeValue;
                                                        var itemVersion = $("#overview_slider li:nth-child(" + i + ")")[0].attributes[3].nodeValue;
                                                        var priceId = $("#overview_slider li:nth-child(" + i + ")")[0].attributes[4].nodeValue;
                                                        var itemId = $("#overview_slider li:nth-child(" + i + ")")[0].attributes[5].nodeValue;
                                                        /*console.log(itemName);
                                                         console.log(price);
                                                         console.log(itemVersion);
                                                         console.log(priceId);
                                                         console.log(itemId);*/
                                                        Ext.getCmp('item_add_itemVersion').setValue(itemVersion);
                                                        Ext.getCmp('item_add_priceId').setValue(priceId);
                                                        Ext.getCmp('item_add_itemId').setValue(itemId);
                                                        Ext.getCmp('item_add_orderItemId').setValue(orderItemId);
                                                        var orderItem = Ext.getCmp('' + itemQuantityBox + '').getValue();
                                                        if (itemPopupSec_modal_form.getForm().isValid()) {
                                                            if (step == 'UpdateItem') {
                                                                com.faralam.common.updateItemQuantityInOrder();
                                                            } else if (step == 'AddItem') {
                                                                com.faralam.common.addItemToOrder();
                                                            }
                                                        }

                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'item_add_itemVersion',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'item_add_priceId',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'item_add_itemId',
                                            value: ''
                                        },
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'item_add_orderItemId',
                                            value: ''
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'small',
                                            margin: '10 0 0 0',
                                            cls: 'delete_catalog_button',
                                            height: 26,
                                            width: 26,
                                            handler: function () {
                                                var orderItem = Ext.getCmp('' + itemQuantityBox + '').getValue();
                                                if (orderItem > 1) {
                                                    Ext.getCmp('' + itemQuantityBox + '').setValue(orderItem - 1);
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            style: '  background: #fff;width: 90px;top: -6px !important;',
                                            value: '<span style="position:absolute !important;  padding: 0 20px;float:right;right:0;color:#000;font-style: italic;font-weight: bold;font-size:12px;">Quantity</span>'
                                        },
                                        {
                                            xtype: 'displayfield',
                                            value: '<span style="float:right;right:0;color:#000;font-size:12px;">Items will be removed from order</span>'
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'large',
                                            text: '<span style="color:#fff !important;">Delete</span>',
                                            style: ' border-radius: 5px !important;cursor:pointer;background:#FF0000 !important;border:2px solid #000 !important;box-shadow:none !important;color:#006FC0;padding:0 5px;',
                                            height: 26,
                                            width: 110,
                                            margin: '0 0 0 40',
                                            handler: function () {
                                                var selected_item = parseInt($(".overview")[0].style.top, 10);
                                                selected_item = Math.abs(selected_item);
                                                selected_item = Math.round(selected_item);
                                                var i = (selected_item / 127) + 2;
                                                var itemName = $("#overview_slider li:nth-child(" + i + ")")[0].attributes[1].nodeValue;
                                                var price = $("#overview_slider li:nth-child(" + i + ")")[0].attributes[2].nodeValue;
                                                var itemVersion = $("#overview_slider li:nth-child(" + i + ")")[0].attributes[3].nodeValue;
                                                var priceId = $("#overview_slider li:nth-child(" + i + ")")[0].attributes[4].nodeValue;
                                                var itemId = $("#overview_slider li:nth-child(" + i + ")")[0].attributes[5].nodeValue;
                                                Ext.getCmp('item_add_itemVersion').setValue(itemVersion);
                                                Ext.getCmp('item_add_priceId').setValue(priceId);
                                                Ext.getCmp('item_add_itemId').setValue(itemId);
                                                Ext.getCmp('item_add_orderItemId').setValue(orderItemId);
                                                var orderItem = Ext.getCmp('' + itemQuantityBox + '').getValue();
                                                com.faralam.common.removeItemFromOrder();
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        itemPopupSec_modal = Ext.widget('window', {
            title: '<span style="float:left;color:#000;font-style: italic;font-weight: bold;font-size:16px;padding-left: 30px;">Add Item to Order</span>',
            id: 'itemPopupSec_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 580,
            cls: 'white_modal',
            //height:410,
            items: itemPopupSec_modal_form,
            listeners: {
                close: function () {
                    itemPopupSec_modal_form.getForm().reset(true);
                },
                show: function () {
                    com.faralam.getSliderPicURLs(step, itemId);
                    if (step == 'UpdateItem') {
                        Ext.getCmp('' + itemQuantityBox + '').setValue(quantity);
                    }

                }

            }
        });
    }
    itemPopupSec_modal.show();
}

com.faralam.common.addItemToOrder = function () {
    com.faralam.addItemToOrder = com.faralam.serverURL + 'retail/addItemToOrder';
    com.faralam.addItemToOrder = com.faralam.addItemToOrder + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "priceItem": {
            "itemVersion": Ext.getCmp('item_add_itemVersion').getValue(),
            "priceId": Ext.getCmp('item_add_priceId').getValue(),
            "itemId": Ext.getCmp('item_add_itemId').getValue()
        },
        "orderUUID": sessionStorage.orderUUID,
        "quantity": Ext.getCmp('orderItemCount').getValue()
    };


    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Item added successfully.', function () {
            Ext.getCmp('itemPopupSec_modal').close();
            if (sessionStorage.orderItem) {
                com.faralam.common.editRetrieveOrders_func(sessionStorage.orderItem);
            }
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.addItemToOrder, "PUT", data, onsuccess, onerror);
}

com.faralam.common.updateItemQuantityInOrder = function () {
    com.faralam.updateItemQuantityInOrder = com.faralam.serverURL + 'retail/updateItemQuantityInOrder';
    com.faralam.updateItemQuantityInOrder = com.faralam.updateItemQuantityInOrder + "?" + encodeURI('UID=' + sessionStorage.UID);

    var data = {
        "itemVersion": Ext.getCmp('item_add_itemVersion').getValue(),
        "orderUUID": sessionStorage.orderUUID,
        "orderItemId": Ext.getCmp('item_add_orderItemId').getValue(),
        "quantity": Ext.getCmp('orderItemCount2').getValue(),
        "priceId": Ext.getCmp('item_add_priceId').getValue(),
        "itemId": Ext.getCmp('item_add_itemId').getValue()
    };

    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Item updated successfully.', function () {
            Ext.getCmp('itemPopupSec_modal').close();
            if (sessionStorage.orderItem) {
                com.faralam.common.editRetrieveOrders_func(sessionStorage.orderItem);
            }
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.updateItemQuantityInOrder, "PUT", data, onsuccess, onerror);
}

com.faralam.common.removeItemFromOrder = function () {
    com.faralam.removeItemFromOrder = com.faralam.serverURL + 'retail/removeItemFromOrder';
    com.faralam.removeItemFromOrder = com.faralam.removeItemFromOrder + "?" + encodeURI('UID=' + sessionStorage.UID);

    var data = {
        "itemVersion": Ext.getCmp('item_add_itemVersion').getValue(),
        "orderUUID": sessionStorage.orderUUID,
        "orderItemId": Ext.getCmp('item_add_orderItemId').getValue(),
        "quantity": Ext.getCmp('orderItemCount2').getValue(),
        "priceId": Ext.getCmp('item_add_priceId').getValue(),
        "itemId": Ext.getCmp('item_add_itemId').getValue()
    };

    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Item deleted successfully.', function () {
            Ext.getCmp('itemPopupSec_modal').close();
            if (sessionStorage.orderItem) {
                com.faralam.common.editRetrieveOrders_func(sessionStorage.orderItem);
            }
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.removeItemFromOrder, "PUT", data, onsuccess, onerror);
}

com.faralam.common.cancelOrder = function () {
    com.faralam.cancelOrder = com.faralam.serverURL + 'retail/cancelOrder';
    com.faralam.cancelOrder = com.faralam.cancelOrder + "?" + encodeURI('UID=' + sessionStorage.UID + '&orderUUID=' + sessionStorage.orderUUID);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Entire order deleted successfully.');
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.cancelOrder, "DELETE", {}, onsuccess, onerror);
}

com.faralam.common.removePlacedItem = function (e) {
    var row = e.parentNode.parentNode;
    document.getElementById("order_item_table").deleteRow(row.rowIndex);
    //console.log(row);
    $('#order_item_table').perfectScrollbar('destroy');
    $('#order_item_table').perfectScrollbar();
}
sessionStorage.setings_open=0;
com.faralam.common.showSettings = function () {
    //    $(e).next('#user_setting_menu').slideToggle();
    //    $(e).toggleClass('active');        
    if ($('#user_setting_menu').css('opacity') == 0) {
        $('#user_setting_menu').css('opacity', '1');
    } else {
        $('#user_setting_menu').css('opacity', '0');
    }
    /*var is_setings_open=sessionStorage.setings_open;
    if (parseInt(is_setings_open) == 0) {
        console.log("show"+is_setings_open);
        $('#user_setting_menu').show();
        sessionStorage.setings_open=1;
    } else {
        console.log("hide"+is_setings_open);
        $('#user_setting_menu').hide();
        sessionStorage.setings_open=0;
    }*/
}


// ############################## Online Order Section End ###################################

// ############################## My App Members Section Start #################################
com.faralam.common.getMemberList_func = function (section) {

    com.faralam.getMemberList_func = com.faralam.serverURL + 'usersasl/getMemberList';
    com.faralam.getMemberList_func = com.faralam.getMemberList_func + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (response, textStatus, jqXHR) {
        var html = '';
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                if (section == 'MyAppMembers') {
                    html += '<tr><td style="color:#000 !important;padding: 10px 10px;height: 38px;" width="200px"><span onclick="com.faralam.common.ShowMemberInfo(this)" email="'+response[i].email+'" mobile="'+response[i].mobileNumber+'" userName="' + response[i].userName + '" style="cursor:pointer;">' + response[i].userName + '</span></td></tr>';
                } else if (section == 'HtmlEmailService') {
                    html += '<tr><td style="padding: 0  5px;height: 38px;" width="200px"><input type="checkbox" class="check_style" name="member" value="1"><span style="color: #fff !important;padding-left: 5px;font-size: 16px;">' + response[i].userName + '</span></td></tr>';
                } else if (section == 'NewsletterService') {
                    if(response[i].isEmailAvailable==true)
                        {
                          html += '<tr><td style="padding: 0  5px;height: 38px;border-bottom: 1px solid #bbb;" width="190px"><input type="checkbox" class="check_style" name="member" value="' + response[i].userName + '" id="newsletterMemberId[' + i + ']" onclick="com.faralam.common.setNewsletterMembers(this)"><span style="color: #000 !important;padding-left: 5px;font-size: 14px;">' + response[i].userName + '</span></td></tr>';  
                        }
                    else
                        {
                            html += '<tr><td title="Email is not available of this user" style="padding: 0  5px;height: 38px;opacity:0.5;border-bottom: 1px solid #bbb;" width="190px"><input type="checkbox" disabled class="check_style" name="member" value="' + response[i].userName + '" id="newsletterMemberId[' + i + ']" onclick="com.faralam.common.setNewsletterMembers(this)"><span style="color: #000 !important;padding-left: 5px;font-size: 14px;">' + response[i].userName + '</span></td></tr>';
                        }
                    
                }
            }
        }
        if (section == 'MyAppMembers') {
            
            html = '<table border="0" id="MyAppMembers_memberList_table">' + html + '</table>';
            Ext.getCmp('slide_panel_members').update(html);
            $('#MyAppMembers_memberList_table').perfectScrollbar('destroy');
            $('#MyAppMembers_memberList_table').perfectScrollbar();
        } else if (section == 'HtmlEmailService') {
            html = '<table border="0" id="HtmlEmailService_memberList_table">' + html + '</table>';
            Ext.getCmp('slide_panel_HtmlEmailService').update(html);
            $('#HtmlEmailService_memberList_table').perfectScrollbar('destroy');
            $('#HtmlEmailService_memberList_table').perfectScrollbar();
        } else if (section == 'NewsletterService') {
            html = '<table border="0" style="height: 400px !important;overflow:hidden;" id="NewsletterService_memberList_table"><tr><td style="padding: 0  5px;height: 38px; text-align:center;" width="200px"><h3 style="color:#FFFFFF; border-bottom: 2px solid #fff;font-size:18px;">Members</h3></td></tr>' + html + '</table>';
            Ext.getCmp('slide_panel_NewsletterService').update(html);
            $('#NewsletterService_memberList_table').perfectScrollbar('destroy');
            $('#NewsletterService_memberList_table').perfectScrollbar();
        }
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.getMemberList_func, "GET", {}, onsuccess, onerror);
}

com.faralam.common.ShowMemberInfo = function (e) {
    var userName = e.getAttribute('userName');
    userEmail=e.getAttribute('email');
    userMobileNo=e.getAttribute('mobile');
    sessionStorage.userName = userName;
    sessionStorage.userEmail = userEmail;
    sessionStorage.userMobileNo = userMobileNo;
    Ext.getCmp('main_tab').down('#MyAppMembers').setDisabled(true);
    Ext.getCmp('main_tab').down('#MyAppMembersDetails').setDisabled(false);
    Ext.getCmp('main_tab').setActiveTab(26);
    
     /*====================================== CODE FOR GETTING THE MESSAGES ============================*/
    //com.faralam.common.getConversationBetweenSASLUserNew2(sessionStorage.userName);
     /*====================================== CODE FOR GETTING THE MESSAGES ============================*/
    /*com.faralam.common.getMember_func(sessionStorage.userName);
    com.faralam.common.getMyCustomerProfile();*/
}
com.faralam.common.customeDateFormat = function (dt, format) {
    dt = dt.substring(0, dt.length - 4);
    var options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    var convertDate;
    var date = new Date(dt);
    convertDate = date.toLocaleDateString('en-US', options);
    return convertDate;
}
com.faralam.common.deleteNote = function (e) {
    Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this Item?', function (ex) {
        if (ex == 'yes') {
            var deleteNoteId = e.getAttribute('noteid');
            console.log(deleteNoteId);
            com.faralam.deleteNote = com.faralam.serverURL + 'usersasl/deleteNote';
            com.faralam.deleteNote = com.faralam.deleteNote + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID + '&noteId=' + deleteNoteId + '&userName=' + sessionStorage.userName);

            var onsuccess = function (response, textStatus, jqXHR) {
                if (response.success) {
                    Ext.MessageBox.alert('Success', 'Delete successfully.');
                    com.faralam.common.getMember_func(sessionStorage.userName);
                }
            };
            var onerror = function (jqXHR, textStatus, errorThrown) {};
            com.faralam.common.sendAjaxRequest(com.faralam.deleteNote, "DELETE", {}, onsuccess, onerror);

        }
    });
};
com.faralam.common.getMember_func = function (userName) {
    console.log(userName);
    
    Ext.getCmp('membersHeaderLeft').update('');
    Ext.getCmp('membersHeaderRight').update('');
    Ext.getCmp('member_rating_panel').update('');
    Ext.getCmp('member_coment_panel').update('');
    Ext.getCmp('member_dislike_panel').update('');
    Ext.getCmp('member_preference_panel').update('');
    com.faralam.getMember_func = com.faralam.serverURL + 'usersasl/getMember';
    com.faralam.getMember_func = com.faralam.getMember_func + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID + '&userName=' + userName);

    var onsuccess = function (response, textStatus, jqXHR) {

        var headerLeft = '<span style="color:#000;font-size:16px; font-weight: bold;padding-top:3px;">' + sessionStorage.userName + '</span>';
        var headerRight = '<span style="color:#000;font-size:16px; font-weight: bold;padding-top:3px;">Profile of ' + sessionStorage.userName + '</span>';

        Ext.getCmp('membersHeaderLeft').update(headerLeft);
        Ext.getCmp('membersHeaderRight').update(headerRight);
		document.getElementById("memberCreatMessageButton").setAttribute("un",sessionStorage.userName);
        //commment Sec
		
		var rating = response.rating;
		var rateArray = new Array();
		
		for(i=0;i<5;i++){
			rateArray[i]="";
			if((i+1)==rating){
				rateArray[i]="checked='checked'";
			}
		}
		var member_rating_panel = '<table class="member_table" style="width:740px !important;  border-spacing:0 !important; border-top: 2px solid #a3aec6;width:200px;"><tr><td colspan="2" class="text-align-center" style="border-left: 1px solid #a3aec6;border-right: 1px solid #a3aec6;" id="member_rating_star"><fieldset id="demo1" class="rating"><span style="line-height:35px;margin-right: 20px" >Rating  </span><input class="stars" type="radio" id="star5" name="rating" value="5" onclick="com.faralam.getRating(this)" '+rateArray[4]+' /><label class = "full" for="star5" title="Perfect">&#9733;</label><input class="stars" type="radio" id="star4" name="rating" value="4" onclick="com.faralam.getRating(this)"  '+rateArray[3]+'/><label class = "full" for="star4" title="Good">&#9733;</label><input class="stars" type="radio" id="star3" name="rating" value="3" onclick="com.faralam.getRating(this)"  '+rateArray[2]+'/><label class = "full" for="star3" title="Not that Bad">&#9733;</label><input class="stars" type="radio" id="star2" name="rating" value="2" onclick="com.faralam.getRating(this)"  '+rateArray[1]+'/><label class = "full" for="star2" title="Poor">&#9733;</label><input class="stars" type="radio" id="star1" name="rating" value="1" onclick="com.faralam.getRating(this)"  '+rateArray[0]+'/><label class = "full" for="star1" title="Very Poor">&#9733;</label></fieldset><input type="button" value="Save" style="background-color: #ffffff;border: 2px solid #cccccc;border-radius: 8px;cursor: pointer;padding: 2px;width: 100px;margin: 5px -70px 0;" onclick="com.faralam.common.setRating(this)" /></td><td class="text-align-center"><input type="button" value="Send Personalized App" style="background-color: #006FC0;border: 2px solid #000;border-radius: 8px;cursor: pointer;padding: 4px;width: 200px;margin:  0 -55px 0 -35px;;font-weight:bold;color:#fff" onclick="com.faralam.common.OpenSendPersonalizedApp()" /></td></tr></table>';
		Ext.getCmp('member_rating_panel').update(member_rating_panel);
		
		
        var comment_table_header = '<table class="member_table" cellspacing="0" style="width:740px !important;"><tr><td class="border_none">Comments</td><td class="border_none">&nbsp;&nbsp;&nbsp;&nbsp;</td><td class="border_none"><img style="float: right;margin-right: 8px;" width="20" src="' + com.faralam.custom_img_path + 'member_add.png" alt"" onclick="com.faralam.common.MemberComment(this)" userName="' + sessionStorage.userName + '"/></td></tr></table>';

        var html = '';
        //console.log(response.comments);        
        if (response.comments.length > 0) {

            for (var i = 0; i < response.comments.length; i++) {
                var formatedDate = com.faralam.common.customeDateFormat(response.comments[i].lastUpdated);
                //console.log(formatedDate);
                html += '<tr><td class="border_none font_normal" style="text-align: left; !important;width:200px;">' + formatedDate + '</td><td class="border_none font_normal" style="width:500px;">' + response.comments[i].noteBody + '</td><td class="border_none font_normal" style="width:50px;"><img style="float: right;margin-right: 8px;" width="20" src="' + com.faralam.custom_img_path + 'member_delete.png" alt"" noteid="' + response.comments[i].noteId + '" onclick="com.faralam.common.deleteNote(this)"/></td></tr>';
            }
        } else {
            html += '<tr><td class="border_none font_normal" style="width:740px; text-align: center !important;" colspan="3">No Comments Found</td></tr>';
        }

        var comment_table = comment_table_header + '<table class="member_table" id="memberComment_table" cellspacing="0" style="width:740px !important;">' + html + '</table>';
        Ext.getCmp('member_coment_panel').update(comment_table);
        $('#memberComment_table').perfectScrollbar('destroy');
        $('#memberComment_table').perfectScrollbar();

        //Dislike Sec
        var dislike_table_header = '<table class="member_table" cellspacing="0" style="width:740px !important;"><tr><td class="border_none">Dislike</td><td class="border_none">&nbsp;&nbsp;&nbsp;&nbsp;</td><td class="border_none"><img style="float: right;margin-right: 8px;" width="20" src="' + com.faralam.custom_img_path + 'member_add.png" alt"" onclick="com.faralam.common.MemberDislike(this)" userName="' + sessionStorage.userName + '"/></td></tr></table>';

        var html = '';
        if (response.dislikes.length > 0) {
            for (var i = 0; i < response.dislikes.length; i++) {
                var formatedDate = com.faralam.common.customeDateFormat(response.dislikes[i].lastUpdated);
                html += '<tr><td class="border_none font_normal" style="text-align: left; !important;width:200px;">' + formatedDate + '</td><td class="border_none font_normal" style="width:500px;">' + response.dislikes[i].noteBody + '</td><td class="border_none font_normal" style="width:50px;"><img style="float: right;margin-right: 8px;" width="20" src="' + com.faralam.custom_img_path + 'member_delete.png" alt"" noteid="' + response.dislikes[i].noteId + '" onclick="com.faralam.common.deleteNote(this)"/></td></tr>';
            }
        } else {
            html += '<tr><td class="border_none font_normal" style="width:740px; text-align: center !important;" colspan="3">No Dislikes Found</td></tr>';
        }

        var dislike_table = dislike_table_header + '<table class="member_table" id="memberDislike_table" cellspacing="0" style="width:740px !important;">' + html + '</table>';
        Ext.getCmp('member_dislike_panel').update(dislike_table);
        $('#memberDislike_table').perfectScrollbar('destroy');
        $('#memberDislike_table').perfectScrollbar();

        //Preference Sec
        var preference_table_header = '<table class="member_table" cellspacing="0" style="width:740px !important;"><tr><td class="border_none">Preference</td><td class="border_none">&nbsp;&nbsp;&nbsp;&nbsp;</td><td class="border_none"><img style="float: right;margin-right: 8px;" width="20" src="' + com.faralam.custom_img_path + 'member_add.png" alt"" onclick="com.faralam.common.MemberPreference(this)" userName="' + sessionStorage.userName + '"/></td></tr>';

        var html = '';
        if (response.preferences.length > 0) {
            for (var i = 0; i < response.preferences.length; i++) {
                var formatedDate = com.faralam.common.customeDateFormat(response.preferences[i].lastUpdated);
                html += '<tr><td class="border_none font_normal" style="text-align: left; !important;width:200px;">' + formatedDate + '</td><td class="border_none font_normal" style="width:500px;">' + response.preferences[i].noteBody + '</td><td class="border_none font_normal" style="width:50px;"><img style="float: right;margin-right: 8px;" width="20" src="' + com.faralam.custom_img_path + 'member_delete.png" alt"" noteid="' + response.preferences[i].noteId + '" onclick="com.faralam.common.deleteNote(this)"/></td></tr>';
            }
        } else {
            html += '<tr><td class="border_none font_normal" style="width:740px;text-align: center !important;" colspan="3">No Preferences Found</td></tr>';
        }

        var preference_table = preference_table_header + '<table class="member_table" id="memberPreference_table" cellspacing="0" style="width:740px !important;">' + html + '</table>';
        Ext.getCmp('member_preference_panel').update(preference_table);
        $('#memberPreference_table').perfectScrollbar('destroy');
        $('#memberPreference_table').perfectScrollbar();

       
        //Ext.getCmp('member_message_panel').hide();
        Ext.getCmp('member_reply_panel').hide();
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.getMember_func, "GET", {}, onsuccess, onerror);
}

com.faralam.common.MemberComment = function (e) {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var MemberComment_modal;

    if (Ext.getCmp('MemberComment_modal')) {
        var modal = Ext.getCmp('MemberComment_modal');
        modal.destroy(modal, new Object());
    }
    if (!MemberComment_modal) {
        var MemberComment_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'blue_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:680px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'addMemberComment_userName',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Comment',
                                            labelSeparator: '',
                                            emptyText: '',
                                            inputWidth: 380,
                                            //height: 150,
                                            margin: '10 0 0 10',
                                            name: '',
                                            value: '',
                                            id: 'member_comment',
                                            allowBlank: false
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    defaultType: 'button',
                                    width: 160,
                                    style: 'text-align:center;',
                                    margin: '0 0 0 70',
                                    items: [
                                        {
                                            text: '<span style="color:#fff !important;">Send</span>',
                                            style: 'background:#007AFF !important;border:2px solid #000 !important;',
                                            margin: '20 0 10 356',
                                            handler: function () {
                                                if (MemberComment_modal_form.getForm().isValid()) {
                                                    com.faralam.common.addMemberComment();
                                                }
                                            }
                                                }]
                                }

                            ]
                        }]
                }
            ]
        });

        MemberComment_modal = Ext.widget('window', {
            title: 'Add Comment',
            id: 'MemberComment_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 540,
            cls: 'blue_modal',
            //height:410,
            items: MemberComment_modal_form,
            listeners: {
                close: function () {
                    MemberComment_modal_form.getForm().reset(true);
                },
                show: function () {
                    if (e != '') {
                        Ext.getCmp('addMemberComment_userName').setValue(e.getAttribute('userName'));
                    }
                }

            }
        });
    }
    MemberComment_modal.show();


}

com.faralam.common.addMemberComment = function () {
    var comment = Ext.getCmp('member_comment').getValue();
    var userName = Ext.getCmp('addMemberComment_userName').getValue();
    com.faralam.addMemberComment = com.faralam.serverURL + 'usersasl/addComment';
    com.faralam.addMemberComment = com.faralam.addMemberComment + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&comment=' + comment + '&userName=' + userName);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Comment added successfully.', function () {
            Ext.getCmp('MemberComment_modal').close();
            com.faralam.common.getMember_func(userName);
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.addMemberComment, "POST", {}, onsuccess, onerror);
}

com.faralam.common.MemberDislike = function (e) {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var MemberDislike_modal;

    if (Ext.getCmp('MemberDislike_modal')) {
        var modal = Ext.getCmp('MemberDislike_modal');
        modal.destroy(modal, new Object());
    }
    if (!MemberDislike_modal) {
        var MemberDislike_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'blue_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:680px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'addMemberDislike_userName',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Dislike',
                                            labelSeparator: '',
                                            emptyText: '',
                                            inputWidth: 380,
                                            //height: 150,
                                            margin: '10 0 0 10',
                                            name: '',
                                            value: '',
                                            id: 'member_dislike',
                                            allowBlank: false
                                        }

                                    ]
                                },
                                {
                                    xtype: 'container',
                                    defaultType: 'button',
                                    width: 160,
                                    style: 'text-align:center;',
                                    margin: '0 0 0 70',
                                    items: [
                                        {
                                            text: '<span style="color:#fff !important;">Send</span>',
                                            style: 'background:#007AFF !important;border:2px solid #000 !important;',
                                            margin: '20 0 10 356',
                                            handler: function () {
                                                if (MemberDislike_modal_form.getForm().isValid()) {
                                                    com.faralam.common.addMemberDislike();
                                                }
                                            }
                                            }]
                                }

                            ]
                        }]
                }
            ]
        });

        MemberDislike_modal = Ext.widget('window', {
            title: 'Add Dislike',
            id: 'MemberDislike_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 540,
            cls: 'blue_modal',
            //height:410,
            items: MemberDislike_modal_form,
            listeners: {
                close: function () {
                    MemberDislike_modal_form.getForm().reset(true);
                },
                show: function () {
                    if (e != '') {
                        Ext.getCmp('addMemberDislike_userName').setValue(e.getAttribute('userName'));
                    }
                }

            }
        });
    }
    MemberDislike_modal.show();


}

com.faralam.common.addMemberDislike = function () {
    var dislike = Ext.getCmp('member_dislike').getValue();
    var userName = Ext.getCmp('addMemberDislike_userName').getValue();
    com.faralam.addMemberDislike = com.faralam.serverURL + 'usersasl/addDislike';
    com.faralam.addMemberDislike = com.faralam.addMemberDislike + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&dislike=' + dislike + '&userName=' + userName);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Dislike added successfully.', function () {
            Ext.getCmp('MemberDislike_modal').close();
            com.faralam.common.getMember_func(userName);
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.addMemberDislike, "POST", {}, onsuccess, onerror);
}

com.faralam.common.MemberPreference = function (e) {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var MemberPreference_modal;

    if (Ext.getCmp('MemberPreference_modal')) {
        var modal = Ext.getCmp('MemberPreference_modal');
        modal.destroy(modal, new Object());
    }
    if (!MemberPreference_modal) {
        var MemberPreference_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'blue_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:680px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'hiddenfield',
                                            id: 'addMemberPreference_userName',
                                            name: '',
                                            value: ''
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Preference',
                                            labelSeparator: '',
                                            emptyText: '',
                                            inputWidth: 380,
                                            // height: 150,
                                            margin: '10 0 0 10',
                                            name: '',
                                            value: '',
                                            id: 'member_preference',
                                            allowBlank: false
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    defaultType: 'button',
                                    width: 160,
                                    style: 'text-align:center;',
                                    margin: '0 0 0 70',
                                    items: [
                                        {
                                            text: '<span style="color:#fff !important;">Send</span>',
                                            style: 'background:#007AFF !important;border:2px solid #000 !important;',
                                            margin: '20 0 10 356',
                                            handler: function () {
                                                if (MemberPreference_modal_form.getForm().isValid()) {
                                                    com.faralam.common.addMemberPreference();
                                                }
                                            }
                                        }]
                                }

                            ]
                        }]
                }
            ]
        });

        MemberPreference_modal = Ext.widget('window', {
            title: 'Add Preference',
            id: 'MemberPreference_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 540,
            cls: 'blue_modal',
            //height:410,
            items: MemberPreference_modal_form,
            listeners: {
                close: function () {
                    MemberPreference_modal_form.getForm().reset(true);
                },
                show: function () {
                    if (e != '') {
                        Ext.getCmp('addMemberPreference_userName').setValue(e.getAttribute('userName'));
                    }
                }

            }
        });
    }
    MemberPreference_modal.show();


}

com.faralam.common.addMemberPreference = function () {
    var preference = Ext.getCmp('member_preference').getValue();
    var userName = Ext.getCmp('addMemberPreference_userName').getValue();
    com.faralam.addMemberPreference = com.faralam.serverURL + 'usersasl/addPreference';
    com.faralam.addMemberPreference = com.faralam.addMemberPreference + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&preference=' + preference + '&userName=' + userName);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Preference added successfully.', function () {
            Ext.getCmp('MemberPreference_modal').close();
            com.faralam.common.getMember_func(userName);
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.addMemberPreference, "POST", {}, onsuccess, onerror);
}

com.faralam.common.MemberRegister = function () {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var MemberRegister_modal;

    if (Ext.getCmp('MemberRegister_modal')) {
        var modal = Ext.getCmp('MemberRegister_modal');
        modal.destroy(modal, new Object());
    }
    if (!MemberRegister_modal) {
        var MemberRegister_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'blue_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:680px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Name (Public)',
                                    labelSeparator: '',
                                    emptyText: '',
                                    inputWidth: 380,
                                    // height: 150,
                                    margin: '10 0 0 10',
                                    name: '',
                                    value: '',
                                    id: 'member_firstName',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Email',
                                    labelSeparator: '',
                                    emptyText: '',
                                    inputWidth: 380,
                                    // height: 150,
                                    margin: '10 0 0 10',
                                    name: '',
                                    value: '',
                                    id: 'member_email',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Mobile Phone',
                                    labelSeparator: '',
                                    emptyText: '',
                                    inputWidth: 380,
                                    // height: 150,
                                    margin: '10 0 0 10',
                                    name: '',
                                    value: '',
                                    id: 'member_mobile',
                                    allowBlank: false
                                }
//				                {
//                                    xtype: 'textfield',
//                                    fieldLabel: 'Promo Code',
//                                    labelSeparator: '',
//                                    emptyText: '',
//                                    inputWidth: 380,
//                                   // height: 150,
//                                    margin: '10 0 0 10',
//                                    name: '',
//                                    value: '',
//                                    id: 'member_promoCode',
//                                    allowBlank: false
//                                }				                
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'container',
                                    defaultType: 'button',
                                    width: 160,
                                    style: 'text-align:center;',
                                    margin: '0 0 0 70',
                                    items: [
                                        {
                                            text: '<span style="color:#fff !important;">Save</span>',
                                            style: 'background:#007AFF !important;border:2px solid #000 !important;',
                                            margin: '20 0 10 56',
                                            handler: function () {

                                                var member_firstName = Ext.getCmp('member_firstName').getValue();
                                                var member_email = Ext.getCmp('member_email').getValue();
                                                var member_mobile = Ext.getCmp('member_mobile').getValue();

                                                if (member_firstName == '') {
                                                    Ext.MessageBox.alert('Information', 'Please enter member\'s Name.');
                                                } else if (member_email == '' && member_mobile == '') {
                                                    Ext.MessageBox.alert('Information', 'Please enter either member\'s Email or member\'s Mobile Number.');
                                                } else if (member_firstName != '' && (member_email != '' || member_mobile != '')) {
                                                    com.faralam.common.registerAdhocMember();
                                                } else {
                                                    Ext.MessageBox.alert('Information', 'Please enter Required fields.');
                                                }
                                            }
                                                }]
                                        },
                                {
                                    xtype: 'container',
                                    defaultType: 'button',
                                    width: 160,
                                    style: 'text-align:center;',
                                    margin: '0 0 0 70',
                                    items: [
                                        {
                                            text: '<span style="color:#fff !important;">Cancel</span>',
                                            style: 'background:#007AFF !important;border:2px solid #000 !important;',
                                            margin: '20 150 10 56',
                                            handler: function () {
                                                MemberRegister_modal.hide();
                                            }
                                                }]
                                        }
                                    ]
                        }
                    ]
                }
            ]
        });

        MemberRegister_modal = Ext.widget('window', {
            title: 'Add Member',
            id: 'MemberRegister_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 540,
            cls: 'blue_modal',
            //height:410,
            items: MemberRegister_modal_form,
            listeners: {
                close: function () {
                    MemberRegister_modal_form.getForm().reset(true);
                },
                show: function () {

                }

            }
        });
    }
    MemberRegister_modal.show();


}

com.faralam.common.registerAdhocMember = function () {
    var member_firstName = Ext.getCmp('member_firstName').getValue();
    var member_email = Ext.getCmp('member_email').getValue();
    var member_mobile = Ext.getCmp('member_mobile').getValue();
    var promoCode = '';
    //var promoCode = Ext.getCmp('member_promoCode').getValue();

    com.faralam.registerAdhocMember = com.faralam.serverURL + 'usersasl/registerAdhocMember';
    com.faralam.registerAdhocMember = com.faralam.registerAdhocMember + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&firstName=' + member_firstName + '&mobile=' + member_mobile + '&promoCode=' + promoCode + '&email=' + member_email);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Member added successfully.', function () {
            Ext.getCmp('MemberRegister_modal').close();
            com.faralam.common.getMemberList_func('MyAppMembers');
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.registerAdhocMember, "POST", {}, onsuccess, onerror);
}

com.faralam.common.MemberSearch = function () {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var MemberSearch_modal;

    if (Ext.getCmp('MemberSearch_modal')) {
        var modal = Ext.getCmp('MemberSearch_modal');
        modal.destroy(modal, new Object());
    }
    if (!MemberSearch_modal) {
        var MemberSearch_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'blue_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:680px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Search for Member',
                                    labelSeparator: '',
                                    emptyText: '',
                                    inputWidth: 380,
                                    // height: 150,
                                    margin: '10 0 0 10',
                                    name: '',
                                    value: '',
                                    id: 'member_fragment',
                                    allowBlank: false
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'container',
                                    defaultType: 'button',
                                    width: 160,
                                    style: 'text-align:center;',
                                    margin: '0 0 0 70',
                                    items: [
                                        {
                                            text: '<span style="color:#fff !important;">Search</span>',
                                            style: 'background:#007AFF !important;border:2px solid #000 !important;',
                                            margin: '20 0 10 356',
                                            handler: function () {
                                                if (MemberSearch_modal_form.getForm().isValid()) {
                                                    com.faralam.common.searchForMembers();
                                                }
                                            }
                                                }]
                                        }
                                    ]
                                }
                    ]
                }
            ]
        });

        MemberSearch_modal = Ext.widget('window', {
            title: 'Search Member',
            id: 'MemberSearch_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 540,
            cls: 'blue_modal',
            //height:410,
            items: MemberSearch_modal_form,
            listeners: {
                close: function () {
                    MemberSearch_modal_form.getForm().reset(true);
                },
                show: function () {

                }

            }
        });
    }
    MemberSearch_modal.show();


}

com.faralam.common.searchForMembers = function () {
    var fragment = Ext.getCmp('member_fragment').getValue();
    com.faralam.searchForMembers = com.faralam.serverURL + 'usersasl/searchForMembers';
    com.faralam.searchForMembers = com.faralam.searchForMembers + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&fragment=' + fragment);

    var onsuccess = function (response, textStatus, jqXHR) {
        console.log(response.memberList);
        var html = '';
        if (response.memberList != {}) {
            $.each(response.memberList, function (key, value) {
                console.log("pp=="+key);
                var mobileno='';
                var email='';
                $.each(value, function (key2, value2) {
                    if(key2=="mobileNumber")
                        {
                            mobileno=value2;
                        }
                    if(key2=="email")
                        {
                            email=value2;
                        }
                    
                });
                html += '<tr><td style="color:#000 !important;padding: 10px 10px;height: 38px;" width="200px"><span onclick="com.faralam.common.ShowMemberInfo(this)" email="'+email+'" mobile="'+mobileno+'" userName="' + key + '" style="cursor:pointer;">' + key + '</span></td></tr>';
            });
        }

        if (html != '') {
            html = '<table width="200px" border="0" id="MyAppMembers_memberList_table">' + html + '</table>';
        } else {
            html = '<table width="200px" border="0" id="MyAppMembers_memberList_table"><tr><td style="color:#000 !important;padding: 10px 10px;height: 38px;" width="200px"><span>No match found</span></td></tr></table>';
        }

        Ext.getCmp('slide_panel_members').update(html);
        $('#MyAppMembers_memberList_table').perfectScrollbar('destroy');
        $('#MyAppMembers_memberList_table').perfectScrollbar();

        Ext.getCmp('MemberSearch_modal').close();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.searchForMembers, "GET", {}, onsuccess, onerror);
}

com.faralam.common.OpenSendPersonalizedApp = function () {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var SendPersonalizedApp_modal;

    if (Ext.getCmp('SendPersonalizedApp_modal')) {
        var modal = Ext.getCmp('SendPersonalizedApp_modal');
        modal.destroy(modal, new Object());
    }
    if (!SendPersonalizedApp_modal) {
        var usrEmail=sessionStorage.userEmail;
        var usrMobile=sessionStorage.userMobileNo;
        if(usrEmail=="null")
            {
                usrEmail="";
            }
        if(usrMobile=="null")
            {
                usrMobile="";
            }
        var SendPersonalizedApp_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
                    //style: 'border: 3px solid #000 !important;'
            },
            //cls: 'white_bg',
            style: 'background: #324F85 !important; width:850px !important;',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 1,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:850px !important;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            style: 'width:850px !important;',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            id: 'SendPersonalizedApp_email',
                                            fieldLabel: 'Send to E-Mail',
                                            name: 'SendPersonalizedApp_email',
                                            allowBlank: false,
                                            value:usrEmail,
                                            emptyText: '',
                                            msgTarget: 'none',
                                            margin: '0 0 0 0',
                                            labelAlign: 'left',
                                            labelWidth: 200,
                                            inputWidth: 250,
                                            emptyText: 'Enter email address',
                                            labelSeparator: '  ',
                                            vtype: 'email',
                                            vtypeText: 'Email format is not valid',
                                            style: ' border-radius: 3px !important;padding: 5px !important;',
                                            listeners: {
                                                'errorchange': function (e, error, eOpts) {
                                                    var errUI = Ext.getCmp('SendPersonalizedApp_email_err');
                                                    errUI.setValue('');
                                                    if (error) {
                                                        if (e.getValue().length > 0) {
                                                            errUI.setValue('<span style="color:#CF4C35;">Enter valid email</span>');
                                                        } else {
                                                            errUI.setValue('<span style="color:#CF4C35;">' + error + '</span>');
                                                        }
                                                    }
                                                }
                                            }
										},
                                        {
                                            xtype: 'button',
                                            text: '<span style="color:#fff;">Send E-Mail</span>',
                                            scale: 'medium',
                                            margin: '0 0 0 150',
                                            width: 130,
                                            style: 'cursor:pointer;background:#006FC0 !important;border:0px solid #000 !important;box-shadow:none !important; left:645px;',
                                            handler: function () {
                        var email =Ext.getCmp('SendPersonalizedApp_email').getValue();
                                                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //return re.test(email);
                                               var mode = Ext.getCmp('SendPersonalizedApp_access_mode').getValue();
                                            if (mode === true) {
                                                if(email.trim()=='')
                                                    {
                                                        Ext.MessageBox.alert('Information', 'Please fill up email field.');
                                                    }
                                                else if(!re.test(email))
                                                    {
                                                        Ext.MessageBox.alert('Information', 'Please enter a valid email.');
                                                    }
                                                else
                                                    {
                                    com.faralam.common.sendAppURLForSASLToEmailNew(email); 
                                                    }
                                            }else
                                            {
                    Ext.MessageBox.alert('Information', 'Please agree with us to receive an message or email .');
                                        } }
                                            
										}
									]
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            id: 'SendPersonalizedApp_mobile_share_sms',
                                            fieldLabel: 'Send to Mobile',
                                            name: 'SendPersonalizedApp_sms',
                                            allowBlank: false,
                                            emptyText: '',
                                            msgTarget: 'none',
                                            margin: '0 0 0 0',
                                            labelAlign: 'left',
                                            labelWidth: 200,
                                            inputWidth: 250,
                                            emptyText: 'Enter mobile number',
                                            labelSeparator: '  ',
                                            style: ' border-radius: 3px !important;padding: 5px !important;',
                                            minValue: 0,
                                            minLength: 10,
                                            maxLength: 14,
                                            value:usrMobile,
                                            maskRe: /[0-9.]/,
                                            enableKeyEvents: true,
                                            listeners: {
                                                'keydown': function (me, e, eOpts) {
                                                    
                                                }
                                            }
										},
                                        {
                                            xtype: 'button',
                                            text: '<span style="color:#fff;">Send Text Msg</span>',
                                            scale: 'medium',
                                            margin: '0 0 0 150',
                                            width: 130,
                                            style: 'cursor:pointer;background:#006FC0 !important;border:0px solid #000 !important;box-shadow:none !important; left:645px;',
                                            handler: function () {
                                var mobile = Ext.getCmp('SendPersonalizedApp_mobile_share_sms').getValue();
                                                  var mode = Ext.getCmp('SendPersonalizedApp_access_mode').getValue();
                                            if (mode === true) {
                                            if(mobile.trim()=='')
                                                    {
                                                        Ext.MessageBox.alert('Information', 'Please enter mobile number .');
                                                    }
                                                else if(mobile.length<10 || isNaN(mobile))
                                                    {
                                                        Ext.MessageBox.alert('Information', 'Please enter a valid mobile number.');
                                                    }
                                                else
                                                    {
                                    com.faralam.common.sendAppURLForSASLToMobileviaSMSNew(mobile);
                                                    }
                                            }
                                                else
                                            {
                                Ext.MessageBox.alert('Information', 'Please agree with us to receive an message or email .');
                                        } 
                                            }
										}
									]
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    width: 900,
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            fieldLabel: '<h4 style="color: #ffff00;margin-right: 10px; text-align:center !important">"I certify that the recipient has agreed to receive this Text/E-Mail message"</h4>',
                                            defaultType: 'checkboxfield',
                                            msgTarget: 'none',
                                            /* inputWidth: 280,
											inputHeight: 32,*/
                                            margin: '0 0 0 20',
                                            labelAlign: 'right',
                                            //labelWidth: 375,
                                            value:true,
                                            labelWidth: 550,
                                            inputWidth: 80,
                                            labelSeparator: '  ',
                                            items: [
                                                {
                                                    name: 'SendPersonalizedApp_access_mode',
                                                    //inputValue: '1',
                                                    id: 'SendPersonalizedApp_access_mode',
                                                    listeners: {
                                                        click: {
                                                            element: 'el',
                                                            fn: function () {
                                                                var mode = Ext.getCmp('SendPersonalizedApp_access_mode').getValue();
                                                                console.log(mode);
                                                                
                                                                if (mode === true) {
                                                                    Ext.get('SendPersonalizedApp_access_mode-inputEl').removeCls("inactive_checkbox");
                                                                    Ext.get('SendPersonalizedApp_access_mode-inputEl').addCls("active_checkbox");
                                                                } else {
                                                                    Ext.get('SendPersonalizedApp_access_mode-inputEl').removeCls("active_checkbox");
                                                                    Ext.get('SendPersonalizedApp_access_mode-inputEl').addCls("inactive_checkbox");
                                                                }
                                                            }
                                                        }
                                                    }
												}
											]
										}
									]
								},
                                
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '0 0 0 0',
                                    width: 500,
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            name: 'share_email_err',
                                            id: 'SendPersonalizedApp_email_err',
                                            fieldLabel: '&nbsp;',
                                            margin: '0 0 0 10',
                                            value: '',
                                            labelSeparator: ''
										}
									]
								}                                
							]
                        }
                    ]
                }
            ]
        });

        SendPersonalizedApp_modal = Ext.widget('window', {
            //title: '<div class="add_answer_text">Please enter your message</div>',
            id: 'SendPersonalizedApp_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 850,
            x:70,
            y:130,
            style: 'background: #324F85 !important; border: 3px solid #000 !important;',
            //cls: 'white_modal',
            //height:410,
            items: SendPersonalizedApp_modal_form,
            listeners: {
                close: function () {
                    SendPersonalizedApp_modal_form.getForm().reset(true);
                },
                show: function () {
                    //com.faralam.common.getMobileAppURLPollContest(sessionStorage.SA, sessionStorage.SL);
                }

            }
        });
    }
    SendPersonalizedApp_modal.show();
}

 com.faralam.common.sendAppURLForSASLToMobileviaSMSNew = function (mobile){         
    com.faralam.sendAppURLForSASLToMobileviaSMSNew= com.faralam.serverURL + 'html/sendAppURLForSASLToMobileviaSMS';
    com.faralam.sendAppURLForSASLToMobileviaSMSNew= com.faralam.sendAppURLForSASLToMobileviaSMSNew+ "?" +encodeURI('UID='+sessionStorage.UID +'&toTelephoneNumber='+mobile +'&serviceAccommodatorId=' + sessionStorage.SA  + '&serviceLocationId=' + sessionStorage.SL+'&username='+sessionStorage.userName);
     var onsuccess = function (data, textStatus, jqXHR) {
	Ext.MessageBox.alert('Success', data.explanation, function(){
        Ext.getCmp('SendPersonalizedApp_mobile_share_sms').setValue('');
        Ext.getCmp('SendPersonalizedApp_modal').close();});
    
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){}
 	com.faralam.common.sendAjaxRequest(com.faralam.sendAppURLForSASLToMobileviaSMSNew, "GET", {}, onsuccess, onerror);
 }
 com.faralam.common.sendAppURLForSASLToEmailNew = function (email){
	com.faralam.sendAppURLForSASLToEmailNew= com.faralam.serverURL + 'html/sendAppURLForSASLToEmail';
    com.faralam.sendAppURLForSASLToEmailNew = com.faralam.sendAppURLForSASLToEmailNew + "?" +encodeURI('UID='+sessionStorage.UID +'&toEmail='+email +'&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL+'&username='+sessionStorage.userName);
 
 	var onsuccess = function (data, textStatus, jqXHR) {
        
	Ext.MessageBox.alert('Success', data.explanation, function(){
      Ext.getCmp('SendPersonalizedApp_email').setRawValue('');
      Ext.getCmp('SendPersonalizedApp_modal').close();  
	});
        
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){}
 	com.faralam.common.sendAjaxRequest(com.faralam.sendAppURLForSASLToEmailNew, "GET", {}, onsuccess, onerror);
 }
// ############################## My App Members Section End ###################################//
// ############################## My Message Section Start ###################################//
com.faralam.common.getCommunicationsForSASL_fromfn = function (usrnm){
    com.faralam.getCommunicationsForSASL_fromfn = com.faralam.serverURL + 'communication/getCommunicationsForSASL';
    com.faralam.getCommunicationsForSASL_fromfn = com.faralam.getCommunicationsForSASL_fromfn + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (response, textStatus, jqXHR) {
        console.log(response);
        var review_len = response.reviews.length;
        var message_len = response.messages.length;
        var len_all = '<table class="MyAppMessages_left_table" cellspacing="0" width="200px" height="45px" border="0"><tr class="MyAppMessagesBgReview"><td width="230px"><span onclick="com.faralam.common.getMyAppMessagesReviews()">Reviews</span></td><td>' + review_len + '</td></tr><tr class="MyAppMessagesBgMessage"><td width="230px"><span onclick="com.faralam.common.getMyAppMessagesMessages()">Messages</span></td><td>' + message_len + '</td></tr></table><img id="my_app_messages_bg" width="200" height="700" src="' + com.faralam.custom_img_path + 'my_app_messages_bg.png">';
        Ext.getCmp('slide_panel_MyAppMessages').update(len_all);
        com.faralam.common.getConversationBetweenSASLUser_fromfn(usrnm);
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.getCommunicationsForSASL_fromfn, "GET", {}, onsuccess, onerror);
}
com.faralam.common.getCommunicationsForSASL_message=function()
{
    com.faralam.getCommunicationsForSASL_message = com.faralam.serverURL + 'communication/getCommunicationsForSASL';
    com.faralam.getCommunicationsForSASL_message = com.faralam.getCommunicationsForSASL_message + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.getCmp('MyAppMessages_message_panel').show();
        var message = '';
        if (response.messages.length > 0) {
            for (j = 0; j < response.messages.length; j++) {
                message += '<tr>\n\
                                <td width="17%">' + response.messages[j].userName + '</td>\n\
								<td width="60%">' + response.messages[j].messageBody + '</td>\n\
								<td width="23%"><button type="button" class="msg_reply_button" onclick="com.faralam.common.getConversationBetweenSASLUser(this)" mb="' + response.messages[j].messageBody + '" urgent="' + response.messages[j].urgent + '" un="' + response.messages[j].userName + '" com_id="' + response.messages[j].communicationId + '" in_reply_to_com_id="' + response.messages[j].inReplyToCommunicationId + '" ts="' + response.messages[j].timeStamp + '" sasl="' + response.messages[j].saslName + '" c_off_id="'+response.messages[j].offset+'">Reply</button></td>\n\
							</tr>';
            }
        }
        /*<div id="MyAppMessages_conversesion" style="height:520px !important;overflow:hidden; width:730px;border:2px solid black">*/
        var message_head = '<table class="MyAppMessages_message_table" style="width:710px !important" >\n\
							<tr style="font-size: 16px;">\n\
								<th width="17%">Member</th>\n\
								<th width="60%">Message</th>\n\
								<th width="23%"></th>\n\
							</tr>';
        var message_final = message_head + message + '</table>';
        Ext.getCmp('MyAppMessages_message_panel').update(message_final);
        $("#MyAppMessages_message_panel").perfectScrollbar('destroy');
        $("#MyAppMessages_message_panel").perfectScrollbar();
         
        //$('#MyAppMessages_chat_container2').scrollTop(50).perfectScrollbar('update');
        //com.faralam.common.getMessagesForUser();
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.getCommunicationsForSASL_message, "GET", {}, onsuccess, onerror);
 
}
com.faralam.common.getCommunicationsForSASL = function (flag) {
 
    if (flag == true) {
        Ext.getCmp('MyAppMessages_message_panel').hide();
        Ext.getCmp('MyAppMessages_reply_container').hide();
    }

    com.faralam.getCommunicationsForSASL = com.faralam.serverURL + 'communication/getCommunicationsForSASL';
    com.faralam.getCommunicationsForSASL = com.faralam.getCommunicationsForSASL + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (response, textStatus, jqXHR) {
        console.log(response);
        var review_len = response.reviews.length;
        var message_len = response.messages.length;
        var len_all = '<table class="MyAppMessages_left_table" cellspacing="0" width="200px" height="45px" border="0"><tr class="MyAppMessagesBgReview"><td width="230px"><span onclick="com.faralam.common.getMyAppMessagesReviews()">Reviews</span></td><td>' + review_len + '</td></tr><tr class="MyAppMessagesBgMessage"><td width="230px"><span onclick="com.faralam.common.getMyAppMessagesMessages()">Messages</span></td><td>' + message_len + '</td></tr></table><img id="my_app_messages_bg" width="200" height="700" src="' + com.faralam.custom_img_path + 'my_app_messages_bg.png">';
        Ext.getCmp('slide_panel_MyAppMessages').update(len_all);

        var review = '';
        var stars = '';
        if (response.reviews.length > 0) {
            for (i = 0; i < response.reviews.length; i++) {
                //  CODE FOR CREATING THE STARS //
                stars = '';
                for (var n = 0; n < 10; n += 2) {
                    if (response.reviews[i].rating - n == 1) {
                        stars += '<span class="cmntyex-icon ui-icon-cmntyex_half_star"></span>';
                    } else if (response.reviews[i].rating - n > 1) {
                        stars += '<span class="cmntyex-icon ui-icon-cmntyex_star"></span>';
                    } else {
                        stars += '<span class="cmntyex-icon ui-icon-cmntyex_grey_star"></span>';
                    }
                }
                // END OF CODE FOR CREATING THE STARS //
                review += '<tr>\n\
                                                                <td class="border_none font_normal" width="160px">' + stars + '</td>\n\
								<td class="border_none font_normal over_wrap" width="340px">' + response.reviews[i].text_excerpt + '</td>\n\
								<td class="border_none font_normal" width="100px">' + response.reviews[i].userName + '</td>\n\
								<td class="border_none font_normal" width="160px"><button type="button" class="msg_reply_btn" style="margin:2px" onclick="com.faralam.common.takeReviewOffline(this)" urgent="' + response.reviews[i].urgent + '" un="' + response.reviews[i].userName + '" com_id="' + response.reviews[i].communicationId + '" in_reply_to_com_id="' + response.reviews[i].inReplyToCommunicationId + '" ts="' + response.reviews[i].timeStamp + '" sasl="' + response.reviews[i].saslName + '" r_off_id="'+response.reviews[i].offset+'" >Take Offline</button></td>\n\
							</tr>';
            }
        }
        var reviw_head = '';
        var heading_tr='<tr><td width="160px" class="border_none font_normal"><h3>Rating</h3></td><td width="340px" class="border_none font_normal"><h3>Feedback</b></td><td width="100px" class="border_none font_normal"><h3>Member</b></td><td width="160px" class="border_none font_normal">&nbsp;</td></tr><tr>';
        var review_final = reviw_head + '</table><table class="MyAppMessages_review_table" id="MyAppMessagesReviewTable" style="height:auto">'+heading_tr + review + '</table>';
        review_final='<div id="MyAppMessages_review_div" style="overflow:hidden;height:530px;width:760px !important ;margin-left:10px;border:2px solid black;possition:relative">'+review_final+'</div>';
        Ext.getCmp('MyAppMessages_review_panel').update(review_final);
		
		Ext.getCmp('MyAppMessages_review_panel').show();
    	Ext.getCmp('MyAppMessages_message_panel').hide();
    	Ext.getCmp('MyAppMessages_reply_container').hide();
		
        $("#MyAppMessages_review_div").perfectScrollbar('destroy');
        $("#MyAppMessages_review_div").perfectScrollbar();

        var message = '';
        if (response.messages.length > 0) {
            for (j = 0; j < response.messages.length; j++) {
                message += '<tr>\n\
                                <td width="17%">' + response.messages[j].userName + '</td>\n\
								<td width="60%">' + response.messages[j].messageBody + '</td>\n\
								<td width="23%"><button type="button" class="msg_reply_button" onclick="com.faralam.common.getConversationBetweenSASLUser(this)" mb="' + response.messages[j].messageBody + '" urgent="' + response.messages[j].urgent + '" un="' + response.messages[j].userName + '" com_id="' + response.messages[j].communicationId + '" in_reply_to_com_id="' + response.messages[j].inReplyToCommunicationId + '" ts="' + response.messages[j].timeStamp + '" sasl="' + response.messages[j].saslName + '" c_off_id="'+response.messages[j].offset+'">Reply</button></td>\n\
							</tr>';
            }
        }
        /*<div id="MyAppMessages_conversesion" style="height:520px !important;overflow:hidden; width:730px;border:2px solid black">*/
        var message_head = '<table class="MyAppMessages_message_table" style="width:710px !important" >\n\
							<tr style="font-size: 16px;">\n\
								<th width="17%">Member</th>\n\
								<th width="60%">Message</th>\n\
								<th width="23%"></th>\n\
							</tr>';
        var message_final = message_head + message + '</table>';
        Ext.getCmp('MyAppMessages_message_panel').update(message_final);
        $("#MyAppMessages_message_panel").perfectScrollbar('destroy');
        $("#MyAppMessages_message_panel").perfectScrollbar();
         
        //$('#MyAppMessages_chat_container2').scrollTop(50).perfectScrollbar('update');
        //com.faralam.common.getMessagesForUser();
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.getCommunicationsForSASL, "GET", {}, onsuccess, onerror);
}

com.faralam.common.getMyCustomerProfile = function () {
    Ext.getCmp('member_profile_panel').show();
    Ext.getCmp('member_message_panel').hide();
    Ext.getCmp('member_reply_panel').hide();
    Ext.getCmp('member_profile_panel').getEl().slideIn('l', {
        stopAnimation: true,
        duration: 200
    });
    $('.member_profile_panel_tr').css('background', '#B8B8E6');
    $('.member_message_panel_tr').css('background', '#FFFFFF');
    com.faralam.common.getMember_func(sessionStorage.userName);
}

com.faralam.common.getMyCustomerMessage = function () {
    Ext.getCmp('member_message_panel').show();
    Ext.getCmp('member_profile_panel').hide();
    Ext.getCmp('member_reply_panel').hide();
    Ext.getCmp('member_message_panel').getEl().slideIn('l', {
        stopAnimation: true,
        duration: 200
    });
    $('.member_message_panel_tr').css('background', '#B8B8E6');
    $('.member_profile_panel_tr').css('background', '#FFFFFF');
    com.faralam.common.getConversationBetweenSASLUserNew2(sessionStorage.userName);
}

com.faralam.common.getMyAppMessagesReviews = function () {
    Ext.getCmp('MyAppMessages_review_panel').show();
    Ext.getCmp('MyAppMessages_message_panel').hide();
    Ext.getCmp('MyAppMessages_reply_container').hide();
    /*Ext.getCmp('MyAppMessages_review_panel').getEl().slideIn('l', {
        stopAnimation: true,
        duration: 200
    });*/
    com.faralam.common.getCommunicationsForSASL(true);
    $('.MyAppMessagesBgReview').css('background', '#B8B8E6');
    $('.MyAppMessagesBgMessage').css('background', '#FFFFFF');
}
com.faralam.common.getMyAppMessagesMessages = function () {
    Ext.getCmp('MyAppMessages_review_panel').hide();
    Ext.getCmp('MyAppMessages_message_panel').show();
    $("#MyAppMessages_message_panel").perfectScrollbar('destroy');
    $("#MyAppMessages_message_panel").perfectScrollbar();
    Ext.getCmp('MyAppMessages_reply_container').hide();
    Ext.getCmp('MyAppMessages_message_panel').getEl().slideIn('l', {
        stopAnimation: true,
        duration: 200
    });
    com.faralam.common.getCommunicationsForSASL_message();
    $('.MyAppMessagesBgMessage').css('background', '#B8B8E6');
    $('.MyAppMessagesBgReview').css('background', '#FFFFFF');
}
com.faralam.common.getMyAppMessagesReply = function (e) {
    Ext.getCmp('MyAppMessages_review_panel').hide();
    Ext.getCmp('MyAppMessages_message_panel').hide();
    Ext.getCmp('MyAppMessages_reply_container').show();
    Ext.getCmp('MyAppMessages_reply_container').getEl().slideIn('r', {
        stopAnimation: true,
        duration: 200
    });
    $('.MyAppMessagesBgMessage').css('background', '#B8B8E6');
    $('.MyAppMessagesBgReview').css('background', '#FFFFFF');

    Ext.getCmp('MyAppMessages_mb').setValue(e.getAttribute('mb'));
    Ext.getCmp('MyAppMessages_urgent').setValue(e.getAttribute('urgent'));
    Ext.getCmp('MyAppMessages_un').setValue(e.getAttribute('un'));
    Ext.getCmp('MyAppMessages_com_id').setValue(e.getAttribute('com_id'));
    Ext.getCmp('MyAppMessages_in_reply_to_com_id').setValue(e.getAttribute('in_reply_to_com_id'));
    Ext.getCmp('MyAppMessages_ts').setValue(e.getAttribute('ts'));
    Ext.getCmp('MyAppMessages_sasl').setValue(e.getAttribute('sasl'));
}

com.faralam.common.sendMessageToUser = function () {
    console.log("one");
    com.faralam.sendMessageToUser = com.faralam.serverURL + 'communication/sendMessageToUser';
    com.faralam.sendMessageToUser = com.faralam.sendMessageToUser + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
    var off_set=Ext.getCmp('MyAppMessages_offset').getValue();
    var com_id=Ext.getCmp('MyAppMessages_com_id').getValue();
    if(off_set=="null")
        {
           off_set=null; 
        }
    if (com_id=="null")
        {
          com_id=null;  
        }
    var data = {
        "messageBody": Ext.getCmp('MyAppMessages_reply_tf').getValue(),
        "fromServiceLocationId": sessionStorage.SL,
        "urgent":Ext.getCmp('MyAppMessages_urgent').getValue(),
        "userName": Ext.getCmp('MyAppMessages_un').getValue(),
        "communicationId": com_id,
        "fromServiceAccommodatorId": sessionStorage.SA,
        "inReplyToCommunicationId": off_set,
        "authorId": sessionStorage.UID  
    };
     //"timeStamp":Ext.getCmp('MyAppMessages_ts').getValue(),
    //"saslName":Ext.getCmp('MyAppMessages_sasl').getValue()
   /*"communicationId":Ext.getCmp('MyAppMessages_com_id').getValue()*/
    //"messageSend":Ext.getCmp('MyAppMessages_reply_tf').getValue(),
    data = JSON.stringify(data);
   
    //console.log(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.getCmp('MyAppMessages_reply_tf').setValue('');
        var usrnm=Ext.getCmp('MyAppMessages_un').getValue();
         com.faralam.common.getConversationBetweenSASLUser_fromfn(usrnm);
        /*
        console.log(response);
        //com.faralam.common.getMessagesForUser();
        reply = '';

        for (i = 0; i < response.messages.length; i++) {
            if (response.messages[i].fromUser == false) {
                reply += '<ul>\n\
						<li><div class="chat_text_time">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name">' + response.messages[i].saslName + '</div></li>\n\
						<li><div class="text_chat_box"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            } else if (response.messages[i].fromUser == true){
                reply += '<ul class="list">\n\
						<li><div class="chat_text_time chat_align">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name chat_align">' + response.messages[i].saslName + '</div></li>\n\
						<li><div class="text_chat_reply"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            }
        }
        reply_final = '<div class="chat_container" id="MyAppMessages_chat_container"><div class="chat_list">' + reply + '</div></div>';
        Ext.getCmp('MyAppMessages_reply_panel').update(reply_final);
        $("#MyAppMessages_chat_container").perfectScrollbar('destroy');
        $("#MyAppMessages_chat_container").perfectScrollbar();*/

    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.sendMessageToUser, "POST", data, onsuccess, onerror);
}
com.faralam.common.sendMessageToUserNew = function () {
    console.log("two");
    com.faralam.sendMessageToUser = com.faralam.serverURL + 'communication/sendMessageToUser';
    com.faralam.sendMessageToUser = com.faralam.sendMessageToUser + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
    var m_id=Ext.getCmp('MyMemberMessages_offset').getValue();
    var m_inReplyTo=Ext.getCmp('MyMemberMessages_communicationId').getValue();
    if (m_id=="null")
        {
          m_id=null;  
        }
    if(m_inReplyTo=="null")
        {
         m_inReplyTo=null;   
        }
    var data = {
        //"messageSend":Ext.getCmp('MyAppMessages_reply_tf').getValue(),
        "messageBody": Ext.getCmp('Mymember_reply_tf').getValue(),
        "fromServiceLocationId": sessionStorage.SL,
        "urgent": 'false',
        "userName": sessionStorage.userName,
        "communicationId": m_inReplyTo ,
        "fromServiceAccommodatorId": sessionStorage.SA,
        "inReplyToCommunicationId": m_id,
        "authorId": sessionStorage.UID
    };
    /*"inReplyTo":Ext.getCmp('MyMemberMessages_offset').getValue(),
        "id":Ext.getCmp('MyMemberMessages_communicationId').getValue() */
    data = JSON.stringify(data);
    console.log("data="+data);
    console.log("url="+com.faralam.sendMessageToUser);
    var onsuccess = function (response, textStatus, jqXHR) {
        
        //console.log(sessionStorage.userName);
        //com.faralam.common.getMessagesForUser();
        Ext.getCmp('Mymember_reply_tf').setValue('');
        com.faralam.common.getConversationBetweenSASLUserNew3(sessionStorage.userName,'');
        reply = '';

        /*for (i = 0; i < response.messages.length; i++) {
            if (response.messages[i].fromUser == false) {
                reply += '<ul>\n\
						<li><div class="chat_text_time">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name">' + response.messages[i].saslName + '</div></li>\n\
						<li><div class="text_chat_box"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            } else if(response.messages[i].fromUser== true) {
                reply += '<ul class="list">\n\
						<li><div class="chat_text_time chat_align">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name chat_align">' + response.messages[i].userName + '</div></li>\n\
						<li><div class="text_chat_reply"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            }
        }
        reply_final = '<div class="chat_container" id="MyAppMessages_chat_container"><div class="chat_list">' + reply + '</div></div>';

	
        Ext.getCmp('member_reply_panel').update(reply_final);
        $("#MyAppMessages_chat_container").perfectScrollbar('destroy');
        $("#MyAppMessages_chat_container").perfectScrollbar();*/

    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.sendMessageToUser, "POST", data, onsuccess, onerror);
}
com.faralam.common.sendMessageToUserNew2 = function (e) {
    console.log("three");
    com.faralam.sendMessageToUser = com.faralam.serverURL + 'communication/sendMessageToUser';
    com.faralam.sendMessageToUser = com.faralam.sendMessageToUser + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
    var data = {
        //"messageSend":Ext.getCmp('MyAppMessages_reply_tf').getValue(),
        "messageBody": e.getAttribute('msgBody'),
        "fromServiceLocationId": sessionStorage.SL,
        "urgent": e.getAttribute('urgent'),
        "userName": e.getAttribute('unm'),
        "communicationId": e.getAttribute('comId'),
        "fromServiceAccommodatorId": sessionStorage.SA,
        "inReplyToCommunicationId": e.getAttribute('replyComId'),
        "authorId": e.getAttribute('auId')
    };
    console.log(data);
    data = JSON.stringify(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        console.log(response);
        //com.faralam.common.getMessagesForUser();
        reply = '';

        for (i = 0; i < response.messages.length; i++) {
            if (response.messages[i].fromUser == false) {
                reply += '<ul>\n\
						<li><div class="chat_text_time">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name">' + response.messages[i].saslName + '</div></li>\n\
						<li><div class="text_chat_box"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            } else if (response.messages[i].fromUser == true) {
                reply += '<ul class="list">\n\
						<li><div class="chat_text_time chat_align">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name chat_align">' + response.messages[i].userName + '</div></li>\n\
						<li><div class="text_chat_reply"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            }
        }
        reply_final = '<div class="chat_container" style="background-color:transparent" id="MyAppMessages_chat_container"><div class="chat_list">' + reply + '</div></div>';

	
        Ext.getCmp('member_reply_panel').update(reply_final);
		Ext.getCmp('member_message_panel').hide();
        Ext.getCmp('member_profile_panel').hide();
        Ext.getCmp('member_reply_panel').show();
        $("#MyAppMessages_chat_container").perfectScrollbar('destroy');
        $("#MyAppMessages_chat_container").perfectScrollbar();

    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.sendMessageToUser, "POST", data, onsuccess, onerror);
}

com.faralam.common.getConversationBetweenSASLUser = function (e) {
    console.log(e.getAttribute('com_id'));
    console.log(e.getAttribute('class'));
    com.faralam.getConversationBetweenSASLUser = com.faralam.serverURL + 'communication/getConversationBetweenSASLUser';
    com.faralam.getConversationBetweenSASLUser = com.faralam.getConversationBetweenSASLUser + "?" + encodeURI('userName=' + e.getAttribute('un') + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&count=10');

    var onsuccess = function (response, textStatus, jqXHR) {
        console.log(response);
        //com.faralam.common.getMessagesForUser();
        reply = '';

        for (i = 0; i < response.messages.length; i++) {
            if (response.messages[i].fromUser == false) {
                reply += '<ul>\n\
						<li><div class="chat_text_time">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name">' + response.messages[i].saslName + '</div></li>\n\
						<li><div class="text_chat_box"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            } else if (response.messages[i].fromUser == true){
                reply += '<ul class="list">\n\
						<li><div class="chat_text_time chat_align">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name chat_align">' + response.messages[i].userName + '</div></li>\n\
						<li><div class="text_chat_reply"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            }
        }
        reply_final = '<div class="chat_container" id="MyAppMessages_chat_container3" style="height:586px"><div  class="chat_list">' + reply + '</div></div>';

        Ext.getCmp('MyAppMessages_review_panel').hide();
        Ext.getCmp('MyAppMessages_message_panel').hide();
        Ext.getCmp('MyAppMessages_reply_container').show();
        Ext.getCmp('MyAppMessages_reply_container').getEl().slideIn('r', {
            stopAnimation: true,
            duration: 200
        });
        $('.MyAppMessagesBgMessage').css('background', '#B8B8E6');
        $('.MyAppMessagesBgReview').css('background', '#FFFFFF');

        Ext.getCmp('MyAppMessages_mb').setValue(e.getAttribute('mb'));
        Ext.getCmp('MyAppMessages_urgent').setValue(e.getAttribute('urgent'));
        Ext.getCmp('MyAppMessages_un').setValue(e.getAttribute('un'));
        
        Ext.getCmp('MyAppMessages_in_reply_to_com_id').setValue(e.getAttribute('in_reply_to_com_id'));
        Ext.getCmp('MyAppMessages_ts').setValue(e.getAttribute('ts'));
        Ext.getCmp('MyAppMessages_sasl').setValue(e.getAttribute('sasl'));
        Ext.getCmp('MyAppMessages_com_id').setValue(e.getAttribute('com_id'));
        Ext.getCmp('MyAppMessages_offset').setValue(e.getAttribute('c_off_id'));
        Ext.getCmp('MyAppMessages_reply_panel').update(reply_final);
        $("#MyAppMessages_chat_container3").perfectScrollbar('destroy');
        $("#MyAppMessages_chat_container3").perfectScrollbar();
        /*var h=$('#MyAppMessages_chat_container2 ul:last').offset().top;
        $('#MyAppMessages_chat_container2').scrollTop(h).perfectScrollbar('update');*/
        $('#MyAppMessages_chat_container3').animate({
    scrollTop: $('#MyAppMessages_chat_container3 ul:last-child').position().top + 'px'
        }, 1000);

    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.getConversationBetweenSASLUser, "GET", {}, onsuccess, onerror);
}
com.faralam.common.getConversationBetweenSASLUser_fromfn = function (usrnm){
    console.log("Called"+usrnm);
    com.faralam.getConversationBetweenSASLUser_fromfn = com.faralam.serverURL + 'communication/getConversationBetweenSASLUser';
    com.faralam.getConversationBetweenSASLUser_fromfn = com.faralam.getConversationBetweenSASLUser_fromfn + "?" + encodeURI('userName=' + usrnm + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&count=10');

    var onsuccess = function (response, textStatus, jqXHR) {
        console.log(response);
        //com.faralam.common.getMessagesForUser();
        reply = '';

        for (i = 0; i < response.messages.length; i++) {
            if (response.messages[i].fromUser == false) {
                reply += '<ul>\n\
						<li><div class="chat_text_time">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name">' + response.messages[i].saslName + '</div></li>\n\
						<li><div class="text_chat_box"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            } else if (response.messages[i].fromUser == true){
                reply += '<ul class="list">\n\
						<li><div class="chat_text_time chat_align">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name chat_align">' + response.messages[i].userName + '</div></li>\n\
						<li><div class="text_chat_reply"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            }
        }
        reply_final = '<div class="chat_container" id="MyAppMessages_chat_container2" style="height:586px"><div  class="chat_list">' + reply + '</div></div>';
        Ext.getCmp('MyAppMessages_reply_panel').update(reply_final);
        $("#MyAppMessages_chat_container2").perfectScrollbar('destroy');
        $("#MyAppMessages_chat_container2").perfectScrollbar();
        $('#MyAppMessages_chat_container2').animate({
    scrollTop: $('#MyAppMessages_chat_container2 ul:last-child').position().top + 'px'
        }, 1000);

}
    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.getConversationBetweenSASLUser_fromfn, "GET", {}, onsuccess, onerror);
    }
com.faralam.common.getConversationBetweenSASLUserNew = function (e) {
    
    com.faralam.getConversationBetweenSASLUser = com.faralam.serverURL + 'communication/getConversationBetweenSASLUser';
    com.faralam.getConversationBetweenSASLUser = com.faralam.getConversationBetweenSASLUser + "?" + encodeURI('userName=' + e.getAttribute('un') + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&count=10');

    var onsuccess = function (response, textStatus, jqXHR) {
        console.log(response);
        reply = '';

        for (i = 0; i < response.messages.length; i++) {
            if (response.messages[i].fromUser == false) {
                reply += '<ul>\n\
						<li><div class="chat_text_time">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name">' + response.messages[i].saslName + '</div></li>\n\
						<li><div class="text_chat_box"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            } else if (response.messages[i].fromUser == true){
                reply += '<ul class="list">\n\
						<li><div class="chat_text_time chat_align">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name chat_align">' + response.messages[i].userName + '</div></li>\n\
						<li><div class="text_chat_reply"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            }
        }
        reply_final = '<div class="chat_container" id="MyAppMessages_chat_container"><div class="chat_list">' + reply + '</div></div>';

        Ext.getCmp('member_message_panel').hide();
        Ext.getCmp('member_profile_panel').hide();
        Ext.getCmp('member_reply_panel').show();
        Ext.getCmp('member_reply_panel').getEl().slideIn('r', {
            stopAnimation: true,
            duration: 200
        });
        /*$('.MyAppMessagesBgMessage').css('background', '#B8B8E6');*/
        $('.member_reply_panel').css('background', '#FFFFFF');

        Ext.getCmp('MyMemberMessages_urgent').setValue(response.urgent);
        Ext.getCmp('MyMemberMessages_un').setValue(response.userName);
        Ext.getCmp('MyMemberMessages_ts').setValue(response.timeStamp);
        Ext.getCmp('MyMemberMessages_aid').setValue(response.authorId);
		
        Ext.getCmp('member_reply_panel').update(reply_final);
        var inReplyTo=null;
        var id=null;
        Ext.getCmp('MyMemberMessages_offset').setValue("null");
        Ext.getCmp('MyMemberMessages_communicationId').setValue("null");
        $("#MyAppMessages_chat_container").perfectScrollbar('destroy');
        $("#MyAppMessages_chat_container").perfectScrollbar();
        $('#MyAppMessages_chat_container').animate({
    scrollTop: $('#MyAppMessages_chat_container ul:last-child').position().top + 'px'
        }, 1000);
    
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.getConversationBetweenSASLUser, "GET", {}, onsuccess, onerror);
}
com.faralam.common.getConversationBetweenSASLUserNew2 = function (username) {
    console.log("New2");
     Ext.getCmp('membersHeaderRight').update('');
    com.faralam.getConversationBetweenSASLUser = com.faralam.serverURL + 'communication/getConversationBetweenSASLUser';
    com.faralam.getConversationBetweenSASLUser = com.faralam.getConversationBetweenSASLUser + "?" + encodeURI('userName=' + username + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&count=10');

    var onsuccess = function (response, textStatus, jqXHR) {
       Ext.getCmp('member_message_panel').update('');
        reply = '';
        /*<div id="MyAppMessages_conversesion_customer" style="overflow:hidden;height:527px; width:730px;margin-left:10px;border:2px solid black">*/
		var reply_final = '<table class="MyAppMessages_review_table" id="MyMemberMessagesReviewTable" style="height:auto;width:726px !important"><tr><th class="border_none font_normal" width="160px"><strong>Member</strong></th><th class="border_none font_normal" width="400px"><strong>Message</strong></th><td class="border_none font_normal" width="210px"><button type="button" class="msg_reply_btn" mb="" urgent="" un="'+username+'" com_id="null" in_reply_to_com_id="" ts="" sasl="" offset="null" onclick="com.faralam.common.getConversationBetweenSASLUserNew(this)" id="memberCreatMessageButton">Create Message</button></td></tr>';
        for (i = 0; i < response.messages.length; i++) {
			if(response.messages[i].fromUser==true){
                var fal=false;
                reply += '<tr><td><div>' + response.messages[i].userName + '</div></td><td><div>' + response.messages[i].messageBody + '</div></td><td><div><button type="button" class="msg_reply_btn" onclick="com.faralam.common.getConversationBetweenSASLUserNew3('+fal+',this)" id="memberReplyMessageButton" msgBody="'+response.messages[i].messageBody+'" urgent="'+response.messages[i].urgent+'"  unm="'+response.messages[i].userName+'" unm="'+response.messages[i].userName+'" comId="'+response.messages[i].communicationId+'" offset="'+response.messages[i].offset+'" replyComId="'+response.messages[i].inReplyToCommunicationId+'" auId="'+response.messages[i].authorId+'">Reply</button></div></td></tr>';
        }
        }
        reply_final += reply + '</table>';
		Ext.getCmp('member_message_panel').update(reply_final);
        $("#member_message_panel").perfectScrollbar('destroy');
        $("#member_message_panel").perfectScrollbar();
        
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.getConversationBetweenSASLUser, "GET", {}, onsuccess, onerror);
}
com.faralam.common.getConversationBetweenSASLUserNew3 = function (username,e) {
    if(!username && e)
        {
   username=e.getAttribute('unm');
      }
    com.faralam.getConversationBetweenSASLUser = com.faralam.serverURL + 'communication/getConversationBetweenSASLUser';
    com.faralam.getConversationBetweenSASLUser = com.faralam.getConversationBetweenSASLUser + "?" + encodeURI('userName=' + username + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&count=10');

    var onsuccess = function (response, textStatus, jqXHR) {
        console.log(response);
        //com.faralam.common.getMessagesForUser();
        reply = '';

        for (i = 0; i < response.messages.length; i++) {
            if (response.messages[i].fromUser == false) {
                
                reply += '<ul>\n\
						<li><div class="chat_text_time">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name">' + response.messages[i].saslName + '</div></li>\n\
						<li><div class="text_chat_box"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            } else if(response.messages[i].fromUser == true) {
                
                reply += '<ul class="list">\n\
						<li><div class="chat_text_time chat_align">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name chat_align">' + response.messages[i].userName + '</div></li>\n\
						<li><div class="text_chat_reply"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            }
        }
        reply_final = '<div class="chat_container"  id="MyAppMessages_chat_container" style="height:586px"><div class="chat_list">' + reply + '</div></div>';

	    
        Ext.getCmp('member_reply_panel').update(reply_final);
		Ext.getCmp('member_message_panel').hide();
        Ext.getCmp('member_profile_panel').hide();
        Ext.getCmp('member_reply_panel').show();
        $("#MyAppMessages_chat_container").perfectScrollbar('destroy');
        $("#MyAppMessages_chat_container").perfectScrollbar();
        $('#MyAppMessages_chat_container').animate({
    scrollTop: $('#MyAppMessages_chat_container ul:last-child').position().top + 'px'
        }, 10);
        if(e)
            {
                var id=e.getAttribute('comId');
                var inReplyTo=e.getAttribute('offset');
                Ext.getCmp('MyMemberMessages_offset').setValue(inReplyTo);
                Ext.getCmp('MyMemberMessages_communicationId').setValue(id);
            }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.getConversationBetweenSASLUser, "GET", {}, onsuccess, onerror);
}



com.faralam.common.takeReviewOffline = function (e) {
    
    com.faralam.takeReviewOffline = com.faralam.serverURL + 'communication/takeReviewOffline';
    com.faralam.takeReviewOffline = com.faralam.takeReviewOffline + "?" + encodeURI('UID=' + sessionStorage.UID + '&communicationId=' + e.getAttribute('com_id') + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (response, textStatus, jqXHR) {
        //console.log(response);
        //com.faralam.common.getMessagesForUser();
       /* reply = '';

        for (i = 0; i < response.messages.length; i++) {
            if (response.messages[i].fromUser == false) {
                reply += '<ul>\n\
						<li><div class="chat_text_time">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name">' + response.messages[i].saslName + '</div></li>\n\
						<li><div class="text_chat_box"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            } else if (response.messages[i].fromUser == true) {
                reply += '<ul class="list">\n\
						<li><div class="chat_text_time chat_align">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name chat_align">' + response.messages[i].userName + '</div></li>\n\
						<li><div class="text_chat_reply"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            }
        }
        reply_final = '<div class="chat_container" id="MyAppMessages_chat_container"><div class="chat_list">' + reply + '</div></div>';
*/      //com.faralam.common.getCommunicationsForSASL(true);
        Ext.getCmp('MyAppMessages_review_panel').hide();
        Ext.getCmp('MyAppMessages_message_panel').hide();
        Ext.getCmp('MyAppMessages_reply_container').show();
        /*Ext.getCmp('MyAppMessages_reply_container').getEl().slideIn('r', {
            stopAnimation: true,
            duration: 200
        });*/
        $('.MyAppMessagesBgMessage').css('background', '#B8B8E6');
        $('.MyAppMessagesBgReview').css('background', '#FFFFFF');

        Ext.getCmp('MyAppMessages_mb').setValue(e.getAttribute('mb'));
        Ext.getCmp('MyAppMessages_urgent').setValue(e.getAttribute('urgent'));
        Ext.getCmp('MyAppMessages_un').setValue(e.getAttribute('un'));
        Ext.getCmp('MyAppMessages_com_id').setValue(e.getAttribute('com_id'));
        Ext.getCmp('MyAppMessages_in_reply_to_com_id').setValue(e.getAttribute('in_reply_to_com_id'));
        Ext.getCmp('MyAppMessages_ts').setValue(e.getAttribute('ts'));
        Ext.getCmp('MyAppMessages_sasl').setValue(e.getAttribute('sasl'));
        Ext.getCmp('MyAppMessages_offset').setValue(e.getAttribute('r_off_id'));

        //Ext.getCmp('MyAppMessages_reply_panel').update(reply_final);
        $("#MyAppMessages_chat_container").perfectScrollbar('destroy');
        $("#MyAppMessages_chat_container").perfectScrollbar();
        com.faralam.common.getCommunicationsForSASL_fromfn(e.getAttribute('un'));
        //Ext.getCmp('MyAppMessages_reply_panel').show();
        
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.takeReviewOffline, "GET", {}, onsuccess, onerror);
}

com.faralam.common.getMessagesForUser = function () {

    com.faralam.getMessagesForUser = com.faralam.serverURL + 'communication/getMessagesForUser';
    com.faralam.getMessagesForUser = com.faralam.getMessagesForUser + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (response, textStatus, jqXHR) {
        console.log(response);
        var reply = '';
        /*for(i=0;i<dummyData.length;i++){
        	if(dummyData[i].inReplyToCommunicationId==2){
        		reply+= ' <ul>\n\
        				 <li><div class="chat_text_time">'+dummyData[i].timeStamp+'</div></li> \n\
        				   <li><div class="chat_text_name">'+dummyData[i].saslName+'</div></li>\n\
        				  <li><div class="text_chat_reply"><p>'+dummyData[i].messageBody+'</p></div></li>\n\
        			  </ul>';
        	}
        	else{
        		reply+='<ul class="list">\n\
        				 <li><div class="chat_text_time chat_align">'+dummyData[i].timeStamp+'</div></li> \n\
        				   <li><div class="chat_text_time chat_align">'+dummyData[i].saslName+'</div></li>\n\
        				  <li><div class="chat_text_time chat_align"><p>'+dummyData[i].messageBody+'</p></div></li>\n\
        			  </ul>';
        	}
        }
        reply_final='<div class="chat_container"><div class="chat_list">'+reply+'</div></div>';
        Ext.getCmp('MyAppMessages_reply_panel').update(reply_final);*/
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.getMessagesForUser, "GET", {}, onsuccess, onerror);
}
com.faralam.common.retriveEmailHTMLJSONBySASL = function () {
    //http://simfel.com/apptsvc/rest/html/retriveEmailHTMLJSONBySASL?UID=someuid&serviceAccommodatorId=RESTCD3&serviceLocationId=RESTCD3
    com.faralam.retriveEmailHTMLJSONBySASL = com.faralam.serverURL + 'html/retriveEmailHTMLJSONBySASL';
    com.faralam.retriveEmailHTMLJSONBySASL = com.faralam.retriveEmailHTMLJSONBySASL + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
    /*var data = {
        "topic": Ext.getCmp('newsletterTitle').getValue(),
        "newsSummary": Ext.getCmp('newsletterMessage').getValue(),
        "includeBlogEntry": Ext.getCmp('newsletter_blog').getValue(),
        "includeGallery": Ext.getCmp('newsletter_gallery').getValue(),
        "serviceAccommodatorId": sessionStorage.SA,
        "includeMenu": Ext.getCmp('newsletter_menu').getValue(),
        "serviceLocationId": sessionStorage.SL,
        "includePromotions": Ext.getCmp('newsletter_promotions').getValue()
    };*/
    var module_arr=sessionStorage.adsModule;
    var module_arr2=module_arr.split("*");
    var final_arr=new Array();
    for (var i=0;i<module_arr2.length;i++){
                    if(module_arr2[i].trim()!='')
                        {
                        final_arr.push(module_arr2[i]);
                        }
                }
    var data={
    "topic": Ext.getCmp('newsletterTitle').getValue(),
    "newsSummary": Ext.getCmp('newsletterMessage').getValue(),
    "serviceAccommodatorId": sessionStorage.SA,
    "serviceLocationId": sessionStorage.SL,
    "modulesToIncludeInNewsLetter": final_arr
    };
    console.log("uril="+com.faralam.retriveEmailHTMLJSONBySASL);
        /*["GALLERY", "PROMOTIONS", "MENU_CATALOG", "BLOG", "EVENTS", "VIDEOS", "LOYALITY_PROGRAMS", "INTERACTIVE_ADS_POLLS", "INTERACTIVE_ADS_PHOTO"]*/
    data = JSON.stringify(data);
    console.log(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        //console.log(response);
        var sub='<span style="color:#000;font-weight:bold">'+response.subject+'</span>';
        Ext.getCmp('newsletterTitledisplay').update(sub);
        Ext.getCmp('newsletterBodydisplay').update(response.html);
        $("#newsletterMainDisplay").perfectScrollbar('destroy');
        $("#newsletterMainDisplay").perfectScrollbar();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retriveEmailHTMLJSONBySASL, "POST", data, onsuccess, onerror);
}

com.faralam.common.sendEmailHTMLBySASL = function (modal) {
    var members = "";
    for (i = 0; i < com.faralam.newsletterMembers.length; i++) {
        members += com.faralam.newsletterMembers[i] + ',';
    }
    members = members.substring(0, members.length - 1);

    com.faralam.sendEmailHTMLBySASL = com.faralam.serverURL + 'communication/sendEmailHTMLBySASL';
    com.faralam.sendEmailHTMLBySASL = com.faralam.sendEmailHTMLBySASL + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    /*var data = {
        "title": Ext.getCmp('newsletterTitle').getValue(),
        "message": Ext.getCmp('newsletterMessage').getValue(),
        "includeGallery": Ext.getCmp('newsletter_gallery').getValue(),
        "includePromotions": Ext.getCmp('newsletter_menu').getValue(),
        "includeBlogEntry": Ext.getCmp('newsletter_blog').getValue(),
        "includeMenuCatalog": Ext.getCmp('newsletter_promotions').getValue(),
        "usernames": [members]
    };*/
    var module_arr=sessionStorage.adsModule;
    var module_arr2=module_arr.split("*");
    var final_arr=new Array();
    for (var i=0;i<module_arr2.length;i++){
                    if(module_arr2[i].trim()!='')
                        {
                        final_arr.push(module_arr2[i]);
                        }
                }
    var data={
    "message": Ext.getCmp('newsletterMessage').getValue(),
    "title": Ext.getCmp('newsletterTitle').getValue(),
    "usernames": [members],
    "modulesToIncludeInNewsLetter": final_arr
};
    data = JSON.stringify(data);
console.log(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', " Sent successfully",function(){
           // Ext.getCmp('HtmlEmail_modal').close();
            modal.close();
        });
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.sendEmailHTMLBySASL, "POST", data, onsuccess, onerror);
}

com.faralam.common.setNewsletterMembers = function (field) {
        //console.log(field.checked);
        if (field.checked == true) {
            var index = com.faralam.newsletterMembers.indexOf(field.value);
            if (index > -1) {
                com.faralam.newsletterMembers.splice(index, 1);
            }
            com.faralam.newsletterMembers.push(field.value);
        } else {
            var index = com.faralam.newsletterMembers.indexOf(field.value);
            com.faralam.newsletterMembers.splice(index, 1);
        }
    }
    // ############################## My Message Section End ###################################//
com.faralam.common.AdAlertPopup = function () {
    //Ext.getCmp('adComponent').show();
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var AdAlert_modal;

    if (Ext.getCmp('AdAlert_modal')) {
        var modal = Ext.getCmp('AdAlert_modal');
        modal.destroy(modal, new Object());
    }
    if (!AdAlert_modal) {
        var AdAlert_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            //cls: 'blue_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:680px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Text (160 cr)',
                                    labelSeparator: ':',
                                    emptyText: '',
                                    inputWidth: 380,
                                    // height: 150,
                                    margin: '20 0 0 10',
                                    name: '',
                                    value: '',
                                    id: 'adAlert_notificationBody',
                                    allowBlank: false
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'combo',
                                            fieldLabel: 'Duration',
                                            labelSeparator: ':',
                                            name: 'adAlertDuration',
                                            emptyText: '',
                                            id: 'adAlertDuration',
                                            queryMode: 'local',
                                            displayField: 'value',
                                            valueField: 'value1',
                                            autoSelect: true,
                                            forceSelection: false,
                                            width: 315,
                                            margin: '20 0 0 10',
                                            editable: false,
                                            store: Ext.create('Ext.data.ArrayStore', {
                                                fields: ['id', 'value', 'value1'],
                                                autoLoad: false,
                                                proxy: {
                                                    type: 'ajax',
                                                    url: '',
                                                    reader: {
                                                        type: 'json',
                                                        getData: function (data) {
                                                            //console.log(data);
                                                            var temparray = [];
                                                            var count = 0;
                                                            Ext.each(data, function (rec) {
                                                                temparray.push([]);
                                                                temparray[count].push(new Array(1));
                                                                temparray[count]['id'] = rec.enumText + ',' + rec.id;
                                                                temparray[count]['value'] = rec.displayText;
                                                                temparray[count]['value1'] = rec.enumText;
                                                                count = count + 1;
                                                            });
                                                            data = temparray;
                                                            return data;
                                                        }
                                                    },
                                                    listeners: {
                                                        exception: function (proxy, response, operation) {
                                                            com.faralam.common.ErrorHandling(response.responseText);
                                                        }
                                                    }
                                                }
                                            })
                                        },
                                        {
                                            xtype: 'container',
                                            defaultType: 'button',
                                            width: 160,
                                            style: 'text-align:center;',
                                            margin: '0 0 0 40',
                                            items: [
                                                {
                                                    text: '<span style="color:#fff !important;">Submit</span>',
                                                    style: 'background:#007AFF !important;border:2px solid #000 !important;',
                                                    margin: '20 0 10 0',
                                                    handler: function () {
                                                        if (AdAlert_modal_form.getForm().isValid()) {
                                                            com.faralam.common.saveAdAlert();
                                                        }
                                                    }
                                                }]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        AdAlert_modal = Ext.widget('window', {
            title: 'Ad Alert',
            id: 'AdAlert_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 540,
            cls: 'blue_modal',
            //height:410,
            items: AdAlert_modal_form,
            listeners: {
                close: function () {
                    AdAlert_modal_form.getForm().reset(true);
                },
                show: function () {
                    Ext.getCmp('adAlertDuration').getStore().removeAll();
                    Ext.getCmp('adAlertDuration').getStore().proxy.url = com.faralam.serverURL + 'communication/getDurationTimesForAdAlert?&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL;
                    Ext.getCmp('adAlertDuration').getStore().reload();
                }

            }
        });
    }
    AdAlert_modal.show();


}

com.faralam.common.saveAdAlert = function () {
    com.faralam.saveAdAlart = com.faralam.serverURL + 'communication/sendNotification';
    com.faralam.saveAdAlart = com.faralam.saveAdAlart + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "fromServiceLocationId": sessionStorage.SL,
        "urgent": false,
        "notificationBody": Ext.getCmp('adAlert_notificationBody').getValue(),
        //"expiration": Ext.getCmp('adAlertDuration').getValue(), 
        "fromServiceAccommodatorId": sessionStorage.SA,
        "authorId": sessionStorage.UID
    };

    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Ad Alert saved successfully.', function () {
            Ext.getCmp('AdAlert_modal').close();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.saveAdAlart, "POST", data, onsuccess, onerror);
}


/*com.faralam.common.adComponentClose = function(){
    Ext.getCmp('adComponent').hide();
}*/

com.faralam.common.HtmlEmailPopup = function () {
    //Ext.getCmp('adComponent').show();
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var HtmlEmail_modal;

    if (Ext.getCmp('HtmlEmail_modal')) {
        var modal = Ext.getCmp('HtmlEmail_modal');
        modal.destroy(modal, new Object());
    }
    if (!HtmlEmail_modal) {
        var HtmlEmail_modal_form = Ext.widget('form', {
            layout: {
                type: 'table',
                columns: 4,
                align: 'stretch'
            },
            cls: 'blue_bg',
            border: false,
            bodyPadding: 0,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            //defaultType: 'textfield',
            defaults: {
                frame: false
            },
            items: [
                {
                    xtype: 'panel',
                    id: 'slide_panel_HtmlEmailService',
                    style: 'width:200px !important;',
                    html: '',
                    rowspan: 2,
                    height: 410
            },
                {
                    xtype: 'htmleditor',
                    fieldLabel: '',
                    labelSeparator: ':',
                    emptyText: '',
                    inputWidth: 710,
                    height: 350,
                    margin: '0 0 0 0',
                    name: '',
                    value: '',
                    id: 'HtmlEmail_Body',
                    allowBlank: false,
                    width: 710,
                    style: 'background:#fff !important;',
                    colspan: 3
            }, {
                    xtype: 'component',
                    style: 'width: 440px;text-align: center;display: table-cell;vertical-align: middle;padding: 10px 5px;background: #7f7f7f;margin: 0px 0px 0px 40px;height: 77px;',
                    html: '<div class="email_footer_details">I certify that the recipient has agreed<br> to receive this Text/E-Mail message</div>'
            }, {
                    xtype: 'component',
                    style: 'width: 120px;text-align: center;display: table-cell;vertical-align: bottom;padding: 10px 5px;background: #7f7f7f;margin: 0px 0px 0px 40px;height: 77px;',
                    html: '<div class="switch_email"><input id="HtmlEmail_switch_toggle" class="cmn-toggle cmn-toggle-round" type="checkbox" onclick="com.faralam.common.operateSwitchCheckbox(this, ' + "'HtmlEmail_agree'" + ')"><label for="HtmlEmail_switch_toggle"></label></div>'
            },
                {
                    xtype: 'hiddenfield',
                    id: 'HtmlEmail_agree',
                    name: '',
                    value: ''
            },
                {
                    xtype: 'container',
                    defaultType: 'button',
                    style: '  text-align: center;display: table-cell;vertical-align: bottom;padding: 10px 5px;background: #7f7f7f;margin: 0px 0px 0px 40px;width: 160px;height: 77px;',
                    margin: '0 0 0 40',
                    items: [
                        {
                            text: '<span style="color:#fff !important;">Send E-Mail</span>',
                            style: 'background:#007AFF !important;border:2px solid #000 !important;',
                            margin: '20 0 10 0',
                            handler: function () {
                                if (HtmlEmail_modal_form.getForm().isValid()) {
                                    com.faralam.common.saveRichEmail();
                                }
                            }
                    }]
            }]
        });

        HtmlEmail_modal = Ext.widget('window', {
            title: '<div style="padding-top: 5px;width:196px;height: 28px;border-right:2px solid #3459a0;float:left;font-size:14px;color:#ffffff;text-align:center;">Members</div><div style="padding-top: 5px;height: 28px;float:left;font-size:14px;color:#ffffff;text-align:center;margin-left: 280px;">EMail Preview</div>',
            id:'HtmlEmail_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 920,
            cls: 'blue_modal',
            //height:410,
            items: HtmlEmail_modal_form,
            listeners: {
                close: function () {
                    HtmlEmail_modal_form.getForm().reset(true);
                },
                show: function () {
                    com.faralam.common.getMemberList_func('HtmlEmailService');
                    com.faralam.common.retrieveRichEmail();
                }

            }
        });
    }
    HtmlEmail_modal.show();


}

/*=============== NEW POPUP CODE FOR NEWSLETTER ==============================*/
//com.faralam.common.retriveEmailHTMLJSONBySASL = function(){
//    console.log("Function called");
//}
com.faralam.common.newsLetterPopup = function () {
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

        var newsLetterGallery = false;
        var newsLetterPromotion = false;
        var newsLetterMenu = false;
        var newsLetterBlog = false;

        var HtmlEmail_modal;

        if (Ext.getCmp('HtmlEmail_modal')) {
            var modal = Ext.getCmp('HtmlEmail_modal');
            modal.destroy(modal, new Object());
        }
        if (!HtmlEmail_modal) {
            var HtmlEmail_modal_form = Ext.widget('form', {
                layout: {
                    type: 'table',
                    columns: 4,
                    align: 'stretch'
                },
                border: false,
                bodyPadding: 0,
                fieldDefaults: {
                    labelAlign: 'side',
                    labelWidth: 80,
                    labelStyle: 'font-weight:bold'
                },
                //defaultType: 'textfield',
                defaults: {
                    frame: false
                },
                items: [
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        style: 'width:700px !important; height:400px !important',
                        id: 'newsletterScreen1',
                        items: [{
                                xtype: 'button',
                                margin: '10 10 10 595',
                                text: '<span style="color:#fff;">Next</span>',
                                scale: 'small',
                                width: 75,
                                style: 'cursor:pointer;background:#006FC0 !important;border:2px solid #000 !important;box-shadow:none !important;',
                                handler: function () {
                                    Ext.getCmp('newsletterScreen2').show();
                                    Ext.getCmp('newsletterScreen1').hide();
                                    Ext.getCmp('newsletterScreen3').hide();
                                    Ext.getCmp('newsletterScreen4').hide();
                                    com.faralam.common.getModulestoIncludeinNewletter();
                                }
                        },
                            {
                                xtype: 'textfield',
                                fieldLabel: '<h3 style="color: #000000 ; margin-right: 10px;">Title</h3>',
                                inputType: 'text',
                                name: 'title',
                                // afterLabelTextTpl: required,
                                allowBlank: false,
                                emptyText: '',
                                id: 'newsletterTitle',
                                msgTarget: 'none',
                                inputWidth: 500,
                                inputHeight: 32,
                                margin: '10 0 0 0',
                                labelAlign: 'right',
                                labelWidth: 120,
                                inputColor: '#000000',
                                style: ' border-radius: 3px !important; padding: 15px !important;'
                    }, {
                                xtype: 'textareafield',
                                fieldLabel: '<h3 style="color: #000000 ; margin-right: 10px;">Message</h3>',
                                inputType: 'text',
                                name: 'message',
                                // afterLabelTextTpl: required,
                                allowBlank: false,
                                emptyText: '',
                                id: 'newsletterMessage',
                                msgTarget: 'none',
                                inputWidth: 500,
                                inputHeight: 200,
                                margin: '10 0 0 0',
                                labelAlign: 'right',
                                labelWidth: 120,
                                inputColor: '#000000',
                                style: ' border-radius: 3px !important; padding: 15px !important;'
                    }
            ]
            },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        style: 'width:700px !important; height:400px !important',
                        id: 'newsletterScreen2',
                        items: [
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                style: 'width:700px !important;',
                                items: [
                                    {
                                        xtype: 'button',
                                        margin: '10 10 10 10',
                                        text: '<span style="color:#fff;">Back</span>',
                                        scale: 'small',
                                        width: 75,
                                        style: 'cursor:pointer;background:#C6C6C6 !important;border:2px solid #000 !important;box-shadow:none !important;',
                                        handler: function () {
                                            Ext.getCmp('newsletterScreen1').show();
                                            Ext.getCmp('newsletterScreen2').hide();
                                            Ext.getCmp('newsletterScreen3').hide();
                                            Ext.getCmp('newsletterScreen4').hide();
                                        }
                            },
                                    {
                                        xtype: 'button',
                                        margin: '10 10 10 500',
                                        text: '<span style="color:#fff;">Next</span>',
                                        scale: 'small',
                                        width: 75,
                                        style: 'cursor:pointer;background:#006FC0 !important;border:2px solid #000 !important;box-shadow:none !important;',
                                        handler: function () {
                                            com.faralam.common.retriveEmailHTMLJSONBySASL();
                                            Ext.getCmp('newsletterScreen3').show();
                                            Ext.getCmp('newsletterScreen1').hide();
                                            Ext.getCmp('newsletterScreen2').hide();
                                            Ext.getCmp('newsletterScreen4').hide();
                                        }
                            }]
                        },{
                            xtype: 'container',
                            id:'news_letter_hidden_field',
                            width: 180,
                            items: []
                            },
                            {
                            xtype: 'container',
                            layout: 'hbox',
                            id:'news_letter_module_switch',
                            style:"height:300px !important;margin: 38px 3px 8px 250px;border:2px solid black",
                            items: [],
                            html:''
                            }
                            /*{
                                xtype: 'fieldcontainer',
                                fieldLabel: '<h4 style="color: #000000; margin-right: 10px;">Gallery</h4>',
                                defaultType: 'checkboxfield',
                                msgTarget: 'none',
                                margin: '30 10 10 100',
                                labelAlign: 'left',
                                labelWidth: 250,
                                inputWidth: 80,
                                labelSeparator: '  ',
                                items: [
                                    {
                                        name: 'newsletter_gallery',
                                        inputValue: 'true',
                                        id: 'newsletter_gallery'
                                }
                            ]
                        },
                            {
                                xtype: 'fieldcontainer',
                                fieldLabel: '<h4 style="color: #000000; margin-right: 10px;">Promotions</h4>',
                                defaultType: 'checkboxfield',
                                msgTarget: 'none',
                                margin: '10 10 10 100',
                                labelAlign: 'left',
                                labelWidth: 250,
                                inputWidth: 80,
                                labelSeparator: '  ',
                                items: [
                                    {
                                        name: 'newsletter_promotions',
                                        inputValue: 'true',
                                        id: 'newsletter_promotions'
                                }
                            ]
                        },
                            {
                                xtype: 'fieldcontainer',
                                fieldLabel: '<h4 style="color: #000000; margin-right: 10px;">Menu/Catalog</h4>',
                                defaultType: 'checkboxfield',
                                msgTarget: 'none',                                
                                margin: '10 10 10 100',
                                labelAlign: 'left',                               
                                labelWidth: 250,
                                inputWidth: 80,
                                labelSeparator: '  ',
                                items: [
                                    {
                                        name: 'newsletter_menu',
                                        inputValue: 'true',
                                        id: 'newsletter_menu'
                                }
                            ]
                        },
                            {
                                xtype: 'fieldcontainer',
                                fieldLabel: '<h4 style="color: #000000; margin-right: 10px;">Blog</h4>',
                                defaultType: 'checkboxfield',
                                msgTarget: 'none',                                
                                margin: '10 10 10 100',
                                labelAlign: 'left',                               
                                labelWidth: 250,
                                inputWidth: 80,
                                labelSeparator: '  ',
                                items: [
                                    {
                                        name: 'newsletter_blog',
                                        inputValue: 'true',
                                        id: 'newsletter_blog'
                                }
                            ]
                        }*/
                    ]
            },
                    {
                        xtype: 'container',
                        layout: 'vbox',
                        style: 'width:700px !important; height:400px !important',
                        id: 'newsletterScreen3',
                        items: [
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                style: 'width:700px !important;',
                                items: [
                                    {
                                        xtype: 'button',
                                        margin: '10 10 10 10',
                                        text: '<span style="color:#fff;">Back</span>',
                                        scale: 'small',
                                        width: 75,
                                        style: 'cursor:pointer;background:#C6C6C6 !important;border:2px solid #000 !important;box-shadow:none !important;',
                                        handler: function () {
                                            Ext.getCmp('newsletterScreen2').show();
                                            Ext.getCmp('newsletterScreen1').hide();
                                            Ext.getCmp('newsletterScreen3').hide();
                                            Ext.getCmp('newsletterScreen4').hide();
                                        }
                            },
                                    {
                                        xtype: 'button',
                                        margin: '10 10 10 500',
                                        text: '<span style="color:#fff;">Next</span>',
                                        scale: 'small',
                                        width: 75,
                                        style: 'cursor:pointer;background:#006FC0 !important;border:2px solid #000 !important;box-shadow:none !important;',
                                        handler: function () {
                                            com.faralam.common.getMemberList_func('NewsletterService');
                                            Ext.getCmp('newsletterScreen4').show();
                                            Ext.getCmp('newsletterScreen1').hide();
                                            Ext.getCmp('newsletterScreen2').hide();
                                            Ext.getCmp('newsletterScreen3').hide();
                                        }
                            }
                        ]
                            },
                            {
                                xtype: 'container',
                                layout: 'vbox',
                                style: 'width:700px !important; height: 350px !important;margin-left:40px;overflow:hidden',
                                id: 'newsletterMainDisplay',
                                items: [
                                    {
                                        xtype: 'component',
                                        id: 'newsletterTitledisplay',
                                        html: ''
                            },
                                    {
                                        xtype: 'component',
                                        id: 'newsletterBodydisplay',
                                        html: ''
                            }
                            ]
                        }]
            },
                    {
                        xtype: 'container',
                        layout: {
                            type: 'table',
                            columns: 4,
                            align: 'stretch'
                        },
                        //layout: 'vbox',
                        style: 'width:700px !important; height:400px !important',
                        id: 'newsletterScreen4',
                        items: [
                            {
                                xtype: 'panel',
                                id: 'slide_panel_NewsletterService',
                                style: 'width:210px !important;',
                                cls: 'blue_bg',
                                html: '',
                                rowspan: 2,
                                height: 400
                        },
                            {
                                xtype: 'button',
                                margin: '10 10 10 10',
                                text: '<span style="color:#fff;">Back</span>',
                                scale: 'small',
                                width: 75,
                                style: 'cursor:pointer;background:#C6C6C6 !important;border:2px solid #000 !important;box-shadow:none !important;',
                                handler: function () {
                                    Ext.getCmp('newsletterScreen3').show();
                                    Ext.getCmp('newsletterScreen1').hide();
                                    Ext.getCmp('newsletterScreen2').hide();
                                    Ext.getCmp('newsletterScreen4').hide();
                                }
                        },
                            {
                                xtype: 'button',
                                margin: '10 10 10 -10',
                                text: '<span style="color:#fff;">Send Newsletter</span>',
                                scale: 'small',
                                colspan: 2,
                                width: 125,
                                style: 'cursor:pointer;background:#006FC0 !important;border:2px solid #000 !important;box-shadow:none !important;',
                                handler: function () {
                                    if (Ext.getCmp('Newsletter_agree').getValue() == 'true' && com.faralam.newsletterMembers[0] != null) {
                                        com.faralam.common.sendEmailHTMLBySASL(HtmlEmail_modal);
                                       
                                        //HtmlEmail_modal.close(); 
                                        //console.log(Ext.getCmp('Newsletter_agree').getValue());
                                    } else if (Ext.getCmp('Newsletter_agree').getValue() == 'false') {
                                        Ext.MessageBox.alert('Information', 'Please select Enable Button.');
                                    } else if (com.faralam.newsletterMembers[0] == null) {
                                        Ext.MessageBox.alert('Information', 'Please Select at least one Member.');
                                    }
                                }
                        },
                            {
                                xtype: 'component',
                                colspan: 2,
                                style: 'width: 350px; text-align: center;display: table-cell;vertical-align: middle;padding: 10px 5px;background: #FFFFFF;margin: 0px 0px 0px 40px;height: 77px;',
                                html: '<div class="email_footer_details" style="color: #000000; font-weight: bold;">I certify that the recipient has agreed<br> to receive this Text/E-Mail message</div>'
                        },
                            {
                                xtype: 'component',
                                style: 'width: 120px;text-align: center;display: table-cell;vertical-align: bottom;padding: 10px 5px;background: #FFFFFF;margin: 0px 0px 0px 40px;height: 77px;',
                                html: '<div class="switch_email"><input id="Newsletter_agree_toggle" class="cmn-toggle cmn-toggle-round" type="checkbox" onclick="com.faralam.common.operateSwitchCheckbox(this, ' + "'Newsletter_agree'" + ')"><label for="Newsletter_agree_toggle"></label></div>'
                        },
                            {
                                xtype: 'hiddenfield',
                                id: 'Newsletter_agree',
                                name: '',
                                value: 'false'
                        }
                ]
            }]
            });

            HtmlEmail_modal = Ext.widget('window', {
                title: '<div style="padding-top: 5px; color:#ffffff; text-align:center;">News Letter</div>',
                id: 'NewsLetter_modal',
                closeAction: 'destroy',
                layout: 'fit',
                resizable: false,
                modal: true,
                width: 690,
                style: 'background-color:#426FD9;',
                //height:410,
                items: HtmlEmail_modal_form,
                listeners: {
                    close: function () {
                        //Ext.getCmp('newsletterScreen1').hide();
                        //Ext.getCmp('newsletterScreen2').hide();
                        //HtmlEmail_modal_form.getForm().reset(true);
                    },
                    show: function () {
                        //Ext.getCmp('newsletterScreen1').show();
                    }

                }
            });
        }
        Ext.getCmp('newsletterScreen1').show();
        Ext.getCmp('newsletterScreen2').hide();
        Ext.getCmp('newsletterScreen3').hide();
        Ext.getCmp('newsletterScreen4').hide();
        HtmlEmail_modal.show();
    }

com.faralam.common.getModulestoIncludeinNewletter = function(){
    var  hid_feilds=new Array();
com.faralam.getModulestoIncludeinNewletter =  com.faralam.serverURL +'html/getModulestoIncludeinNewletter?';
com.faralam.getModulestoIncludeinNewletter=  com.faralam.getModulestoIncludeinNewletter+ encodeURI('&UID=' + sessionStorage.UID+'&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
    
var onsuccess = function (data, textStatus, jqXHR){
    
    sessionStorage.adsModule ='';
    var switch_html='<table id="news_letter_switch_tab" style="margin-left:8px;width:96%;overflow:hidden">';
        for (var i=0;i<data.length;i++)
            {      
              
               hid_feilds.push({
                        xtype: 'hiddenfield',
                        id: 'module_'+data[i].enumText,
                        name: 'module_'+data[i].enumText,
                        value:false
                        });
                      switch_html=switch_html+'<tr style="height: 25px !important; font-weight: bold; font-size: 14px;"><td>'+data[i].displayText+'</td><td><div class="switch_email" style="padding:0px !important; float:left;"><input id="'+data[i].enumText+'" module="'+data[i].enumText+'" class="cmn-toggle cmn-toggle-rounds" onclick="com.faralam.common.enablecheck_email_ads(this,\'module_'+data[i].enumText+'\')" type="checkbox"><label for="'+data[i].enumText+'"></label></div></td></tr>';
                      
                      }
    switch_html=switch_html+"</table>";
    Ext.getCmp('news_letter_hidden_field').add(hid_feilds);
    Ext.getCmp('news_letter_module_switch').update(switch_html);
    $('#news_letter_module_switch').perfectScrollbar('destroy');
    $('#news_letter_module_switch').perfectScrollbar();
   
                  
}
var onerror = function (jqXHR, textStatus, errorThrown) {}
com.faralam.common.sendAjaxRequest(com.faralam.getModulestoIncludeinNewletter, "GET", {}, onsuccess, onerror);
}
com.faralam.common.enablecheck_email_ads= function (e,field) {
    
        if (e != '') {
            //console.log("module="+e.getAttribute('module'));
            
            Ext.getCmp(field).setValue($(e).is(':checked'));
            temp=sessionStorage.adsModule;
            var module=e.getAttribute('module');
            
            //console.log(Ext.getCmp(field).getValue());
            var modeTogle=Ext.getCmp(field).getValue();
            
            if(modeTogle=="true"){
                temp=temp+module+"*";
                sessionStorage.adsModule=temp;
            }
            else{
                var pop='';
                var tm=sessionStorage.adsModule;
                var ar=tm.split("*");
                for (var i=0;i<ar.length;i++){
                    if(ar[i].trim()!='')
                        {
                            if(ar[i].trim()!=module.trim())
                                {
                                 pop=pop+ ar[i]+"*";  
                                }
                        }
                }
                sessionStorage.adsModule='';
                sessionStorage.adsModule=pop;
            }
             //console.log("tmp="+temp);
            
           
            console.log("ar="+sessionStorage.adsModule);
        }
}
    /*============================================================================*/

com.faralam.common.retrieveRichEmail = function () {
    com.faralam.retrieveRichEmail = com.faralam.serverURL + 'html/retriveEmailHTMLBySASL';
    com.faralam.retrieveRichEmail = com.faralam.retrieveRichEmail + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.getCmp('HtmlEmail_Body').setValue('');
        if (data) {
            Ext.getCmp('HtmlEmail_Body').setValue(data);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retrieveRichEmail, "GET", {}, onsuccess, onerror);
}

com.faralam.common.saveRichEmail = function () {
        //console.log(Ext.getCmp('HtmlEmail_agree').getValue());
        //console.log(Ext.getCmp('HtmlEmail_Body').getValue());
        /*com.faralam.saveRichEmail = com.faralam.serverURL + '';
        com.faralam.saveRichEmail = com.faralam.saveAdAlart + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
    
        var data = {
                   };
    
        data = JSON.stringify(data);

        var onsuccess = function (response, textStatus, jqXHR) {
            Ext.MessageBox.alert('Success', 'Rich Email send successfully.', function () {
                
            });
        }

        var onerror = function (jqXHR, textStatus, errorThrown) {
        }

        com.faralam.common.sendAjaxRequest(com.faralam.saveRichEmail , "POST", data, onsuccess, onerror);*/
    }
    /*========================  ORDER SITE CARDS SECTION START ===========================================*/
com.faralam.common.getSASLCoBrandedCardPNG = function () {
        if (sessionStorage.SASLNAME) {
            Ext.getCmp('order_site_cards_front').setSrc(com.faralam.serverURL + 'html/getSASLCoBrandedCardPNG_front?serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
            Ext.getCmp('order_site_cards_back').setSrc(com.faralam.serverURL + 'html/getSASLCoBrandedCardPNG_back?serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
        }
        com.faralam.common.sendAjaxRequest(com.faralam.common.getSASLCoBrandedCardPNG, "GET", {}, onsuccess, onerror);
    }
    /*========================  ORDER SITE CARDS SECTION END ===========================================*/
    /*======================== WALL SERVICE SECTION START ==============================================*/
    //com.faralam.common.createPostFromSASL= function(){
    //    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
    //        
    //        var createPostFromSASL_model;
    //        
    //        createPostFromSASL_model = Ext.widget('window', {
    //            //title: '<div class="add_answer_text">Please enter your message</div>',
    //            id: 'createPostFromSASL_model',
    //            closeAction: 'hide',
    //            layout: 'fit',
    //            resizable: false,
    //            modal: true,
    //            width: 850,
    //            style: 'background: #324F85 !important; border: 3px solid #000 !important;',
    //            //cls: 'white_modal',
    //            //height:410,
    //            //items: sharePollContest_modal_form,
    //            listeners: {
    //                close: function () {
    //                    createPostFromSASL_model_form.getForm().reset(true);
    //                },
    //                show: function () {
    //                    //com.faralam.common.getMobileAppURLPollContest(sessionStorage.SA, sessionStorage.SL);
    //                }
    //
    //            }
    //        });
    //    createPostFromSASL_model.show();
    //}
    //com.faralam.common.retrievePostsOnSASL = function () {
    //    com.faralam.retrievePostsOnSASL = com.faralam.serverURL + 'usersasl/retrievePostsOnSASL';
    //    com.faralam.retrievePostsOnSASL = com.faralam.retrievePostsOnSASL + "?" + encodeURI('&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
    //
    //    var onsuccess = function (response, textStatus, jqXHR) {
    //       console.log(response.memberList);
    //        var html = '';
    //        if(response.memberList != {}){
    //            $.each(response.memberList, function(key, value){
    //                console.log(key);
    //                 html += '<tr><td style="color:#000 !important;padding: 10px 10px;height: 38px;" width="200px"><span onclick="com.faralam.common.ShowMemberInfo(this)" userName="' + key + '" style="cursor:pointer;">' + key + '</span></td></tr>';
    //            });
    //        }      
    //         
    //        if(html != ''){
    //            html = '<table width="200px" border="0">' + html + '</table>';
    //        }
    //        else{
    //            html = '<table width="200px" border="0"><tr><td style="color:#000 !important;padding: 10px 10px;height: 38px;" width="200px"><span>No match found</span></td></tr></table>';
    //        }
    //        
    //        Ext.getCmp('slide_panel_members').update(html);
    //        Ext.getCmp('MemberSearch_modal').close();
    //    }
    //
    //    var onerror = function (jqXHR, textStatus, errorThrown) {
    //    }
    //
    //    com.faralam.common.sendAjaxRequest(com.faralam.searchForMembers , "GET", {}, onsuccess, onerror);
    //}


com.faralam.common.createPostFromSASL = function () {
    com.faralam.createPostFromSASL = com.faralam.serverURL + 'communication/createPostFromSASLURL';
    com.faralam.createPostFromSASL = com.faralam.createPostFromSASL + "?" + encodeURI('UID=' + sessionStorage.UID);

    var data = {

        "postbody": Ext.getCmp('blogBody').getValue(),
        "title": Ext.getCmp('blogTitle').getValue(),
        "fromServiceAccommodatorId": sessionStorage.SA,
        "fromServiceLocationId": sessionStorage.SL,
        "authorId": sessionStorage.UID,
        "attachementURL": Ext.getCmp('wall_image').src
    }
    data = JSON.stringify(data);

    console.log(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Poll added successfully.', function () {
            Ext.getCmp('createNewWallPost').close();
			com.faralam.common.retrievePostsOnSASL(0);
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.createPostFromSASL, "POST", data, onsuccess, onerror);
}

com.faralam.common.retrievePostsOnSASL = function (blogNo) {

    var prevBlog = "";
    var nextBlog = "";
    var totalBlog = 0;

    com.faralam.retrievePostsOnSASL = com.faralam.serverURL + 'communication/retrievePostsOnSASL';
    com.faralam.retrievePostsOnSASL = com.faralam.retrievePostsOnSASL + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (response, textStatus, jqXHR) {
        //console.log(response); 

        totalBlog = parseInt(response.posts.length) - 1;
		console.log(totalBlog);
        if(response.hasPost==false){
			prevBlog = '<a href="#" class="blog_button" style="background: #ccc none repeat scroll 0 0 !important; color: #909090 !important; border: 2px solid #888 !important; cursor:auto !important;">&lt; Previous</a>';
			nextBlog = '<a href="#" class="blog_button" style="background: #ccc none repeat scroll 0 0 !important; color: #909090 !important; border: 2px solid #888 !important; cursor:auto !important;">Next &gt;</a>';
		}
		else if(response.hasPost==true && parseInt(response.posts.length)=="1"){
			prevBlog = '<a href="#" class="blog_button" style="background: #ccc none repeat scroll 0 0 !important; color: #909090 !important; border: 2px solid #888 !important; cursor:auto !important;">&lt; Previous</a>';
			nextBlog = '<a href="#" class="blog_button" style="background: #ccc none repeat scroll 0 0 !important; color: #909090 !important; border: 2px solid #888 !important; cursor:auto !important;">Next &gt;</a>';
		}
		else if (blogNo == 0) {
            prevBlog = '<a href="#" class="blog_button" style="background: #ccc none repeat scroll 0 0 !important; color: #909090 !important; border: 2px solid #888 !important; cursor:auto !important;">&lt; Previous</a>';
            nextBlog = '<a href="#" class="blog_button" onclick="com.faralam.common.retrievePostsOnSASL(' + (parseInt(blogNo) + 1) + ')">Next &gt;</a>';
        } else if (blogNo == totalBlog) {
            prevBlog = '<a href="#" class="blog_button" onclick="com.faralam.common.retrievePostsOnSASL(' + (parseInt(blogNo) - 1) + ')">&lt; Previous</a>';
            nextBlog = '<a href="#" class="blog_button" style="background: #ccc none repeat scroll 0 0 !important; color: #909090 !important; border: 2px solid #888 !important; cursor:auto !important;">Next &gt;</a>';
        } else {
            prevBlog = '<a href="#" class="blog_button" onclick="com.faralam.common.retrievePostsOnSASL(' + (parseInt(blogNo) - 1) + ')">&lt; Previous</a>';
            nextBlog = '<a href="#" class="blog_button" onclick="com.faralam.common.retrievePostsOnSASL(' + (parseInt(blogNo) + 1) + ')">Next &gt;</a>';
        }

        var html1 = '<div class="blog_container"><div class="blog_top_buttons"><span style="left: 73px; position: relative;">' + prevBlog + '</span><span class="blog_title">My Posts</span><span style="left: 481px; position: relative;">' + nextBlog + '</span></div><div class="blog_top_row"><div class="blog_left_inner">';
        var html2 = "";
        var html_comm1 = '<div class="blog_container_comm"><div class="blog_top_row_comm"><div class="blog_left_inner_comm" id="blog_left_inner_comm">';
        var html_comm2 = [];
        Ext.each(response.posts, function (value, index) {

            if (index == blogNo) {
                html2 = '<div class="test_blog_text" id="test_blog_text">' + value.title + '</div></div><div class="blog_right_inner"><div class="delete_red_button" onclick="com.faralam.common.deleteCommunications(this)" threadUUID="' + value.communicationId + '"><img src="' + com.faralam.custom_img_path + 'icon_delete.png" alt="" style="cursor: pointer;"></div></div><div class="clear"></div></div><div class="blog_bottom_row"><div class="blog_bottom-left_inner"><div class="inner_box" id="inner_box"><img src="' + value.attachementURL + '" width=100% height=100%></div><div class="blog-testing_text" style="color:#000000 !important;" id="testing_text_body">' + value.postbody + '</div><div class="clear"></div></div><div class="blog_bottom-right_inner"><div class="like-dislike_area"><p style="color:#000000 !important;">' + value.likeCount + ' Likes</p><p style="color:#000000 !important;">' + value.disLikeCount + ' Dislikes</p></div></div>';
                Ext.each(value.comments, function (comm_value, comm_index) {
                    var attachementURL = "";
                    if (comm_value.hasAttachmenet == true)
                        attachementURL = '<img src="' + comm_value.attachementURL + '" width=100% height=100% class="blog_img">';
                    else
                        attachementURL = '<span style="color:black !important" class="blog_noimg">No Image Available</span>';
                    html_comm2 += '<div class="content_wrap"><div class="up_down_arrows"><div class="down_arrow" onclick="com.faralam.common.flagCommentOnPostFromSASL(this)" messageId = "' + comm_value.offset + '" threadUUID="' + comm_value.communicationId + '" blogno="' + blogNo + '"><img src="' + com.faralam.custom_img_path + 'down_arrow.png" alt="down" style="cursor:pointer;"></div><div class="up_arrow" onclick="com.faralam.common.calloutCommentOnPostFromSASL(this)" messageId = "' + comm_value.offset + '" threadUUID="' + comm_value.communicationId + '" blogno="' + blogNo + '"><img src="' + com.faralam.custom_img_path + 'up_arrow.png" alt="up" style="cursor:pointer;"></div><div class="clear"></div></div><div class="add_delete_midsection"><div class="owner_one blog_text_span"><span>' + comm_value.userName + '</span>' + attachementURL + '</div><div class="gen_text" style="color:black !important; text-align: center; padding-top: 60px; font-weight: bold;">' + comm_value.postbody + '</div><div class="clear"></div></div></div>';
                });
            }
        });
        var html3 = '<div class="clear"></div></div></div>';
        var html = html1 + html2 + html3;
        Ext.getCmp('blog_text_com').update(html);
        var html_comm3 = '</div></div></div>';

        var html_comm = html_comm1 + html_comm2 + html_comm3;
        Ext.getCmp('blog_comment').update(html_comm);

        $('#blog_left_inner_comm').perfectScrollbar('destroy');
        $('#blog_left_inner_comm').perfectScrollbar();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrievePostsOnSASL, "GET", {}, onsuccess, onerror);
}

com.faralam.common.flagCommentOnPostFromSASL = function (e) {
    console.log(e);
    var threadUUID = e.getAttribute('threadUUID');
    var messageId = e.getAttribute('messageId');
    var blogno = e.getAttribute('blogno');

    com.faralam.flagCommentOnPostFromSASL = com.faralam.serverURL + 'communication/flagCommentOnPostFromSASL';
    com.faralam.flagCommentOnPostFromSASL = com.faralam.flagCommentOnPostFromSASL + "?" + encodeURI('UID=' + sessionStorage.UID + '&threadUUID=' + threadUUID + '&messageId=' + messageId);

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            com.faralam.common.retrievePostsOnSASL(blogno);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.flagCommentOnPostFromSASL, "GET", {}, onsuccess, onerror);

};

com.faralam.common.calloutCommentOnPostFromSASL = function (e) {
    console.log(e);
    var threadUUID = e.getAttribute('threadUUID');
    var messageId = e.getAttribute('messageId');
    var blogno = e.getAttribute('blogno');

    com.faralam.calloutCommentOnPostFromSASL = com.faralam.serverURL + 'communication/calloutCommentOnPostFromSASL';
    com.faralam.calloutCommentOnPostFromSASL = com.faralam.calloutCommentOnPostFromSASL + "?" + encodeURI('UID=' + sessionStorage.UID + '&threadUUID=' + threadUUID + '&messageId=' + messageId);

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            com.faralam.common.retrievePostsOnSASL(blogno);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.calloutCommentOnPostFromSASL, "GET", {}, onsuccess, onerror);

};

com.faralam.common.deleteCommunications = function (e) {
        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to delete this Blog?', function (ev) {
            if (ev == 'yes') {
                var blogno = "0";

                com.faralam.deleteCommunications = com.faralam.serverURL + 'communication/deleteCommunications';
                com.faralam.deleteCommunications = com.faralam.deleteCommunications + "?" + encodeURI('threadUUID=' + e.getAttribute('threadUUID'));

                var onsuccess = function (response, textStatus, jqXHR) {
                    Ext.MessageBox.alert('Success', 'Blog deleted successfully.', function () {
                        com.faralam.common.retrievePostsOnSASL(blogno);
                    });
                }

                var onerror = function (jqXHR, textStatus, errorThrown) {}
                com.faralam.common.sendAjaxRequest(com.faralam.deleteCommunications, "DELETE", {}, onsuccess, onerror);
            }
        });
    }
    /*=========================== WALL SERVICE SECTION END ==============================================*/
    /*========================= DRIVING DIRECTION SECTION START =========================================*/
com.faralam.common.getBusinessAddress = function () {
    com.faralam.getBusinessAddress = com.faralam.serverURL + 'sasl/getBusinessAddress';
    com.faralam.getBusinessAddress = com.faralam.getBusinessAddress + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    //Ext.getCmp('drivingNumber').setValue('testValue');

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data != {}) {
            var number = street = street2 = city = zip = state = country = "";

            number = data.number;
            street = data.street;
            street2 = data.street2;
            city = data.city;
            zip = data.zip;
            state = data.state;
            country = data.country;

            Ext.getCmp('drivingNumber').setRawValue(number);
            Ext.getCmp('drivingStreet').setRawValue(street);
            Ext.getCmp('drivingStreet2').setRawValue(street2);
            Ext.getCmp('drivingCity').setRawValue(city);
            Ext.getCmp('drivingzip').setRawValue(zip);
            Ext.getCmp('drivingState').setRawValue(state);
            Ext.getCmp('drivingCountry').setRawValue(country);
        }
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.getBusinessAddress, "GET", {}, onsuccess, onerror);
}
com.faralam.common.drivingdirectionsSwitchCheckbox = function (e, field) {
        if (e != '') {
            //console.log(field);
            Ext.getCmp(field).setValue($(e).is(':checked'));
        }
    }
    /*======================== DRIVING DIRECTIONS SECTION END ============================================*/
    /*========================  CLICK TO CALL SECTION START ===========================================*/
com.faralam.common.retrieveclickToCall_func = function () {
    com.faralam.retrieveclickToCall_func = com.faralam.serverURL + 'sasl/getBusinessTelephone';
    com.faralam.retrieveclickToCall_func = com.faralam.retrieveclickToCall_func + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (response, textStatus, jqXHR) {
        if (response != {}) {
            Ext.getCmp('telephone').setRawValue(response.businessTelephone);
        }
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrieveclickToCall_func, "GET", {}, onsuccess, onerror);
}
com.faralam.setBusinessTelephone = function () {
    com.faralam.setBusinessTelephone = com.faralam.serverURL + 'sasl/setBusinessTelephone';
    com.faralam.setBusinessTelephone = com.faralam.setBusinessTelephone + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "businessTelephone": Ext.getCmp('telephone').getValue()
    }
    data = JSON.stringify(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.success) {
            //console.log(response);
            if (response.success) {
                Ext.MessageBox.alert('Success', 'Business Telephone Set Successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.setBusinessTelephone, "PUT", data, onsuccess, onerror);
}
com.faralam.common.clicktocallSwitchCheckbox = function (e, field) {
        if (e != '') {
            //console.log(field);
            Ext.getCmp(field).setValue($(e).is(':checked'));
        }
    }
/*=========================event external address enable================================*/
com.faralam.common.enableextadd= function (e, field) {
        if (e != '') {
            //console.log(field);
           
            Ext.getCmp(field).setValue($(e).is(':checked'));
            var d=Ext.getCmp(field).getValue();
            
            if(d=='true')
                {
                    Ext.getCmp('ext_add').show(500);
                }
           if(d=='false')
                {
                    Ext.getCmp('ext_add').hide(500);
                }
            
        }
    }
    /*========================  CLICK TO CALL SECTION END ===========================================*/
    /*======================== WIDGET GALLERY SECTION START =========================================*/
com.faralam.common.htmlEntities = function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
com.faralam.common.retriveCarouselHTMLJSONBySASL = function () {
    com.faralam.retriveCarouselHTMLJSONBySASL = com.faralam.serverURL + 'html/retriveCarouselHTMLJSONBySASL';
    com.faralam.retriveCarouselHTMLJSONBySASL = com.faralam.retriveCarouselHTMLJSONBySASL + "?" + encodeURI('&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (response, textStatus, jqXHR) {
        
            Ext.getCmp('hiddenWidgetCopy').setRawValue(response.value);
            Ext.MessageBox.alert("Success","<strong>Please Copy the Below Code</strong><br/><br />" + "<textarea style='width:300px; height:150px;' onclick='this.focus();this.select()'>"+com.faralam.common.htmlEntities(response.value)+"</textarea>");
       
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.retriveCarouselHTMLJSONBySASL, "GET", {}, onsuccess, onerror);
}
com.faralam.sendWidgetGalleryCarouselHTMLBySASL = function (email) {
    com.faralam.sendWidgetGalleryCarouselHTMLBySASL = com.faralam.serverURL + 'communication/sendWidgetGalleryCarouselHTMLBySASL';
    com.faralam.sendWidgetGalleryCarouselHTMLBySASL = com.faralam.sendWidgetGalleryCarouselHTMLBySASL + "?" + encodeURI('&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID + '&toEmail=' + email);

    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.success) {
            //console.log(response);
            if (response.success) {
                Ext.MessageBox.alert('Success', 'Email Send.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.sendWidgetGalleryCarouselHTMLBySASL, "GET", {}, onsuccess, onerror);
}
com.faralam.common.widgetSwitchCheckbox = function (e, field) {
        if (e != '') {
            //console.log(field);
            Ext.getCmp(field).setValue($(e).is(':checked'));
        }
    }
    /*======================= WIDGET GALLERY SECTION END ============================================*/
    //############################### PHOTO CONTEST SECTION START ##################################//
    //       CREATED BY PRADYUT MANNA
    //       DATE - 24th feb 2016
    //-----------------------------------------------------------------------------------------------
com.faralam.common.createPhoto = function () {
    com.faralam.createPhoto = com.faralam.serverURL + 'contests/createPhotoContestURL';
    com.faralam.createPhoto = com.faralam.createPhoto + "?" + encodeURI('UID=' + sessionStorage.UID);
    var url=Ext.getCmp('photoQuestion_img').src;
    if(url==null)
        {
            url='';
        }
    var data = {
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL,
        /*"activationDate": "2016-10-20T22:27:41:PDT", //Ext.getCmp('newPollActivationDate').getSubmitValue(),
        "expirationDate": "2016-11-01T09:45:00:PDT", *///Ext.getCmp('newPollExpirationDate').getSubmitValue(),
       "activationDate": com.faralam.common.contestDateFormat(Ext.getCmp('newPhotoActivationDate').getSubmitValue())+":PDT",
        "expirationDate": com.faralam.common.contestDateFormat(Ext.getCmp('newPhotoExpirationDate').getSubmitValue())+"Z",
        "contestName": Ext.getCmp('newPhotoContestTitle').getValue(),
        "displayText": Ext.getCmp('newPhotoContestDescription').getValue(),
        "isAnonymous": Ext.getCmp('photo_anonymous').getValue(),
        "contestUUID": null,
        "url": Ext.getCmp('photoQuestion_img').src
    };
    /*{     
    "serviceAccommodatorId":"FTRFCD1",
    "serviceLocationId":"FTRFCD1",
    "activationDate":"2015-10-20T22:27:41:PDT",
    "expirationDate":"2015-11-01T09:45:00:PDT",
    "contestName":"Photo contest Tree",
    "displayText":"What is the oldest tree in the world" ,
    "isAnonymous": false,
    "contestUUID":"POLxBa08SUUR3SJx1AoAdxMoA",
    "url":"http://faralam.com/ext/asparagus.jpg"
} */

    data = JSON.stringify(data);

    console.log(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Photo contest added successfully.', function () {
            sessionStorage.photo_nxt_prev_id="";
            Ext.getCmp('newPhotoMainContainer').getForm().reset(true);
            Ext.getCmp('photo_anonymous').setValue(false);
            Ext.getCmp('photoQuestion_img').setSrc('');
            Ext.getCmp('photo_agree').setValue(false);
            $('#photo_anonymous_toggle').attr('checked', false); 
            $('#photo_agree_toggle').attr('checked', false); 
             
            Ext.getCmp('main_tab').down('#PhotoContest').setDisabled(false);
            Ext.getCmp('main_tab').down('#CreateNewPhotoContest').setDisabled(true);
            Ext.getCmp('main_tab').setActiveTab(33);
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.createPhoto, "POST", data, onsuccess, onerror);
}

com.faralam.common.retrievePhotoContestPortal_func_nxt_prev = function(fl){
    if(fl=="NEXT")
        {
            sessionStorage.photo_nxt_prev_id= sessionStorage.photo_nxt_UUID;   
        }
    if(fl=="PREV")
        {
            sessionStorage.photo_nxt_prev_id=sessionStorage.photo_prev_UUID;
        }
    com.faralam.common.retrievePhotoContestPortal();
}

com.faralam.common.retrievePhotoContestPortal = function () {
    var txt="";
    if(sessionStorage.photo_nxt_prev_id)
        {
            var txt='contestUUID='+sessionStorage.photo_nxt_prev_id;
        }
    com.faralam.retrievePhotoContestPortal = com.faralam.serverURL + 'contests/retrievePhotoContestPortal';
    com.faralam.retrievePhotoContestPortal = com.faralam.retrievePhotoContestPortal + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID+"&"+txt);

    var onsuccess = function (response, textStatus, jqXHR) {
        if (response.hasContest) {
            sessionStorage.photo_nxt_UUID=response.nextContestUUID;
            sessionStorage.photo_prev_UUID=response.previousContestUUID;
            
            sessionStorage.PhcontestUUID = response.contest.contestUUID;
            sessionStorage.PhcontestName = response.contest.contestName;
            sessionStorage.Phquestion = response.contest.displayText;
            sessionStorage.contest_shareurl = response.contest.shareURL;
            sessionStorage.contest_type="PHOTO";
            Ext.getCmp('photo_hid_preview_url').setValue(response.contest.previewURL);
            
            /*=========================================== Hide Show ===========================*/
            var img2='<div style="background-color: rgb(255, 255, 255); border: 1px solid black; height: 200px; width: 250px; margin-left: 20px;"></div>';
     Ext.getCmp('big_img').update(img2);
            Ext.getCmp('photo_is_select').setValue('0');
            if(response.hasPrevious)
            {
                Ext.getCmp('photo_prev_btn').show();
            }
            else
            {
                Ext.getCmp('photo_prev_btn').hide();  
            }
            if(response.hasNext)
                {
                Ext.getCmp('photo_next_btn').show();
                }
            else
                {
                Ext.getCmp('photo_next_btn').hide();   
                }
            
            Ext.getCmp('photo_share_btn').setDisabled(true);
            if(response.contest.contestStatus.enumText!="PROPOSED" && response.contest.contestStatus.enumText!="ACTIVE" )
                {
                    
                   $('#pool_dv_layer').remove();
                    var layer='<div id="pool_dv_layer" style="z-index: 999; background-color: rgba(0, 0, 0, 0.4); position: absolute; top: 169px; border-radius: 5px; height: 203px; left: 16px; width: 627px;"></div>';
                    $("#photoMainContainer").append(layer);  
                }
            
            if(response.showActivateButton)
                {
                    Ext.getCmp('photo_share_btn').setDisabled(true);
                    Ext.getCmp('photo_terminate_btn').hide();
                    Ext.getCmp('photo_activate_btn').show();
                    $('#pool_dv_layer').remove();
                    var layer='<div id="pool_dv_layer" style="z-index: 999; background-color: rgba(0, 0, 0, 0.4); position: absolute; border-radius: 5px; left: 16px; top: 364px; height: 316px; width: 600px;"></div>';
                    
                    $("#photoMainContainer").append(layer);
                     
                }
            else
                {
                    Ext.getCmp('photo_activate_btn').hide(); 
                }
            if(response.showTerminateButton)
                {  
                    Ext.getCmp('photo_share_btn').setDisabled(false);
                    Ext.getCmp('photo_activate_btn').hide();
                    Ext.getCmp('photo_terminate_btn').show();
                    $('#pool_dv_layer').remove();
                    var layer='<div id="pool_dv_layer" style="z-index: 999; background-color: rgba(0, 0, 0, 0.4); position: absolute; top: 169px; border-radius: 5px; height: 200px; left: 16px; width: 627px;"></div>';
                    $("#photoMainContainer").append(layer);        
                }
            else
                {
                 Ext.getCmp('photo_terminate_btn').hide();   
                }
            /*=========================================== Hide Show ===========================*/
            /*===============================Date and Title fetch===============================*/
            var activationDate = response.contest.activationDate;
            if(activationDate)
                {
            var n1 = activationDate.split('T');
            Ext.getCmp('photoActivationDate').setValue(n1[0]);
                }
            var expirationDate = response.contest.expirationDate;
            if(expirationDate)
                {
            var n2 = expirationDate.split('T');
            Ext.getCmp('photoExpirationDate').setValue(n2[0]);
                }
                
            Ext.getCmp('photoTitle').setValue(response.contest.contestName);
            var status='<p style="font-weight:bold;font-size:16px">status&nbsp;:&nbsp;'+response.contest.contestStatus.displayText+'</p>';
            Ext.getCmp('photocontestStatus').update(status);
            /*=========================end=============================*/
            /*====================================== contest details and prize ============================*/
            var details='<div id="photo_details" class="photo_question_data" style="overflow:hidden;position:relative"><img src="'+response.contest.imageURL+'" style="height:100px;margin:5px;float:left"><p style="color:#000;font-size:15px;font-weight:500">'+response.contest.displayText+'</p<div class="clear"></div></div>';
            Ext.getCmp('photoContestDetails').update('');
            Ext.getCmp('photoContestDetails').update(details);
            $("#photo_details").perfectScrollbar('destroy');
            $("#photo_details").perfectScrollbar();
            
            /*prize*/
            var prize='<div id="photo_prize_dv" style="overflow:hidden;position:relative" class="photo_question_data"><ul id="photo_prize">';
            
            for(var i=0;i<response.contest.prizes.length;i++)
                {
                    prize=prize+'<li style="height:30px;border:1px solid #000;margin:5px 5px 0px 5px"><p style="float:left;width:80%;height:100%;border-right:1px solid black;color:black;line-height:25px;padding-left:5px">'+response.contest.prizes[i].displayText+'</p><center><p style="color:#000;line-height:30px">'+response.contest.prizes[i].quantity+'</p></center></li>';
                }
            prize+='</ul></div>';
            if(!response.contest.prizes.length)
                {
                  Ext.getCmp('photoPrizes').update('<div id="photo_prize_dv" style="overflow:hidden;position:relative" class="photo_question_data"></div>'); 
                }
            Ext.getCmp('photoPrizes').update(prize);
            $("#photo_prize_dv").perfectScrollbar('destroy');
            $("#photo_prize_dv").perfectScrollbar();
            
            sessionStorage.photo_prize_data = JSON.stringify(response.contest.prizes);
            if (Ext.getCmp('photoPrizePopupSec_modal')){
                com.faralam.common.populatephotoContestInnerData();
            }
            /*====================================== contest details and prize ============================*/
            
            /*=======================================fetch entries===================================================*/
            var en_head='<div class="photo_heading_area"><div style="width: 100px; margin: 0px;" class="photo_heading_answer"><div class="photo_question">Entries</div></div><div class="photo_heading_answer" style="width: 191px;"><div class="photo_question" style="font-weight:400;">Responses:&nbsp;'+response.photoContestEntries.entries.length+'</div></div><div class="photo_heading_answer" style="width: 191px;"><div class="photo_question" style="font-weight:400;">Days left:&nbsp;'+response.contest.daysLeft+'</div></div><div class="clear"></div></div>';
            Ext.getCmp('entry_head').update(en_head);
               if (response.photoContestEntries.hasEntry) {
            var entries='';
            var ie=0;
            for(ie=0;ie<response.photoContestEntries.entries.length;ie++)
                {
                    var img_ent='';
                    var mv_btn='';
                    var drop_z='<div id="photo_entry_rearrange_drop_zone" ondrop="com.faralam.drop_contest(event)" ondragover="com.faralam.dragOver_contest(event)" ondragenter="com.faralam.dragEnter_contest(event)" ondragleave="com.faralam.dragLeave_contest(event)" class="photo_re_normal"></div>';
                    mv_btn='<img src="'+com.faralam.custom_img_path+'icon_move.png" draggable="true" id="photo_drag_entry" ondragend="com.faralam.dragEnd_contest(event)" contestUUID="'+response.photoContestEntries.entries[ie].contestUUID+'" entryId="'+response.photoContestEntries.entries[ie].entryId+'"  entryForUID="'+response.photoContestEntries.entries[ie].entryForUID+'" imageURL="'+response.photoContestEntries.entries[ie].imageURL+'" userName="'+response.photoContestEntries.entries[ie].userName+'" ondragstart="com.faralam.dragStart_contest(event)"  alt="" style="z-index: 999; position: absolute; margin-left: -28px;cursor:move" >';
                    
                    entries=entries+'<div class="photo_entries_div" >'+mv_btn+'<img style="width: 100%; border:none; float: left; height: 100%;" src="'+response.photoContestEntries.entries[ie].imageURL+'" userName="'+response.photoContestEntries.entries[ie].userName+'" onclick="com.faralam.common.set_big_src(this)"></div>'+drop_z;
                }
            var f_html='<div id="photo_entries_data">'+entries+'</div>';
              
             Ext.getCmp('photoEntries').update(f_html);
            $("#photo_entries_data").perfectScrollbar('destroy');
            $("#photo_entries_data").perfectScrollbar();
        }   
            
        else
            {
              Ext.getCmp('photoEntries').update('<div id="photo_entries_data"></div>');  
            }
           /*===================================end fetch entries=============================================*/
            /*==================================Photo winner fetch===============================*/
            if (response.contestWinners.hasWinners) {
            var winners='';
            for(var ipw=0;ipw<response.contestWinners.winners.length;ipw++)
                {
                    var img_ent='';
                    var mv_btn='';
                    
                    mv_btn='<img src="'+com.faralam.custom_img_path+'icon_move.png" draggable="true" id="photo_drag_entry" alt="" style="z-index: 999; position: absolute; margin-left: -28px;cursor:move" >';
                    
                    winners=winners+'<div class="photo_winners_div"  style="margin: 5px 0 5px 5px;">'+mv_btn+'<img style="width: 100%; border:none; float: left; height: 100%;cursor:pointer" userName="'+response.contestWinners.winners[ipw].userName+'" onclick="com.faralam.common.set_big_src(this)" src="'+response.contestWinners.winners[ipw].imageURL+'"></div>';
                }
            var fw_html='<div id="photo_winners_data" >'+winners+'</div>';
              
             Ext.getCmp('photoWinners').update(fw_html);
            $("#photo_winners_data").perfectScrollbar('destroy');
            $("#photo_winners_data").perfectScrollbar();
        }   
            
        else
            {
              Ext.getCmp('photoWinners').update('<div id="photo_winners_data"></div>');  
            }
            /*============================photo winner end =====================================*/
        }
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrievePhotoContestPortal, "GET", {}, onsuccess, onerror);
}

com.faralam.common.set_big_src = function(e){
    var usrnm=e.getAttribute('userName');
    console.log("unm="+usrnm);
    sessionStorage.photo_userName=usrnm;
    Ext.getCmp('photo_is_select').setValue('1');
    var src=e.getAttribute('src');
    var img='<div style="background-color: rgb(255, 255, 255); border: 1px solid black; height: 200px; width: 250px; margin-left: 20px;"><img src="'+src+'" style="height:100%;width:100%;float:left"></div>';
     Ext.getCmp('big_img').update(img);
    
}

com.faralam.common.msg_sec_open_photo = function(){
   if(Ext.getCmp('photo_is_select').getValue()=='1')
       {
   
   sessionStorage.contest_usrnm=sessionStorage.photo_userName;
   Ext.getCmp('main_tab').down('#PhotoContest').setDisabled(true);
   Ext.getCmp('main_tab').down('#ContestMessage').setDisabled(false);
   Ext.getCmp('main_tab').setActiveTab(49);
   
    Ext.getCmp('ContestMessage_pageHeader').update('<span style="width:920px !important;position: absolute;text-align:center;color:#568;font-size:20px; font-weight: bold;top:0px !important;margin-top:-12px">' + sessionStorage.contest_usrnm + '</span>');
        }
    else
        {
            Ext.MessageBox.alert('Error', 'Please select any entry.');
        }
}

com.faralam.common.photoPrizePopupSec = function () {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var photoPrizePopupSec_modal;

    if (Ext.getCmp('photoPrizePopupSec_modal')) {
        var modal = Ext.getCmp('photoPrizePopupSec_modal');
        modal.destroy(modal, new Object());
    }
    if (!photoPrizePopupSec_modal) {
        var photoPrizePopupSec_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'white_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:800px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            value: '<div class="add_answer_text">Add / Delete Prizes</div>'
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'large',
                                            text: '<span style="color:#fff !important;">Add New Picture</span>',
                                            style: ' border-radius: 5px !important;cursor:pointer;background:#007AFF !important;border:2px solid #000 !important;box-shadow:none !important;color:#006FC0;padding:0 5px;',
                                            height: 26,
                                            width: 170,
                                            margin: '0 0 0 255',
                                            handler: function () {
                                                $('#modal').css({
                                                    'z-index': '19002'
                                                });
                                                com.faralam.getCropPicURLs('resources/plugins/croppic/pollcontestprize_crop.html');
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '20 0 0 25',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: '<p style="margin: -1px;color: #000;font-size: 15px;font-weight: bold;">QTY</p>',
                                            labelStyle: 'color:#000 !important;',
                                            labelSeparator: '',
                                            labelAlign: 'top',
                                            emptyText: 'Prize Qty',
                                            inputWidth: 75,
                                            // height: 150,
                                            margin: '20 0 0 10',
                                            name: '',
                                            value: '',
                                            id: 'photoPrizeQty',
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: '<p style="margin: -1px;color: #000;font-size: 15px;font-weight: bold;">Prize Name</p>',
                                            labelStyle: 'color:#000 !important;',
                                            labelSeparator: '',
                                            labelAlign: 'top',
                                            emptyText: 'Prize Name',
                                            inputWidth: 300,
                                            // height: 150,
                                            margin: '20 0 0 20',
                                            name: '',
                                            value: '',
                                            id: 'photoPrizeName',
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'image',
                                            width: 160,
                                            height: 150,
                                            src: '',
                                            margin: '0 0 0 27',
                                            style: 'background:#E81212;',
                                            id: 'photoPrize_img'
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'large',
                                            text: '<span style="color:#fff !important;">Add</span>',
                                            style: ' border-radius: 5px !important;cursor:pointer;background:#007AFF !important;border:2px solid #000 !important;box-shadow:none !important;color:#006FC0;padding:0 5px;',
                                            height: 26,
                                            width: 80,
                                            margin: '40 0 0 35',
                                            handler: function () {
                                                var qty=Ext.getCmp('photoPrizeQty').getValue();
                                                var name=Ext.getCmp('photoPrizeName').getValue();
                                                if(qty.trim()=='')
                                                    {
                                                        Ext.MessageBox.alert('Error','Please Enter Quantity');
                                                        return false;
                                                    }
                                                else if(isNaN(qty))
                                                    {
                                                        Ext.MessageBox.alert('Error','Quantity should be numeric');
                                                        return false;
                                                    }
                                                else if(name.trim()=='')
                                                    {
                                                        Ext.MessageBox.alert('Error','Please Enter prize name');
                                                        return false;
                                                    }
                                                /*else if(Ext.getCmp('photoPrize_img').src=="")
                                                    {
                                                        Ext.MessageBox.alert('Error', 'Please Choose a picture.');
                                                    }*/
                                                else{
                                                com.faralam.common.addPhotoContestPrizeURL(qty,name);
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '20 0 0 0',
                                    items: [
                                        {
                                            xtype: 'component',
                                            id: 'photo_prizeDetailsTable',
                                            html: ''
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        photoPrizePopupSec_modal = Ext.widget('window', {
            title: '',
            id: 'photoPrizePopupSec_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 800,
            cls: 'white_modal',
            //height:410,
            style:'border: 2px solid black;',
            items: photoPrizePopupSec_modal_form,
            listeners: {
                close: function () {
                    photoPrizePopupSec_modal_form.getForm().reset(true);
                },
                show: function () {
                    com.faralam.common.populatephotoContestInnerData();
                    //com.faralam.common.populateContestInnerData('pollPrizeData');
                }

            }
        });
    }
    photoPrizePopupSec_modal.showAt(50, 100);
    //photoPrizePopupSec_modal.show();
}

com.faralam.common.activatePhotoContest = function(){
    
 com.faralam.activatePhotoContest = com.faralam.serverURL + 'contests/activatePhotoContest';
    com.faralam.activatePhotoContest = com.faralam.activatePhotoContest + "?" + encodeURI('UID=' + sessionStorage.UID+'&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&contestUUID='+sessionStorage.PhcontestUUID+'&activate=true');

    var onsuccess = function (data, textStatus, jqXHR) {
    com.faralam.common.retrievePhotoContestPortal();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.activatePhotoContest, "PUT", {}, onsuccess, onerror);  
       
}

com.faralam.common.terminatePhotoContest = function(){
 com.faralam.terminatePhotoContest = com.faralam.serverURL + 'contests/terminatePhotoContest';
    com.faralam.terminatePhotoContest = com.faralam.terminatePhotoContest + "?" + encodeURI('UID=' + sessionStorage.UID+'&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&contestUUID='+sessionStorage.PhcontestUUID);

    var onsuccess = function (data, textStatus, jqXHR) {
    com.faralam.common.retrievePhotoContestPortal();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
    Ext.MessageBox.confirm('Confirm', 'Do you really want to terminate the photo contest?', function (e) {
                                    if (e == 'yes') {
            com.faralam.common.sendAjaxRequest(com.faralam.terminatePhotoContest, "PUT", {}, onsuccess, onerror);  
                                                    }
                                                });
    
        }

com.faralam.common.deletePhotoContestEntry = function (entryId,entryForUID,contestUUID){
    com.faralam.deletePhotoContestEntry = com.faralam.serverURL + 'contests/deletePhotoContestEntry';
    com.faralam.deletePhotoContestEntry = com.faralam.deletePhotoContestEntry + "?" + encodeURI('UID=' + sessionStorage.UID+ '&contestUUID='+contestUUID+'&entryId='+entryId+'&entryForUID='+entryForUID);
//http://simfel.com/apptsvc/rest/contests/deletePhotoContestEntry?UID=user20.781305772384780045&contestUUID=POLxBa08SUUR3SJx1AoAdxMoA&entryId=1&entryForUID=1
    var onsuccess = function (data, textStatus, jqXHR) {
  com.faralam.common.retrievePhotoContestPortal();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
    
            com.faralam.common.sendAjaxRequest(com.faralam.deletePhotoContestEntry, "DELETE", {}, onsuccess, onerror);  
                                                    
}

com.faralam.common.addPhotoContestPrizeURL = function(qty,name){
    com.faralam.addPhotoContestPrizeURL = com.faralam.serverURL + 'contests/addPhotoContestPrizeURL';
    com.faralam.addPhotoContestPrizeURL = com.faralam.addPhotoContestPrizeURL + "?" + encodeURI('UID=' + sessionStorage.UID);
    var img_url=Ext.getCmp('photoPrize_img').src;
    if(!img_url)
        {
            img_url=null;
        }
    var data = {
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL,
        "contestUUID": sessionStorage.PhcontestUUID,
        "quantity": qty,
        "contestPrizeName": name,
        "displayText": name,
        "hiddenText": "Employees not eligible",
        "url":Ext.getCmp('photoPrize_img').src
    };

    data = JSON.stringify(data);
    
    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Poll prize added successfully.', function () {
            //Ext.getCmp('photoPrizePopupSec_modal').close();
            Ext.getCmp('photoPrizeQty').setValue('');
            Ext.getCmp('photoPrizeName').setValue('');
            Ext.getCmp('photoPrize_img').setSrc('');
            com.faralam.common.retrievePhotoContestPortal();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.addPhotoContestPrizeURL, "POST", data, onsuccess, onerror);   
}

com.faralam.common.populatephotoContestInnerData = function () {
    
    var obj = JSON.parse(sessionStorage.photo_prize_data);

    var data = '<div class="bottom_scroll" id="photo_prize_contain_block">';
    if (obj.length > 0) {
        for (i = 0; i < obj.length; i++) {
            var p_im='<div class="add_prof_imagedetails"><div class="add_prof_text">No Image Available</div></div>';
            if(obj[i].imageUrl)
                {
                 p_im ='<div class="add_prof_imagedetails"><div class="add_prof_pic"><img width="140" height="91" alt="" src="'+obj[i].imageUrl+'"></div></div>';   
                }

            data+='<div class="add_delete_bottomsection"><div class="add_minus_icon"><img alt="" contestPrizeId="'+obj[i].contestPrizeId+'" contestUUID="'+obj[i].contestUUID+'" onclick="com.faralam.common.deletePhotoContestPrize(this)" src="'+com.faralam.custom_img_path+'icon_delete.png"></div><div class="add_profile_list prizeList_section"><div class="add_prof_no"><p>'+obj[i].contestPrizeIndex+'</p></div>'+p_im+'<div style="font-size: 16px;" class="add_prof_imageoption prizeName_section"><p>'+obj[i].displayText+'</p></div><div class="add_prof_move"><img class="move_icon_position" alt="" src="'+com.faralam.custom_img_path+'icon_move.png"></div></div></div>';
        }
        data+='</div>';
    }

        Ext.getCmp('photo_prizeDetailsTable').update(data);
    //$(".bottom_scroll").perfectScrollbar('destroy');
    $("#photo_prize_contain_block").perfectScrollbar('destroy');
    $("#photo_prize_contain_block").perfectScrollbar();


}

com.faralam.common.deletePhotoContestPrize = function(e){
    com.faralam.deletePhotoContestPrize = com.faralam.serverURL + 'contests/deletePhotoContestPrize';
    com.faralam.deletePhotoContestPrize = com.faralam.deletePhotoContestPrize + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&contestUUID=' + e.getAttribute('contestUUID') + '&contestPrizeId=' + e.getAttribute('contestPrizeId'));
   console.log(e.getAttribute('contestUUID'));
    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Prize deleted successfully.', function () {
        com.faralam.common.retrievePhotoContestPortal();  
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
Ext.MessageBox.confirm('Confirm', 'Do you really want to remove prize?', function (e) {
                                    if (e == 'yes') {
            com.faralam.common.sendAjaxRequest(com.faralam.deletePhotoContestPrize, "DELETE", {}, onsuccess, onerror);
                                                    }
                                                });
}

com.faralam.common.awardPhotoContestPrize = function(e){
    
    com.faralam.awardPhotoContestPrize = com.faralam.serverURL + 'contests/awardPhotoContestPrize';
    com.faralam.awardPhotoContestPrize = com.faralam.awardPhotoContestPrize + "?" + encodeURI('UID=' + sessionStorage.UID);
    var data={     
    "serviceAccommodatorId":sessionStorage.SA,
    "serviceLocationId":sessionStorage.SL,
    "contestUUID": e.getAttribute('contestUUID'),
    "prizeId":e.getAttribute('prizeId'),
    "quantity":e.getAttribute('quantity'),
    "entryId": e.getAttribute('entryId'),
    "entryForUID": e.getAttribute('entryForUID')
};

    data=JSON.stringify(data);
    console.log("Photo"+data);
    var onsuccess = function (response, textStatus, jqXHR) {
     Ext.getCmp('photo_contest_award_modal').close();    
     com.faralam.common.retrievePhotoContestPortal();   
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.awardPhotoContestPrize, "POST", data, onsuccess, onerror);

}
//############################### photo Contest Section end  ###################################//

com.faralam.common.contest_share_sms = function(mobno){
    var type=sessionStorage.contest_type;
   var ajxurl=com.faralam.serverURL;
    switch (type) {
    case 'POLL':
        ajxurl+='html/sendPollContestURLToMobileviaSMS?'+encodeURI('UID=' + sessionStorage.UID +'&contestUUID='+ sessionStorage.contestUUID +'&toTelephoneNumber=' + mobno + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
        break;
    case 'PHOTO':
        ajxurl+='html/sendPhotoContestURLToMobileviaSMS?'+encodeURI('UID=' + sessionStorage.UID +'&contestUUID='+ sessionStorage.PhcontestUUID +'&toTelephoneNumber=' + mobno + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
        break;
    }
    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            //console.log(data);
            console.log(data.success);
            if (data.success == true) {
                Ext.MessageBox.alert('Success', 'Send successfully.');
            }
            if (data.success == false) {
                Ext.MessageBox.alert('Error', data.explanation);
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(ajxurl, "GET", {}, onsuccess, onerror);
} 

com.faralam.common.contest_share_email = function(emailAddress){
    var type=sessionStorage.contest_type;
    var ajxurl=com.faralam.serverURL;
    switch (type) {
    case 'POLL':
       ajxurl+='html/sendPollContestURLToEmail?'+encodeURI('UID=' + sessionStorage.UID +'&contestUUID='+ sessionStorage.contestUUID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL+'&toEmail='+emailAddress);
        break;
    case 'PHOTO':
        ajxurl+='html/sendPhotoContestURLToEmail?'+encodeURI('UID=' + sessionStorage.UID +'&contestUUID='+ sessionStorage.PhcontestUUID +'&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL +'&toEmail='+emailAddress);
        break;
    }
    
    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            if (data.success) {
                Ext.MessageBox.alert('Success', 'Send successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(emailAddress))
      {
    Ext.MessageBox.alert('Information', 'Please enter a valid email.');
      }
    else
    {
    com.faralam.common.sendAjaxRequest(ajxurl, "GET", {}, onsuccess, onerror);
    }
}

com.faralam.common.populatePrize = function (entryId,entryForUID,userName) {
    var type=sessionStorage.contest_type;
    var obj={};
   
    switch (type) {
    case 'POLL':
    obj = JSON.parse(sessionStorage.pollPrizeData);
        break;
    case 'PHOTO':
    obj = JSON.parse(sessionStorage.photo_prize_data);
        break;
    }
    
     /*entryId="'+response.pollEntries.entries[ie].entryId+'" entryForUID="'+response.pollEntries.entries[ie].entryForUID+'" contestUUID="'+response.pollEntries.entries[ie].contestUUID+'"*/

    var htm= '<ul id="tst" style="auto;position:relative;overflow:hidden">';
   
    if (obj.length > 0) {
        for (i = 0; i < obj.length; i++) {
            var inp='';
            if(type=="POLL")
                {
              inp='<input type="button" value="Award" class="contest_awd_btn" entryId="'+entryId+'" entryForUID="'+entryForUID+'" contestUUID="'+obj[i].contestUUID+'" prizeId="'+obj[i].contestPrizeId+'" quantity="'+obj[i].quantity+'" onclick="com.faralam.common.awardPollPrize(this)" >';
                }
             if(type=="PHOTO")
                {
             inp='<input type="button" value="Award" class="contest_awd_btn" entryId="'+entryId+'" entryForUID="'+entryForUID+'" contestUUID="'+obj[i].contestUUID+'" prizeId="'+obj[i].contestPrizeId+'" quantity="'+obj[i].quantity+'" onclick="com.faralam.common.awardPhotoContestPrize(this)" >';
                }
             htm+='<li style="margin: 5px 5px 0px; height: auto; border: 1px solid black; padding: 3px 0px 0px 3px;"><div style="display: inline-block;"><img style="height:80px;width:90px;float:left" src="'+obj[i].imageUrl+'"><p style="float: left; color: black; font-weight: bold; font-size: 16px; margin-left: 10px; width: 295px;">'+obj[i].contestPrizeName+'</p>'+inp+'</div></li>';
            
        }
        htm+='</ul>';
    }

        Ext.getCmp('contest_aw_prizes').update(htm);
   
    $("#contest_aw_prizes").perfectScrollbar('destroy');
    $("#contest_aw_prizes").perfectScrollbar();


}

com.faralam.common.open_award_sec = function (entryId,entryForUID,userName) {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var photo_contest_award_modal;

    if (Ext.getCmp('photo_contest_award_modal')) {
        var modal = Ext.getCmp('photo_contest_award_modal');
        modal.destroy(modal, new Object());
    }
    if (!photo_contest_award_modal) {
        var photo_contest_award_modal_form = Ext.widget('form', {
                                    xtype: 'container',
                                    layout: 'vbox',
                                    style: 'height:450px !important;width:550px !important',
                                    margin: '10 10 10 10',
                                    items: [
                                        
                                        {
                                            xtype: 'container',
                                            width: 500,
                                            height:440,
                                            margin: '20 0 0 10',
                                            id:'contest_aw_prizes',
                                            html: '',
                                            style: 'z-index: 99;border:2px solid black;position:relative !important;overflow:hidden !important'
                                            
                                        }
                                    ]
                                
        });

        photo_contest_award_modal = Ext.widget('window', {
            title: '<div style="color:black;font-size:16px;font-weight:bold"><h4 style="color:#fff">Award Prize To:&nbsp; '+userName+'</h4></div>',
            id: 'photo_contest_award_modal',
            closeAction: 'destroy',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 550,
            style: 'background-color: transparent  !important;border:none !important top:0px !important',
            items: photo_contest_award_modal_form,
            listeners: {
                close: function () {
                    
                },
                show: function () {
                   com.faralam.common.populatePrize(entryId,entryForUID,userName);
                }

            }
        });
    }
    photo_contest_award_modal.show();
}

// ############################## Poll Contest Section Start ###################################//
com.faralam.common.retrievePollPortal_func_nxt_prev = function(fl){
    if(fl=="NEXT")
        {
            sessionStorage.nxt_prev_id= sessionStorage.nxt_UUID;   
        }
    if(fl=="PREV")
        {
            sessionStorage.nxt_prev_id=sessionStorage.prev_UUID;
        }
    com.faralam.common.retrievePollPortal_func();
}

com.faralam.common.retrievePollPortal_func = function () {
    var txt="";
    if(sessionStorage.nxt_prev_id)
        {
            var txt='contestUUID='+sessionStorage.nxt_prev_id;
        }
    com.faralam.retrievePollPortal_func = com.faralam.serverURL + 'contests/retrievePollPortal';
    com.faralam.retrievePollPortal_func = com.faralam.retrievePollPortal_func + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID+"&"+txt);

    var onsuccess = function (response, textStatus, jqXHR) {
        if (response != {}) {
           Ext.getCmp('pool_is_prize').setValue('0');
           Ext.getCmp('pool_is_answer').setValue('0');
            sessionStorage.nxt_UUID=response.nextContestUUID;
            sessionStorage.prev_UUID=response.previousContestUUID;
            
            sessionStorage.contestUUID = response.contest.contestUUID;
            sessionStorage.contestName = response.contest.contestName;
            sessionStorage.question = response.contest.displayText;
            sessionStorage.contest_shareurl = response.contest.shareURL;
            sessionStorage.contest_type="POLL";
            Ext.getCmp('poll_hid_preview_url').setValue(response.contest.previewURL);
            var sts_htm='<b><p>Status:'+response.contest.contestStatus.displayText+'</p></b>';
            if(response.hasPrevious)
            {
                Ext.getCmp('pool_prev_btn').show();
            }
            else
            {
                Ext.getCmp('pool_prev_btn').hide();  
            }
            if(response.hasNext)
                {
                Ext.getCmp('pool_next_btn').show();
                }
            else
                {
                Ext.getCmp('pool_next_btn').hide();   
                }
            Ext.getCmp('pool_share_button').setDisabled(true);
            if(response.contest.contestStatus.enumText!="PROPOSED" && response.contest.contestStatus.enumText!="ACTIVE" )
                {
                    
                   $('#pool_dv_layer').remove();
                    var layer='<div style="z-index: 999; background-color: rgba(0, 0, 0, 0.4); position: absolute; top: 169px; width: 935px; left: 25px; height: 228px; border-radius: 5px;" id="pool_dv_layer"></div>';
                    $("#pollMainContainer").append(layer);  
                }
            
            if(response.showActivateButton)
                {
                    Ext.getCmp('pool_share_button').setDisabled(true);
                    Ext.getCmp('pool_terminate_btn').hide();
                    Ext.getCmp('pool_activate_btn').show();
                    Ext.getCmp('pool_box3').setDisabled(false);
                    Ext.getCmp('pool_box2').setDisabled(false);
                    $('#pool_dv_layer').remove();
                    var layer='<div style="z-index: 999; background-color: rgba(0, 0, 0, 0.4); position: absolute; top: 415px; width: 935px; left: 25px; height: 228px; border-radius: 5px;" id="pool_dv_layer"></div>';
                    $("#pollMainContainer").append(layer);
                     
                }
            else
                {
                    Ext.getCmp('pool_activate_btn').hide(); 
                }
            if(response.showTerminateButton)
                {  
                    Ext.getCmp('pool_share_button').setDisabled(false);
                    Ext.getCmp('pool_activate_btn').hide();
                    Ext.getCmp('pool_terminate_btn').show();
                    Ext.getCmp('pool_box3').setDisabled(true);
                    Ext.getCmp('pool_box2').setDisabled(true);
                    $('#pool_dv_layer').remove();
                    var layer='<div style="z-index: 999; background-color: rgba(0, 0, 0, 0.4); position: absolute; top: 169px; width: 935px; left: 25px; height: 228px; border-radius: 5px;" id="pool_dv_layer"></div>';
                    $("#pollMainContainer").append(layer);        
                }
            else
                {
                 Ext.getCmp('pool_terminate_btn').hide();   
                }
            
            Ext.getCmp('pollcontestStatus').update(sts_htm);
        
            var activationDate = response.contest.activationDate;
            if(activationDate)
                {
            var n1 = activationDate.split('T');
            Ext.getCmp('pollActivationDate').setValue(n1[0]);
                }
            var expirationDate = response.contest.expirationDate;
            if(expirationDate)
                {
            var n2 = expirationDate.split('T');
            Ext.getCmp('pollExpirationDate').setValue(n2[0]);
                }
                
            Ext.getCmp('pollTitle').setValue(response.contest.contestName);
             /*==================================fetch question============================================*/
            Ext.getCmp('pollQuestions').update('<div class="poll_question_data"><div class="poll_profile_image"><img src="" alt=""/></div><div class="poll_profile_data"></div><div class="clear"></div></div>');
            var questionDetails = '<div class="poll_question_data"><div class="poll_profile_data" id="poll_profile_data"><p id="poll_question_details"><img src="' + response.contest.imageURL + '" width="86" alt="" style="float:left;margin: 0 10px 0 0;"><span>' + response.contest.displayText + '</span></p></div><div class="clear"></div></div>';
            
            Ext.getCmp('pollQuestions').update(questionDetails);
            $("#poll_profile_data").perfectScrollbar('destroy');
            $("#poll_profile_data").perfectScrollbar();
            var choices = '';
            /*====================================fetch answer============================================= */
            sessionStorage.pollChoicesData = JSON.stringify(response.contest.choices);
            if (Ext.getCmp('pollAnswerPopupSec_modal')){
                com.faralam.common.populateContestInnerData('pollChoicesData');
            }
            if (response.contest.choices.length > 0) {
                
                Ext.getCmp('pool_is_answer').setValue('1');
                for (i = 0; i < response.contest.choices.length; i++) {
                    var right='';
                if(response.contest.choices[i].isCorrect)
                    {
                var right='<img style="margin-top:5px;margin-right:5px" src="'+com.faralam.custom_img_path+'ACTIVE.png" alt="">';
                    }
                    choices += '<li><div style="height:25px;width:30px">'+right+'</div><div class="box_lable">' + response.contest.choices[i].choiceValue + '</div><div class="simple_text">' + response.contest.choices[i].displayText + '</div></li>';
                }
            }
            var choicesData = '';
            if (choices != '') {
                choicesData = '<div id="poll_answer_data"><ul>' + choices + '</ul></div><div class="clear"></div></div> ';

            } else {
                choicesData = '<div id="poll_answer_data"></div><div class="clear"></div></div> ';
            }

            Ext.getCmp('pollAnswers').update(choicesData);
            $("#poll_answer_data").perfectScrollbar('destroy');
            $("#poll_answer_data").perfectScrollbar();
            /*========================================fetch prize ============================*/
            var prize = '';
            sessionStorage.pollPrizeData = JSON.stringify(response.contest.prizes);
            if (Ext.getCmp('pollPrizePopupSec_modal')){
                com.faralam.common.populateContestInnerData('pollPrizeData');
            }
            //console.log(sessionStorage.pollPrizeData);
            if (response.contest.prizes.length > 0) {
                Ext.getCmp('pool_is_prize').setValue('1');
                for (i = 0; i < response.contest.prizes.length; i++) {
                    prize += '<li><div class="simple_text">' + response.contest.prizes[i].displayText + '</div><div class="box_lable">' + response.contest.prizes[i].quantity + '</div></li>';
                }
            }
            else
                {
                    Ext.getCmp('pollPrizes').update('<div class="poll_question_data"><div class="poll_profile_image"><img src="" alt=""/></div><div class="poll_profile_data"></div><div class="clear"></div></div>');
                }
            var prizeData = '';
            if (prize!= '') {
                prizeData = '<div id="poll_prizes_data"><ul>' + prize + '</ul></div><div class="clear"></div></div> ';

            } else {
                prizeData = '<div id="poll_prizes_data"></div><div class="clear"></div></div> ';
            }

            
            Ext.getCmp('pollPrizes').update(prizeData);
            $("#poll_prizes_data").perfectScrollbar('destroy');
            $("#poll_prizes_data").perfectScrollbar();
            /*=======================================fetch entries===================================================*/
            
               if (response.pollEntries.hasEntry) {
            var entries='';
            var ie=0;
            for(ie=0;ie<response.pollEntries.entries.length;ie++)
                {
                    var img_ent='';
                    if(response.pollEntries.entries[ie].isCorrect)
                        {
                          img_ent='<img style="margin-top:5px" src="'+com.faralam.custom_img_path+'ACTIVE.png" alt="">';  
                        }
                    entries=entries+'<div class="entrylist"><div class="entry_active">'+img_ent+'</div><div class="member_entry" style="overflow:hidden">'+response.pollEntries.entries[ie].userName+'</div><div style="width:50px; height:30px; padding:0px; margin-left:3px; border:0px solid #000000; float:left; "><button type="button" usrnm="'+response.pollEntries.entries[ie].userName+'" class="entry_msg_btn" onclick="com.faralam.common.msg_sec_open(this)" style="font-size:12px;cursor:pointer">Message</button></div><div class="entry_move_icon"><img style="cursor:move" src="'+com.faralam.custom_img_path+'icon_move.png" draggable="true" id="poll_drag_winner" entryId="'+response.pollEntries.entries[ie].entryId+'" entryForUID="'+response.pollEntries.entries[ie].entryForUID+'" contestUUID="'+response.pollEntries.entries[ie].contestUUID+'" userName="'+response.pollEntries.entries[ie].userName+'" ondragend="com.faralam.dragEnd_contest(event)"  ondragstart="com.faralam.dragStart_contest(event)"  alt=""></div></div>';
                }
                   
            var f_html='<div id="poll_entries_data"><div class="entrylist">'+entries+'</div></div>';
                   
             Ext.getCmp('pollEntries').update(f_html);
            $("#poll_entries_data").perfectScrollbar('destroy');
            $("#poll_entries_data").perfectScrollbar();
        }   
            
        else
            {
              Ext.getCmp('pollEntries').update('<div id="poll_entries_data"><div class="entrylist"></div></div>');  
            }
           /*===================================end fetch entries=============================================*/
            //=======================================fetch winner======================================
            
               if (response.pollWinners.hasEntry) {
            var winner='<div id="poll_winners_data">';
            var iw=0;
            for(iw=0;iw<response.pollWinners.winners.length;iw++)
                {
                winner=winner+'<div class="winner_notification"><div class="member_winner">'+response.pollWinners.winners[iw].userName+'</div><div class="notification_btn"><button type="button" class="winner_notify_btn" entryForUID="'+response.pollWinners.winners[iw].entryForUID+'" entryId="'+response.pollWinners.winners[iw].entryId+'" contestUUID="'+response.pollWinners.winners[iw].contestUUID+'" onclick="com.faralam.common.notifyPollingContestWinner(this)" style="margin-left:15px">Notify</button></div></div>';
                }
                   
            winner=winner+'</div><div  style="width: 290px;height: 27px; color: rgb(119, 119, 119); padding-left: 95px; padding-top: 4px;" ondrop="com.faralam.drop_contest(event)" ondragover="com.faralam.dragOver_contest(event)" ondragenter="com.faralam.dragEnter_contest(event)" ondragleave="com.faralam.dragLeave_contest(event)" class="poll_drop_zone_normal" id="poll_winner_drop_zone">Drop Entries Here</div></div>';
                  
             Ext.getCmp('pollWinners').update(winner);
             
            $("#poll_winners_data").perfectScrollbar('destroy');
            $("#poll_winners_data").perfectScrollbar();
               }
            else
                {
                    var txt='<div style="border: 1px solid black; width: 292px;"><div style="border: medium none; height: 163px;" id="poll_winners_data"><div class="winner_notification"></div></div><div  style="width:290px;height: 27px; color: rgb(119, 119, 119); padding-left: 95px; padding-top: 4px;" ondrop="com.faralam.drop_contest(event)" ondragover="com.faralam.dragOver_contest(event)" ondragenter="com.faralam.dragEnter_contest(event)" ondragleave="com.faralam.dragLeave_contest(event)" class="poll_drop_zone_normal" id="poll_winner_drop_zone">Drop Entries Here</div>';
                Ext.getCmp('pollWinners').update(txt);     
                }
            //=======================================fetch winner end======================================
            //=======================================Result map ===========================================
            var result_map='<div style="height: 165px; width: 100%; position: relative; overflow: hidden; border-bottom: 1px solid black;">';
            if(response.pollResults.totalEntries>0)
                {
                    var n=parseInt(230/response.pollResults.totalEntries);
                    
            $.each(response.pollResults.resultsMap, function(key, value){
                            var color='#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
                result_map=result_map+'<div style="width: 100%; display: inline-block; height: 32px;"><div style="width: 17%; height: 30px; float: left; margin: 5px 0px 0px; padding-left: 21px; padding-top: 5px;"><b>'+value.choiceIndex+'</b></div>';
                    if(value.entryCountForThisChoice>0)
                        {
                            var px=n*value.entryCountForThisChoice;
                          result_map=result_map+'<div style="background-color:'+color+'; float: left; border: 2px solid black; height: 20px; margin-top: 8px; width:'+px+'px"></div>';  
                        }
                    result_map=result_map+'</div>';
                                 
                             });
             }
            result_map=result_map+'</div>'
               
            var result_htm='<div id="poll_results_data">'+result_map+'<div style="color: rgb(0, 0, 0); height: 30px; position: relative; padding-top: 5px; padding-left: 5px;"><p style="width:50%;float:left;font-weight:bold">Responses:&nbsp'+response.pollResults.totalEntries+' </p><p style="width: 50%; float: left; font-weight:bold">Days left:&nbsp'+response.pollResults.daysLeft+'</p></div></div>';
            Ext.getCmp('pollResults').update('<div id="poll_results_data"></div>');
            Ext.getCmp('pollResults').update(result_htm);
            $("#poll_results_data").perfectScrollbar('destroy');
            $("#poll_results_data").perfectScrollbar();
            //=======================================Result map end =======================================
            Ext.getCmp('pollcontestStatus').update('<div class="text_poll">Status: ' + response.contest.contestStatus.displayText + '</div>');
            
            //com.faralam.common.retrievePollEntries();
            //com.faralam.common.retrievePollWinners();
        }

    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrievePollPortal_func, "GET", {}, onsuccess, onerror);
}

com.faralam.common.retrievePollEntries = function () {
    com.faralam.retrievePollEntries = com.faralam.serverURL + 'contests/retrievePollEntries';
    com.faralam.retrievePollEntries = com.faralam.retrievePollEntries + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID + '&contestUUID=' + sessionStorage.contestUUID);

    var onsuccess = function (response, textStatus, jqXHR) {
        if (response != {}) {
            
            var html='';
            var i=0;
            for(i=0;i<response.entries.length;i++)
                {
                    html=html+'<div class="entrylist"><div class="entry_active"><img style="margin-top:5px" src="'+com.faralam.custom_img_path+'ACTIVE.png" alt=""></div><div class="member_entry" style="overflow:hidden">'+response.entries[i].userName+'</div><div style="width:50px; height:30px; padding:0px; margin-left:3px; border:0px solid #000000; float:left; "><button type="button" usrnm="'+response.entries[i].userName+'" class="entry_msg_btn" onclick="com.faralam.common.msg_sec_open(this)" style="font-size:12px;cursor:pointer">Message</button></div><div class="entry_move_icon"><img src="'+com.faralam.custom_img_path+'icon_move.png" draggable="true" id="poll_drag_winner" entryId="'+response.entries[i].entryId+'" entryForUID="'+response.entries[i].entryForUID+'" contestUUID="'+response.entries[i].contestUUID+'" userName="'+response.entries[i].userName+'" ondragend="com.faralam.dragEnd_contest(event)"  ondragstart="com.faralam.dragStart_contest(event)"  alt=""></div></div>';
                }
            var f_html='<div id="poll_entries_data"><div class="entrylist">'+html+'</div></div>';
             Ext.getCmp('pollEntries').update(f_html);
            $("#poll_entries_data").perfectScrollbar('destroy');
            $("#poll_entries_data").perfectScrollbar();
        }

    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrievePollEntries, "GET", {}, onsuccess, onerror);
}

com.faralam.common.msg_sec_open = function(e){
   
   console.log(e.getAttribute('usrnm'));
   sessionStorage.contest_usrnm=e.getAttribute('usrnm');
   Ext.getCmp('main_tab').down('#PollContest').setDisabled(true);
   Ext.getCmp('main_tab').down('#ContestMessage').setDisabled(false);
   Ext.getCmp('main_tab').setActiveTab(49); 
   
    Ext.getCmp('ContestMessage_pageHeader').update('<span style="width:920px !important;position: absolute;text-align:center;color:#568;font-size:20px; font-weight: bold;top:0px !important;margin-top:-12px">' + sessionStorage.contest_usrnm + '</span>');
}

com.faralam.common.retrievePollWinners = function () {
    com.faralam.retrievePollWinners = com.faralam.serverURL + 'contests/retrievePollWinners';
    com.faralam.retrievePollWinners = com.faralam.retrievePollWinners + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID + '&contestUUID=' + sessionStorage.contestUUID);

    var onsuccess = function (response, textStatus, jqXHR) {
        if (response != {}) {
            //console.log(response);
        }

    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrievePollWinners, "GET", {}, onsuccess, onerror);
}

com.faralam.common.contestDateFormat = function(date){
console.log(date);
    var t=date.split('-');
    var d = new Date();
    d.setFullYear(t[0]);
    var mn=parseInt(t[1])-1;
    
    d.setMonth(mn);
    d.setDate(t[2]);
    var t=d.toISOString();
    var f=t.split('.');
    f=f[0];
    //console.log(t);
    return f;
}

com.faralam.common.createPoll = function () {
    com.faralam.createPoll = com.faralam.serverURL + 'contests/createPollURL';
    com.faralam.createPoll = com.faralam.createPoll + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
    var data = {
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL,
        "activationDate": com.faralam.common.contestDateFormat(Ext.getCmp('newPollActivationDate').getSubmitValue())+":PDT",          
        "expirationDate": com.faralam.common.contestDateFormat(Ext.getCmp('newPollExpirationDate').getSubmitValue())+"Z",  
        "contestName": Ext.getCmp('newPollTitle').getValue(),
        "displayText": Ext.getCmp('newPollQuestion').getValue(),
        "isAnonymous": Ext.getCmp('poll_anonymous').getValue(),
        "contestUUID": null,
        "url": Ext.getCmp('pollQuestion_img').src
    };

    data = JSON.stringify(data);

    console.log(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Poll contest added successfully.', function () {
            sessionStorage.nxt_prev_id="";
        Ext.getCmp('main_tab').down('#CreateNewPollContest').setDisabled(true);
        Ext.getCmp('main_tab').down('#PollContest').setDisabled(false);   
        Ext.getCmp('main_tab').setActiveTab(29);
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

com.faralam.common.sendAjaxRequest(com.faralam.createPoll, "POST", data, onsuccess, onerror);
}

com.faralam.common.operateSwitchCheckbox = function (e, field) {
    if (e != '') {
        //console.log(field);
        Ext.getCmp(field).setValue($(e).is(':checked'));
    }
}

com.faralam.common.pollQuestionPopupSec = function () {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var pollQuestionPopupSec_modal;

    if (Ext.getCmp('pollQuestionPopupSec_modal')) {
        var modal = Ext.getCmp('pollQuestionPopupSec_modal');
        modal.destroy(modal, new Object());
    }
    if (!pollQuestionPopupSec_modal) {
        var pollQuestionPopupSec_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'white_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:540px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    margin: '30 0 0 25',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: '<span style="color:#000 !important;">Question</span>',
                                            labelSeparator: '',
                                            emptyText: '',
                                            inputWidth: 345,
                                            // height: 150,
                                            margin: '0 0 0 10',
                                            name: '',
                                            value: '',
                                            id: 'updateQuestionText',
                                            allowBlank: false
                                        }
                                    ]
                                },
                                {
                                    xtype: 'button',
                                    scale: 'large',
                                    text: '<span style="color:#fff !important;">Update</span>',
                                    style: ' border-radius: 5px !important;cursor:pointer;background:#007AFF !important;border:2px solid #000 !important;box-shadow:none !important;color:#006FC0;padding:0 5px;',
                                    height: 26,
                                    width: 120,
                                    margin: '30 0 20 120',
                                    handler: function () {
                                        var question = Ext.getCmp('updateQuestionText').getValue();
                                        if (question && question != '') {
                                            com.faralam.common.updatePoll();
                                        } else {
                                            Ext.MessageBox.alert('Information', 'Please enter the poll question');
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        pollQuestionPopupSec_modal = Ext.widget('window', {
            title: '<div class="add_answer_text">Update Question</div>',
            id: 'pollQuestionPopupSec_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 540,
            cls: 'white_modal',
            //height:410,
            items: pollQuestionPopupSec_modal_form,
            listeners: {
                close: function () {
                    pollQuestionPopupSec_modal_form.getForm().reset(true);
                },
                show: function () {
                    Ext.getCmp('updateQuestionText').setValue(sessionStorage.question);
                }

            }
        });
    }
    pollQuestionPopupSec_modal.show();
}

com.faralam.common.pollAnswerPopupSec = function () {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var pollAnswerPopupSec_modal;

    if (Ext.getCmp('pollAnswerPopupSec_modal')) {
        var modal = Ext.getCmp('pollAnswerPopupSec_modal');
        modal.destroy(modal, new Object());
    }
    if (!pollAnswerPopupSec_modal) {
        var pollAnswerPopupSec_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'white_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:800px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            value: '<div class="add_answer_text">Add / Delete Answers</div>'
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'large',
                                            text: '<span style="color:#fff !important;">Add New Picture</span>',
                                            style: ' border-radius: 5px !important;cursor:pointer;background:#007AFF !important;border:2px solid #000 !important;box-shadow:none !important;color:#006FC0;padding:0 5px;',
                                            height: 26,
                                            width: 170,
                                            margin: '0 0 0 255',
                                            handler: function () {
                                                $('#modal').css({
                                                    'z-index': '19002'
                                                });
                                                com.faralam.getCropPicURLs('resources/plugins/croppic/pollcontestanswer_crop.html');
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '20 0 0 25',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: '',
                                            labelSeparator: '',
                                            emptyText: 'Poll Answer',
                                            inputWidth: 345,
                                            // height: 150,
                                            margin: '40 0 0 10',
                                            name: '',
                                            value: '',
                                            id: 'newPollAnswerText',
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'image',
                                            width: 160,
                                            height: 150,
                                            src: '',
                                            margin: '0 0 0 78',
                                            style: 'background:#E81212;',
                                            id: 'pollAnswer_img'
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'large',
                                            text: '<span style="color:#fff !important;">Add</span>',
                                            style: ' border-radius: 5px !important;cursor:pointer;background:#007AFF !important;border:2px solid #000 !important;box-shadow:none !important;color:#006FC0;padding:0 5px;',
                                            height: 26,
                                            width: 80,
                                            margin: '40 0 0 35',
                                            handler: function () {
                                                com.faralam.common.addPollChoice();
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '20 0 0 0',
                                    items: [
                                        {
                                            xtype: 'component',
                                            id: 'choiceDetailsTable',
                                            html: ''
                                                //html:'<div class="bottom_scroll"><div class="add_delete_bottomsection"><button type="button" title="set as correct" class="set_corrcet">Set As Correct</button><div class="add_minus_icon"><img src="'+com.faralam.custom_img_path+'icon_delete.png" alt=""></div><div class="add_profile_list"><div class="add_prof_no">1</div><div class="add_prof_imagedetails"><div class="add_prof_text">No Image Available</div></div><div class="add_prof_imageoption">Choice 1</div><div class="add_prof_move"><img src="'+com.faralam.custom_img_path+'icon_move.png" alt="" class="move_icon_position"></div></div></div><div class="add_delete_bottomsection"><button type="button" title="set as correct" class="set_corrcet">Set As Correct</button><div class="add_minus_icon"><img src="'+com.faralam.custom_img_path+'icon_delete.png" alt=""></div><div class="add_profile_list"><div class="add_prof_no">1</div><div class="add_prof_imagedetails"><div class="add_prof_pic"><img src="'+com.faralam.custom_img_path+'prof_image.png" alt="" width="140" height="91" ></div></div><div class="add_prof_imageoption">Choice 1</div><div class="add_prof_move"><img src="'+com.faralam.custom_img_path+'icon_move.png" alt="" class="move_icon_position"></div></div></div></div>'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        pollAnswerPopupSec_modal = Ext.widget('window', {
            title: '',
            id: 'pollAnswerPopupSec_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 800,
            cls: 'white_modal',
            //height:410,
            items: pollAnswerPopupSec_modal_form,
            listeners: {
                close: function () {
                    pollAnswerPopupSec_modal_form.getForm().reset(true);
                },
                show: function () {
                    com.faralam.common.populateContestInnerData('pollChoicesData');
                }

            }
        });
    }
    pollAnswerPopupSec_modal.showAt(50, 100);
    //pollAnswerPopupSec_modal.show();
}

com.faralam.common.pollPrizePopupSec = function () {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var pollPrizePopupSec_modal;

    if (Ext.getCmp('pollPrizePopupSec_modal')) {
        var modal = Ext.getCmp('pollPrizePopupSec_modal');
        modal.destroy(modal, new Object());
    }
    if (!pollPrizePopupSec_modal) {
        var pollPrizePopupSec_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'white_bg',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:800px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            value: '<div class="add_answer_text">Add / Delete Prizes</div>'
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'large',
                                            text: '<span style="color:#fff !important;">Add New Picture</span>',
                                            style: ' border-radius: 5px !important;cursor:pointer;background:#007AFF !important;border:2px solid #000 !important;box-shadow:none !important;color:#006FC0;padding:0 5px;',
                                            height: 26,
                                            width: 170,
                                            margin: '0 0 0 255',
                                            handler: function () {
                                                $('#modal').css({
                                                    'z-index': '19002'
                                                });
                                                com.faralam.getCropPicURLs('resources/plugins/croppic/pollcontestprize_crop.html');
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '20 0 0 25',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: '<p style="margin: -1px;color: #000;font-size: 15px;font-weight: bold;">QTY</p>',
                                            labelStyle: 'color:#000 !important;',
                                            labelSeparator: '',
                                            labelAlign: 'top',
                                            emptyText: 'Prize Qty',
                                            inputWidth: 75,
                                            // height: 150,
                                            margin: '20 0 0 10',
                                            name: '',
                                            value: '',
                                            id: 'pollPrizeQty',
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: '<p style="margin: -1px;color: #000;font-size: 15px;font-weight: bold;">Prize Name</p>',
                                            labelStyle: 'color:#000 !important;',
                                            labelSeparator: '',
                                            labelAlign: 'top',
                                            emptyText: 'Prize Name',
                                            inputWidth: 300,
                                            // height: 150,
                                            margin: '20 0 0 20',
                                            name: '',
                                            value: '',
                                            id: 'pollPrizeName',
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'image',
                                            width: 160,
                                            height: 150,
                                            src: '',
                                            margin: '0 0 0 27',
                                            style: 'background:#E81212;',
                                            id: 'pollPrize_img'
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'large',
                                            text: '<span style="color:#fff !important;">Add</span>',
                                            style: ' border-radius: 5px !important;cursor:pointer;background:#007AFF !important;border:2px solid #000 !important;box-shadow:none !important;color:#006FC0;padding:0 5px;',
                                            height: 26,
                                            width: 80,
                                            margin: '40 0 0 35',
                                            handler: function () {
                                                com.faralam.common.addPollPrize();
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '20 0 0 0',
                                    items: [
                                        {
                                            xtype: 'component',
                                            id: 'prizeDetailsTable',
                                            html: ''
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        pollPrizePopupSec_modal = Ext.widget('window', {
            title: '',
            id: 'pollPrizePopupSec_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 800,
            cls: 'white_modal',
            //height:410,
            items: pollPrizePopupSec_modal_form,
            listeners: {
                close: function () {
                    pollPrizePopupSec_modal_form.getForm().reset(true);
                },
                show: function () {
                    com.faralam.common.populateContestInnerData('pollPrizeData');
                }

            }
        });
    }
    pollPrizePopupSec_modal.showAt(50, 100);
    //pollPrizePopupSec_modal.show();
}

com.faralam.common.pollMsgPopupSec = function () {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var pollMsgPopupSec_modal;

    if (Ext.getCmp('pollMsgPopupSec_modal')) {
        var modal = Ext.getCmp('pollMsgPopupSec_modal');
        modal.destroy(modal, new Object());
    }
    if (!pollMsgPopupSec_modal) {
        var pollMsgPopupSec_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            cls: 'white_bg',
            border: false,
            bodyPadding: 0,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 1,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:345px;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'container',
                                    margin: '0 0 0 0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: '',
                                            labelSeparator: '',
                                            emptyText: '',
                                            inputWidth: 295,
                        
                                            // height: 150,
                                            margin: '20 0 0 0',
                                            name: '',
                                            value: '',
                                            id: 'updateMsgText',
                                            allowBlank: false
                                        }
                                    ]
                                },
                                {
                                    xtype: 'button',
                                    scale: 'midium',
                                    text: '<span style="color:#007AFF !important;">Send Message</span>',
                                    style: ' border-radius: 0px !important;cursor:pointer;background:none !important;border:0px solid #000 !important;border-top:1px solid #CCC !important;box-shadow:none !important;padding:0 5px;',
                                    height: 30,
                                    width: 315,
                                    margin: '30 0 0 0',
                                    handler: function () {
                                        var question = Ext.getCmp('updateQuestionText').getValue();
                                        if (question && question != '') {
                                            com.faralam.common.updatePoll();
                                        } else {
                                            Ext.MessageBox.alert('Information', 'Please enter the poll question');
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    scale: 'midium',
                                    text: '<span style="color:#007AFF !important;">Cancel</span>',
                                    style: ' border-radius: 0px !important;cursor:pointer;background:none !important;border:0px solid #000 !important;box-shadow:none !important;padding:0 5px; border-top:1px solid #CCC !important;',
                                    height: 30,
                                    width: 315,
                                    margin: '0 0 0 0',
                                    handler: function () {
                                        Ext.getCmp('pollMsgPopupSec_modal').close();
                                    }
								}
                            ]
                        }
                    ]
                }
            ]
        });

        pollMsgPopupSec_modal = Ext.widget('window', {
            title: '<div class="add_answer_text">Please enter your message</div>',
            id: 'pollMsgPopupSec_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 315,
            cls: 'white_modal',
            //height:410,
            items: pollMsgPopupSec_modal_form,
            listeners: {
                close: function () {
                    pollMsgPopupSec_modal_form.getForm().reset(true);
                },
                show: function () {
                    //Ext.getCmp('updateMsgText').setValue(sessionStorage.question);
                }

            }
        });
    }
    pollMsgPopupSec_modal.show();
}

com.faralam.common.populateContestInnerData = function (source) {
    if (source == 'pollPrizeData') {
        var obj = JSON.parse(sessionStorage.pollPrizeData);
        var blockId = 'pollPrizeBlock';
    } else if (source == 'pollChoicesData') {
        var obj = JSON.parse(sessionStorage.pollChoicesData);
        var blockId = 'pollChoicesBlock';
    }

    var data = '';
    if (obj.length > 0) {
        for (i = 0; i < obj.length; i++) {
            if (source == 'pollPrizeData') {
                var imgData = '';
                if (obj[i].imageUrl != null) {
                    imgData = '<div class="add_prof_pic"><img src="' + obj[i].imageUrl + '" alt="" width="140" height="91" ></div>';
                } else {
                    imgData = '<div class="add_prof_text">No Image Available</div>';
                }
                data += '<div class="add_delete_bottomsection"><div class="add_minus_icon"><img onclick="com.faralam.common.deletePollContestPrize(this)" contestPrizeId="' + obj[i].contestPrizeId + '" src="' + com.faralam.custom_img_path + 'icon_delete.png" alt="" style="cursor:pointer;"></div><div class="add_profile_list prizeList_section"><div class="add_prof_no"><p>' + obj[i].quantity + '</p></div><div class="add_prof_imagedetails">' + imgData + '</div><div class="add_prof_imageoption prizeName_section"><p>' + obj[i].displayText + '</p></div><div class="add_prof_move"><img src="' + com.faralam.custom_img_path + 'icon_move.png" alt="" class="move_icon_position"></div></div></div>';
            } else if (source == 'pollChoicesData') {
                var imgData = '';
                if (obj[i].imageURL != null) {
                    imgData = '<div class="add_prof_pic"><img src="' + obj[i].imageURL + '" alt="" width="140" height="91" ></div>';
                } else {
                    imgData = '<div class="add_prof_text">No Image Available</div>';
                }
                var rht_img="";
                if(obj[i].isCorrect){
                rht_img='<img src="' + com.faralam.custom_img_path + 'ACTIVE.png" alt="" style="cursor:pointer;">';
                }
                data += '<div class="add_delete_bottomsection"><button onclick="com.faralam.common.setCorrectPollChoice(this)" choiceId="' + obj[i].choiceId + '" type="button" title="set as correct" class="set_corrcet" style="width:130px !important">Set As Correct</button><div class="add_minus_icon" style="width:50px">'+rht_img+'<img onclick="com.faralam.common.removePollChoice(this)" choiceId="' + obj[i].choiceId + '" src="' + com.faralam.custom_img_path + 'icon_delete.png" alt="" style="cursor:pointer;"></div><div class="add_profile_list"><div class="add_prof_no"><p>' + obj[i].choiceValue + '</p></div><div class="add_prof_imagedetails">' + imgData + '</div><div class="add_prof_imageoption"><p>' + obj[i].displayText + '</p></div><div class="add_prof_move"><img src="' + com.faralam.custom_img_path + 'icon_move.png" alt="" class="move_icon_position"></div></div></div>';
            }
        }
    }

    if (data != '') {
        html = '<div class="bottom_scroll" id="' + blockId + '">' + data + '</div>';
    } else {
        html = '<div class="bottom_scroll" id="' + blockId + '">No Data Available</div>';
    }

    if (source == 'pollPrizeData') {
        Ext.getCmp('prizeDetailsTable').update(html);
    } else if (source == 'pollChoicesData') {
        Ext.getCmp('choiceDetailsTable').update(html);
    }
    $("#" + blockId).perfectScrollbar('destroy');
    $("#" + blockId).perfectScrollbar();


}

com.faralam.common.updatePoll = function () {
    com.faralam.updatePoll = com.faralam.serverURL + 'contests/updatePoll';
    com.faralam.updatePoll = com.faralam.updatePoll + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "displayText": Ext.getCmp('updateQuestionText').getValue(),
        "pollName": sessionStorage.contestName,
        "contestUUID": sessionStorage.contestUUID
    };

    data = JSON.stringify(data);

    //console.log(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Poll updated successfully.', function () {
            Ext.getCmp('pollQuestionPopupSec_modal').close();
            com.faralam.common.retrievePollPortal_func();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.updatePoll, "POST", data, onsuccess, onerror);
}

com.faralam.common.addPollChoice = function () {
    var ans=Ext.getCmp('newPollAnswerText').getValue();
    if(ans.trim()=='')
        {
            Ext.MessageBox.alert('Success', 'Please Enter Answer befor save.');
        }
    else{
    com.faralam.addPollChoice = com.faralam.serverURL + 'contests/addPollChoiceURL';
    com.faralam.addPollChoice = com.faralam.addPollChoice + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var data = {
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL,
        "contestUUID": sessionStorage.contestUUID,
        "choiceName": Ext.getCmp('newPollAnswerText').getValue(),
        "displayText": Ext.getCmp('newPollAnswerText').getValue(),
        "url": Ext.getCmp('pollAnswer_img').src
    };

    data = JSON.stringify(data);

    //console.log(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Poll choice added successfully.', function () {
            Ext.getCmp('newPollAnswerText').setValue('');
            Ext.getCmp('pollAnswer_img').setSrc('');
            //Ext.getCmp('pollAnswerPopupSec_modal').close();
            com.faralam.common.retrievePollPortal_func();
            
            
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.addPollChoice, "POST", data, onsuccess, onerror);
}}

com.faralam.common.addPollPrize = function () {
    com.faralam.addPollPrize = com.faralam.serverURL + 'contests/addPollPrizeURL';
    com.faralam.addPollPrize = com.faralam.addPollPrize + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);


    var data = {
        "serviceAccommodatorId": sessionStorage.SA,
        "serviceLocationId": sessionStorage.SL,
        "contestUUID": sessionStorage.contestUUID,
        "quantity": Ext.getCmp('pollPrizeQty').getValue(),
        "contestPrizeName": Ext.getCmp('pollPrizeName').getValue(),
        "displayText": Ext.getCmp('pollPrizeName').getValue(),
        "hiddenText": "Employees not eligible",
        "url": Ext.getCmp('pollPrize_img').src
    };

    data = JSON.stringify(data);

    //console.log(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Poll prize added successfully.', function () {
            //Ext.getCmp('pollPrizePopupSec_modal').close();
            Ext.getCmp('pollPrizeQty').setValue('');
            Ext.getCmp('pollPrizeName').setValue('');
            Ext.getCmp('pollPrize_img').setSrc('');
            com.faralam.common.retrievePollPortal_func();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.addPollPrize, "POST", data, onsuccess, onerror);
}

com.faralam.common.setCorrectPollChoice = function (e) {
    com.faralam.setCorrectPollChoice = com.faralam.serverURL + 'contests/setCorrectPollChoice';
    com.faralam.setCorrectPollChoice = com.faralam.setCorrectPollChoice + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&contestUUID=' + sessionStorage.contestUUID + '&choiceId=' + e.getAttribute('choiceId'));

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Set correct poll choice successfully.', function () {
        com.faralam.common.retrievePollPortal_func();    
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.setCorrectPollChoice, "GET", {}, onsuccess, onerror);

}

com.faralam.common.removePollChoice = function (e) {
    
    com.faralam.removePollChoice = com.faralam.serverURL + 'contests/removePollChoice';
    com.faralam.removePollChoice = com.faralam.removePollChoice + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&contestUUID=' + sessionStorage.contestUUID + '&choiceId=' + e.getAttribute('choiceId'));

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Choice deleted successfully.', function () {
            //Ext.getCmp('pollAnswerPopupSec_modal').close();
            com.faralam.common.retrievePollPortal_func();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
Ext.MessageBox.confirm('Confirm', 'Do you really want to remove the choice?', function (e) {
                                    if (e == 'yes') {
            com.faralam.common.sendAjaxRequest(com.faralam.removePollChoice, "DELETE", {}, onsuccess, onerror);
                                                    }
                                                });
    

}

com.faralam.common.deletePollContestPrize = function (e) {
    com.faralam.deletePollContestPrize = com.faralam.serverURL + 'contests/deletePollContestPrize';
    com.faralam.deletePollContestPrize = com.faralam.deletePollContestPrize + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&contestUUID=' + sessionStorage.contestUUID + '&contestPrizeId=' + e.getAttribute('contestPrizeId'));

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Prize deleted successfully.', function () {
            Ext.getCmp('pollPrizePopupSec_modal').close();
            com.faralam.common.retrievePollPortal_func();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
    Ext.MessageBox.confirm('Confirm', 'Do you really want to delete the prize?', function (e) {
                                    if (e == 'yes') {
             com.faralam.common.sendAjaxRequest(com.faralam.deletePollContestPrize, "DELETE", {}, onsuccess, onerror);
                                                    }
                                                });
}

com.faralam.common.notifyPollingContestWinner = function (e) {
    com.faralam.notifyPollingContestWinner = com.faralam.serverURL + 'contests/notifyPollingContestWinner';
    com.faralam.notifyPollingContestWinner = com.faralam.notifyPollingContestWinner + "?" + encodeURI('UID=' + sessionStorage.UID);
  var data = {
  "entryForUID": e.getAttribute('entryForUID'),
  "entryId": e.getAttribute('entryId'),
  "contestUUID": e.getAttribute('contestUUID')
};
    data=JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success',response.messageBody );
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.notifyPollingContestWinner, "POST", data, onsuccess, onerror);
}
com.faralam.common.OpenInNewTab = function (e) {
    var url;
  var type=e.getAttribute('tp');
  if(type=="FB")
      {
          url='https://www.facebook.com/sharer.php?u='+sessionStorage.contest_shareurl;  
      }
    if(type=="TW")
        {
         url='https://twitter.com/share?url='+sessionStorage.contest_shareurl;  
        }
    url= url.toString().trim();
  var win = window.open(url, '_blank');
  win.focus();
}

com.faralam.common.sharePollContest = function () {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var sharePollContest_modal;

    if (Ext.getCmp('sharePollContest_modal')) {
        var modal = Ext.getCmp('sharePollContest_modal');
        modal.destroy(modal, new Object());
    }
    if (!sharePollContest_modal) {
        var sharePollContest_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
                    //style: 'border: 3px solid #000 !important;'
            },
            //cls: 'white_bg',
            style: 'background: #324F85 !important; width:850px !important;',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 1,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:850px !important;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            style: 'width:850px !important;',
                            items: [
                                {
                                    xtype: 'container',
                                    margin: '0 0 0 0',
                                    layout: 'hbox',
                                    style: 'width:850px !important;',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            value: '<h4 style="color: #fff;">Share URL</h4> ',
                                            width: 200,
                                            style: 'text-align: left;'
										},
                                        {
                                            xtype: 'component',
                                            width: 600,
                                            id: 'mobile_url_PollContest',
                                            margin: '0 0 0 0',
                                            html: '<span style="color:#fff;font-family: arial !important;font-size: 14px;">' + sessionStorage.contest_shareurl + '</span>',
                                            style: 'text-align:left;'
										}/*,
                                        {
                                            xtype: 'button',
                                            text: '<span style="color:#fff;">Share</span>',
                                            scale: 'medium',
                                            margin: '0 0 0 105',
                                            width: 130,
                                            style: 'cursor:pointer;background:#006FC0 !important;border:0px solid #000 !important;box-shadow:none !important; ',
                                            handler: function () {
                                                var mobNo = Ext.getCmp('share_sms_PollContest').getValue();
                                                if (mobNo && mobNo != '') {
                                                    var mode = Ext.getCmp('shareEmailSMS_access_mode_PollContest').getValue();
                                                    if (mode === true) {
                                                        //com.faralam.shareAppBySMS(mobNo);
                                                        Ext.getCmp('share_sms_PollContest').setValue('');
                                                    } else {
                                                        Ext.MessageBox.alert('Information', 'Please select the checkbox');
                                                    }
                                                } else {
                                                    Ext.MessageBox.alert('Information', 'Please enter a valid mobile no.');
                                                }
                                            }
										}*/
                                    ]
                                },
                                {
                                    xtype: 'component',
                                    //layout: 'hbox',
                                    height: 40,
                                    width: 845,
                                    margin: '10 0 10 0',
                                   /*'<table><tr><td style="width:180px;"><h4 style="color: #fff; width:135px;">Via Social Network</h4></td><td><a tp="TW" target="_blank" href="https://twitter.com/share?url=http://www.dubaishopping.com/"><img id="tweet_btn_PollContest" src="' + com.faralam.custom_img_path + '/tweet-button_withoutbg.png" width="90" height="28" style="float: left; margin-left:20px;"></a></td><td><a tp="FB" href="https://www.facebook.com/sharer.php?u=http://www.dubaishopping.com/" target="_blank"><img id="fb_btn_PollContest" src="' + com.faralam.custom_img_path + '/share_button.png" width="90" height="30" style="margin-left:30px;"></a></td></tr></table>'*/
                                    html: '<table><tr><td style="width:180px;"><h4 style="color: #fff; width:135px;">Via Social Network</h4></td><td><a href="https://twitter.com/share?url='+encodeURIComponent(sessionStorage.contest_shareurl)+'" target="_blank"><img id="tweet_btn_PollContest" src="' + com.faralam.custom_img_path + '/tweet-button_withoutbg.png" width="90" height="28" style="float: left; margin-left:20px;"></a></td><td><a href="https://www.facebook.com/sharer.php?u='+encodeURIComponent(sessionStorage.contest_shareurl)+'" target="_blank"><img id="fb_btn_PollContest" src="' + com.faralam.custom_img_path + '/share_button.png" width="90" height="30" style="margin-left:30px;"></a></td></tr></table>'
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            id: 'share_sms_PollContest',
                                            fieldLabel: 'Send URL to Mobile',
                                            name: 'share_sms',
                                            allowBlank: true,
                                            emptyText: '',
                                            msgTarget: 'none',
                                            margin: '0 0 0 0',
                                            labelAlign: 'left',
                                            labelWidth: 200,
                                            inputWidth: 250,
                                            emptyText: 'Enter mobile number',
                                            labelSeparator: '  ',
                                            style: ' border-radius: 3px !important;padding: 5px !important;',
                                            minValue: 0,
                                            minLength: 10,
                                            maxLength: 14,
                                            maskRe: /[0-9.]/,
                                            enableKeyEvents: true,
                                            listeners: {
                                                'keydown': function (me, e, eOpts) {
                                                    //com.faralam.FormatPhone(e, me);
                                                }
                                            }
										},
                                        {
                                            xtype: 'button',
                                            text: '<span style="color:#fff;">Send Text Msg</span>',
                                            scale: 'medium',
                                            margin: '0 0 0 150',
                                            width: 130,
                                            style: 'cursor:pointer;background:#006FC0 !important;border:0px solid #000 !important;box-shadow:none !important; left:645px;',
                                            handler: function () {
                                                var mobNo = Ext.getCmp('share_sms_PollContest').getValue();
                                                if (mobNo && mobNo != '') {
                                                    var mode = Ext.getCmp('shareEmailSMS_access_mode_PollContest').getValue();
                                                    if (mode === true) {
                                                        //com.faralam.shareAppBySMS(mobNo);
                                                        com.faralam.common.contest_share_sms(mobNo);
                                                        Ext.getCmp('share_sms_PollContest').setValue('');
                                                    } else {
                                                        Ext.MessageBox.alert('Information', 'Please select the checkbox');
                                                    }
                                                } else {
                                                    Ext.MessageBox.alert('Information', 'Please enter a valid mobile no.');
                                                }
                                            }
										}
									]
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            id: 'share_email_PollContest',
                                            fieldLabel: 'Send URL to E-Mail',
                                            name: 'share_email',
                                            allowBlank: true,
                                            emptyText: '',
                                            msgTarget: 'none',
                                            margin: '0 0 0 0',
                                            labelAlign: 'left',
                                            labelWidth: 200,
                                            inputWidth: 250,
                                            emptyText: 'Enter email address',
                                            labelSeparator: '  ',
                                            vtype: 'email',
                                            vtypeText: 'Email format is not valid',
                                            style: ' border-radius: 3px !important;padding: 5px !important;',
                                            listeners: {
                                                'errorchange': function (e, error, eOpts) {
                                                    var errUI = Ext.getCmp('share_email_err_PollContest');
                                                    errUI.setValue('');
                                                    if (error) {
                                                        if (e.getValue().length > 0) {
                                                            errUI.setValue('<span style="color:#CF4C35;">Enter valid email</span>');
                                                        } else {
                                                            errUI.setValue('<span style="color:#CF4C35;">' + error + '</span>');
                                                        }
                                                    }
                                                }
                                            }
										},
                                        {
                                            xtype: 'button',
                                            text: '<span style="color:#fff;">Send E-Mail</span>',
                                            scale: 'medium',
                                            margin: '0 0 0 150',
                                            width: 130,
                                            style: 'cursor:pointer;background:#006FC0 !important;border:0px solid #000 !important;box-shadow:none !important; left:645px;',
                                            handler: function () {
                                                var emailAddress = Ext.getCmp('share_email_PollContest').getValue();
                                                if (emailAddress && emailAddress != '') {
                                                    var mode = Ext.getCmp('shareEmailSMS_access_mode_PollContest').getValue();
                                                    if (mode === true) {
                                                        //com.faralam.shareAppByEmail(emailAddress);
                                                        com.faralam.common.contest_share_email(emailAddress);
                                                        Ext.getCmp('share_email_PollContest').setValue('');
                                                    } else {
                                                        Ext.MessageBox.alert('Information', 'Please select the checkbox');
                                                    }
                                                } else {
                                                    Ext.MessageBox.alert('Information', 'Please enter a valid email address.');
                                                }
                                            }
										}
									]
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '0 0 0 0',
                                    width: 500,
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            name: 'share_email_err',
                                            id: 'share_email_err_PollContest',
                                            fieldLabel: '&nbsp;',
                                            margin: '0 0 0 10',
                                            value: '',
                                            labelSeparator: ''
										}
									]
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    width: 900,
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            fieldLabel: '<h4 style="color: #ffff00;margin-right: 10px; text-align:center !important">"I certify that the recipient has agreed to receive this Text/E-Mail message"</h4>',
                                            defaultType: 'checkboxfield',
                                            msgTarget: 'none',
                                            /* inputWidth: 280,
											inputHeight: 32,*/
                                            margin: '0 0 0 20',
                                            labelAlign: 'right',
                                            //labelWidth: 375,
                                            labelWidth: 550,
                                            inputWidth: 80,
                                            labelSeparator: '  ',
                                            items: [
                                                {
                                                    name: 'shareEmailSMS_access_mode',
                                                    //inputValue: '1',
                                                    id: 'shareEmailSMS_access_mode_PollContest',
                                                    listeners: {
                                                        click: {
                                                            element: 'el',
                                                            fn: function () {
                                                                var mode = Ext.getCmp('shareEmailSMS_access_mode_PollContest').getValue();
                                                                //console.log(mode);
                                                                //console.log(Ext.getCmp('share_email_access_mode_PollContest').inputEl.dom.style.backgroundPosition);
                                                                if (mode === true) {
                                                                    Ext.get('shareEmailSMS_access_mode_PollContest-inputEl').removeCls("inactive_checkbox");
                                                                    Ext.get('shareEmailSMS_access_mode_PollContest-inputEl').addCls("active_checkbox");
                                                                } else {
                                                                    Ext.get('shareEmailSMS_access_mode_PollContest-inputEl').removeCls("active_checkbox");
                                                                    Ext.get('shareEmailSMS_access_mode_PollContest-inputEl').addCls("inactive_checkbox");
                                                                }
                                                            }
                                                        }
                                                    }
												}
											]
										}
									]
								}
							]
                        }
                    ]
                }
            ]
        });

        sharePollContest_modal = Ext.widget('window', {
            //title: '<div class="add_answer_text">Please enter your message</div>',
            id: 'sharePollContest_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 850,
            style: 'background: #324F85 !important; border: 3px solid #000 !important;',
            //cls: 'white_modal',
            //height:410,
            items: sharePollContest_modal_form,
            listeners: {
                close: function () {
                    sharePollContest_modal_form.getForm().reset(true);
                },
                show: function () {
                    //com.faralam.common.getMobileAppURLPollContest(sessionStorage.SA, sessionStorage.SL);
                }

            }
        });
    }
    sharePollContest_modal.show();
}

com.faralam.common.getMobileAppURLPollContest = function (sa, sl) {
    com.faralam.get_mobile_app_url = com.faralam.serverURL + 'sasl/getMobileAppURL';
    com.faralam.get_mobile_app_url = com.faralam.get_mobile_app_url + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (data, textStatus, jqXHR) {
        //console.log(data);
        //console.log(data.mobileURL);
        Ext.getCmp('mobile_url_PollContest').update('');
        if (data) {
            html = '<span style="color:#fff;font-family: arial !important;font-size: 14px;">' + data.mobileURL + '</span>';
            Ext.getCmp('mobile_url_PollContest').update(html);
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_mobile_app_url, "GET", {}, onsuccess, onerror);
}

com.faralam.common.activatePoll = function(){
    var is_ans=Ext.getCmp('pool_is_answer').getValue();
    var is_prize=Ext.getCmp('pool_is_prize').getValue();
    if(is_ans=='0')
        {
           Ext.MessageBox.alert('Success', 'Please enter poll answers before activating'); 
        }
    else if(is_prize=='0')
        {
           Ext.MessageBox.alert('Success', 'Please enter poll prize before activating'); 
        }
    else
        {
 com.faralam.activatePoll = com.faralam.serverURL + 'contests/activatePoll';
    com.faralam.activatePoll = com.faralam.activatePoll + "?" + encodeURI('UID=' + sessionStorage.UID+'&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&contestUUID='+sessionStorage.contestUUID+'&activate=true');

    var onsuccess = function (data, textStatus, jqXHR) {
    com.faralam.common.retrievePollPortal_func();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.activatePoll, "PUT", {}, onsuccess, onerror);  
        }
}

com.faralam.common.terminatePoll = function(){
 com.faralam.terminatePoll = com.faralam.serverURL + 'contests/terminatePoll';
    com.faralam.terminatePoll = com.faralam.terminatePoll + "?" + encodeURI('UID=' + sessionStorage.UID+'&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&contestUUID='+sessionStorage.contestUUID);

    var onsuccess = function (data, textStatus, jqXHR) {
    com.faralam.common.retrievePollPortal_func();
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
    Ext.MessageBox.confirm('Confirm', 'Do you really want to terminate the poll?', function (e) {
                                    if (e == 'yes') {
            com.faralam.common.sendAjaxRequest(com.faralam.terminatePoll, "PUT", {}, onsuccess, onerror);  
                                                    }
                                                });
    
        }

com.faralam.common.awardPollPrize = function(e){
    //console.log("entryId="+entryId+",entryForUID="+entryForUID+",contestUUID="+contestUUID);
    com.faralam.awardPollPrize = com.faralam.serverURL + 'contests/awardPollPrize';
    com.faralam.awardPollPrize = com.faralam.awardPollPrize + "?" + encodeURI('UID=' + sessionStorage.UID);
    var data={     
    "serviceAccommodatorId":sessionStorage.SA,
    "serviceLocationId":sessionStorage.SL,
    "contestUUID": e.getAttribute('contestUUID'),
    "prizeId":e.getAttribute('prizeId'),
    "awardQuantity":e.getAttribute('quantity'),
    "entryId": e.getAttribute('entryId'),
    "entryForUID": e.getAttribute('entryForUID')
};

    data=JSON.stringify(data);
    console.log("poll"+data);
    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.getCmp('photo_contest_award_modal').close();
        com.faralam.common.retrievePollPortal_func();
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.awardPollPrize, "POST", data, onsuccess, onerror);

}

com.faralam.common.getConversationBetweenSASLUser_contest = function (usrnm){
    
    Ext.getCmp('Contest_Usrnm').setValue(usrnm);
    com.faralam.getConversationBetweenSASLUser_contest = com.faralam.serverURL + 'communication/getConversationBetweenSASLUser';
    com.faralam.getConversationBetweenSASLUser_contest = com.faralam.getConversationBetweenSASLUser_contest + "?" + encodeURI('userName=' + usrnm + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&count=10');

    var onsuccess = function (response, textStatus, jqXHR) {
        console.log(response);
        //com.faralam.common.getMessagesForUser();
        reply = '';

        for (i = 0; i < response.messages.length; i++) {
            if (response.messages[i].fromUser == false) {
                reply += '<ul>\n\
						<li><div class="chat_text_time">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name">' + response.messages[i].saslName + '</div></li>\n\
						<li><div class="text_chat_box"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            } else if (response.messages[i].fromUser == true){
                reply += '<ul class="list">\n\
						<li><div class="chat_text_time chat_align">' + response.messages[i].timeStamp + '</div></li> \n\
						<li><div class="chat_text_name chat_align">' + response.messages[i].userName + '</div></li>\n\
						<li><div class="text_chat_reply" style="padding:9px 12px; box-shadow: 2px 2px 4px #888;"><p>' + response.messages[i].messageBody + '</p></div></li>\n\
					</ul>';
            }
        }
        reply_final = '<div class="chat_container_contest" id="ContestMessages_chat_container" style="height:574px;"><div  class="chat_list">' + reply + '</div></div>';
        Ext.getCmp('ContestMessage_reply_panel').update(reply_final);
        $("#ContestMessages_chat_container").perfectScrollbar('destroy');
        $("#ContestMessages_chat_container").perfectScrollbar();
        $('#ContestMessages_chat_container').animate({
    scrollTop: $('#ContestMessages_chat_container ul:last-child').position().top + 'px'
        }, 1000);

}
    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.getConversationBetweenSASLUser_contest, "GET", {}, onsuccess, onerror);
    }

com.faralam.common.sendMessageToUser_contest = function (){
    com.faralam.sendMessageToUser_contest = com.faralam.serverURL + 'communication/sendMessageToUser';
    com.faralam.sendMessageToUser_contest = com.faralam.sendMessageToUser_contest + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
    var usrnm=Ext.getCmp('Contest_Usrnm').getValue();
    var data = {
        "messageBody": Ext.getCmp('ContestMessage_reply_tf').getValue(),
        "fromServiceLocationId": sessionStorage.SL,
        "urgent":"false",
        "userName":usrnm ,
        "communicationId": null,
        "fromServiceAccommodatorId": sessionStorage.SA,
        "inReplyToCommunicationId": null,
        "authorId": sessionStorage.UID  
    };
    data = JSON.stringify(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.getCmp('ContestMessage_reply_tf').setValue('');
        com.faralam.common.getConversationBetweenSASLUser_contest(usrnm);
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.sendMessageToUser_contest, "POST", data, onsuccess, onerror);
}

com.faralam.common.close_Contest_preview = function(){
    console.log('ok');
    Ext.getCmp('contest_preview_modal').close();
}

com.faralam.common.open_Contest_preview = function (url) {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var contest_preview_modal;

    if (Ext.getCmp('contest_preview_modal')) {
        var modal = Ext.getCmp('contest_preview_modal');
        modal.destroy(modal, new Object());
    }
    if (!contest_preview_modal) {
        var contest_preview_modal_form = Ext.widget('form', {
                                    xtype: 'container',
                                    layout: 'vbox',
                                    style: 'height:675px !important;width:380px !important',
                                    margin: '10 10 10 10',
                                    items: [
                                        {
                                            width: 328,
                                            id: 'close_btn_contest_preview',                                            
                                            margin: '0 0 0 16',
                                            html: '<img src="' + com.faralam.custom_img_path + 'cross_alert.png" height="25" width="25" style="float:right;cursor:pointer" onclick="com.faralam.common.close_Contest_preview()" >',
                                            style: 'z-index: 99;right:0px !important',
                                            handler: function () {
                                                
                                                        }
                                        },
                                        {
                                            xtype: 'component',
                                            width: 320,
                                            id: 'mobile_url_start_contest',                                            
                                            margin: '47 0 0 16',
                                            html: '<iframe src="' + url + '" frameborder="0" height="471px" width="320px" style="margin-top: -4px !important;margin-left:-1px !important"></iframe>',
                                            style: 'z-index: 99;'
                                        },
                                        {
                                            xtype: 'component',
                                            id: 'mobile_pic_componemt_contest',
                                            html: '<img id="mobile_pic_app" src="' + com.faralam.custom_img_path + 'mobile_pic.png" width="345">'
                                        }
                                    ]
                                
        });

        contest_preview_modal = Ext.widget('window', {
            id: 'contest_preview_modal',
            closeAction: 'destroy',
            layout: 'fit',
            resizable: false,
            modal: true,
            header: false,
            width: 380,
            style: 'background-color: transparent  !important;border:none !important top:0px !important',
            items: contest_preview_modal_form,
            listeners: {
                close: function () {
                    
                },
                show: function () {
                   
                }

            }
        });
    }
    contest_preview_modal.show();
}

com.faralam.drop_contest = function(ev){
    
    ev.preventDefault();
    var drag_data = ev.dataTransfer.getData('Text');
    if (ev.target.id == 'poll_winner_drop_zone') {
        if (drag_data == 'poll_drag_winner') {
            var entryId = ev.dataTransfer.getData('entryId');
            var entryForUID = ev.dataTransfer.getData('entryForUID');
            var contestUUID = ev.dataTransfer.getData('contestUUID');
            var userName = ev.dataTransfer.getData('userName');
            com.faralam.common.open_award_sec(entryId,entryForUID,userName);
            //com.faralam.common.awardPollPrize(entryId,entryForUID,contestUUID)
        }
    }
    
    if (ev.target.id == 'delete_zone_photo_entry') {
        if (drag_data == 'photo_drag_entry') {
            Ext.MessageBox.confirm('Confirm', 'Do you really want remove the entry?', function (e) {
                                    if (e == 'yes') {
            var entryId = ev.dataTransfer.getData('entryId');
            var entryForUID = ev.dataTransfer.getData('entryForUID');
            var contestUUID = ev.dataTransfer.getData('contestUUID');
            console.log(contestUUID);
            com.faralam.common.deletePhotoContestEntry(entryId,entryForUID,contestUUID);
                                                    }
                                                });
        }
    }
    if (ev.target.id == 'photo_entry_rearrange_drop_zone') {
        if (drag_data == 'photo_drag_entry') {
            ev.target.className = 'photo_re_normal'; 
        }
    }
     if (ev.target.id == 'photo_winners_dropzone') {
        if (drag_data == 'photo_drag_entry') {
            var entryId = ev.dataTransfer.getData('entryId');
            var entryForUID = ev.dataTransfer.getData('entryForUID');
            var contestUUID = ev.dataTransfer.getData('contestUUID');
            var imageURL = ev.dataTransfer.getData('imageURL');
            var userName = ev.dataTransfer.getData('userName');
            ev.target.className = 'photo_winners_dropzone_normal';
            $('#photo_winners_dropzone').remove();
            
            com.faralam.common.open_award_sec(entryId,entryForUID,userName);
        }
    }
    
}

com.faralam.dragStart_contest = function(ev){
    if (ev.target.id == 'poll_drag_winner') {
        ev.dataTransfer.setData('Text', 'poll_drag_winner');
        ev.dataTransfer.setData('entryId', ev.target.getAttribute('entryId'));
        ev.dataTransfer.setData('entryForUID', ev.target.getAttribute('entryForUID'));
        ev.dataTransfer.setData('contestUUID', ev.target.getAttribute('contestUUID'));
        ev.dataTransfer.setData('userName', ev.target.getAttribute('userName'));
    }
    if (ev.target.id == 'photo_drag_entry') { 
        //console.log(ev);
        var md='<div id="photo_winners_dropzone" class="photo_winners_dropzone_normal" ondrop="com.faralam.drop_contest(event)" ondragover="com.faralam.dragOver_contest(event)" ondragenter="com.faralam.dragEnter_contest(event)" ondragleave="com.faralam.dragLeave_contest(event)" >Drop entry to give award</div>';
        $('#photo_winners_dropzone').remove();
        $('#photoWinners').append(md);
        console.log("ok"+md);
        ev.dataTransfer.setData('Text', 'photo_drag_entry');
        ev.dataTransfer.setData('entryId', ev.target.getAttribute('entryId'));
        ev.dataTransfer.setData('entryForUID', ev.target.getAttribute('entryForUID'));
        ev.dataTransfer.setData('contestUUID', ev.target.getAttribute('contestUUID'));
        ev.dataTransfer.setData('imageURL', ev.target.getAttribute('imageURL'));
        ev.dataTransfer.setData('userName', ev.target.getAttribute('userName'));
    }
}

com.faralam.dragEnd_contest = function(ev){
    if(ev.target.id=='poll_drag_winner')
        {
            document.getElementById("poll_winner_drop_zone").className = 'poll_drop_zone_normal';
        }
    if(ev.target.id=='photo_winners_dropzone')
        {
          ev.target.className = 'photo_winners_dropzone_normal'; 
        }
}

com.faralam.dragOver_contest = function(ev){
    ev.preventDefault();
}

com.faralam.dragEnter_contest = function(ev){
    ev.preventDefault();
    //console.log("prevent+"+ev.target.id);
    if(ev.target.id=='poll_winner_drop_zone')
        {
            ev.target.className = 'poll_drop_zone_active';
        }
        if(ev.target.id=='photo_entry_rearrange_drop_zone')
        {
          ev.target.className = 'photo_re_active'; 
        }
    if(ev.target.id=='photo_winners_dropzone')
        {
          ev.target.className = 'photo_winners_dropzone_active'; 
        }
    
}

com.faralam.dragLeave_contest = function(ev){
    if(ev.target.id=='poll_winner_drop_zone')
        {
            document.getElementById("poll_winner_drop_zone").className = 'poll_drop_zone_normal';
        }
    if(ev.target.id=='photo_entry_rearrange_drop_zone')
        {
           ev.target.className = 'photo_re_normal'; 
        }
    if(ev.target.id=='photo_winners_dropzone')
        {
          ev.target.className = 'photo_winners_dropzone_normal'; 
        }
    
}

// ############################## Poll Contest Section End ###################################//



// ############################## Loyalty Program Section Start ###################################//

com.faralam.common.retrieveLoyaltyProgram = function () {

    com.faralam.retrieveLoyaltyProgram = com.faralam.serverURL + 'retail/retrieveLoyaltyProgram';
    com.faralam.retrieveLoyaltyProgram = com.faralam.retrieveLoyaltyProgram + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);
    var imageHTML = "";
    
    var onsuccess = function (response, textStatus, jqXHR) {
        //console.log(response); 
        //Ext.getCmp('loyal_date').setDisabled(true);
        if (response.hasLoyaltyProgram == false) {
            com.faralam.getSliderPicURLsHZ('loyal_imgs', '','');
            Ext.getCmp('current_loyalty_program').setValue('(No Loyalty Programs)');
            document.getElementById('current_loyalty_program_fieldset').style.backgroundColor = "#CCCCCC";
            document.getElementById('new_loyalty_program_fieldset').style.backgroundColor = "#FFFFFF";
            Ext.getCmp('current_loyalty_program_fieldset').setDisabled(true);
            Ext.getCmp('new_loyalty_program_fieldset').setDisabled(false);
            
            Ext.getCmp('loyal_name').setValue("");
            Ext.getCmp('loyal_awardmsg').setValue("");
            Ext.getCmp('loyal_count_award').setValue("");
            Ext.getCmp('loyal_selected_item_name').setValue("");
            Ext.getCmp('loyal_selected_item_price').setValue("");
            imageHTML = '';
            Ext.getCmp('loyal_selected_item_image').update(imageHTML);
        } else {
            com.faralam.getSliderPicURLsHZ('loyal_imgs', '',response.itemId);
            Ext.getCmp('current_loyalty_program').setValue(response.displayText);
            document.getElementById('new_loyalty_program_fieldset').style.backgroundColor = "#CCCCCC";
            document.getElementById('current_loyalty_program_fieldset').style.backgroundColor = "#FFFFFF";
            Ext.getCmp('new_loyalty_program_fieldset').setDisabled(true);
            Ext.getCmp('current_loyalty_program_fieldset').setDisabled(false);
            
            Ext.getCmp('loyal_name').setValue(response.displayText);
            Ext.getCmp('loyal_awardmsg').setValue(response.awardMessage);
            Ext.getCmp('loyal_count_award').setValue(response.count);
            imageHTML = '<img width="200" height="200" alt="image" src="' +response.url+ '">';
            Ext.getCmp('loyal_selected_item_image').update(imageHTML);
            
        }

        //Ext.getCmp('loyal_count_award').setValue(response.count);
        //Ext.getCmp('loyal_internal_code').setValue(response.customerCode);

    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrieveLoyaltyProgram, "GET", {}, onsuccess, onerror);
}

/*com.faralam.common.clicktocallSwitchCheckboxNew = function (e, field) {
    
    if(e !=''){
        Ext.getCmp(field).setValue($(e).is(':checked'));
        var radio = Ext.getCmp('loyal_count_award_radio').getValue();
        if(radio == "true"){
            Ext.getCmp('loyal_date').setDisabled(false);
        }
        else if(radio == "false"){
            Ext.getCmp('loyal_date').setDisabled(true);
        }
    }
}*/

com.faralam.common.createLoyaltyProgram = function () {

    com.faralam.createLoyaltyProgram = com.faralam.serverURL + 'retail/createLoyaltyProgram';
    com.faralam.createLoyaltyProgram = com.faralam.createLoyaltyProgram + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var exp_date = "";
    var internal_code = "";

    /*internal_code = Ext.getCmp('loyal_internal_code').getValue();*/
    /*if(Ext.getCmp('loyal_date').getValue().length != 0)
        exp_date = Ext.getCmp('loyal_date').getValue();*/

    var data = {
        "itemId": Ext.getCmp('loyal_itemId').getValue(),
        "itemVersion": Ext.getCmp('loyal_itemVersion').getValue(),
        "idPrice": Ext.getCmp('loyal_idPrice').getValue(),
        "minCount": Ext.getCmp('loyal_count_award').getValue(),
        "awardMessage": Ext.getCmp('loyal_awardmsg').getValue(),
        "displayText": Ext.getCmp('loyal_name').getValue(),
        "customerCode": internal_code,
        "expirationDate": exp_date,
        "activationDate": null
    };
    data = JSON.stringify(data);

    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Activated Successfully.', function(){
            com.faralam.common.retrieveLoyaltyProgram();
        });
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.createLoyaltyProgram, "POST", data, onsuccess, onerror);
}

com.faralam.common.deactivateLoyaltyProgram = function () {

    com.faralam.deactivateLoyaltyProgram = com.faralam.serverURL + 'retail/deactivateLoyaltyProgram';
    com.faralam.deactivateLoyaltyProgram = com.faralam.deactivateLoyaltyProgram + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);

    var onsuccess = function (data, textStatus, jqXHR) {
        Ext.MessageBox.alert('Success', 'Deactivated successfully', function(){
            com.faralam.common.retrieveLoyaltyProgram();
        });
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.deactivateLoyaltyProgram, "PUT", onsuccess, onerror);
}

com.faralam.getSliderPicURLsHZ = function (step, itemId, selectedItemId) {
    console.log(selectedItemId);
    com.faralam.retrieve_item_info2 = com.faralam.serverURL + 'retail/retrieveItems';
    com.faralam.retrieve_item_info2 = com.faralam.retrieve_item_info2 + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&status=ALL');

    var onsuccess = function (response, textStatus, jqXHR) {
        //console.log(response);
        var slider = '';
        var slider_head = '';
        var html = '';
        var slider_tail = '';
        var position = 0;
        if (response.items.length > 0) {            
            slider_head = '<div style="color:#000; margin:5px 0;"  class="layal_new_label"> Select an item ( These items are from Catalog /Menu screen)</div><div  id="layal_img_block"><ul class="loyal_items" id="loyal_items_ul">';
            for (var j = 0; j < response.items.length; j++) {
                if (response.items[j].itemId == itemId) {
                    position = j - 1;
                    //console.log(position);
                }
                var itemOrder = j + 1;
                
            // =================    CODE FOR GETTING THE SELECTED ITEM VALUE ===================================//
                if(response.items[j].itemId == selectedItemId)
                {
                    Ext.getCmp('loyal_selected_item_name').setValue(response.items[j].itemName);
                    Ext.getCmp('loyal_selected_item_price').setValue(response.items[j].price);
                }
            // =================  END OF CODE FOR GETTING THE SELECTED ITEM VALUE ==============================//

                
                html += '<li id="item-' + itemOrder + '" itemName="' + response.items[j].itemName + '" price="' + response.items[j].price + '" itemVersion="' + response.items[j].itemVersion + '" priceId="' + response.items[j].priceId + '" itemId="' + response.items[j].itemId + '" pimg="' + response.items[j].mediaURLs[0] + '" onclick="com.faralam.common.getThisItemData(this)"><img src="' + response.items[j].mediaURLs[0] + '" width="170"  /><div style="width:100%; background-color:#cccccc; padding: 2px;"><span class="item_name">' + response.items[j].itemName + '</span></div></li>';
            }
            slider_tail = '</ul></div>';
        }
        else
        {
            slider_head = '<div style="color:#000; margin:5px 0;"  class="layal_new_label"> Please create an item in Menu screen and create a Loyalty program</div>'
            html = ''
            slider_tail = '';
        }

        slider = slider_head + html + slider_tail;

        Ext.getCmp('pic_panel' + step).update(slider);
        $('#layal_img_block').perfectScrollbar('destroy');
        $('#layal_img_block').perfectScrollbar();
        //document.getElementById("overview_slider").style.top = '-127px';


    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrieve_item_info2, "GET", {}, onsuccess, onerror);
}

com.faralam.common.getThisItemData = function (e) {
        var html = "";
        Ext.getCmp('loyal_selected_item_name').setValue(e.getAttribute('itemName'));
        Ext.getCmp('loyal_selected_item_price').setValue(e.getAttribute('price'));
        Ext.getCmp('loyal_itemId').setValue(e.getAttribute('itemid'));
        Ext.getCmp('loyal_itemVersion').setValue(e.getAttribute('itemversion'));
        Ext.getCmp('loyal_idPrice').setValue(e.getAttribute('priceid'));

        html = '<img src="' + e.getAttribute('pimg') + '"  alt="image" height="200" width="200">';
        Ext.getCmp('loyal_selected_item_image').update(html);

        $('#loyal_items_ul li').css("border", "2px solid #000000");
        e.style = "border:2px solid #0000FF";
    }
    // ############################## Loyalty Program Section End ###################################//


// ============================ EVENT SERVICE SECTION STARTED ===================================//
com.faralam.common.retrieveEventSummary = function () {
com.faralam.retrieveEventSummary = com.faralam.serverURL + 'reservations/retrieveEventSummary';
com.faralam.retrieveEventSummary = com.faralam.retrieveEventSummary + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
var edit_img = com.faralam.custom_img_path + 'icon_pencil.png';
var edit_image_code = '&nbsp;';
var onsuccess = function (data, textStatus, jqXHR) {
    //console.log(data);
    if (data) {
            var html = '<table width="900" cellpadding="3" cellspacing="0" style="color:#000000;"><tr style="border: 1px solid #000000;"><td>&nbsp;</td><td><strong>Event Name</strong></td><td><strong>Date</strong></td><td><strong>Status</strong></td></tr><tr><td colspan="4"></td></tr>';
        var jsobj="";
        var latlong=null;
        if (data.events.length > 0) {
            for (var i = 0; i < data.events.length; i++) {
                var act_btn="";
				if(data.events[i].status=='ACTIVE' || data.events[i].status=='PROPOSED'){
					edit_image_code = '<img src="' + edit_img + '" title="Edit this event"  width="25" height="26" style="cursor : pointer" uuid="'+ data.events[i].uuid+'" eventType="'+data.events[i].type.enumText+'" status="' +data.events[i].status+ '" longDescription="'+data.events[i].longDescription+'" uuid="'+data.events[i].uuid+'" allDay='+data.events[i].allDay+' rating="'+data.events[i].rating+'" www="'+data.events[i].www+'" latlong='+data.events[i].latlong+' email="'+data.events[i].email+'" telephone="'+data.events[i].telephone+'" externalId="'+data.events[i].externalId+'" number="'+data.events[i].address.number+'" street="'+data.events[i].address.street+'" city="'+data.events[i].address.city+'" state="'+data.events[i].address.state+'" country="'+data.events[i].address.country+'" shareURL="'+data.events[i].shareURL+'" onclick="EditEvent(this)" />';
                if(data.events[i].status=='PROPOSED')
                    {
                        var act_btn='<input type="button" style="cursor: pointer; border: 1px solid rgb(204, 204, 204); background-color: rgb(128, 77, 166); color: rgb(255, 255, 255); display: inline-block; margin-bottom: 0px; float: right; margin-right: 10px; border-radius: 5px; font-weight: bold; letter-spacing: 1px; font-size: 11px; margin-left: -60px; padding: 6px 10px;" title="Activate this event" onclick="com.faralam.common.activateEvent('+data.events[i].id+',0)" value="Activate">';
                    }
				}
                html += '<tr><td text-align="center" nowrap>'+edit_image_code+act_btn+'</td><td style="border: 1px solid #000000;">' + data.events[i].displayText + '</td><td style="border: 1px solid #000000;">' + data.events[i].startShowing + '</td><td style="border: 1px solid #000000;">' + data.events[i].status +'</td></tr>';
                html += '<tr><td colspan="4">&nbsp;</td></tr>'
				edit_image_code = '&nbsp;';
            }
            html += '</table>';
        }
    }
    Ext.getCmp('eventComponent').update(html);
}

var onerror = function (jqXHR, textStatus, errorThrown) {}

com.faralam.common.sendAjaxRequest(com.faralam.retrieveEventSummary, "GET", {}, onsuccess, onerror);
}

com.faralam.common.customeDateFormatOnly = function(dt){
	var dtString = "";
	dt = dt.split("T");
	dt = dt[0];
	dt = new Date(dt);

	dtString = com.faralam.common.pad(dt.getFullYear(),2)+"-"+com.faralam.common.pad((parseInt(dt.getMonth())+1),2)+"-"+com.faralam.common.pad(dt.getDate(),2);

	return dtString;
}

com.faralam.common.customeTimeFormatOnly = function(dt){
	var dtString = "";
	var ampm = "";
	
	dt = dt.split("T");
	dt = dt[1];
	dt = dt.split(":");
	ampm = dt[0]>=12?"PM":"AM";
	dt = dt[0]+":"+dt[1]+":"+dt[2];
	
	dtString =dt+" "+ampm;
	return dtString;
}

com.faralam.common.getEventByUUID = function(e){
	var uuid =  e.getAttribute('uuid');
    var etype=  e.getAttribute('eventType');
    
	com.faralam.getEventByUUID = com.faralam.serverURL + 'reservations/getEventByUUID';
	com.faralam.getEventByUUID = com.faralam.getEventByUUID + "?" + encodeURI('UID=' + sessionStorage.UID + '&eventUUID=' + uuid);
	
	var onsuccess = function (data, textStatus, jqXHR) {

Ext.getCmp('editeventname').setRawValue(data.displayText);
		Ext.getCmp('editeventstdate').setRawValue(com.faralam.common.customeDateFormatOnly(data.activation));
		Ext.getCmp('editeventsttime').setRawValue(com.faralam.common.customeTimeFormatOnly(data.activation));
		Ext.getCmp('editeventendate').setRawValue(com.faralam.common.customeDateFormatOnly(data.expiration));
		Ext.getCmp('editevententime').setRawValue(com.faralam.common.customeTimeFormatOnly(data.expiration));
		Ext.getCmp('editeventoneliner').setRawValue(data.shortDescription);
		Ext.getCmp('editevent_image').setSrc(data.url);
		Ext.getCmp('hidden_event_id').setRawValue(data.id);
		//Ext.getCmp('editeventtype').setValue(etype);
        Ext.getCmp('longDescription').setRawValue(data.longDescription);
        Ext.getCmp('allDay').setRawValue(data.allDay);
        Ext.getCmp('uuid').setRawValue(data.uuid);
        Ext.getCmp('rating').setRawValue(data.rating);
        Ext.getCmp('www').setRawValue(data.www);
        Ext.getCmp('email').setRawValue(data.email);
        Ext.getCmp('telephone').setRawValue(data.telephone);
        Ext.getCmp('externalId').setRawValue(data.externalId);
        Ext.getCmp('number').setRawValue(data.address.number);
        Ext.getCmp('street').setRawValue(data.address.street);
        Ext.getCmp('city').setRawValue(data.address.city);
        Ext.getCmp('state').setRawValue(data.address.state);
        Ext.getCmp('country').setRawValue(data.address.country);
        Ext.getCmp('editeventtype').setValue(data.type.enumText);
        console.log("type1"+data.type.enumText);
        console.log("type2"+etype);
        //
		Ext.getCmp('editevent_image').setSrc(data.url);
        
		/*Ext.getCmp('editeventtype').src(data.shortDescription);*/
	}
	var onerror = function (jqXHR, textStatus, errorThrown) {}
	
	com.faralam.common.sendAjaxRequest(com.faralam.getEventByUUID, "GET", {}, onsuccess, onerror);

}

com.faralam.common.createSASLEventNewPictureNewMetaDataURL = function () {
    com.faralam.createSASLEventNewPictureNewMetaDataURL = com.faralam.serverURL + 'reservations/createSASLEventNewPictureNewMetaDataURL';
    com.faralam.createSASLEventNewPictureNewMetaDataURL = com.faralam.createSASLEventNewPictureNewMetaDataURL + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
    /*var data = {
            "displayText":Ext.getCmp('eventname').getValue(),
			"shortDescription":Ext.getCmp('eventoneliner').getValue(),
			"longDescription":Ext.getCmp('eventdesc').getValue(),	"activation":com.faralam.common.customDateFormat(Ext.getCmp('eventstdate').getValue(),Ext.getCmp('eventsttime').getValue()),
			"expiration":com.faralam.common.customDateFormat(Ext.getCmp('eventendate').getValue(),Ext.getCmp('evententime').getValue()),


"startShowing":com.faralam.common.customDateFormat(Ext.getCmp('eventstdate').getValue(),Ext.getCmp('eventsttime').getValue()),
"stopShowing" :com.faralam.common.customDateFormat(Ext.getCmp('eventendate').getValue(),Ext.getCmp('evententime').getValue()),


		"imageURLForPortalExpress":Ext.getCmp('event_image').src,

			"allDay":Ext.getCmp('allDay_Enable').getValue(),
			"rating":"G",
			"type":Ext.getCmp('eventtype').getValue(),
			"www":Ext.getCmp('eventurl').getValue(),
			"latlong":null,
			"email":Ext.getCmp('eventemail').getValue(),
			"telephone":Ext.getCmp('eventtelephone').getValue(),
			"externalId":Ext.getCmp('optadd_Enable').getValue(),
			"address":
			{
				"number":'',
				"street":Ext.getCmp('street').getValue(),
				"city":  Ext.getCmp('city').getValue(),
				"state": Ext.getCmp('state').getValue(),
				"country":Ext.getCmp('country').getValue()
			}
    }   //all property before disabled*/
    var data = {
            "displayText":Ext.getCmp('eventname').getValue(),
			"shortDescription":Ext.getCmp('eventoneliner').getValue(),
			"longDescription":'',	      "activation":com.faralam.common.customDateFormat(Ext.getCmp('eventstdate').getValue(),Ext.getCmp('eventsttime').getValue()),
			"expiration":com.faralam.common.customDateFormat(Ext.getCmp('eventendate').getValue(),Ext.getCmp('evententime').getValue()),


"startShowing":com.faralam.common.customDateFormat(Ext.getCmp('eventstdate').getValue(),Ext.getCmp('eventsttime').getValue()),
"stopShowing" :com.faralam.common.customDateFormat(Ext.getCmp('eventendate').getValue(),Ext.getCmp('evententime').getValue()),


		    "imageURLForPortalExpress":Ext.getCmp('event_image').src,

			"allDay":Ext.getCmp('allDay_Enable').getValue(),
			"rating":"G",
			"type":Ext.getCmp('eventtype').getValue(),
			"www":'',
			"latlong":null,
			"email":'',
			"telephone":'',
			"externalId":'',
			"address":
			{
				"number":'',
				"street":'',
				"city":  '',
				"state": '',
				"country":''
			}
    }
    data = JSON.stringify(data);
    var onsuccess = function (response, textStatus, jqXHR) {
		Ext.MessageBox.alert('Success', 'Event Created Successfully.',function(){
			Ext.getCmp('eventname').setRawValue('');
			Ext.getCmp('eventoneliner').setRawValue('');
			//Ext.getCmp('eventdesc').setRawValue('');
			Ext.getCmp('eventstdate').setRawValue('');
			Ext.getCmp('eventsttime').setRawValue('');
			Ext.getCmp('eventendate').setRawValue('');
			Ext.getCmp('evententime').setRawValue('');
			Ext.getCmp('event_image').setSrc('');
            Ext.getCmp('eventtype').setRawValue('');
            Ext.getCmp('allDay_Enable').setRawValue(false);
			//Ext.getCmp('eventurl').setRawValue('');
			//Ext.getCmp('eventemail').setRawValue('');
			//Ext.getCmp('eventtelephone').setRawValue('');
			//Ext.getCmp('street').setRawValue('');
			//Ext.getCmp('city').setRawValue('');
			//Ext.getCmp('state').setRawValue('');
			//Ext.getCmp('country').setRawValue('');
			
			Ext.getCmp('main_tab').down('#EventsService').setDisabled(false);
			Ext.getCmp('main_tab').down('#createNewEvent').setDisabled(true);
			Ext.getCmp('main_tab').setActiveTab(43);
		});
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.createSASLEventNewPictureNewMetaDataURL, "POST", data, onsuccess, onerror);
}

com.faralam.common.customDateFormat = function(dt,tm){
	var dtString = "";
	var offset = dt.getTimezoneOffset();
	offset = ((offset<0? '+':'-')+com.faralam.common.pad(parseInt(Math.abs(offset/60)), 2)+":"+com.faralam.common.pad(Math.abs(offset%60), 2));
	
	dtString = com.faralam.common.pad(dt.getFullYear(),2)+"-"+com.faralam.common.pad((parseInt(dt.getMonth())+1),2)+"-"+com.faralam.common.pad(dt.getDate(),2)+"T"+com.faralam.common.pad(tm.getHours(),2)+":"+com.faralam.common.pad(tm.getMinutes(),2)+":"+com.faralam.common.pad(tm.getSeconds(),2)+":UTC"+offset;
	return dtString;
}

com.faralam.common.pad = function(number, length){
    var str = "" + number
    while (str.length < length) {
        str = '0'+str
    }
    return str
}

com.faralam.common.deactivateEvent = function(){
	var eventID =  Ext.getCmp('hidden_event_id').getValue();
	
	com.faralam.deactivateEvent = com.faralam.serverURL + 'reservations/deactivateEvent';
    com.faralam.deactivateEvent = com.faralam.deactivateEvent + "?" + encodeURI('UID=' + sessionStorage.UID +'&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&eventId=' + eventID);
 
 	var onsuccess = function (data, textStatus, jqXHR) {
	Ext.MessageBox.alert('Success', 'Event Deactivated successfully', function(){
        Ext.getCmp('editEvents').close();
		com.faralam.common.retrieveEventSummary();
	});
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){
 	}
 
 	com.faralam.common.sendAjaxRequest(com.faralam.deactivateEvent, "PUT", {}, onsuccess, onerror);	
}

com.faralam.common.activateEvent = function(eventID,sts){
	//var eventID =  Ext.getCmp('hidden_event_id').getValue();
	
	com.faralam.activateEvent = com.faralam.serverURL + 'reservations/activateEvent';
    com.faralam.activateEvent = com.faralam.activateEvent + "?" + encodeURI('UID=' + sessionStorage.UID +'&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&eventId=' + eventID);
 
 	var onsuccess = function (data, textStatus, jqXHR) {
	Ext.MessageBox.alert('Success', 'Event Activated successfully', function(){
        if(parseInt(sts)==1)
           {
           Ext.getCmp('editEvents').close();
           }
		com.faralam.common.retrieveEventSummary();
	});
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){
 	}
 
 	com.faralam.common.sendAjaxRequest(com.faralam.activateEvent, "PUT", {}, onsuccess, onerror);	
}
com.faralam.common.updateEventMetaData=function(){
  var data={ 
"displayText":Ext.getCmp('editeventname').getValue(),
"shortDescription":Ext.getCmp('editeventoneliner').getValue(),
"longDescription":Ext.getCmp('longDescription').getValue(),
"activation":com.faralam.common.customDateFormat(Ext.getCmp('editeventstdate').getValue(),Ext.getCmp('editeventsttime').getValue()),
"expiration":com.faralam.common.customDateFormat(Ext.getCmp('editeventendate').getValue(),Ext.getCmp('editevententime').getValue()),
"uuid":Ext.getCmp('uuid').getValue(),

"startShowing":com.faralam.common.customDateFormat(Ext.getCmp('editeventstdate').getValue(),Ext.getCmp('editeventsttime').getValue()),
"stopShowing" :com.faralam.common.customDateFormat(Ext.getCmp('editeventendate').getValue(),Ext.getCmp('editevententime').getValue()),
"allDay":Ext.getCmp('allDay').getValue(),
"rating":Ext.getCmp('rating').getValue(),
"type":Ext.getCmp('editeventtype').getValue(),
"www":Ext.getCmp('www').getValue(),
"latlong":null,
"email":Ext.getCmp('email').getValue(),
"telephone":Ext.getCmp('telephone').getValue(),
"externalId":Ext.getCmp('externalId').getValue(),
"address":{"number":Ext.getCmp('number').getValue(),
"street":Ext.getCmp('street').getValue(),
"city": Ext.getCmp('city').getValue(),
"state": Ext.getCmp('state').getValue(),
"country":Ext.getCmp('country').getValue()
}
};                                                      
data = JSON.stringify(data); 
//data2= JSON.stringify(data);
com.faralam.updateEventMetaData=com.faralam.serverURL+"reservations/updateEventMetaData" + "?" + encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
     //console.log(com.faralam.common.updateEventMetaData);
    console.log("common"+data);
    var onsuccess = function (response, textStatus, jqXHR) {
        Ext.MessageBox.alert('success','Event successfully updated.');
        Ext.getCmp('editeventtype').setRawValue('');
        Ext.getCmp('editEvents').close();
        com.faralam.common.retrieveEventSummary();
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {
        //Ext.MessageBox.alert('success','Event not updated.');
    }
    com.faralam.common.sendAjaxRequest(com.faralam.updateEventMetaData, "PUT", data, onsuccess, onerror);
}
com.faralam.common.OpenShare = function (EventShareUrl,eventurl) {
    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var OpenShare_modal;

    if (Ext.getCmp('OpenShare_modal')) {
        var modal = Ext.getCmp('OpenShare_modal');
        modal.destroy(modal, new Object());
    }
    if (!OpenShare_modal) {
        var OpenShare_modal_form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
                    //style: 'border: 3px solid #000 !important;'
            },
            //cls: 'white_bg',
            style: 'background: #324F85 !important; width:850px !important;',
            border: false,
            bodyPadding: 10,
            fieldDefaults: {
                labelAlign: 'side',
                labelWidth: 1,
                labelStyle: 'font-weight:bold'
            },
            defaultType: 'textfield',
            items: [
                {
                    xtype: 'container',
                    style: 'width:850px !important;',
                    tdAttrs: {
                        style: {
                            'vertical-align': 'top'
                        }
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            style: 'width:850px !important;',
                            items: [
                                {
                                    xtype: 'container',
                                    margin: '0 0 0 0',
                                    layout: 'hbox',
                                    style: 'width:850px !important;',
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            value: '<h4 style="color: #fff;">Share URL</h4> ',
                                            width: 200,
                                            style: 'text-align: left;'
										},
                                        {
                                            xtype: 'component',
                                            width: 300,
                                            id: 'event_mobile_url',
                                            margin: '0 0 0 0',
                                            html: EventShareUrl,
                                            style: 'text-align:left;'
										},
                                        {
                                            xtype: 'button',
                                            text: '<span style="color:#fff;">Share</span>',
                                            scale: 'medium',
                                            margin: '0 0 0 105',
                                            width: 130,
                                            style: 'cursor:pointer;background:#006FC0 !important;border:0px solid #000 !important;box-shadow:none !important; ',
                                            handler: function () {
                                            var mobNo = Ext.getCmp('event_mobile_share_sms').getValue();
                                            if (mobNo && mobNo != '') {
                                            var mode = Ext.getCmp('event_shareEmailSMS_access_mode').getValue();
                                            if (mode === true) {
                                                        //com.faralam.shareAppBySMS(mobNo);
                                                        Ext.getCmp('event_mobile_share_sms').setValue('');
                                                    } else {
                                                        Ext.MessageBox.alert('Information', 'Please select the checkbox');
                                                    }
                                                } else {
                                                    Ext.MessageBox.alert('Information', 'Please enter a valid mobile no.');
                                                }
                                            }
										}
                                    ]
                                },
                                {
                                    xtype: 'component',
                                    //layout: 'hbox',
                                    height: 40,
                                    width: 845,
                                    margin: '10 0 10 0',
                                    html: '<table><tr><td style="width:180px;"><h4 style="color: #fff; width:135px;">Via Social Network</h4></td><td><a href="https://www.facebook.com/sharer.php?u=' + EventShareUrl + '" target="_blank"><img id="fb_btn_PollContest" src="' + com.faralam.custom_img_path + '/share_button.png" width="90" height="30" style="margin-left:30px;"></a></td><td><a href="https://twitter.com/share?url=' + EventShareUrl + '" target="_blank"><img id="tweet_btn_PollContest" src="' + com.faralam.custom_img_path + '/tweet-button_withoutbg.png" width="90" height="28" style="float: left; margin-left:20px;"></a></td></tr></table>'
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            hideTrigger: true,
                                            keyNavEnabled: false,
                                            mouseWheelEnabled: false,
                                            id: 'event_mobile_share_sms',
                                            fieldLabel: 'Send URL to Mobile',
                                            name: 'share_sms',
                                            allowBlank: false,
                                            emptyText: '',
                                            msgTarget: 'none',
                                            margin: '0 0 0 0',
                                            labelAlign: 'left',
                                            labelWidth: 200,
                                            inputWidth: 250,
                                            emptyText: 'Enter mobile number',
                                            labelSeparator: '  ',
                                            style: ' border-radius: 3px !important;padding: 5px !important;',
                                            minValue: 0,
                                            minLength: 10,
                                            maxLength: 14,
                                            maskRe: /[0-9.]/,
                                            enableKeyEvents: true,
                                            listeners: {
                                                'keydown': function (me, e, eOpts) {
                                                    
                                                }
                                            }
										},
                                        {
                                            xtype: 'button',
                                            text: '<span style="color:#fff;">Send Text Msg</span>',
                                            scale: 'medium',
                                            margin: '0 0 0 150',
                                            width: 130,
                                            style: 'cursor:pointer;background:#006FC0 !important;border:0px solid #000 !important;box-shadow:none !important; left:645px;',
                                            handler: function () {
                                var mobNo = Ext.getCmp('event_mobile_share_sms').getValue();
                                            if (mobNo && mobNo != '') {
                                var mode = Ext.getCmp('event_shareEmailSMS_access_mode').getValue();
                                            if (mode === true) {
                                                com.faralam.common.sendEventURLToMobileviaSMS(mobNo,eventurl);
                                Ext.getCmp('event_mobile_share_sms').setValue('');
                                                    } else {
                                Ext.MessageBox.alert('Information', 'Please select the checkbox');
                                                    }
                                                } else {
                                Ext.MessageBox.alert('Information', 'Please enter a valid mobile no.');
                                                }
                                            }
										}
									]
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            id: 'event_share_email',
                                            fieldLabel: 'Send URL to E-Mail',
                                            name: 'share_email',
                                            allowBlank: false,
                                            emptyText: '',
                                            msgTarget: 'none',
                                            margin: '0 0 0 0',
                                            labelAlign: 'left',
                                            labelWidth: 200,
                                            inputWidth: 250,
                                            emptyText: 'Enter email address',
                                            labelSeparator: '  ',
                                            vtype: 'email',
                                            vtypeText: 'Email format is not valid',
                                            style: ' border-radius: 3px !important;padding: 5px !important;',
                                            listeners: {
                                                'errorchange': function (e, error, eOpts) {
                                                    var errUI = Ext.getCmp('event_share_email_err');
                                                    errUI.setValue('');
                                                    if (error) {
                                                        if (e.getValue().length > 0) {
                                                            errUI.setValue('<span style="color:#CF4C35;">Enter valid email</span>');
                                                        } else {
                                                            errUI.setValue('<span style="color:#CF4C35;">' + error + '</span>');
                                                        }
                                                    }
                                                }
                                            }
										},
                                        {
                                            xtype: 'button',
                                            text: '<span style="color:#fff;">Send E-Mail</span>',
                                            scale: 'medium',
                                            margin: '0 0 0 150',
                                            width: 130,
                                            style: 'cursor:pointer;background:#006FC0 !important;border:0px solid #000 !important;box-shadow:none !important; left:645px;',
                                            handler: function () {
                        var emailAddress =Ext.getCmp('event_share_email').getValue();
                                                if (emailAddress && emailAddress != '') {
                        var mode = Ext.getCmp('event_shareEmailSMS_access_mode').getValue();
                                                    if (mode) {
                                                        com.faralam.common.sendEventURLToEmail(emailAddress,eventurl); 
                                                        Ext.getCmp('event_share_email').setValue('');
                                                    } else {
                                                        Ext.MessageBox.alert('Information', 'Please select the checkbox');
                                                    }
                                                } else {
                                                    Ext.MessageBox.alert('Information', 'Please enter a valid email address.');
                                                }
                                            }
										}
									]
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '0 0 0 0',
                                    width: 500,
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            name: 'share_email_err',
                                            id: 'event_share_email_err',
                                            fieldLabel: '&nbsp;',
                                            margin: '0 0 0 10',
                                            value: '',
                                            labelSeparator: ''
										}
									]
								},
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 0 0',
                                    width: 900,
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            fieldLabel: '<h4 style="color: #ffff00;margin-right: 10px; text-align:center !important">"I certify that the recipient has agreed to receive this Text/E-Mail message"</h4>',
                                            defaultType: 'checkboxfield',
                                            msgTarget: 'none',
                                            /* inputWidth: 280,
											inputHeight: 32,*/
                                            margin: '0 0 0 20',
                                            labelAlign: 'right',
                                            //labelWidth: 375,
                                            labelWidth: 550,
                                            inputWidth: 80,
                                            labelSeparator: '  ',
                                            items: [
                                                {
                                                    name: 'event_shareEmailSMS_access_mode',
                                                    //inputValue: '1',
                                                    id: 'event_shareEmailSMS_access_mode',
                                                    listeners: {
                                                        click: {
                                                            element: 'el',
                                                            fn: function () {
                                                                var mode = Ext.getCmp('event_shareEmailSMS_access_mode').getValue();
                                                                //console.log(mode);
                                                                
                                                                if (mode === true) {
                                                                    Ext.get('event_shareEmailSMS_access_mode-inputEl').removeCls("inactive_checkbox");
                                                                    Ext.get('event_shareEmailSMS_access_mode-inputEl').addCls("active_checkbox");
                                                                } else {
                                                                    Ext.get('event_shareEmailSMS_access_mode-inputEl').removeCls("active_checkbox");
                                                                    Ext.get('event_shareEmailSMS_access_mode-inputEl').addCls("inactive_checkbox");
                                                                }
                                                            }
                                                        }
                                                    }
												}
											]
										}
									]
								}
							]
                        }
                    ]
                }
            ]
        });

        OpenShare_modal = Ext.widget('window', {
            //title: '<div class="add_answer_text">Please enter your message</div>',
            id: 'OpenShare_modal',
            closeAction: 'hide',
            layout: 'fit',
            resizable: false,
            modal: true,
            width: 850,
            x:70,
            y:130,
            style: 'background: #324F85 !important; border: 3px solid #000 !important;',
            //cls: 'white_modal',
            //height:410,
            items: OpenShare_modal_form,
            listeners: {
                close: function () {
                    OpenShare_modal_form.getForm().reset(true);
                },
                show: function () {
                    //com.faralam.common.getMobileAppURLPollContest(sessionStorage.SA, sessionStorage.SL);
                }

            }
        });
    }
    OpenShare_modal.show();
}
com.faralam.common.sendEventURLToEmail = function (email,eventuuid) {
    com.faralam.sendEventURLToEmail = com.faralam.serverURL + 'html/sendEventURLToEmail';
    com.faralam.sendEventURLToEmail = com.faralam.sendEventURLToEmail + "?"+ encodeURI('UID=' + sessionStorage.UID + '&serviceAccommodatorId=' + sessionStorage.SA +'&toEmail=' + email + '&serviceLocationId=' + sessionStorage.SL+'&eventUUID='+eventuuid);

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            //console.log(data);
            if (data.success) {
                Ext.MessageBox.alert('Success', 'Send successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {
        //Ext.MessageBox.alert('Information', 'Sending Fail.'); 
    }

    com.faralam.common.sendAjaxRequest(com.faralam.sendEventURLToEmail, "GET", {}, onsuccess, onerror);

};
com.faralam.common.sendEventURLToMobileviaSMS = function (mobnum,eventuuid) {
    com.faralam.sendEventURLToMobileviaSMS = com.faralam.serverURL + 'html/sendEventURLToMobileviaSMS';
    com.faralam.sendEventURLToMobileviaSMS = com.faralam.sendEventURLToMobileviaSMS + "?"+  encodeURI('UID=' + sessionStorage.UID +'&toTelephoneNumber=' + mobnum + '&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL+'&eventUUID='+eventuuid);

    var onsuccess = function (data, textStatus, jqXHR) {
        if (data.success) {
            //console.log(data);
            if (data.success) {
                Ext.MessageBox.alert('Success', 'Send successfully.');
            }
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {
        //Ext.MessageBox.alert('Information', 'Sending Fail.'); 
    }

    com.faralam.common.sendAjaxRequest(com.faralam.sendEventURLToMobileviaSMS, "GET", {}, onsuccess, onerror);

};
    // ============================ EVENT SERVICE SECTION END  ======================================//


    // ============================ THEME SERVICE SECTION START  ======================================//
com.faralam.common.getThemeSelectorIframe = function(){
    var urlData = "";
    var html = "";
    
    //urlData = "http://sitelettes.com/themes?UID=" + sessionStorage.UID + "&serviceAccommodatorId=" + sessionStorage.SA + "&serviceLocationId=" + sessionStorage.SL+"&demo=true";
	if(com.faralam.serverURL == 'https://simfel.com/apptsvc/rest/' ){
		urlData = "https://sitelettes.com/common_themes.php?UID=" + sessionStorage.UID + "&serviceAccommodatorId=" + sessionStorage.SA + "&serviceLocationId=" + sessionStorage.SL+"&demo=true";
	}
	else{
		urlData = "https://sitelettes.com/common_themes.php?UID=" + sessionStorage.UID + "&serviceAccommodatorId=" + sessionStorage.SA + "&serviceLocationId=" + sessionStorage.SL;
	}
    
    html = '<iframe src="' + urlData + '" frameborder="0" height="600px" width="900px" style="overflow:scroll;"></iframe>';
            Ext.getCmp('themeSelectorIframeComponent').update(html);
    
}
    // ============================ THEME SERVICE SECTION END  ========================================//


    // ============================ VIDEO SERVICE SECTION START  ========================================//
com.faralam.common.retrieveExternalMedia = function () {
    com.faralam.retrieveExternalMedia = com.faralam.serverURL + 'media/retrieveExternalMedia';
    com.faralam.retrieveExternalMedia = com.faralam.retrieveExternalMedia + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);

    var onsuccess = function (response, textStatus, jqXHR) {
		Ext.getCmp('videoActiveContainer').update('');
		var activeStr = '<ul class="main_list">';
		var deactiveStr = '<ul class="main_list">';
		
        if (response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].status == 'ACTIVE') {
					activeStr += '<li class="video_list_wrap"><div class="video_list"><div class="video_frame"><iframe width="134"  height="100" src="'+response[i].src+'&showinfo=0" frameborder="0" allowfullscreen></iframe></div><div class="video_content_details"><div class="video_details_row">' +response[i].message+ '</div><div class="video_details_row">Added: ' +response[i].lastUpdated+ '</div><div class="video_details_row" style="border-bottom: 0px !important;"><span>Status: ' +response[i].status+ '</span><button type="button" class="deactivate_button" mediaId="' + response[i].idMedia+ '" onClick="com.faralam.common.deactivateExternalMedia(this)" style="cursor:pointer">Deactivate</button></div></div><div class="video_upload_download"><img id="video_drag_zone_active" src="'+com.faralam.custom_img_path+'pink_upload_download_btn.png" alt="button" class="upload_button before_dragging" mediaid="' + response[i].idMedia + '"  ondragend="com.faralam.dragEnd_video(event)" ondragstart="com.faralam.dragStart_video(event)" onclick="" /></div></div></li> <li class="catalog_li" style="height: 25px;padding: 0; margin-top:16px !important; list-style: none;"><div style="line-height: 20px; text-align: center; margin-left: 25px; font-weight: bold; padding-bottom: 4px; color: rgb(204, 204, 204); border: 2px dotted rgb(204, 204, 204);">Drop Here</div><img  id="groupList_video_drag_zone_middlebar_active'+i+'" class="before_dragging" ondrop="com.faralam.drop_video(event)" ondragover="com.faralam.allowDrop_catalog(event)" mediaid="' + response[i].idMedia + '" style="height: 35px; left: 0;position: absolute;top: 0;width: 770px;border:none; opacity:0.0; cursor:move;" src="' + com.faralam.custom_img_path + 'trans_img.jpg"></li>';
				}
				else{
					deactiveStr += '<li class="video_list_wrap"><div class="video_list"><div class="video_frame"><iframe width="134"  height="100" src="'+response[i].src+'&showinfo=0" frameborder="0" allowfullscreen></iframe></div><div class="video_content_details"><div class="video_details_row">' +response[i].message+ '</div><div class="video_details_row">Added: ' +response[i].lastUpdated+ '</div><div class="video_details_row" style="border-bottom: 0px !important;"><span>Status: ' +response[i].status+ '</span><button type="button" class="deactivate_button" mediaId="' + response[i].idMedia+ '" onClick="com.faralam.common.activateExternalMedia(this)" style="cursor:pointer">Activate</button></div></div><div class="video_upload_download"><img src="'+com.faralam.custom_img_path+'edit_btn.png" alt="button" class="upload_button" /></div></div></li>';
				}
			}
			activeStr +='</ul>';
			deactiveStr +='</ul>';
			
			Ext.getCmp('videoActiveContainer').update(activeStr);
			//Ext.getCmp('videoDeactiveContainer').update(deactiveStr);
			
			$('#videoActiveContainer').perfectScrollbar('destroy');
        	$('#videoActiveContainer').perfectScrollbar();
			
			//$('#videoDeactiveContainer').perfectScrollbar('destroy');
        	//$('#videoDeactiveContainer').perfectScrollbar();
		}
    }
    var onerror = function (jqXHR, textStatus, errorThrown) {}
    com.faralam.common.sendAjaxRequest(com.faralam.retrieveExternalMedia, "GET", {}, onsuccess, onerror);
}

 com.faralam.common.activateExternalMedia = function(e){
	var videoID =  e.getAttribute('mediaId');
	
	com.faralam.activateExternalMedia = com.faralam.serverURL + 'media/activateExternalMedia';
    com.faralam.activateExternalMedia = com.faralam.activateExternalMedia + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&id=' + videoID);
 
 	var onsuccess = function (data, textStatus, jqXHR) {
	Ext.MessageBox.alert('Success', 'Video Activated successfully', function(){
		com.faralam.common.retrieveExternalMedia();
	});
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){
 	}
 
 	com.faralam.common.sendAjaxRequest(com.faralam.activateExternalMedia, "PUT", {}, onsuccess, onerror);
 }
 
 com.faralam.common.deactivateExternalMedia = function(e){
	var videoID =  e.getAttribute('mediaId');
	
	com.faralam.deactivateExternalMedia = com.faralam.serverURL + 'media/deactivateExternalMedia';
    com.faralam.deactivateExternalMedia = com.faralam.deactivateExternalMedia + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&id=' + videoID);
 
 	var onsuccess = function (data, textStatus, jqXHR) {
	Ext.MessageBox.alert('Success', 'Video Deactivated successfully', function(){
		com.faralam.common.retrieveExternalMedia();
	});
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){
 	}
 
 	com.faralam.common.sendAjaxRequest(com.faralam.deactivateExternalMedia, "PUT", {}, onsuccess, onerror);
 }
 
 
 /*add new video*/
    com.faralam.common.createExternalMedia = function(){
    var videoname = Ext.getCmp('videoname').getValue();
    var videourl=Ext.getCmp('videourl').getValue();
    var data={
         "title":videoname,
         "mediaWidth":320,
         "mediaHeight":240,
         "message":videoname,
         "auxData1":videourl,
         "auxData2":null
        
 };
data = JSON.stringify(data);
        console.log(data);
	com.faralam.createExternalMedia = com.faralam.serverURL + 'media/createExternalMedia';
    com.faralam.createExternalMedia = com.faralam.createExternalMedia + "?" + encodeURI('UID='+sessionStorage.UID+'&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL);
 
 	var onsuccess = function (data, textStatus, jqXHR) {
	Ext.MessageBox.alert('Success', 'Video Added Successfully', function(){
		Ext.getCmp('videoname').setRawValue('');
		Ext.getCmp('videourl').setRawValue('');

		Ext.getCmp('main_tab').down('#videos').setDisabled(false);
		Ext.getCmp('main_tab').down('#AddNewVideo').setDisabled(true);                                   						Ext.getCmp('main_tab').setActiveTab(45);
	});
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){
 	}
 	com.faralam.common.sendAjaxRequest(com.faralam.createExternalMedia, "POST", data, onsuccess, onerror);
 }
	
	com.faralam.common.drop_video = function (ev) {

    ev.preventDefault();
    var drag_data = ev.dataTransfer.getData('Text');
	var mediaId = ev.dataTransfer.getData('mediaid');
    console.log(mediaId);
}
	
	com.faralam.dragEnd_video = function (ev) {
        ev.target.className = 'before_dragging';
    }
	
	com.faralam.dragStart_video = function (ev) {
    	if (ev.target.id == 'video_drag_zone_active') {
			ev.dataTransfer.setData('Text', ev.target.id);
			ev.dataTransfer.setData('mediaid', ev.target.getAttribute('mediaid'));
			ev.target.className = 'after_dragging';
			com.faralam.fire_count = 0;
    	}
	}
	
	com.faralam.drop_video = function (ev) {
    ev.preventDefault();
	var drop_data_id = ev.currentTarget.id;
	var drop_mediaId = ev.currentTarget.getAttribute('mediaid');
    var drag_data = ev.dataTransfer.getData('Text');
		
	if (drag_data == 'video_drag_zone_active') {
		var drag_mediaId = ev.dataTransfer.getData('mediaid');
	}
	com.faralam.common.positionExternalMediaIdAfterId(drop_mediaId, drag_mediaId);
}
	
	
	com.faralam.common.positionExternalMediaIdAfterId = function(drop, drag){
		com.faralam.positionExternalMediaIdAfterId = com.faralam.serverURL + 'media/positionExternalMediaIdAfterId';
    	com.faralam.positionExternalMediaIdAfterId = com.faralam.positionExternalMediaIdAfterId + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&id=' + drag + '&insertAfterId=' + drop);

    var onsuccess = function (response, textStatus, jqXHR) {
        		Ext.MessageBox.alert('Success', 'Sort Successfully.',function(){		com.faralam.common.retrieveExternalMedia();
			});
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.positionExternalMediaIdAfterId, "PUT", {}, onsuccess, onerror);
	}
 
	// ============================ VIDEO SERVICE SECTION END  ==========================================//
    com.faralam.common.retrieveLoyaltyProgram = function(){
    com.faralam.retrieveLoyaltyProgram= com.faralam.serverURL + 'retail/retrieveLoyaltyProgram';
    com.faralam.retrieveLoyaltyProgram= com.faralam.retrieveLoyaltyProgram+ "?" +'UID='+sessionStorage.UID +'&serviceAccommodatorId=' + sessionStorage.SA  + '&serviceLocationId=' + sessionStorage.SL;
     var onsuccess = function (data, textStatus, jqXHR) {
	if(data.hasLoyaltyProgram)
        {
            Ext.getCmp('loyality_lebel').update('<div class="call_heading_area" style="font-weight:400"><center>'+data.displayText+'</center></div>');
             
        }
         else
             {
                Ext.getCmp('loyality_lebel').update('<div class="call_heading_area" style="font-weight:400"><center></center></div>'); 
             }
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){
 	}
 	com.faralam.common.sendAjaxRequest(com.faralam.retrieveLoyaltyProgram, "GET", {}, onsuccess, onerror); 
    }
    
	com.faralam.common.sendQR = function(htmlEntities){
        Ext.getCmp('qr_out_decode').update('');
        var html='<div class="qrcode_code_status" id="result_ext" style="">'+htmlEntities+'</div>';
        Ext.getCmp('qr_out_decode').update(html);
    }
    
    com.faralam.common.registerUserLoyaltyCheckinQRCode = function(code){
        
        console.log(code+"called");
        var dl=Ext.getCmp('qrcode_override').getValue();
        
        var ajxurl=com.faralam.serverURL + 'retail/registerUserLoyaltyCheckinQRCode?'+encodeURI('qrcode='+code+'&UID='+sessionStorage.UID +'&serviceAccommodatorId=' + sessionStorage.SA  + '&serviceLocationId=' + sessionStorage.SL+"&ignoreLastScanTime="+dl);
        console.log(ajxurl);
     var onsuccess = function (data, textStatus, jqXHR) {
       Ext.MessageBox.alert('Success', 'Success'); 
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){}
    var html='<div class="qrcode_code_status" id="result_ext" style="">- scanning -</div>';
    Ext.getCmp('qr_out_decode').update(html);
 	com.faralam.common.sendAjaxRequest(ajxurl, "PUT", {}, onsuccess, onerror); 
        
    }
    
    com.faralam.common.registerUserLoyaltyCheckinUsername = function(username){
        var dl=Ext.getCmp('qrcode_override_manual').getValue();
        var ajxurl=com.faralam.serverURL + 'retail/registerUserLoyaltyCheckinUsername?'+encodeURI('username='+username+'&UID='+sessionStorage.UID +'&serviceAccommodatorId=' + sessionStorage.SA  + '&serviceLocationId=' + sessionStorage.SL+'&ignoreLastScanTime='+dl);
        console.log(ajxurl);
     var onsuccess = function (data, textStatus, jqXHR) { 
         Ext.MessageBox.alert('Success', 'Successfully sent.',function(){	
             Ext.getCmp('username_email').setValue('');
			});
     
     }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){}
 	com.faralam.common.sendAjaxRequest(ajxurl, "PUT", {}, onsuccess, onerror); 
        
    }
    
    /*com.faralam.common.registerUserLoyaltyCheckinUsername = function(){
    com.faralam.registerUserLoyaltyCheckinUsername= com.faralam.serverURL + 'retail/registerUserLoyaltyCheckinUsername';
    com.faralam.registerUserLoyaltyCheckinUsername= com.faralam.registerUserLoyaltyCheckinUsername+ "?" +'username='+ +'&serviceAccommodatorId=' + sessionStorage.SA  + '&serviceLocationId=' + sessionStorage.SL+'&ignoreLastScanTime'+;
     var onsuccess = function (data , textStatus, jqXHR) { }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){	}
 	com.faralam.common.sendAjaxRequest(com.faralam.registerUserLoyaltyCheckinUsername , "PUT", {}, onsuccess, onerror); 
    
    }*/
    /*com.faralam.common.getQRcodeURL = function (URL) {
	 Ext.Ajax.request({
            url: URL,
            method: 'GET',
            success: function (data, textStatus, jqXHR) {
				console.log(data.responseText);
				Ext.getCmp('mainQrcodeViewer').update('<div class="qrcode_code_section" style=""><iframe>'+data.responseText+'</iframe></div>');
            }
        });
		Ext.getCmp('mainQrcodeViewer').update('');
		var html = '<div class="qrcode_code_section" style=""><iframe src="'+URL+'" style="height:100%;width:100%; border:2px solid black"></iframe></div>';
		Ext.getCmp('mainQrcodeViewer').update(html);
}*/
    com.faralam.common.getLoyaltyReport = function(){
    com.faralam.getLoyaltyReport= com.faralam.serverURL + 'retail/getLoyaltyReport';
    com.faralam.getLoyaltyReport= com.faralam.getLoyaltyReport+ "?" +'UID='+sessionStorage.UID +'&serviceAccommodatorId=' + sessionStorage.SA  + '&serviceLocationId=' + sessionStorage.SL;
     var onsuccess = function (data, textStatus, jqXHR) {
         var html='<table border="1" id="loyality_summery_table"><tr><th>Username</th><th>Last Seen</th><th>Status</th></tr>';
	if(data.ongoing.length>0){
            
            for(var i=0;i<data.ongoing.length;i++)
                {
                html+='<tr usrnm="'+data.ongoing[i].username+'" tp="SUMM" onclick="com.faralam.common.select_row(this)"><td>'+data.ongoing[i].username+'</td><td>'+data.ongoing[i].lastCheckin+'</td><td>'+data.ongoing[i].details+'</td></tr>';
                }
            html+="</table>";
        Ext.getCmp('summery_table').update(html);
        $('loyality_summery_table').perfectScrollbar('destroy');
        $('loyality_summery_table').perfectScrollbar();
        }
    else{
            html+="</table>";
        Ext.getCmp('summery_table').update(html);
        $('loyality_summery_table').perfectScrollbar('destroy');
        $('loyality_summery_table').perfectScrollbar();
        }
         var html2='<table border="1" id="loyality_award_table">';
    if(data.collected.length>0){
            
            for(var j=0;j<data.collected.length;j++)
                {
                    html2+='<tr usrnm="'+data.collected[j].username+'" tp="AWARD" onclick="com.faralam.common.select_row(this)"><td>'+data.collected[j].username+'</td><td>'+data.collected[j].lastCheckin+'</td><td>'+data.collected[j].details+'</td></tr>';
                }
            html2+="</table>";
        Ext.getCmp('award_table').update(html2);
        $('loyality_award_table').perfectScrollbar('destroy');
        $('loyality_award_table').perfectScrollbar();
        }
    else{
            html2+="</table>";
        console.log(html2);
        Ext.getCmp('award_table').update(html2);
        $('loyality_award_table').perfectScrollbar('destroy');
        $('loyality_award_table').perfectScrollbar();
        }
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){
 	}
 	com.faralam.common.sendAjaxRequest(com.faralam.getLoyaltyReport, "GET", {}, onsuccess, onerror); 
    
     }
    
    com.faralam.common.select_row = function(e){
        var tp=$(e).attr('tp');
        var usrnm=$(e).attr('usrnm');
        console.log(usrnm);
        if(tp=="SUMM")
            {
                $("#loyality_summery_table tr").css({"background":"#fff"});
                $(e).css({"background":"#aaa"});
                Ext.getCmp('user_name_summ').setValue(usrnm);
            }
        if(tp=="AWARD"){
            $("#loyality_award_table tr").css({"background":"#fff"});
                $(e).css({"background":"#aaa"});
                Ext.getCmp('user_name_award').setValue(usrnm);
        }
        
    }
    
    
    
    
    
 com.faralam.common.setGroupItemType = function(e){
    com.faralam.setGroupItemType = com.faralam.serverURL + 'retail/setGroupItemType';
    com.faralam.setGroupItemType = com.faralam.setGroupItemType + "?" + encodeURI('UID=' + sessionStorage.UID);

	var itemId = e.getAttribute('itemId');
    var itemVersion = e.getAttribute('itemVersion');
    var priceId = e.getAttribute('priceId');
    var groupId = e.getAttribute('groupId');
	 
    var data = {
		"serviceAccommodatorId": sessionStorage.SA,
		"serviceLocationId": sessionStorage.SL,
		"item": {
			"itemId": itemId,
			"itemVersion": itemVersion,
			"priceId": priceId
		},
		"groupId": groupId,
		"itemGroupType": "HIGHLIGHTED"
	}

    data = JSON.stringify(data);
    var onsuccess = function (response, textStatus, jqXHR) {
        		Ext.MessageBox.alert('Success', 'Successfully Item Highlighted.',function(){	com.faralam.common.retrieveGroup_func(groupId);
			});
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.setGroupItemType, "PUT", data, onsuccess, onerror);
}
 //==========================================Preview App ===========================
 com.faralam.common.getMobileAppURLStartScreen_App = function (sa, sl) {
    
        var slider = '';
        var slider_head = '';
        var html = '';
        var slider_tail = '';
        var position = 0;
        var social='';
       
        var bullets='<center><ul class="bullets"><li><a data-slide="0" class="bullet active" href="#">&bull;</a></li><li><a data-slide="1" class="bullet" href="#">&bull;</a></li><li><a data-slide="2" class="bullet" href="#">&bull;</a></li><li><a data-slide="3" class="bullet" href="#">&bull;</a></li><li><a data-slide="4" class="bullet" href="#">&bull;</a></li><li><a data-slide="5" class="bullet" href="#">&bull;</a></li> </ul></center>'; 
            slider_head = '<div id="sliderPreview"><div class="viewport"><ul class="overview" id="overview_slider">';
            for (var j = 1; j < 7;j++) {
                var itemOrder = j + 1;
                html += '<li><img src="'+com.faralam.custom_img_path+'carousel/carousel_'+j+'.jpg" width="283" height="500" /></li>';
            }
                slider_tail = '</ul>'+bullets+'</div></div>';
                slider = slider_head + html + slider_tail;
                Ext.getCmp('carousel_main').update(slider);
                    $("#sliderPreview").tinycarousel({
                        axis: "x",
						interval: true,
                        bullets:true
                    }); 
     
    com.faralam.get_mobile_app_url_start1 = com.faralam.serverURL + 'sasl/getMobileAppURL';
    com.faralam.get_mobile_app_url_start1 = com.faralam.get_mobile_app_url_start1 + "?" + encodeURI('serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL + '&UID=' + sessionStorage.UID);
var splitString = "";
	var addURL = "";
    var onsuccess = function (data, textStatus, jqXHR) {
        var splitString = data.mobileURL.split("?");
        if(splitString.length>1){
			addURL = "&desktopiframe=true";
		}
		else{
			addURL = "?desktopiframe=true";
		}
        Ext.getCmp('mobile_url_start_App').update('');
        //Ext.getCmp('mobile_url_end_App').update('');
        if (data) {
            urlhtml = '<center><div style="  background: #CCCCCC; height: 25px; display: table-cell;vertical-align: middle;text-align: center;"><p style="color:#000;font-family: arial !important;font-size: 12px;">' + data.mobileURL + '</p></div></center>';
            html = '<iframe src="' + data.mobileURL + addURL + '" frameborder="0" height="472px" width="320px" style="margin-top: 22px;"></iframe>';
            var social='<table><tr><td style="width:180px;"><h4 style="color: #fff; width:160px;margin-bottom: 10px;">Share Via Social Network</h4></td></tr><tr><td><a href="https://www.facebook.com/sharer.php?u=' + data.mobileURL + '" target="_blank"><img id="fb_btn_PollContest" src="' + com.faralam.custom_img_path + '/share_button.png" width="90" height="30" style="border: 1px solid white;border-radius: 5px;"></a></td><td><a href="https://twitter.com/share?url=' + data.mobileURL + '" target="_blank"><img id="tweet_btn_PollContest" src="' + com.faralam.custom_img_path + '/tweet-button_withoutbg.png" width="90" height="28" style="float: left; margin-left:-60px;border: 1px solid white;border-radius: 5px;"></a></td></tr></table>';
            Ext.getCmp('mobile_url_start_App').update(html);
            Ext.getCmp('share_base_path_url').update(urlhtml);
            Ext.getCmp('share_app_social_icon_grp').update(social);
            
        }
    }

    var onerror = function (jqXHR, textStatus, errorThrown) {}

    com.faralam.common.sendAjaxRequest(com.faralam.get_mobile_app_url_start1, "GET", {}, onsuccess, onerror);
}
 com.faralam.common.sendAppURLForSASLToEmail=function (email){
	com.faralam.sendAppURLForSASLToEmail= com.faralam.serverURL + 'html/sendAppURLForSASLToEmail';
    com.faralam.sendAppURLForSASLToEmail = com.faralam.sendAppURLForSASLToEmail + "?" +'UID='+sessionStorage.UID +'&toEmail='+email +'&serviceAccommodatorId=' + sessionStorage.SA + '&serviceLocationId=' + sessionStorage.SL;
  console.log(com.faralam.sendAppURLForSASLToEmail);
 	var onsuccess = function (data, textStatus, jqXHR) {
	Ext.MessageBox.alert('Success', 'Email Send Successfully', function(){
		Ext.getCmp('email_preview').setRawValue('');
		
	});
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){
    Ext.MessageBox.alert('Information', 'Email Send Fail'); 
 	}
 	com.faralam.common.sendAjaxRequest(com.faralam.sendAppURLForSASLToEmail, "GET", {}, onsuccess, onerror);
 }
 com.faralam.common.sendAppURLForSASLToMobileviaSMS=function (mobile){
    com.faralam.sendAppURLForSASLToMobileviaSMS= com.faralam.serverURL + 'html/sendAppURLForSASLToMobileviaSMS';
    com.faralam.sendAppURLForSASLToMobileviaSMS= com.faralam.sendAppURLForSASLToMobileviaSMS+ "?" +'UID='+sessionStorage.UID +'&toTelephoneNumber='+mobile +'&serviceAccommodatorId=' + sessionStorage.SA  + '&serviceLocationId=' + sessionStorage.SL;
  console.log(com.faralam.sendAppURLForSASLToMobileviaSMS);
     var onsuccess = function (data, textStatus, jqXHR) {
	Ext.MessageBox.alert('Success', 'Message Send Successfully', function(){
		Ext.getCmp('mobile_preview').setRawValue('');
	});
    }
 
 	var onerror =function(jqXHR, textStatus, errorThrown){
    Ext.MessageBox.alert('Information', 'Message Send Fail'); 
 	}
 	com.faralam.common.sendAjaxRequest(com.faralam.sendAppURLForSASLToMobileviaSMS, "GET", {}, onsuccess, onerror);
 }
 //==========================================Preview App ===========================
 com.faralam.common.gotoTab = function(tabName, tabId){
	tabName = "#"+tabName;
	Ext.getCmp('main_tab').down(tabName).setDisabled(false);
	Ext.getCmp('main_tab').down('#start_screen').setDisabled(true);
	Ext.getCmp('main_tab').setActiveTab(tabId);
 }