angular.module("app").config(function($routeProvider){
	$routeProvider.when("/intro", {
		templateUrl: "templates/pages/intro.html",
		controller: "introController"
	})
	.when("/game", {
		templateUrl: "templates/pages/game.html",
		controller: "gameController"
	})
	.when("/infographic", {
		templateUrl: "templates/pages/infographic.html",
		controller: "infographicController"
	})
	.when("/ending", {
		templateUrl: "templates/pages/ending.html",
		controller: "endingController"
	})
	.otherwise({
		templateUrl: "templates/pages/intro.html",
		controller: "introController"
	})
});