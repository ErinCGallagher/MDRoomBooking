angular
.module('mainApp')
.controller('SignOutCtrl', SignOutCtrl)

function SignOutCtrl($scope, $window, $location, CommService){

	//ensure the session variables are destroyed before redirecting to solus signout
	CommService.signOut()
		.then(function(){
			console.log("successfuly destroyed session");
			$window.location.href = "https://idptest.queensu.ca/idp/logout.jsp";
		},
		function(){
			console.log("error destroying session");
			$window.location.href = "https://idptest.queensu.ca/idp/logout.jsp";
		});

}