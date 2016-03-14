angular
.module('mainApp')
.controller('KeyListCtrl', KeyLisyCtrl);

function UsersCtrl($scope, $uibModal, AdminUsersService) {
	$scope.pageClass = 'keyList';  //used to change pages in index.php

}