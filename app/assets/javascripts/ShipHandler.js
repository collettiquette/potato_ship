var ShipHandler = function (dispatcher, channel) {
  console.log('New ship handler!');

  var init = function () {
    ConnectionHandler.channel.bind('update_ship', function (data) {
      console.log('Ship updated!');
      console.log(data);
    });

  };

  return {
    init: init
  }

}
