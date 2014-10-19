var ShipHandler = function () {
  var init = function () {
    ConnectionHandler.channel.bind('update_ship', function (data) {
      console.log(data);
      game_instance.updatePlayers(data);
    });

  };

  return {
    init: init
  }

}
