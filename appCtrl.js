angular
.module('mainApp')
.controller('AppCtrl', AppCtrl)

function AppCtrl($scope, $location, $route){

//may need to handle back button functionality here espeically on phones
  
  //used for keeping active tabs highlighted in nav bar
  $scope.$route = $route;

  //detect user type (ADMIN OR NOT ADMIN)
  
  //retrieve constant text from service from service
  $scope.calendarText = function(){
      return "Calendar";
  }
  
  //retrieve constant text from service
  $scope.searchText = function(){
      return "Search";
  }

  //retrieve constant text from service
  $scope.myBookingsText = function(){
      return "My Bookings";
  }

  //retrieve constant text from service
  //only display if Admin user
  $scope.AdminText = function(){
      return "Admin";
  }

  //retrieve constant text from service
  //only display if Admin user
  $scope.UserText = function(){
      return "User";
  }

  //retrieve constant text from service
  //only display if Admin user
  $scope.GroupsText = function(){
      return "Groups";
  }

  //retrieve constant text from service
  $scope.OtherText = function(){
      return "Other";
  }

}
