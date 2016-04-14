angular.module("app")
.controller("gameController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	
	// Reset score
	$scope.$parent.score = 0;
	
	// Set up loop to generate new flying money
	$scope.moneybags = [];
	setInterval(function(){
		$scope.$apply(function(){
			$scope.moneybags.push(Math.random());
		})
		
	}, 500);
	
	// Make list of agencies they'll guess from
	$scope.guesses = $scope.agencies.slice();
	
	// Initalize first guess
	getCombination();
	
	var timer = setInterval(function(){ 
		$scope.$apply(function(){
			$scope.timeLeft = Math.max(0,$scope.timeLeft - 1);
			if( $scope.timeLeft <= 0 ){
				$scope.ended = true;
				window.location.hash="#/ending";
				clearInterval(timer);
			}
		})
	}, 1000)
	
	
	function getCombination(){
		console.log($scope.guesses);
		$scope.choices.length = 0;
		$scope.choices.push( $scope.guesses[ Math.floor(Math.random() * $scope.guesses.length) ] );
		
		while($scope.choices.length < 2){ 
			var otherOption = $scope.agencies[ Math.floor(Math.random() * $scope.agencies.length) ];
			if(otherOption != $scope.choices[0]){
				$scope.choices.push(otherOption);
				break;
			}
		}
		
		$scope.choices.forEach(function(choice){
			choice.correct = null;
		})
		
	}
	
	
	$scope.makeGuess = function(guess){
		if( typeof guess.correct == "object"){
			// Get other option
			var otherChoice = $scope.choices.filter(function(d){ return d != guess })[0];
			if( guess.budget > otherChoice.budget ){
				// Increment score
				$scope.$parent.score++;

				// Remove guess from remaining guesses list
				$scope.guesses.splice( $scope.guesses.indexOf(guess), 1 );

				// Add time to clock
				$scope.timeLeft += 2

				// Looks like we got the guess right
				guess.correct = true;
				
				
			}
			else {
				// Subtract time from clock
				$scope.timeLeft = Math.max(0, $scope.timeLeft - 3)
				guess.correct = false
			}



			setTimeout(function(){
				$scope.$apply(function(){
					$scope.choices.length = 0;
				});

					setTimeout(function(){
						$scope.$apply(function(){
							// Get new options
							getCombination();
						})
					},1)

			}, 750)
		}
	}
}]);