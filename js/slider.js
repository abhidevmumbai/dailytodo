var slider = {
	wrapper: null,
	viewport: null,
	cards: null,
	cardW: null,
	cardH: null,
	prevBtn: null,
	nextBtn: null,
	slideCount: 0,
	cardCount: 0,
	isWorking: false,

	init: function () {
		this.wrapper = $('.slider');
		this.container = this.wrapper.find('.container');
		this.cards = this.wrapper.find('.card');
		this.cardW = this.cards.outerWidth();
		this.cardH = this.cards.outerHeight();
		this.cardCount = this.cards.length;

		// wrap a div around the container
		this.container.wrap( "<div class='viewport'></div>" )

		this.viewport = this.wrapper.find('.viewport');

		// Set the
		this.wrapper.width($(window).width()).height(this.cardH);
		this.container.width(this.cards.length * this.cardW + this.cardCount * 20);
		
		this.addControls();
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
	},

	addControls: function () {
		var controls = '<a href="#" class="prevBtn btn"></a><a href="#" class="nextBtn btn"></a>';

		// ADD the controls to the viewport
		this.wrapper.append(controls);

		this.prevBtn = this.wrapper.find('.prevBtn');
		this.nextBtn = this.wrapper.find('.nextBtn');

		// Bind control actions
		this.attachEvents();
	},

	slideLeft: function () {
		if (this.slideCount && !this.isWorking) {
			console.log('slide left');
			var pos = this.container.position(),
				lPos = pos.left + slider.cardW + 20;
			this.isWorking = true;
			this.container.animate({
				left: lPos + 'px'
			}, function() {
				slider.isWorking = false;
			});
			this.slideCount--;
		}
	},

	slideRight: function () {
		if ((this.slideCount < (this.cardCount-1)) && !this.isWorking) {
			console.log('slide right');
			var pos = this.container.position();
			var lPos = pos.left - slider.cardW - 20;
			this.isWorking = true; 
			this.container.animate({
				left: lPos + 'px'
			}, function() {
				slider.isWorking = false;
			});
			this.slideCount++;
		}
	}
}



			

			