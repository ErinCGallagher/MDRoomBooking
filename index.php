<!DOCTYPE html>

<html>
    <head>
        <link rel="stylesheet" href="bower_components/fullcalendar/dist/fullcalendar.css"/>
        
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="src/html_css/stylesheet.css"/>
        <link rel="stylesheet" href="src/html_css/calendar.css"/>
        <link rel="stylesheet" href="src/html_css/groups.css"/>
        <link rel="stylesheet" href="src/html_css/search.css"/>
        <link rel="stylesheet" href="src/html_css/myBookings.css"/>
        <link rel="stylesheet" href="src/html_css/users.css"/>
         <link rel="stylesheet" href="src/html_css/keyList.css"/>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- jquery, moment, and angular have to get included before fullcalendar -->
        <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="bower_components/moment/min/moment.min.js"></script>
        <script type="text/javascript" src="bower_components/angular/angular.js"></script>
        <script type="text/javascript" src="bower_components/angular-ui-calendar/src/calendar.js"></script>
        <script type="text/javascript" src="bower_components/fullcalendar/dist/fullcalendar.min.js"></script>
        <script type="text/javascript" src="bower_components/fullcalendar/dist/gcal.js"></script>

        <!-- angular scripts, must ramin in this order -->
        <script type="text/javascript" src="src/angularjs/mainApp.js"></script>
        <script type="text/javascript" src="src/angularjs/angular-route.js"></script> 


        <!-- Controllers --> 
        <script type="text/javascript" src="src/angularjs/appCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/calendarCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/searchCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/admin/groupsCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/admin/usersCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/loginCtrl.js"></script>
        
        <script type="text/javascript" src="src/angularjs/signOutCtrl.js"></script>
        

        <!-- Modal Controllers-->
        <script type="text/javascript" src="src/angularjs/bookings/myBookingsCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/makeBookingPopupCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/viewBookingPopupCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/bookingConfirmationPopupCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/recurringBookingConfirmationPopupCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/confirmCancelCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/confirmationPopupCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/admin/keyListCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/admin/viewUsersPopupCtrl.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/confirmCancelAllRecurCtrl.js"></script>

        <!-- Services -->
        <script type="text/javascript" src="src/angularjs/commService.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/bookingsService.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/bookingsCommService.js"></script>
        <script type="text/javascript" src="src/angularjs/admin/adminCommService.js"></script>
        <script type="text/javascript" src="src/angularjs/admin/adminGroupsService.js"></script>
        <script type="text/javascript" src="src/angularjs/admin/adminUsersService.js"></script>
        <script type="text/javascript" src="src/angularjs/sharedVariableService.js"></script>
        <script type="text/javascript" src="src/angularjs/admin/userCommService.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/searchService.js"></script>
        <script type="text/javascript" src="src/angularjs/bookings/myBookingsService.js"></script>
        <script type="text/javascript" src="src/angularjs/confirmationPopupService.js"></script>
        <script type="text/javascript" src="src/angularjs/admin/adminKeyService.js"></script>
        <script type="text/javascript" src="src/angularjs/constantTextService.js"></script>


        <!-- Bootstrap/Modal Stuff -->
        <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css" >
        <script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="bower_components/ui-bootstrap-tpls-0.14.3.min.js"></script>

       <!--<base href="/MDRoomBooking/"> -->

        <title>Room Booking System</title>

    </head>

    <body ng-app="mainApp" ng-controller="AppCtrl">

    <!-- https://github.com/IronSummitMedia/startbootstrap-agency -->

<nav class="navbar navbar-default navbar-centered" ng-if="$route.current.activetab != null">
            <div class="navbar-header page-scroll">
                <button type"button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
            </div>      
            
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li ng-class="{ active: $route.current.activetab == 'calendar'}">
                        <a href="#/calendar" ng-click="confirmInitialLoad()">{{calendarText}}</a>
                    </li>
                    <li ng-class="{ active: $route.current.activetab == 'search'}">
                        <a href="#/search">{{searchText}}</a>
                    </li>
                    <li ng-class="{ active: $route.current.activetab == 'my-bookings'}" ng-show="userPermision != 'nonbooking'">
                        <a href="#/my-bookings">{{myBookingsText}}</a>
                    </li>
                    <li class="dropdown" ng-class="{ active: $route.current.activetab == 'admin'}" ng-show="userPermision == 'admin'">
                      <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{AdminText}} <span class="caret"></span></a>
                      <ul class="dropdown-menu" >
                        <li ng-class="{ active: $route.current.activesubtab == 'user'}"><a href="#/admin/user">{{UserText}}</a></li>
                        <li ng-class="{ active: $route.current.activesubtab == 'groups'}"><a href="#/admin/groups">{{GroupsText}}</a></li>
                        <li ng-class="{ active: $route.current.activesubtab == 'keyList'}"><a href="#/admin/keyList">{{KeyText}}</a></li>
                      </ul>
                    </li>
                    <li ng-class="{ active: $route.current.activetab == 'other'}">
                        <a href="#/signOut">{{SignOutText}}</a>
                    </li>
                </ul>
            </div>

            <!-- /.navbar-collapse -->

      
    </nav>

    <!-- page that appears under navigation bar -->    
            <!--each controller applies a different class here-->
            <div class = "page {{pageClass}}" ng-view></div> 
    </body>
</html>
