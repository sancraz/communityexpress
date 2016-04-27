$(document).ready(function() {
 $('.owl-carousel').owlCarousel({
  margin : 0,
  loop : true,
  autoWidth : false,
  items : 1
 });
 $('.owl-carousel').on('initialized.owl.carousel changed.owl.carousel', function(e) {
  if (!e.namespace || e.type != 'initialized' && e.property.name != 'position')
   return;
  var current = e.item.index;
  
  var uuid = $(e.target).find('.owl-item').eq(current).find('.mediatile').attr('uuid');
  console.log(uuid);
 });
});