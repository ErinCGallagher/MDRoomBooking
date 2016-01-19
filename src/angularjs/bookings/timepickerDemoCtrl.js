angular.module('mainApp')
.controller('TimepickerDemoCtrl', function ($scope, $log, MakeBookingPopupCtrl) {
  
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1],
    mstep: [30]
  };

  $scope.ismeridian = true;

  var x = MakeBookingPopupCtrl.$scope.startTime;
  console.log(x);


});