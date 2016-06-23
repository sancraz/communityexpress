/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            getPreeQuestions: ['GET', '/pree/retrieveFeed'],
            getPreeCategories: ['GET', '/pree/retrieveCategories'],
            getPreeTags: ['GET', '/pree/retrieveHashTags'],


            login: ['POST', '/authentication/login'],
            logout: ['GET', '/authentication/logout'],
            registerNewMember: ['POST', '/authentication/registerNewMember'],
            getAuthenticationStatus: ['GET', '/authentication/getAuthenticationStatus'],
            registerNewMemberWithInvitationCode: ['POST', '/authentication/registerNewMemberWithInvitationCode'],
            createAnonymousUser: ['POST', '/authentication/registerAnonymousAdhocMember'],

        };
    }
};
