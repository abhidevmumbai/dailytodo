var toDo = {
	wrapperEl: null,
	week: [],
	today: null,
	tomorrow: null,
	init: function () {
		this.wrapperEl = $('#wrapper');
		this.getCurrentWeek();
		this.renderDays();

	},

	renderDays: function () {
		var htmlStr = '',
			hlClass = '';

		for (var i = 0; i < 7; i++) {
			if (this.today.getDate() == this.week[i].getDate()) {
				hlClass = 'today';
			} 
			if (this.tomorrow.getDate() == this.week[i].getDate()) {
				hlClass = 'tomorrow';
			}	
			
			htmlStr += '<div class="weekday '+ hlClass +'" data-date="'+ this.week[i] +'">'
						+ '<div class="head">'
							+ '<span class="day FL">'
								+ this.week[i].getDayName() 
							+ '</span>'
							+ '<span class="date FR">'
								+ this.week[i].getMonthName()+ ' ' +this.week[i].getFullYear()
							+ '</span>'
		    			+ '</div>'
		    			+ '<span class="addTaskBtn">+ click to add task</span>'
		    		+
		    		'</div>';
		}
		this.wrapperEl.html(htmlStr);
	},

	renderHtml: function () {

	},

	getCurrentWeek: function () {
		this.today = new Date();
		this.tomorrow = new Date();
		this.tomorrow.setDate(this.today.getDate()+1)
		var	diff = (this.today.getDay() + 6) % 7,
			start = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - diff),
			week = [];

			for (var i = 0; i <= 6; i++) {
				var day = start.setDate(start.getDate());
				this.week.push(new Date(day));
				day = start.setDate(start.getDate() + 1);
			}
			// console.log(this.week);
	}
}

$(document).ready(function () {
	toDo.init();
});
