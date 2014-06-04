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

		// Show Delete btn on tasks focusin
		$('.weekday ul').on('focusin', 'li', function (index) {
			var currDate = $(this).parent().parent().data('date');

			$(this).find('.delBtn').fadeIn();
			// console.log(task + ' - ' + currDate);
		});

		// Remove empty tasks on focusout
		$('.weekday ul').on('focusout', 'li', function (index) {
			var task = $(this).text(),
				currDate = $(this).parent().parent().data('date');
			if (task == '') {
				$(this).remove();
			} else {
				toDo.addTask(task, currDate);
			}
			$(this).find('.delBtn').hide();
			// console.log(task + ' - ' + currDate);
		});

		// Delete task btn
		$('.weekday').on('click', '.delBtn', function() {
			var task = $(this).parent().parent(),
				currDay = task.parent().parent();
			task.remove();
			// console.log(currDay);
			toDo.updateTaskList(currDay);

		});
		
		// Init the drag n drop functionality
		DnD.init();
	},

	renderDays: function () {
		var htmlStr = '';

		// Get the current week
		this.getCurrentWeek();

		for (var i = 0; i < 7; i++) {
			var hlClass = '';
			if (this.today.getDate() == this.week[i].getDate()) {
				hlClass = 'Today';
			} 
			if (this.tomorrow.getDate() == this.week[i].getDate()) {
				hlClass = 'Tomorrow';
			}	
			
			htmlStr += '<div class="weekday card '+ hlClass +'" data-date="'+ this.week[i] +'">'
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
		}
		this.weekEl.html(htmlStr);

		this.renderTasks();

		slider.init();
	},

	renderTasks: function () {
		if (localStorage.getItem('todo')) {
			this.todoObj = JSON.parse(localStorage.getItem('todo'));
			foo = this.todoObj;
		}
		for (var item in this.todoObj) {
			var tasks = this.todoObj[item];
			for (var i = 0; i < tasks.length; i++) {
				this.renderTask(tasks[i], item);
			}
		}
	},

	updateTaskList: function (day) {
		var currDate = day.data('date'),
			tasks = [];
		console.log(currDate);
		$('.weekday[data-date="'+ currDate +'"] ul span').each(function () {
			tasks.push($(this).text());
		});
		this.todoObj[currDate] = tasks;
		this.updateLocalStorage();
	},

	renderTask: function (task, currDate) {
		var task = $('<li/>').append('<span>'+ task +'</span>'),
			delBtn = $('<input type="button" class="delBtn" value="x"/>');
		task.attr('draggable', true);
		task.find('span').attr('contenteditable','true').append(delBtn);
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
		this.todoObj[currDate][id] = task;
		// console.log(currDate);
		this.updateLocalStorage();

		// Bind drag n drop events
		DnD.bindEvents();
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

	updateLocalStorage: function () {
		localStorage.setItem('todo', JSON.stringify(this.todoObj));
	}
}

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
