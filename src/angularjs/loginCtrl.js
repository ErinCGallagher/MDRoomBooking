angular
.module('mainApp')
.controller('LoginCtrl', LoginCtrl);


function LoginCtrl($scope, $location, SharedVariableService){
  
  $scope.retrieve = function(){
  	$location.path('/calendar');
  }
  
};




