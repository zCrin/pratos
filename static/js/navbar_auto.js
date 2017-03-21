var goTo;

$('#nav > .fa-bars').click(function(){
	$('.page').fadeOut();
	$('footer').fadeOut();
$('#nav').addClass('full-nav', 1000).promise().done(function(){ 	
			$('#nav > .fa-bars').hide(0, function(){
				$('#nav > .closebtn').fadeIn(500);
				$('#menu').show(1000);

			});
		});
});

$(".grouped-button").click(function(){
goTo = $(this).attr("act") + '_group';
	$('#menu').hide(500,function(){
	$('#nav > .closebtn').hide(500, function(){
		$('#nav > #menu-step-back').fadeIn(500, function(){
			$('#' + goTo).show(1000);
			
		});
	});
});

});
$('#nav > .closebtn').click(function(){
	$('#menu').hide();
$('#nav').removeClass('full-nav', 1000).promise().done(
		function(){
			$('#nav > .closebtn').hide(0, function(){
				$('#nav > .fa-bars').fadeIn(500);
				$('.page').fadeIn();
				$('footer').fadeIn();
			});
		}
	);
});


$('#nav > #menu-step-back').click(function(){
	$('#nav > #menu-step-back').hide('explode', {}, 500);
	$('#' + goTo).hide(500, function(){
		$('#nav > .closebtn').fadeIn(500, function(){
			$('#menu').show(1000);
		});
	});
});