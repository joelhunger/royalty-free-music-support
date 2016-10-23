var todoModule = angular.module('todoModule', []);

todoModule.controller('todoModuleController', function ($scope, $http, $location) {

	$scope.showArchived = false;
	$scope.filterText = '';
	$scope.showSaveProgress = false;
	$scope.isAuthenticated = false;
	$scope.userName = '';
	$scope.password = '';
	
	$scope.authenticate = function() {
		var uri = "http://www.jhungermusic.com/signupt";
		var postData = { userName: $scope.userName, password: $scope.password };
        var responsePromise = $.ajax({
            type: "POST",
            url: uri,
			data: angular.toJson(postData),
			contentType: "application/json; charset=utf-8",
			dataType: "json"
        });
		responsePromise.done(function (data, status, headers, config) {
			if (data.status == 200)
			{
				$scope.isAuthenticated = true;
				$scope.loadData("todo");
			}
			//$scope.isAuthenticated = true;
			//$scope.loadData("todo");
        });
        responsePromise.error(function (data, status, headers, config) {
			if (data.status == 200)
			{
				$scope.isAuthenticated = true;
				$scope.loadData("todo");
			}
			console.log(data);
			console.log(status);
        });
		

	};

    // angular.element(document).ready(function () {
	   // $scope.loadData("todo");
    // });

    $scope.loadData = function (todoFile) { 
	    $scope.todoFile = todoFile;
		$scope.showArchived = false;
		$scope.filterText = '';
		$scope.showSaveProgress = false;
		
		var postData = { fileName: todoFile };
	
        //var uri = "http://localhost:8081/readDatabaseFile";
		var uri = "http://www.jhungermusic.com/readDatabaseFile";
        $scope.dataIsLoading = true;
        var responsePromise = $.ajax({
            type: "POST",
            url: uri,
			data: angular.toJson(postData),
			contentType: "application/json; charset=utf-8",
			dataType: "json"
        });
		

        responsePromise.done(function (data, status, headers, config) {
			$scope.todoData = data;
			$scope.todoProjectName = $scope.todoData.todoProject.projectName;
			$scope.todos = $scope.todoData.todoProject.todos;
			$scope.todoTemplates = $scope.todoData.todoProject.todoTemplates;
			$scope.todoStates = $scope.todoData.todoProject.todoStates;
            $scope.$apply();
        });
        responsePromise.error(function (data, status, headers, config) {
			console.log(data);
			console.log(status);
        });
    };
	
	$scope.saveData = function() {
		$scope.showSaveProgress = true;
		
		var postData = { fileName: $scope.todoFile, data: $scope.todoData };
		var uri = "http://www.jhungermusic.com/writeDatabaseFile";
		
        $scope.dataIsLoading = true;
        var responsePromise = $.ajax({
            type: "POST",
            url: uri,
			data: angular.toJson(postData), 
			contentType: "application/json; charset=utf-8",
			dataType: "json"
        });

        responsePromise.done(function (data, status, headers, config) {
			$scope.showSaveProgress = false;
			$scope.$apply();
        });
        responsePromise.error(function (data, status, headers, config) {
			$scope.showSaveProgress = false;
			$scope.$apply();
        });	
	};
	
	$scope.getTodoState = function (id) {
		var todoState;
		angular.forEach($scope.todoStates, function(value, key) {
			if (value.id == id) 
			{
				todoState = value;
			}
		});
		return todoState;
	};
	
	$scope.taskClass = function (id) {
		var listItemClass = "list-group-item list-group-item-";
		return listItemClass.concat($scope.getTodoState(id).style);
	};
	
	$scope.expandIconClass = function(todo) {
		return todo.showTasks == true ? 'glyphicon glyphicon-chevron-up' : 'glyphicon glyphicon-chevron-down';
	};
	
	$scope.taskHasNextState = function(id) {
		var todoState = $scope.getTodoState(id);
		return (todoState.nextState != todoState.id);
	};
	
	$scope.taskHasPreviousState = function(id) {
		var todoState = $scope.getTodoState(id);
		return (todoState.previousState != todoState.id);
	};
	
	$scope.taskHasSuspendState = function(id) {
		return (id != 3);
	};
	
	$scope.todoStateNextStateText = function(id) {
		var todoState = $scope.getTodoState(id);
		return (todoState.nextStateAbbr);
	};
	
	$scope.todoStateSuspendStateText = function() {
		return ('S');
	};
	
	$scope.todoStatePreviousStateText = function(id) {
		var todoState = $scope.getTodoState(id);
		return (todoState.previousStateAbbr);
	};
	
	$scope.todoStateNextStateTooltip = function(id) {
		var todoState = $scope.getTodoState(id);
		return (todoState.nextStateText);
	};
	
	$scope.todoStatePreviousStateTooltip = function(id) {
		var todoState = $scope.getTodoState(id);
		return (todoState.previousStateText);
	};
	
	$scope.todoStateSuspendStateTooltip = function() {
		return ('Suspend task');
	};
	
	$scope.todoStatePreviousClass = function(id) {
		var todoState = $scope.getTodoState(id);
		var previousState = $scope.getTodoState(todoState.previousState);
		
		var classLabelText = "hspace-left-5 label label-";
		classLabelText = classLabelText.concat(previousState.style);
		classLabelText = classLabelText.concat(" pull-right m-l-2 m-r-2");
		return classLabelText;
	};

	$scope.todoStateNextClass = function(id) {
		var todoState = $scope.getTodoState(id);
		var nextState = $scope.getTodoState(todoState.nextState);
		
		var classLabelText = "hspace-left-5 label label-";
		classLabelText = classLabelText.concat(nextState.style);
		classLabelText = classLabelText.concat(" pull-right m-l-2 m-r-2");
		return classLabelText;
	};
	
    $scope.todoStateSuspendClass = function() {
		var todoState = $scope.getTodoState(3);
		
		var classLabelText = "label label-";
		classLabelText = classLabelText.concat(todoState.style);
		classLabelText = classLabelText.concat(" pull-right m-l-2 m-r-2");
		return classLabelText;
	};
	
	$scope.moveTaskToNextState = function(task) {
		var todoState = $scope.getTodoState(task.state);
		task.state = todoState.nextState;
		$scope.saveData();
	};
	
	$scope.moveTaskToPreviousState = function(task) {
		var todoState = $scope.getTodoState(task.state);
		task.state = todoState.previousState;
		$scope.saveData();
	};
	
    $scope.moveTaskToSuspendState = function(task) {
		task.state = 3;
		$scope.saveData();
	};
	
	$scope.getLeastCompletedTodoState = function(todo) {
		var leastCompletedTodoState = $scope.getTodoState(2);
		angular.forEach(todo.tasks, function(value, key) {
			var currentTodoState = $scope.getTodoState(value.state);
			if (currentTodoState.id != 3 && currentTodoState.id < leastCompletedTodoState.id) 
			{
				leastCompletedTodoState = currentTodoState;
			}
		});
		return leastCompletedTodoState;
	};
	
	$scope.getTopLevelTaskStatusListItemClass = function(todo) {
		var leastCompletedTodoState = $scope.getLeastCompletedTodoState(todo);
		var listItemClass = "list-group-item list-group-item-";
		return listItemClass.concat(leastCompletedTodoState.style);
	};
	
	$scope.getTopLevelTaskStatusLabelClass = function(todo) {
		var leastCompletedTodoState = $scope.getLeastCompletedTodoState(todo);
		var listItemClass = "hspace-5 label label-";
		return listItemClass.concat(leastCompletedTodoState.style);
	};
	
    $scope.getTopLevelTaskStatusLabelText = function(todo) {
		var leastCompletedTodoState = $scope.getLeastCompletedTodoState(todo);
		return leastCompletedTodoState.name;
	};
	
	$scope.addNewTodo = function(templateId) {
		var todoTemplate;
		angular.forEach($scope.todoTemplates, function(value, key) {
			if (value.id == templateId) 
			{
				todoTemplate = value;
			}
		});
		
		var newTodo = {
			"title": todoTemplate.todo.title,
			"archived": todoTemplate.todo.archived,
			"isEditing": todoTemplate.todo.isEditing,
			"showTasks": todoTemplate.todo.showTasks,
			"tasks":[]
		};
		
		angular.forEach(todoTemplate.todo.tasks, function(value, key) {
			var newTask = {
				"description": value.description,
				"state": value.state
			}
			newTodo.tasks.push(newTask);
		});
		
		$scope.todos.unshift(newTodo);
		$scope.saveData();
	};
	
	$scope.addTask = function(todo) {
		todo.tasks.push({
			description: "New task",
			state: 0
		});
		todo.isEditing = true;
		$scope.saveData();
	};
	
	$scope.archiveTodo = function(todo) {
		todo.archived = true;
		$scope.saveData();
	};
	
	$scope.deleteTask = function(todo, task) {
		var index = todo.tasks.indexOf(task); 
		if (index >= 0)
		{
			todo.tasks.splice(index, 1);
		}
		$scope.saveData();
	};
	
	$scope.toggleShowTasks = function(todo) {
		todo.showTasks = !todo.showTasks;
		$scope.saveData();
	};
	
	$scope.toggleEditMode = function(todo) {
		todo.isEditing = !todo.isEditing;
		$scope.saveData();
	};
	
	$scope.applyTodoFilter = function(todo) {
		if (!$scope.showArchived && todo.archived == true) {
			return false;
		}
		
		if ($scope.filterText.length > 0) {
			if (todo.title.toLowerCase().indexOf($scope.filterText.toLowerCase()) < 0) {
				return false;
			}
		}
		return true;
	};

	$scope.isTodoInEditMode = function(todo) {
		return todo.isEditing == true;
	};
	
	$scope.collapseAll = function() {
		angular.forEach($scope.todos, function(value, key) {
			value.showTasks = false;
		});
	};
	
	$scope.expandAll = function() {
		angular.forEach($scope.todos, function(value, key) {
			value.showTasks = true;
		});
	};

});