
var goTo;
$('.colored').css('color',$('h1').css('color'))
$('.not_colored').css('color',$('nav').css('background-color'))
$('#open-nav-button').click(function(){
	  var $self = $('body');
	  $('.page').fadeOut(500);

    var initPos = $self.css("position"),
        offs = $self.offset(),
        x = offs.left,
        y =offs.top,
        dia = Math.min(this.offsetHeight, this.offsetWidth, 100), // start diameter
        $rippleNav = $('<div/>', {class : "rippleNav",appendTo : $self });

    if(!initPos || initPos==="static") {
      $self.css({position:"relative"});
    }

    $('<div/>', {
      class : "rippleWaveNav",
      css : {
        background: $self.data("rippleNav"),
        width: dia,
        height: dia,
        left: x - (dia/2),
		
        top: y - (dia/2),
      },
      appendTo : $rippleNav,
      one : {
        animationend : function(){
 offs =$('#open-nav-button').offset(),
        x = offs.left,
        y =  offs.top;
		$('#close-nav-button').css({
			 left: x,
		
        top: y 
		}); $('.menu-button').css('font-size',$('.menu-button').width()/6.5);
			$('nav').fadeIn(500);
				
       
        
        }
      }
    });
  });

$('#close-nav-button').click(function(){
		 $('.page').fadeIn(500);
	$('nav').hide();
	$('.rippleNav').addClass('remove-navbar')
  });




$(".grouped-button").click(function(){
	var offs =$('#open-nav-button').offset();
		$('#menu-step-back').css({
			 left: offs.left,
		
        top: offs.top 
		});	
goTo = $(this).attr("act") + '_group';
	$('#menu').hide(500,function(){
	$('#close-nav-button').hide(500, function(){
		$('#menu-step-back').fadeIn(500, function(){
			$('#' + goTo).show(1000);
			
		});
	});
});

});


$(' #menu-step-back').click(function(){
	$('#menu-step-back').hide('explode', {}, 500);
	$('#' + goTo).hide(500, function(){
		$('#close-nav-button').fadeIn(500, function(){
			$('#menu').show(1000);
		});
	});
});