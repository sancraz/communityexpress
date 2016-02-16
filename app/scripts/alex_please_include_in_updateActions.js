/**
 * 
 */

$(document).ready(
  function() {
   $('.embedded_video').on(
     'click',
     function(event) {
      var src = event.target.attr('srcmedia');
      $(this).html(
        '<iframe width=\"320\" height=\"240\" src=\"' + src + '\" frameborder=\"0\" allowfullscreen></iframe>').css(
        'background', 'none');
     });
   /*
    * change the radio buttons in the poll
    */
   $('.embedded_poll input').radiobutton();

   /*
    * attach click handler to submit
    */

   $('.poll_submit_button').click(function(event) {
    var uuid = $(event.target).attr('uuid');
    var choice = $('#' + uuid + " input[type='radio']:checked").val();
    if (typeof choice !== 'undefined') {
     $('#' + uuid + ' input[type=radio]').attr('disabled', true);
     $('#' + uuid + ' a').fadeTo('slow', .3).removeAttr('href');
     $('#' + uuid + ' a').off();
     var url = window.community.protocol + window.community.server + '/apptsvc/rest/contests/enterPollAnonymous';
     console.log(' url:' + url);
     var data = {
      'choiceId' : choice,
      'serviceAccommodatorId' : window.community.serviceAccommodatorId,
      'serviceLocationId' : window.community.serviceLocationId,
      'contestUUID' : uuid
     };
     $(event.target).fadeOut('slow');
     $('#pollresultsplot' + uuid).fadeIn('slow');
     $(document).ready(function() {
      console.log('starting');
      var request = $.ajax({
       headers : {
        Accept : 'application/json;charset=utf-8'
       },
       type : 'POST',
       url : url,
       contentType : 'application/json;charset=utf-8',
       data : JSON.stringify(data)
      }).done(function(response) {
       console.log('done:');
       var dataArray = response.dataArray, options = response.options;
       options.seriesDefaults.renderer = eval(options.seriesDefaults.renderer);
       options.axes.yaxis.renderer = eval(options.axes.yaxis.renderer);
       options.axes.yaxis.rendererOptions.tickRenderer = eval(options.axes.yaxis.rendererOptions.tickRenderer);
       $.jqplot('pollresultsplot' + uuid, dataArray, options);
      }).fail(function(e, o) {
       console.log('Request failed: ' + o);
       if ('undefined' != typeof e.responseJSON && 'undefined' != typeof e.responseJSON.error)
        console.log(' Error:' + e.responseJSON.error.message);
      }).always(function() {
       console.log(' All done');
      });
     });
    }
   }).attr('onclick', '').css('cursor', 'pointer');
  });

/*
 * 
 */
//
//$(document).ready(function() {
// $('.embedded_poll input').radiobutton();
//
// $('poll_submit_button').click(function(event) {
//
//  var choice = $("#poll.getContestUUID() input[type='radio']:checked").val();
//  if (typeof choice !== 'undefined') {
//   //
//   $('#poll.getContestUUID() input[type=radio]').attr('disabled', true);
//   $('#poll.getContestUUID() a').fadeTo('slow', .3).removeAttr('href');
//   $('#poll.getContestUUID() a').off();
//   //
//   var url = 'tmpb.append(baseURI)/contests/enterPollAnonymous';
//   var data = {
//    'choiceId' : choice,
//    'serviceAccommodatorId' : 'snapShot.getSasl().getServiceAccommodatorId())',
//    'serviceLocationId' : 'snapShot.getSasl().getServiceLocationId())',
//    'contestUUID' : 'poll.getContestUUID())'
//   };
//   $(event.target).fadeOut('slow');
//   $('#pollresultsplotpoll.getContestUUID())').fadeIn('slow');
//
//   $(document).ready(function() {
//    console.log('starting');
//    var request = $.ajax({
//     headers : {
//      Accept : 'application/json;charset=utf-8'
//     },
//     type : 'POST',
//     url : url,
//     contentType : 'application/json;charset=utf-8',
//     data : JSON.stringify(data)
//    }).done(function(response) {
//     console.log('done:');
//     var dataArray = response.dataArray;
//     var options = response.options;
//     options.seriesDefaults.renderer = eval(options.seriesDefaults.renderer);
//     options.axes.yaxis.renderer = eval(options.axes.yaxis.renderer);
//     options.axes.yaxis.rendererOptions.tickRenderer = eval(options.axes.yaxis.rendererOptions.tickRenderer);
//     //
//     $.jqplot('pollresultsplotpoll.getContestUUID()', dataArray, options);
//    }).fail(function(e, o) {
//     console.log('Request failed: ' + o);
//     if ('undefined' != typeof e.responseJSON && 'undefined' != typeof e.responseJSON.error) {
//      console.log(' Error:' + e.responseJSON.error.message)
//     }
//    }).always(function() {
//     console.log(' All done');
//    })
//   });
//  }
// }).attr('onclick', '').css('cursor', 'pointer');
//});
