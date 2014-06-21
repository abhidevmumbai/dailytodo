var toDo = {
	wrapperEl: null,
	weekEl: null,
	week: [],
	today: null,
	tomorrow: null,
	todoObj: {},
	init: function () {
		this.wrapperEl = $('#wrapper');
		this.weekEl = $('#week .container');
		this.renderAllDays();
		this.bindEvents();
	},

	// Bind all events
	bindEvents: function () {
		// Add task btn
		$('#week').on('click', '.addTaskBtn', function (event) {
			event.preventDefault();
			var currDate = $(this).parent().data('date');

			toDo.renderTask('Enter task', currDate);
		});

		// Show Delete btn on tasks focusin
		$('#week').on('focusin', 'li', function () {
			var currDate = $(this).parent().parent().data('date');

			$(this).find('.delBtn').fadeIn();
			// console.log(task + ' - ' + currDate);
		});

		// Remove empty tasks on focusout
		$('#week').on('focusout', 'li', function () {
			var task = $(this).text(),
				currDate = $(this).parent().parent().data('date');
			if (task == '') {
				$(this).remove();
			} else {
				toDo.addTask(task, currDate);
			}
			$(this).find('.delBtn').delay(1000).fadeOut();
			// console.log(task + ' - ' + currDate);
		});

		// Delete task btn
		$('.weekday').on('click', '.delBtn', function() {
			var task = $(this).parent(),
				currDay = task.parent().parent();
			task.remove();
			// console.log(currDay);
			toDo.updateTaskList(currDay);

		});
		
		// Init the drag n drop functionality
		DnD.init();
	},

	// Show Today/ Tomorrow based on the date
	todayTomorrowClass: function (i) {
		var hlClass = '';
		if (toDo.today.getDate() == this.week[i].getDate()) {
			hlClass = 'Today';
		} 
		if (toDo.tomorrow.getDate() == this.week[i].getDate()) {
			hlClass = 'Tomorrow';
		}	
		return hlClass;
	},

	// Add next day card
	addNextDay: function () {
		var len = toDo.week.length,
			nextDay = toDo.week[len - 1],
			hlClass = '';
		nextDay.setDate(toDo.week[len - 1].getDate() + 1);
		toDo.week.push(nextDay);
		hlClass = this.todayTomorrowClass(len-1);
		toDo.renderDay(len, hlClass, 'next');
		slider.setDimensions();
		// console.log('Add next day');
	},

	// Add prev day card
	addPrevDay: function () {
		var len = toDo.week.length,
			prevDay = toDo.week[0];
		prevDay.setDate(toDo.week[0].getDate() - 1);
		toDo.week.unshift(prevDay);
		toDo.renderDay(0, '', 'prev');
		slider.setDimensions();
		// console.log('Add prev day');
	},

	// Render single day
	renderDay: function (i, hlClass, pos) {
		var htmlStr = '<div class="weekday card '+ hlClass +'" data-date="'+ this.week[i] +'">'
						+ '<div class="head">'
							+ '<span class="day FL">'
								+ (hlClass ? hlClass : this.week[i].getDayName()) 
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
		if (pos == 'next') {
			this.weekEl.append(htmlStr);	
		} else {
			this.weekEl.prepend(htmlStr);
		}
		
	},

	// Render all days
	renderAllDays: function () {
		var htmlStr = '';

		// Get the current week
		this.getCurrentWeek();

		for (var i = 0; i < this.week.length; i++) {
			var hlClass = this.todayTomorrowClass(i);
			htmlStr = this.renderDay(i, hlClass, 'next');
		}

		this.renderAllTasks();

		slider.init();
	},

	// Render single Task
	renderTask: function (task, currDate) {
		var task = $('<li/>').append('<span>'+ task +'</span>'),
			delBtn = $('<span class="delBtn typcn typcn-times"></span>');
		task.attr('draggable', true);
		task.find('span:first').attr('contenteditable','true');
		task.append(delBtn);
		$('.weekday[data-date="'+ currDate +'"] ul').append(task);

		// Select the default text
		utils.select_all(task.find('span:first')[0]);
	},	
 
 	// Render all Tasks
	renderAllTasks: function () {
		if (localStorage.getItem('todo')) {
			this.todoObj = JSON.parse(localStorage.getItem('todo'));
		}
		for (var item in this.todoObj) {
			var tasks = this.todoObj[item];
			for (var i = 0; i < tasks.length; i++) {
				this.renderTask(tasks[i], item);
			}
		}
	},

	// Update the tasks list from the DOM after shuffling of the tasks from one day to another
	updateTaskList: function (day) {
		var currDate = day.data('date'),
			tasks = [];
		// console.log(currDate);
		$('.weekday[data-date="'+ currDate +'"] ul span').each(function () {
			var text = $(this).text();
			if (text != '') {
				tasks.push(text);
			}
		});
		this.todoObj[currDate] = tasks;
		this.updateLocalStorage();
	},

	// Add single task
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
		this.todoObj[currDate][id] = task;
		// console.log(currDate);
		this.updateLocalStorage();

		// Bind drag n drop events
		DnD.bindEvents();
	},

	// Get the current week
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

	// Update the LocalStorage
	updateLocalStorage: function () {
		localStorage.setItem('todo', JSON.stringify(this.todoObj));
	}
}


/*
	Drag and Drop 
*/
var DnD = {
	dragSrcEl: null, // Source task element
	srcDay: null, // Source day dom element
	init: function () {
		this.bindEvents();
	},

	bindEvents: function () {
		var tasks = document.querySelectorAll('.weekday li');
		[].forEach.call(tasks, function(task) {
			task.addEventListener('dragstart', DnD.handleDragStart, false);
			task.addEventListener('dragenter', DnD.handleDragEnter, false)
			task.addEventListener('dragover', DnD.handleDragOver, false);
			task.addEventListener('dragleave', DnD.handleDragLeave, false);
			task.addEventListener('drop', DnD.handleDrop, false);
			task.addEventListener('dragend', DnD.handleDragEnd, false);
		});
	},

	handleDragStart: function (e) {
		DnD.dragSrcEl = this;

		DnD.srcDay = $(DnD.dragSrcEl).parent().parent();

		e.dataTransfer.effectAllowed = 'move';
		
		// Transfer the task html
		e.dataTransfer.setData('html', $(DnD.dragSrcEl)[0].outerHTML);
		console.log($(DnD.dragSrcEl));
		// console.log(day.data('date'));
	},

	handleDragOver: function (e) {
		if (e.preventDefault) {
			e.preventDefault(); // Necessary. Allows us to drop.
		}

		e.dataTransfer.dropEffect = 'move';

		return false;
	},

	handleDragEnter: function (e) {
		// this / e.target is the current hover target.
	},

	handleDragLeave: function (e) {
		// this / e.target is previous target element.
	},

	handleDrop: function (e) {
		// this / e.target is current target element.
		if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		}

		var day = $(this).parent().parent();
		// Don't do anything if dropping the same column we're dragging.
		if (DnD.dragSrcEl != this) {
			// Remove the task from the source column and Update the toDo object
			$.when($(DnD.dragSrcEl).remove()).then(toDo.updateTaskList(DnD.srcDay));

			// Append the task to the target column
			$(this).parent().append($(e.dataTransfer.getData('html')));

			// Update the toDo object after the task has been dropped
			toDo.updateTaskList(day);

			// Bind drag n drop events
			DnD.bindEvents();
			// console.log(day.data('date'));
		}
		
		return false;
	},

	handleDragEnd: function (e) {
		// this/e.target is the source node.
	}
}

$(document).ready(function () {
	toDo.init();
});
