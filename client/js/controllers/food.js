angular
	.module('app')
	.controller('FoodController', ['$scope','$state','Searchitem', function($scope,$state,Searchitem){
		function listFood() {
      Searchitem
        .find()
        .$promise
        .then(function(results) {
        	$scope.foodlist = results;
        });
    }
    listFood();
	}])
	.controller('FoodSearchController',['$scope','$state','Searchitem', function($scope,$state,Searchitem){
		console.log($state.params)
		Searchitem
			.search({"searchitem":$state.params.item})
			.$promise
			.then(function(results){
				$scope.sresults=results.response;
			})
	}])