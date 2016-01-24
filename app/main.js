'use strict';

require('./styles/main.scss');
require('./styles/sitelette_icons.css');
require('./vendor/styles/jquery.jqplot.min.css');
require('./vendor/add-to-homescreen/style/addtohomescreen.css');
require('./vendor/styles/owl.carousel.css');

require('./vendor/add-to-homescreen/src/addtohomescreen.min');
require('./scripts/jquerymobile_config');
require('./vendor/jquery-mobile/js/jquery.mobile-1.4.0.min');
require('imports?$=jquery!./vendor/scripts/owl.carousel.min.js');
require('imports?$=jquery!./vendor/scripts/jquery.jqplot.min');
require('imports?$=jquery!./vendor/scripts/jqplot.barRenderer.min');
require('imports?$=jquery!./vendor/scripts/jqplot.categoryAxisRenderer.min');
require('imports?$=jquery!./vendor/scripts/jqplot.pointLabels.min');
require('imports?$=jquery!./vendor/scripts/jquery-radiobutton.min');
require('./vendor/swipe/swipe');
require('jquery-mask-plugin');
require('moment');

var App = require('./scripts/app.js'),
    h = require('./scripts/globalHelpers.js'),
    FastClick = require('fastclick');

    addToHomescreen({
        autostart: false,
        maxDisplayCount: 1
    });

    console.log('Starting...');

    $(function() {

        // Radiobutton initialization and behavior
        $('#POLxBa08SUUR3SJx1HAIRSTYL input').radiobutton();
        $('#POLxBa08SUUR3SJx1HAIRSTYL_submit').click(function(event){
            var choice= $("#POLxBa08SUUR3SJx1HAIRSTYL   input[type='radio']:checked").val();
            if(typeof choice!=='undefined'){
                $('#POLxBa08SUUR3SJx1HAIRSTYL input[type=radio]').attr('disabled', true);
                $('#POLxBa08SUUR3SJx1HAIRSTYL a').fadeTo('slow', .3).removeAttr('href');
                $('#POLxBa08SUUR3SJx1HAIRSTYL a').off();
                var url = 'http://simfel.com/apptsvc/rest/contests/enterPollAnonymous';
                var data = {
                    'choiceId':choice,
                    'serviceAccommodatorId':'ISPFFD2',
                    'serviceLocationId':'ISPFFD2',
                    'contestUUID':'POLxBa08SUUR3SJx1HAIRSTYL'
                };
                $(event.target).fadeOut('slow');
                $('#pollresultsplotPOLxBa08SUUR3SJx1HAIRSTYL').fadeIn('slow');
                $(document).ready(function(){
                    console.log('starting');
                    var request=$.ajax({
                        headers:{
                            Accept:'application/json;charset=utf-8'
                        },
                        type:'POST',
                        url:url,
                        contentType:'application/json;charset=utf-8',
                        data:JSON.stringify(data)
                    }).done(function(response){
                        console.log('done:');
                        var dataArray=response.dataArray,
                            options=response.options;
                        options.seriesDefaults.renderer=eval(options.seriesDefaults.renderer),
                        options.axes.yaxis.renderer=eval(options.axes.yaxis.renderer),
                        options.axes.yaxis.rendererOptions.tickRenderer=eval(options.axes.yaxis.rendererOptions.tickRenderer),
                        $.jqplot('pollresultsplotPOLxBa08SUUR3SJx1HAIRSTYL',dataArray,options)
                    }).fail(
                        function(e,o){
                            console.log('Request failed: '+o),
                            'undefined'!=typeof e.responseJSON&&'undefined'!=typeof e.responseJSON.error&&(console.log(' Error:'+e.responseJSON.error.message))
                        }
                    ).always(function(){
                        console.log(' All done')
                    })
                });
            }
        }).attr('onclick','').css('cursor','pointer');

        // Media Carousel initialization     
        $('#media_carousel').owlCarousel({ 
            items:1,
            loop:true,
            margin:0,
            autoplay:true,
            autoplayTimeout:3000,
            dots:false,
            animateOut:'fadeOut',
            animateIn:'fadeIn'
        });

        FastClick.attach(document.body);
    });

    $(document).on('click', 'a[href]:not([data-bypass])', function(evt) {
        // Get the absolute anchor href.
        var href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
        // Get the absolute root.
        var root = location.protocol + '//' + location.host;

        // Ensure the root is part of the anchor href, meaning it's relative.
        if (href.prop.slice(0, root.length) === root) {
            evt.preventDefault();
            // Backbone.history.navigate(href.attr, true);
        }
    });


new App().init();
h().startLogger();
