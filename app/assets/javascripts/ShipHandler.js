var ShipHandler = function () {
  console.log('New ship handler!');

  var init = function () {
    ConnectionHandler.channel.bind('update_ship', function (data) {
      console.log('Ship updated!');
      console.log(data);
      game_instance.updatePlayers(data);
    });

  };

  return {
    init: init
  }

}
