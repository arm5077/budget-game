angular.module("app")
.controller("endingController", ["$scope", "$http", "$sce", function($scope, $http, $sce){

	$scope.moneybags = [];
	setInterval(function(){
		$scope.$apply(function(){
			$scope.moneybags.push(Math.random());
		})
		
	}, 500);
	
	$scope.url = "http://www.theatlantic.com/politics/archive/2016/04/could-you-balance-the-federal-budget/477867/";

	$scope.makeFacebookLink = function(){
		var title = "When it comes to taxes, I'm ";
		var text = "With The Atlantic's emoji-powered tax game, test your knowledge of federal expenditures and see how the government fits into your budget.";
		var img = "https://s3.amazonaws.com/the-atlantic/budget-quiz/assets/";
		
		if( $scope.score < 10){
			title += "an 'Intern, Remittance Perfection Division'";
			img += "level4.jpg"
		}
		else if( $scope.score >= 10 && $scope.score <= 14 ){
			title += "an 'Assistant to the Asst. Undersecretary of Excel'";
			img += "level3.jpg"
		}
		else if( $scope.score >= 15 && $scope.score <= 19 ){
			title += "an 'Executive Tax Compliance Assassin'";
			img += "level2.jpg"
		}
		else if( $scope.score >= 20 ){
			title += "an 'Senior VP of 1040 Form Enhancement'";
			img += "level1.jpg"
		}
		return "https://www.facebook.com/dialog/feed?caption=+&app_id=100770816677686&link=" + $scope.url + "&name=" + title + "&description=" + text + "&redirect_uri=" + $scope.url + "&picture=" + img;
	}
	
	$scope.makeTwitterLink = function(){

		var title = ".@TheAtlantic says I'm "; 
		
		if( $scope.score < 10){
			title += "an 'Intern, Remittance Perfection Division'";
		}
		else if( $scope.score >= 10 && $scope.score <= 14 ){
			title += "an 'Assistant to the Asst. Undersecretary of Excel'";
		}
		else if( $scope.score >= 15 && $scope.score <= 19 ){
			title += "an 'Executive Tax Compliance Assassin'";
		}
		else if( $scope.score >= 20 ){
			title += "an 'Senior VP of 1040 Form Enhancement'";
		}
		
		title += " when it comes to taxes. Find your rank: "

		return "http://twitter.com/intent/tweet?text=" + title + "&url=" + $scope.url;
	}

}]);