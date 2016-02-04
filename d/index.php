<!DOCTYPE html>
<html lang="en">
 <head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="description" content="">
  <meta name="keywords" content="">
  <title>Sitelettes</title>
  <!--[if IE]>
  <script src="https://html5shim.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->

  <link href="/d/bootstrap/bootstrap.min.css" rel="stylesheet">
  <link href="/d/desktop.css" rel="stylesheet">
  <link href="/d/owl.carousel.min.css" rel="stylesheet">
  <link href="/d/owl.theme.default.min.css" rel="stylesheet">
  <link href="/d/owl.transitions.css" rel="stylesheet">
  <link href="/d/formvalidation/formValidation.min.css" rel="stylesheet">
  <link href="/d/ladda-bootstrap/ladda-themeless.min.css" rel="stylesheet">

  <style>
	.picture_background {
		background-image: url(d/images/main_background.jpg);
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: 0% top;
	}

	.phone_bar {
		background-image: url(d/images/iphone-6-gold.png);
		background-size: 362px;
		background-repeat: no-repeat;
		background-position: 0% top;
	}
	.phone_wrapper {
		margin-top: 88px;
		padding-left: 6px;
		padding-bottom: 220px;
	}
	#demoinstructions_carousel {
		padding-top: 88px;
	}
	.owl-item div {
		width: 320px;
		height: auto;
		text-align: center;
	}
	 .top_gap {
margin-top:20px;
 }
  </style>
 </head>
 <body>
  <div class="container-fluid   picture_background">
   <div class="row">
    <div class="col-sm-12">
     <div class="container top_gap">
      <div class="row">
       <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 phone_bar" style="min-width:370px;">
        <div class="phone_wrapper"  >
         <!--<iframe id="phoneFrame" class=" " width=260 height=456  srcdoc="<head> </head><html><body><style>body{color:#FFF;}</style> <div> Hello, <b>world</b>.</div></body></html>" frameborder="0" allowfullscreen></iframe> -->
         <iframe id="communityexpress" class=" " width=320 height=568  src="" frameborder="0" ></iframe>
        </div>
       </div>

       <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
        <!--  FORM row  -->
        <div id="demosite_form_row" class="row  " style="height: 500px;">
         <div style="height:40px;"></div>
         <h2>Send the app to your smartphone. </h2>
         <form id="demosite_email_form" role="form" class="form-horizontal">
          <div class="form-group">
           <label class="col-xs-3 control-label">Email</label>
           <div class="col-xs-9">
            <input id="share_email" type="text" class="form-control" name="share_email" placeholder="email" />
           </div>
          </div>
          <div class="form-group">
           <div class="col-xs-9 col-xs-offset-3">
            <div class="checkbox">
             <label>
              <input id="certify_email" type="checkbox" name="certify_email" value="certify_email" />
              I
              certify that the recipient has agreed. </label>
            </div>
           </div>
          </div>
          <div class="form-group">
           <div class="col-xs-9 col-xs-offset-3">
            <button id="submit_email" type="submit" class="btn btn-primary ladda-button" data-style="expand-left"
            name="submit_email" value="submit_email">
             Send
            </button>
           </div>
          </div>
         </form>
         <hr style="height: 30px; border: none;" />

         <form id="demosite_mobile_form" role="form" class="form-horizontal">
          <div class="form-group">
           <label class="col-xs-3 control-label">Mobile</label>
           <div class="col-xs-9">
            <input id="share_mobile" type="text" class="form-control" name="share_mobile" placeholder="mobile number" />
           </div>
          </div>
          <div class="form-group">
           <div class="col-xs-9 col-xs-offset-3">
            <div class="checkbox">
             <label>
              <input id="certify_mobile" type="checkbox" name="certify_mobile" value="certify_mobile" />
              I
              certify that the recipient has agreed. </label>
            </div>
           </div>
          </div>
          <div class="form-group">
           <div class="col-xs-9 col-xs-offset-3">
            <button id="submit_mobile" type="submit" class="btn btn-primary ladda-button" data-style="expand-left"
            name="submit_mobile" value="submit_mobile">
             Send
            </button>
           </div>
          </div>
         </form>

        </div>
        <!-- ERROR row -->
        <div id="demosite_error_row" class="row  " style="display: none; height: 500px;">
         <h2>Error</h2>
         <div id="demosite_error_message">
          Invalid request
         </div>
        </div>
        <!-- RESULTS row -->
        <div id="demosite_result_row" class="row  " style="display: none; height: 500px;">
         <h2>Results</h2>
         <div id="demosite_message"></div>
        </div>
       </div>

       <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">

        <!-- Owl Slider -->

        <div>
         <div id="demoinstructions_carousel" class="owl-carousel owl-theme" >
          <div>
           <img src="d/images/demosite/demosite_carousel_1.jpg" width=100px  alt="First slide">
          </div>
          <div>
           <img src="d/images/demosite/demosite_carousel_2.jpg" width=100px alt="Second slide">
          </div>
          <div>
           <img src="d/images/demosite/demosite_carousel_3.jpg" width=100px alt="Third slide">
          </div>
          <div>
           <img src="d/images/demosite/demosite_carousel_4.jpg" width=100px alt="Fourth slide">
          </div>
          <div>
           <img src="d/images/demosite/demosite_carousel_5.jpg" width=100px alt="Fifth slide">
          </div>
         </div>
        </div>

        <!-- END Carousel -->
        <hr style="border: none;" />
        <hr style="border: none;" />
       </div>

      </div>
     </div>
    </div>

   </div>
  </div>
  <script src="/d/jquery.js"></script>

  <script src="/d/URI.min.js"></script>
  <script src="/d/common_utility.js"></script>

  <script src="/d/bootstrap/bootstrap.min.js"></script>

  <script src="/d/owl.carousel.min.js"></script>

  <script src="/d/ladda-bootstrap/spin.min.js"></script>
  <script src="/d/ladda-bootstrap/ladda.jquery.min.js"></script>
  <script src="/d/ladda-bootstrap/ladda.min.js"></script>
  <script src="/d/formvalidation/formValidation.min.js"></script>
  <script src="/d/formvalidation/formValidation.min.js"></script>
  <script src="/d/formvalidation/framework/bootstrap.min.js"></script>
  <script src="/d/formvalidation/mandatoryIcon.min.js"></script>

  <script src="/d/desktop.js"></script>

 </body>
</html>
