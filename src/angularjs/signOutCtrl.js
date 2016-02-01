angular
.module('mainApp')
.controller('SignOutCtrl', SignOutCtrl)

function SignOutCtrl($scope, $window, $location){

	$window.location.href = "https://idptest.queensu.ca/idp/logout.jsp";


}