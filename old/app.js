angular.module("app", ['ngAnimate'])
.controller("controller", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	
	$scope.usedItems = [];
	$scope.score = 0;
	$scope.guesses = [];
	$scope.started = false;
	$scope.ended = false;
	$scope.timeLimit = 30
	$scope.timeLeft = $scope.timeLimit;
	$scope.timeStep = .1;
	$scope.answer = [];
	$scope.Math = Math;
	console.log(window.location.hash);
	if( window.location.hash == "#government" ) 
		$scope.type = "government" 
	else 
		$scope.type = "personal" 
	
	$http.get("data/personal_expenditures.json").then(function(data){

		/*
		// Split personal expenditure data into monthly, weekly and daily cuts
		$scope.personal_expenditures = [];
		data.data.forEach(function(d){
			$scope.personal_expenditures.push({ item: d.item, timespan: "annually", expenditure: Math.round(d.expenditure * 100) / 100 });
			$scope.personal_expenditures.push({ item: d.item, timespan: "monthly", expenditure: Math.round(d.expenditure / 12 * 100) / 100});			
			$scope.personal_expenditures.push({ item: d.item, timespan: "weekly", expenditure: Math.round(d.expenditure / 52 * 100) / 100 });
			$scope.personal_expenditures.push({ item: d.item, timespan: "daily", expenditure: Math.round(d.expenditure / 365 * 100) / 100 });			
		})
		*/
		
		$scope.personal_expenditures = data.data;
		
		$http.get("data/government_expenditures.json").then(function(data){
			// Get government expenditures and round to two digits
			$scope.government_expenditures = data.data;
			$scope.government_expenditures.forEach(function(d){
				d.expenditure = Math.round(d.expenditure * 100) / 100;
			})
			
			// Load first two choices into the app
			$scope.choices = $scope.getCombination($scope.type);
			
			/*
			for(i = 0; i<= 10; i++) {
				console.log($scope.getCombination("mixed"));
			}
			*/
		});


	});

	$scope.getCombination = function(type){
		// possible types of combination: random (will match gov-to-gov AND gov-to-personal) or mixed (will always match gov-to-personal)
			
		// Get government item
		var filtered = makeFilteredList();
		var government_item = filtered.government_expenditures[ Math.round( Math.random() * filtered.government_expenditures.length ) ];	
		
		// Push it to the list of used items
		$scope.usedItems.push(government_item);

		// Re-make filtered list
		var filtered = makeFilteredList();
				
		// Find out if we're getting a government or a personal comparison (50-50 chance)
		// First option is government comparison
		if( type == 'government' ){
			var otherExpenditures = filtered.government_expenditures;
		} 

		// Making a personal item comparison
		else {
			var personal_expenditures_flag = true;
			var otherExpenditures = filtered.personal_expenditures;
		}
	
		// Get raw difference between the first item and the array of second items
		otherExpenditures.forEach(function(d){ d.difference = Math.abs( d.expenditure - government_item.expenditure ); })
		otherExpenditures.sort(function(a,b){
			return a.difference - b.difference;
		});
		
		// Take one of the top 3 options
		var other_item = otherExpenditures[ Math.round(Math.random() * 2 ) ];

		// Add the item to the "used" list
		$scope.usedItems.push(other_item);
		
		/*
		// If this is a household item, make sure all time versions of it are removed
		if(  other_item.timespan ){
			makeFilteredList().personal_expenditures.forEach(function(d){
				if( d.item == other_item.item )
					$scope.usedItems.push(d);
			})
		}
		*/
		
		return [government_item, other_item];
	}

	function makeFilteredList(){
		// Filter out options that have already been exposed
		return {
			personal_expenditures: $scope.personal_expenditures.filter(function(d){
				return $scope.usedItems.indexOf(d) == -1
			}),
			
			government_expenditures: $scope.government_expenditures.filter(function(d){
				return $scope.usedItems.indexOf(d) == -1
			})
		}
	}
	
	$scope.makeGuess = function(guess){
		// Get other option
		var otherChoice = $scope.choices.filter(function(d){ return d != guess })[0];
		if( guess.expenditure > otherChoice.expenditure ){
			$scope.score++;
			guess.correct = true;
			$scope.answer.push("Right!");
		}
		else {
			guess.correct = false
			$scope.answer.push("Wrong!");
		}
		
		if( guess.timespan )
			$scope.guesses.unshift({otherChoice, guess});	
		else 
			$scope.guesses.unshift({guess, otherChoice	});	
		setTimeout(function(){
			$scope.$apply(function(){
				$scope.choices.length = 0;
				$scope.answer.length = 0;
			});
			
				setTimeout(function(){
					$scope.$apply(function(){
						// Get new options
						$scope.choices = $scope.getCombination($scope.type);
					})
				},500)
			
		}, 250)
		
	
		
	}

	$scope.startGame = function(){
		$scope.started=true;
		var timer = setInterval(function(){ 
			$scope.$apply(function(){
				$scope.timeLeft -= $scope.timeStep;
				$scope.timeLeft = Math.round($scope.timeLeft * 100) / 100;
				if( $scope.timeLeft <= 0 ){
					$scope.ended = true;
					clearInterval(timer);
				}
			})
		}, $scope.timeStep * 1000)
	}

	$scope.makeChoiceTitle = function(choice){
		if( choice.timespan ){
			switch(choice.timespan){
				case "annual": 
					return "Yearly " + choice.item.toLowerCase() + " bill"
				break;
				
				case "monthly": 
					return "Monthly " + choice.item.toLowerCase() + " bill"
				break;
				
				case "single": 
					return choice.item;
				break;				
			}
		}
		else {
			return choice.item
		}
	}
	

	
	
}])
.directive("centerY", function(){
	return function(scope, element, attr){
		setInterval(resize, 10);
		angular.element(window).on("resize", resize);
		function resize(){
			element.css({
				top: Math.floor((element.parent()[0].offsetHeight - element[0].offsetHeight) / 2 ) + "px",
				position: "relative"
			});
		}
	}
})
.directive("centerAbsolute", function(){
	return function(scope, element, attr){
		setInterval(resize, 100);
		angular.element(window).on("resize", resize);
		function resize(){
			element.css({
				top: Math.floor((window.innerHeight - element[0].offsetHeight) / 2 ) + "px",
				left: Math.floor((window.innerWidth - element[0].offsetWidth) / 2 ) + "px",
				position: "fixed"
			});
		}
	}
})
.directive("money", function(){
	return {
		template: twemoji.parse('\uD83D\uDCB8'), 
		link: function(scope, element, attr){
			element[0].style.left = "-50px"
			element[0].style.top = Math.random() * window.innerHeight + "px";
			
			var speed = Math.random() * 5;
			
			var movement = setInterval(function(){
				element[0].style.left = parseInt(element[0].style.left) + (speed + 1) + "px";
				if( parseInt(element[0].style.left) > window.innerWidth ){
					scope.moneybags.splice(scope.moneybags.indexOf(scope.money), 1);
					clearInterval(movement);
				}
			},10);
			
		}
	}
});