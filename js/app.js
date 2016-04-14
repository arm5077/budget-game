angular.module("app", ['ngRoute', 'ngAnimate'])
.controller("mainController", ["$scope", "$http", "$sce", "$window", function($scope, $http, $sce, $window){
	$scope.renderHTML = function(text){ return $sce.trustAsHtml(text); };
	FastClick.attach(document.body);
	$scope.score = 0;
	$scope.timeLimit = 30;
	$scope.timeLeft = $scope.timeLimit;
	$scope.Math = Math;
	$scope.speeds = [
		{
			speed: "fast",
			time: 3000,
			size: 75
		},
		{
			speed: "medium",
			time: 5000,
			size: 40
		},
		{
			speed: "slow",
			time: 7000,
			size: 15
		}
	];

	$window.addEventListener("message", function(event){
		if( event.data == "infographic")
			window.location.hash="#/infographic";
	}, false);
	
	$scope.options = [];
	Papa.parse("data/agencies.csv", {
		download: true,
		header: true,
		dynamicTyping: true,
		complete: function(results) {
			$scope.agencies = results.data;
			$scope.agencies.sort(function(a,b){
				return b.budget - a.budget;
			})
			$scope.choices = [];
		}
	});
	
	
	$scope.numberWithCommas = function(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
}])
.directive("money", function(){
	return {
		template: twemoji.parse('\uD83D\uDCB8'), 
		link: function(scope, element, attr){
			
			var size = Math.ceil(Math.random() * 75);
			var speed = scope.speeds[Math.round(Math.random() * 2)];
			
			console.log(speed);
			
			//element[0].style.left = "-50px";
			element[0].style.top = Math.random() * window.innerHeight + "px";
			element[0].style.width = speed.size + "px";
			element[0].style.zIndex = speed.speed;
			element.addClass(speed.speed);
			
			
			
			
			setTimeout(function(){
				scope.$apply(function(){
					scope.moneybags.splice(scope.moneybags.indexOf(scope.money), 1);
				});
			}, speed.time);
		}
	}
})
.directive("moneyFace", function(){
	return {
		template: "<img src='assets/money-face.png' class='money-face' />", 
		link: function(scope, element, attr){
			
		}
	}
})
.directive("clock", function(){
	return {
		template: twemoji.parse('\u23F2')
	}
})
.directive("trophy", function(){
	return {
		template: twemoji.parse('\uD83C\uDFC6'),
		link: function(scope, element, attr){
			scope.$watch("score", function(){
				if(scope.score > 0){
					element.removeClass("jig");
					element.addClass("jig");
					setTimeout(function(){
						element.removeClass("jig");
					}, 500);
				}
			});
		}
	}
})
.directive("moneyOnFire", function(){
	return {
		template: twemoji.parse('\uD83D\uDD25 \uD83D\uDCB0 \uD83D\uDD25'),
	}
})
.directive("emoji", function(){
	return {
		link: function(scope, element, attr){
			element[0].innerHTML = twemoji.parse(eval("'" + scope.agency.surrogate_pair + "'"));
		}
	}
});
