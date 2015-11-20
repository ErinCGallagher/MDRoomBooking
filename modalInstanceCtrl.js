// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular
.module('mainApp')
.controller('ModalInstanceCtrl', ModalInstanceCtrl);

function ModalInstanceCtrl ($scope, $uibModalInstance, selectedReason, reasons, selectedDuration, durations) {

  $scope.selectedReason = selectedReason;
  $scope.reasons = reasons;
  $scope.selectedDuration = selectedDuration;
  $scope.durations = durations;

//  console.log(selectedReason);

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};