angular
.module('mainApp')
.controller('AppCtrl', AppCtrl)

function AppCtrl($scope, $location, $route, SharedVariableService, ConstantTextSerivce){

//may need to handle back button functionality here espeically on phones

  $scope.userPermision = SharedVariableService.userType;

  SharedVariableService.initialSetup()
    .then(function(userType){
       $scope.userPermision = userType;
    });
  
  //used for keeping active tabs highlighted in nav bar
  $scope.$route = $route;

  //detect user type (ADMIN OR NOT ADMIN)
  
  //retrieve constant text from service from service
  $scope.calendarText = ConstantTextSerivce.NAV_BAR.CALENDAR.NAME;
  
  //retrieve constant text from service
  $scope.searchText = ConstantTextSerivce.NAV_BAR.SEARCH.NAME;

  //retrieve constant text from service
  $scope.myBookingsText = ConstantTextSerivce.NAV_BAR.MY_BOOKINGS.NAME;

  //retrieve constant text from service
  //only display if Admin user
  $scope.AdminText = ConstantTextSerivce.NAV_BAR.ADMIN.NAME;

  //retrieve constant text from service
  //only display if Admin user
  $scope.UserText = ConstantTextSerivce.NAV_BAR.USERS.NAME;
  
  //retrieve constant text from service
  //only display if Admin user
  $scope.KeyText = ConstantTextSerivce.NAV_BAR.KEY_LIST.NAME;

  //retrieve constant text from service
  //only display if Admin user
  $scope.GroupsText = ConstantTextSerivce.NAV_BAR.GROUPS.NAME;

  //retrieve constant text from service
  $scope.SignOutText = ConstantTextSerivce.NAV_BAR.SIGN_OUT.NAME;
  
  

  $scope.confirmInitialLoad = function(){
    if(SharedVariableService.initialLoadComplete == false){
      $location.path("/"); //return to the login page to 
    }
  }

}
