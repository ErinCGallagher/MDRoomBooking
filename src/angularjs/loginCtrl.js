angular
.module('mainApp')
.controller('LoginCtrl', LoginCtrl);


function LoginCtrl($scope, $location, SharedVariableService){
  
  SharedVariableService.initialSetup()
  	.then(function(){
  		$location.path('/calendar');
  	},
  	function(err){
		alert("could not retrieve all initial setup information");
	});


  $scope.retrieve = function(){
  		$location.path('/calendar');
  }
  
};




