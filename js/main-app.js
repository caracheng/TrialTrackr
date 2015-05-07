//var http = require('http');

// http.createServer(function(req, res){
	// res.writeHead(200, {'Content-Type':'text/plain'});
	// res.end('Hello World\n');
	
// }).listen(1337, '127.0.0.1');

// console.log('Server running at http://127.0.0.1:1337/');

angular.module('tabtracker', ['ui.router'])
    .config(['$stateProvider', function ($stateProvider) {
 	var main = {
		name: 'main',
		url: '/#',
		templateUrl: '',
		controller: 'AutoPopCtrl',
	};
	
	$stateProvider.state(main);
	$stateProvider.state('screen1', {
        url: 'screen1',
        templateUrl: '/templates/screen1.html',
        controller: 'NavigationCtrl',
	});
	
	$stateProvider.state('screen2', {
        url: 'screen2',
        templateUrl: '/templates/screen2.html',
        controller: 'Screen2Ctrl',
	});
	
	$stateProvider.state('screen3', {
        url: 'screen3',
        templateUrl: 'templates/screen3.html',
        controller: 'Screen3Ctrl',
	});	
	
	$stateProvider.state('screen4', {
        url: 'screen4',
        templateUrl: 'templates/screen4.html',
        controller: 'Screen4Ctrl',
	});	
	
	$stateProvider.state('screen5', {
        url: 'screen5',
        templateUrl: 'templates/screen5.html',
        controller: 'Screen5Ctrl',
	});	
	
	$stateProvider.state('screen6', {
        url: 'screen6',
        templateUrl: 'templates/screen6.html',
        controller: 'Screen6Ctrl',
	});	
	$stateProvider.state('screen7', {
        url: 'screen7',
        templateUrl: '/templates/screen7.html',
        controller: 'NavigationCtrl',
	});
	// $stateProvider.state(screen2);
	// $stateProvider.state(screen3);
	// $stateProvider.state(screen4);

    }])
	
	
    .run(['$state', function ($state) {
       $state.transitionTo('screen1'); 
    }])

    .controller('NavigationCtrl', function ($scope, $state) {

		$scope.setPage = function (page) {
			$state.transitionTo(page);
		};
	
	});
	
