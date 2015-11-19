angular
.module('mainApp')
.service('CalendarService', CalendarService);

function CalendarService($http){
  //$rootScope.url = 'search.php'; // The url of our search

  var calendarService = {};
    
  // The function that will be executed on button click (ng-click="search()")
  calendarService.search = function(keywords) {
    var result = {};
    // Create the http post request
    // the data holds the keywords
    // The request is a JSON request.
    var promisePost = $http.post('search.php', { "data" : keywords})
    .success(function(data, status) {
      return data; // Show result from server in our <pre></pre> element
    })
    .error(function(data, status) {
    	return 'error';
      //$rootScope.data = data || "Request failed";
      //$rootScope.status = status;     
    });

    return promisePost;

  };

  return calendarService;

}