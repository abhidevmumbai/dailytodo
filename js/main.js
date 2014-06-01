var toDo = {
	wrapperEl: null,
	weekEl: null,
	week: [],
	today: null,
	tomorrow: null,
	todoObj: {},
	init: function () {
		this.wrapperEl = $('#wrapper');
		this.weekEl = $('#week');
		this.renderDays();
		this.bindEvents();
	},

	bindEvents: function () {
		// Add task btn
		$('.weekday').on('click', '.addTaskBtn', function (event) {
			event.preventDefault();
			var currDate = $(this).parent().data('date');

			toDo.renderTask('', currDate);
		});


		$('.weekday ul').on('focusout', 'li', function (index) {
			var task = $(this).text(),
				currDate = $(this).parent().parent().data('date');
			if (task == '') {
				$(this).remove();
			} else {
				toDo.addTask(task, currDate);
			}
			console.log(task + ' - ' + currDate);
		});
	},

	renderDays: function () {
		var htmlStr = '',
			hlClass = '';

		// Get the current week
		this.getCurrentWeek();

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
								+ this.week[i].getDate() + ' ' + this.week[i].getMonthName()+ ' ' +this.week[i].getFullYear()
							+ '</span>'
		    			+ '</div>'
		    			+ '<ul>'
						+ '</ul>'
		    			+ '<a href="#" class="addTaskBtn">+ click to add task</a>'
		    		+
		    		'</div>';
		}
		this.weekEl.html(htmlStr);

		this.renderTasks();
	},

	renderTasks: function () {
		if (localStorage.getItem('todo')) {
			this.todoObj = JSON.parse(localStorage.getItem('todo'));
			foo = this.todoObj;
		}
		for (var item in this.todoObj) {
			var tasks = this.todoObj[item];
			console.log(item);
			for (var i = 0; i < tasks.length; i++) {
				this.renderTask(tasks[i], item);
			}
		}
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
	},

	renderTask: function (task, currDate) {
		var task = $('<li/>').append('<span>'+ task +'</span>');
		task.find('span').attr('contenteditable','true');
		$('.weekday[data-date="'+ currDate +'"] ul').append(task);
	},

	addTask: function (task, currDate) {
		var count = $('.weekday[data-date="'+ currDate +'"] li').length,
			id = 0;
		if (this.todoObj[currDate] == undefined) {
			this.todoObj[currDate] = [];
		}
		if (count == 1) {
			id = 0;
		} else {
			id = --count;
		}
		console.log(id);
		this.todoObj[currDate][id] = task;
		// console.log(currDate);
		this.updateLocalStorage();
	},

	updateLocalStorage: function () {
		localStorage.setItem('todo', JSON.stringify(this.todoObj));
	}
}

$(document).ready(function () {
	toDo.init();
});
