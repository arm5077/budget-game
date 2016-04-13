angular.module("app")
.controller("endingController", ["$scope", "$http", "$sce", function($scope, $http, $sce){

	$scope.moneybags = [];
	setInterval(function(){
		$scope.$apply(function(){
			$scope.moneybags.push(Math.random());
		})
		
	}, 500);

}]);