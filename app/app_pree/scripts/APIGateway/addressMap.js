/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            getPreeQuestions: ['GET', '/pree/retrieveFeed'],
            getPreeCategories: ['GET', '/pree/retrieveCategories'],
            getPreeTags: ['GET', '/pree/retrieveHashTags'],
            createQuestion: ['POST', '/pree/createPoll'],
            answerQuestion: ['POST', '/pree/answerQuestion'],
            likeDislikePoll: ['POST', '/pree/likeDislikePoll'],

            login: ['POST', '/authentication/login'],
            logout: ['GET', '/authentication/logout'],
            //registerNewMember: ['POST', '/pree/registerNewMember'],
            registerNewMember: ['POST', '/authentication/registerNewMemberViaPostBody'],
            getAuthenticationStatus: ['GET', '/authentication/getAuthenticationStatus'],
            registerNewMemberWithInvitationCode: ['POST', '/authentication/registerNewMemberWithInvitationCode'],
            createAnonymousUser: ['POST', '/authentication/registerAnonymousAdhocMember'],

            sendContactInfo: ['POST','/pree/sendContactUsEmail'],

            sendPromoURLToEmail: ['GET', '/pree/sendPollContestURLToEmail'],
            sendPromoURLToMobileviaSMS: ['GET', '/pree/sendPollContestURLToMobileviaSMS']

        };
    }
};
