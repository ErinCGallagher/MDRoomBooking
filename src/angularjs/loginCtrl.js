//written by Erin Gallagher
angular
.module('mainApp')
.controller('LoginCtrl', LoginCtrl);


function LoginCtrl($scope, $location, SharedVariableService, ConstantTextSerivce){
  
  SharedVariableService.initialSetup()
  	.then(function(){
  		$location.path('/calendar');
  	},
  	function(err){
		alert(ConstantTextSerivce.LOGIN.NAME);
	});


  
};




