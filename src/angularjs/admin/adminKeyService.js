angular
.module('mainApp')
.service('AdminKeyService', AdminKeyService);

function AdminKeyService(CommService, $q){
	var adminKeyService = {};
	
	
	adminKeyService.keyList = function(info) {
		var q = $q.defer();
		CommService.keyList(info)
		.then(function(success){
				q.resolve(success);
			},
			function(err){
				alert("error with KeyList");
				q.reject();
			});
		return q.promise;
	
	}
		
	return adminKeyService;

};