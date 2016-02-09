angular
.module('mainApp')
.controller('AppCtrl', AppCtrl)

function AppCtrl($scope, $location, $route, SharedVariableService){

//may need to handle back button functionality here espeically on phones
  
  //used for keeping active tabs highlighted in nav bar
  $scope.$route = $route;

  //detect user type (ADMIN OR NOT ADMIN)
  
  //retrieve constant text from service from service
  $scope.calendarText = "CALENDAR";
  
  //retrieve constant text from service
  $scope.searchText = "SEARCH";

  //retrieve constant text from service
  $scope.myBookingsText = "MY BOOKINGS";

  //retrieve constant text from service
  //only display if Admin user
  $scope.AdminText = "ADMIN";

  //retrieve constant text from service
  //only display if Admin user
  $scope.UserText = "USERS";

  //retrieve constant text from service
  //only display if Admin user
  $scope.GroupsText = "GROUPS";

  //retrieve constant text from service
  $scope.SignOutText = "SIGN OUT";

  $scope.confirmInitialLoad = function(){
    if(SharedVariableService.initialLoadComplete == false){
      $location.path("/"); //return to the login page to 
    }
  }


  $scope.$watch('userPermision', function(userPermision) {
    if(userPermision == undefined){
      SharedVariableService.userType = "admin";
    }else{
       SharedVariableService.userType = userPermision;      
    }

 });

}
