var slider = {
	sliderEl: null,
	viewport: null,
	windowW: null,
	cards: null,
	cardW: null,
	cardH: null,
	prevBtn: null,
	nextBtn: null,
	slideCount: 0,
	cardCount: 0,
	isWorking: false,

	init: function () {
		this.sliderEl = $('.slider');
		this.container = this.sliderEl.find('.container');
		this.cards = this.sliderEl.find('.card');
		this.cardCount = this.cards.length;

		// wrap a div around the container
		this.container.wrap( "<div class='viewport'></div>" )

		this.viewport = this.sliderEl.find('.viewport');

		slider.calDimensions();
		$(window).resize(function () {
			slider.calDimensions();
		})
		this.addControls();
	},

	calDimensions: function () {
		this.windowW = $(window).width();
		this.windowH = $(window).height();
		this.cardW = this.cards.outerWidth();
		this.cardH = this.cards.outerHeight();
		
		// Set the viewport height
		this.viewport.height(this.windowH);

		// Set the container width
		this.container.width(this.cards.length * this.cardW + this.cardCount * 20).css({ 'left': 0});
		
	},

	attachEvents: function () {
		this.prevBtn.bind('click', function (event) {
			event.preventDefault();
			slider.slideLeft();
		});
		this.nextBtn.bind('click', function (event) {
			event.preventDefault();
			slider.slideRight();
		});

		if (this.windowW < 400) {
			this.sliderEl.swipe({
			swipeLeft:function(event, direction, distance, duration, fingerCount) {
				//This only fires when the user swipes left
				slider.slideRight();
			},
			swipeRight:function(event, direction, distance, duration, fingerCount) {
				//This only fires when the user swipes left
				slider.slideLeft();
			}
		});	
		}
		
	},

	addControls: function () {
		var controls = '<div class="controls"><a href="#" class="prevBtn btn"></a><a href="#" class="nextBtn btn"></a></div>';

		// ADD the controls to the viewport
		this.sliderEl.append(controls);

		this.prevBtn = this.sliderEl.find('.prevBtn');
		this.nextBtn = this.sliderEl.find('.nextBtn');

		// Bind control actions
		this.attachEvents();
	},

	slideLeft: function () {
		if (this.slideCount && !this.isWorking) {
			var pos = this.container.position(),
				lPos = pos.left + slider.cardW + 20;
			this.isWorking = true;
			this.container.animate({
				left: lPos + 'px'
			}, function() {
				slider.isWorking = false;
			});
			this.slideCount--;
			// console.log('slide left');
		}
	},

	slideRight: function () {
		if ((this.slideCount < (this.cardCount-1)) && !this.isWorking) {
			var pos = this.container.position();
			var lPos = pos.left - slider.cardW - 20;
			this.isWorking = true; 
			this.container.animate({
				left: lPos + 'px'
			}, function() {
				slider.isWorking = false;
			});
			this.slideCount++;
			// console.log('slide right');
		}
	}
}



			

			