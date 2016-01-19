
describe('Navigation bar', function() {

  it('Click calendar and be directed to that page', function() {
    browser.get('http://localhost/MDRoomBooking/#/calendar');

    element(by.id('calendar-nav')).click();

    expect(element(by.css('.date-text')).getText()).
        toEqual('Jan 10, 2016 - Jan 17, 2016'); // This is wrong!
  });

  it('Click search and be directed to that page', function(){
  	browser.get('http://localhost/MDRoomBooking/#/calendar');

    element(by.id('search-nav')).click();

    expect(element(by.id('search-title')).getText()).
        toEqual('Search page'); // This is wrong!
  });

    it('Click my bookings and be directed to that page', function(){
  	browser.get('http://localhost/MDRoomBooking/#/calendar');


    element(by.id('myBookings-nav')).click();

    expect(element(by.id('myBookings-title')).getText()).
        toEqual('myBookings page'); // This is wrong!
  });

    it('Click users and be directed to that page', function(){
  	browser.get('http://localhost/MDRoomBooking/#/calendar');

  	element(by.id('admin-nav')).click();
    element(by.id('user-nav')).click();

    expect(element(by.id('user-title')).getText()).
        toEqual('Users page'); // This is wrong!
  });
	
	it('Click groups and be directed to that page', function(){
  	browser.get('http://localhost/MDRoomBooking/#/calendar');

  	element(by.id('admin-nav')).click();
    element(by.id('groups-nav')).click();

    expect(element(by.css('.title')).getText()).
        toEqual('User Groups'); // This is wrong!
  });

});