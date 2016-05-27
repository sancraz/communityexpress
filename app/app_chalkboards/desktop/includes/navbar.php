<header id="header" role="banner" >
 <nav class="navbar navbar-default navbar-fixed-top"  id="tf-menu">
  <div class="container">
   <div class="row">
    <!-- Logo start -->
    <div class="navbar-header">
     <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
     </button>
     <div class="navbar-brand">
      <a href="/" class="page-scroll"> <img class="img-responsive" src="images/logo1.png" alt="logo"> </a>
     </div>
    </div><!--/ Logo end -->
    <div class="collapse navbar-collapse clearfix navMenu" role="navigation">
        
     <!--   
        
     <ul class="nav navbar-nav navbar-right">
      <li class="active">
       <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","slider-part") ?>  >Home</a>
      </li>
      <li>
       <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","whatwedo") ?>>What we do</a>
      </li>
      <li>
       <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","projects") ?>>Projects</a>
      </li>
      <li>
       <a class="page-scroll" href="careers.php" >Careers</a>
      </li>
      <li>
       <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","contact") ?>>Contact</a>
      </li>
     </ul>
     -->
       <ul class="nav navbar-nav navbar-right">
      <li  <?php modifyUrlAndClass("") ?> >
       <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","slider-part") ?>  >Home</a>
      </li>
      <li >
       <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","features") ?>>Features</a>
      </li>
      <li  <?php modifyUrlAndClass("signup") ?> >
       <a href="signup" >Sign Up</a>
      </li>
      <li <?php modifyUrlAndClass("portalexpress") ?>>
       <a  href="portalexpress" >Login</a>
      </li>
           <li <?php modifyUrlAndClass("Invitation") ?>>
       <a  href="signup" >Invitation</a>
      </li>
      <!--
      <li  <?php modifyUrlAndClass("services") ?>>
       <a href="services" >Services</a>
      </li>
      -->
      <li>
       <a class="page-scroll" href=<?php echoActiveClassIfRequestMatches("index","contact") ?>>Contact</a>
      </li>
     </ul>
     
     
     
    </div><!--/ Navigation end -->
   </div><!--/ Row end -->
  </div><!--/ Container end -->
 </nav>
</header><!--/ Header end -->
<!-- END MAIN NAV -->
