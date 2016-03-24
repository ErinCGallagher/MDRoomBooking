angular
.module('mainApp')
.constant('ConstantTextSerivce', {

	//this service stores all the contants text used throughout the app
	LOGIN : {
		INVALID_INITIAL_LOAD : 		{NAME : "could not retrieve all initial setup information" },
	},
	CALENDAR : {
		BUILDING_SELECTION : 		{NAME : "Select A Building" },
	},
	NAV_BAR : {
		CALENDAR : 		{NAME : "CALENDAR" },
		SEARCH : 		{NAME : "SEARCH" },
		MY_BOOKINGS : 	{NAME : "MY BOOKINGS" },
		ADMIN : 		{NAME : "ADMIN" },
		USERS : 		{NAME : "USERS" },
		GROUPS : 		{NAME : "GROUPS" },
		KEY_LIST : 		{NAME : "KEY LIST" },
		SIGN_OUT : 		{NAME : "SIGN OUT" },
	},
	SEARCH : {
		DATE_SELECTION : 	{NAME : "Date" },
		BUILDING_SELECTION :{NAME : "Building" },
		TIME_SELECTION : 	{NAME : "Time" },
		TIME_BETWEEN : 		{NAME : "To" },
		SEARCH_BUTTON : 	{NAME : "Search" },
		SEARCH_EXPLA : 		{NAME: "Search for Available Rooms"},
		NO_RESULTS : 		{NAME: "Your search returned no results."},
		
	},
	MY_BOOKINGS : {
		USER_INFO : 		{NAME : "User Information" },
		NAME : 				{NAME : "Name:" },
		EMAIL : 			{NAME : "Email:" },
		HOURS_REMAIN : 		{NAME : " Hours Remaining This Week: " },
		DATE : 				{NAME : "Date" },
		TIME : 				{NAME: "Time"},
		BUILDING : 			{NAME: "Building"},
		ROOM_NUM : 			{NAME: "Room Number"},
		KEY_REQ : 			{NAME: "Key Required"},
		REASON : 			{NAME: "Reason"},
		CLICK_CANCEL : 		{NAME: "Click to Cancel"},
		MY_BOOKINGS : 		{NAME: "My Bookings"},
		MY_REC_BOOKINGS : 	{NAME: "My Recurring Bookings"},
		REC_INFO : 			{NAME: "Click Row To Expand Recurring Bookings"},
		DAY_WEEK : 			{NAME: "Day of the Week"},
		BOOKINGS_REMAIN : 	{NAME: "Bookings Remaining"},	
	},
	USERS : {
		UPLOAD_MUSIC : 		{NAME : "Upload Music List" },
		UPLOAD_DRAMA : 		{NAME : "Upload Drama List" },
		DOWNLOAD_MUSIC : 	{NAME : "Download Music Users" },
		DOWNLOAD_DRAMA : 	{NAME : "Download Drama Users" },
		USER_SEARCH_TITLE : {NAME : "Search For A User" },
		SEARCH_NETID : 		{NAME: "Enter NetID"},
		SEARCH_BUTTON : 	{NAME: "Search"},
		NETID : 			{NAME: "NetID"},
		NETID_NOT_FOUND : 	{NAME: "Not Found"},
		NETID_SARCH_RESULT :{NAME: "User Search For NetID"},
		NAME : 				{NAME: "Name:"},
		WEEKLY_HRS_REMAIN : {NAME: "Remaining Weekly Hours"},
		THIS_WEEK : 		{NAME: "This"},
		NEXT_WEEK : 		{NAME: "Next"},
		WEEK : 				{NAME: "Week:"},
		GROUPS : 			{NAME: "'s Groups"},
		GROUP_NAME : 		{NAME: "Group Name"},
		HOURS_TYPE : 		{NAME: "Hours Type"},
		HOURS_GIVEN : 		{NAME: "Hours Given"},
		SPEC_HRS_REMAIN : 	{NAME: "Special Hours Remaining"},
		START_DATE : 		{NAME: "Start Date"},
		END_DATE : 			{NAME: "End Date"},
		DURATION_RESTRICT : {NAME: "Has Duration Restriction"},
		
	},

});
