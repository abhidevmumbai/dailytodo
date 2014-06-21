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
	lPos: 0,

	init: function () {
		this.sliderEl = $('.slider');
		this.container = this.sliderEl.find('.container');
		this.updateCards();

		// wrap a div around the container
		this.container.wrap( "<div class='viewport'></div>" )

		this.viewport = this.sliderEl.find('.viewport');

		slider.calDimensions();
		$(window).resize(function () {
			slider.calDimensions();
		})
		slider.setDimensions();
		this.addControls();
	},

	// Update the number of Cards(Days)
	updateCards: function () {
		this.cards = this.sliderEl.find('.card');
		this.cardCount = this.cards.length;
	},

	// Set slider dimensions
	setDimensions: function () {
		this.updateCards();
		// Set the viewport height
		this.viewport.height(this.windowH - $('header').outerHeight());

		// Set the container width
		this.container.width(this.cards.length * this.cardW + this.cardCount * 20).css({ 'left': slider.lPos});
	},

	// Calculate the current dimensions
	calDimensions: function () {
		this.windowW = $(window).width();
		this.windowH = $(window).height();
		this.cardW = this.cards.outerWidth();
		this.cardH = this.cards.outerHeight();
	},

	// bind all the event listeners
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

	// Add Next/ Prev handles to the slider
	addControls: function () {
		var controls = '<div class="controls"><a href="#" class="prevBtn btn"></a><a href="#" class="nextBtn btn"></a></div>';

		// ADD the controls to the viewport
		this.sliderEl.append(controls);

		this.prevBtn = this.sliderEl.find('.prevBtn');
		this.nextBtn = this.sliderEl.find('.nextBtn');

		// Bind control actions
		this.attachEvents();
	},

	// Slide the slider to the left
	slideLeft: function () {
		if (!this.isWorking) {
			if (this.slideCount) {
				var pos = this.container.position();
				this.lPos = pos.left + slider.cardW + 20;
				
				this.isWorking = true;
				this.container.animate({
					left: this.lPos + 'px'
				}, function() {
					slider.isWorking = false;
				});
				this.slideCount--;
				// console.log('slide left');
			} else {
				// Add a new card for the previous day
				toDo.addPrevDay();
			}
		}
	},

	// Slide the slider to the right
	slideRight: function () {
		if (!this.isWorking) {
			var pos = this.container.position();
			this.lPos = pos.left - slider.cardW - 20;

			if (this.slideCount < (this.cardCount-1)) {
				
				this.isWorking = true; 
				
				// console.log('slide right');
			} else {
				// Add a new card for the next day
				toDo.addNextDay();
			}
			this.container.animate({
					left: this.lPos + 'px'
				}, function() {
					slider.isWorking = false;
				});
			this.slideCount++;	
		}
		
	}
}



			

			