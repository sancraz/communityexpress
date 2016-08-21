/* global define */
'use strict';

module.exports = {
    getAddressMap: function(){
        return {
            getPreeQuestions: ['GET', '/pree/retrieveFeed'],
            getPreeQuestionByUUID:['GET','/pree/retrieveQuestion'],
            getPreeCategories: ['GET', '/pree/retrieveCategories'],
            getPreeTags: ['GET', '/pree/retrieveHashTags'],
            createQuestion: ['POST', '/pree/createPoll'],
            answerQuestion: ['POST', '/pree/answerQuestion'],
            likeDislikePoll: ['POST', '/pree/likeDislikePoll'],

            retrieveCommentsOnPreeQuestion: ['GET', '/communication/retrieveCommentsOnPostFromSASL'],
            sendMessageToSASL: ['POST', '/pree/commentOnPostFromSASL'],
            deleteCommentOnPostFromSASL: ['DELETE' , '/communication/deleteCommentOnPostFromSASL'],

            login: ['POST', '/authentication/login'],
            logout: ['GET', '/authentication/logout'],

            registerNewMember: ['POST', '/pree/registerNewMemberViaPostBody'],
            getAuthenticationStatus: ['GET', '/authentication/getAuthenticationStatus'],
            registerNewMemberWithInvitationCode: ['POST', '/authentication/registerNewMemberWithInvitationCode'],
            createAnonymousUser: ['POST', '/authentication/registerAnonymousAdhocMember'],

            sendContactInfo: ['POST','/pree/sendContactUsEmail'],

            sendPromoURLToEmail: ['GET', '/pree/sendPollContestURLToEmail'],
            sendPromoURLToMobileviaSMS: ['GET', '/pree/sendPollContestURLToMobileviaSMS'],

            createWNewPictureNewMetaData: ['POST', '/usersasl/createWNewPictureNewMetaData']

        };
    }
};
