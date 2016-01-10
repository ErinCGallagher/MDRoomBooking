angular
.module('mainApp')
.controller('AppCtrl', AppCtrl)

function AppCtrl($scope, $location, $route){

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
  $scope.UserText = "User";

  //retrieve constant text from service
  //only display if Admin user
  $scope.GroupsText = "GROUPS";

  //retrieve constant text from service
  $scope.OtherText = "OTHER";

}
