
!function ($) {

	$(function () {

		var h, h2, h3;
		
		if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
			var msViewportStyle = document.createElement("style");
			msViewportStyle.appendChild(
				document.createTextNode(
					"@-ms-viewport{width:auto!important}"
				)
			);
			document.getElementsByTagName("head")[0].
				appendChild(msViewportStyle);
		}

		var _navon = true;

		var _fold = 0, 
			_scrolltop = 0,
			_point = 0,
			_frame = 0,
			_startedoffset = 0,
			_pgheight = 0,
			_pgbottom = 0,
			_footertop = 0,
			_sidebarheight = 0,
			_sidebaroffset = 0,
			_startedend = 0,			
			_startedheight = 0;


		var $window = $(window);
		var $body = $(document.body);
		var $footer = $('.bs-footer');
		var $hero = $('#content');
		var $totop = $('#totop');
		var $herocontent = $('#content .container-s');
		var $getbutton = $('.getbutton');
		var $getstarted = $('#getstarted');
		var $sidebar = $('.bs-sidebar');
		var $pgcontent = $('.pgcontent');

		var _touch = ('ontouchstart' in window || navigator.msMaxTouchPoints);
		var _portrait = false;

		function sz() {
			_portrait = window.orientation !== 0 || window.orientation !== 180;
			
			$getstarted.removeClass('startoff');
			$sidebar.removeClass('navfix');
			
			_startedheight = $getstarted.height();
			_startedoffset = $getstarted.offset().top;
			_startedend = _startedheight + _startedoffset;
			_pgheight = $pgcontent.height();		
			_pgbottom = _pgheight + $pgcontent.offset().top;
			_sidebarheight = $sidebar.outerHeight();
			_sidebaroffset = _pgbottom - (_sidebarheight*0.33);
			_footertop = $footer.offset().top;
			_frame = $window.height();
			_point = _frame - _startedend;

			var _doc =_frame + 40;
			if(!_touch) { $hero.css({ 'height': _doc }); }
			$body.scrollTop(0);
			calc();
		}

		function calc() {
			_scrolltop = $window.scrollTop();
			if(!_touch) { $getstarted.toggleClass('startoff', _point < _scrolltop && _point > 0); } 
			
			$sidebar.toggleClass('navfix', _scrolltop > _frame);
			if(_scrolltop > _startedend) { $totop.fadeIn(200); } else { $totop.fadeOut(); }
			 if(_scrolltop > _sidebaroffset) {
				$sidebar.css('top','-10%');
				$totop.css('bottom', '40%');
			} else
			{
				$sidebar.css('top','4%');
				$totop.css('bottom','2%');
			}					
				
		}

		$window.on('load',function () {
			
			if(_touch){ $getstarted.removeClass('started-fix').addClass('started-rel'); }			
			sz();

			
		}).on('resize', function (e) { sz(); });
		$('.bs-sidenav').onePageNav({
			currentClass: 'current',
			changeHash: false,
			scrollSpeed: 750,
			scrollOffset: 30,
			scrollThreshold: 0.5,
			filter: '',
			easing: 'swing',
			begin: function () {
				//I get fired when the animation is starting
			},
			end: function () {
				//I get fired when the animation is ending
			},
			scrollChange: function ($currentListItem) { }
		});

		$getbutton.on('click', function (e) {
			e.preventDefault();
			$.scrollTo(e.target.hash, 550, {'axis' : 'y' });
		});

		$('#seehere').on('click', function (e) {
			e.preventDefault();
			$.scrollTo(e.target.hash, 550);
		});

		$totop.on('click', function(e) { $('html, body').animate({scrollTop: 0}, 300); });

		if(!_touch) { 
			$getbutton.hover(
				function(e) { $herocontent.addClass('hero-on'); },
				function(e) { $herocontent.removeClass('hero-on'); }
			);
			
		}

		

		setTimeout(function () {
		//	$sidebar.affix({ offset: { top: _fold + 120 } });
			$(document).stop().scrollTop(0);

		}, 100);

		setTimeout(function () {
			$pgcontent.css('opacity', '1.0');
			$getstarted.css('opacity', '1.0');
			
		}, 500);


		var descroll = _.debounce(function(e) {
			calc();

	
		}, 20);

		$window.scroll(function(){
			calc();
		});

		window.addEventListener('orientationchange', function() {
			sz();
		}, false);
		
		//window.addEventListener('scroll', descroll, false);

			
	})

}(jQuery);
