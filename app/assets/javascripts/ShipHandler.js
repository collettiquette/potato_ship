var ShipHandler = function () {
  var init = function () {
    ConnectionHandler.channel.bind('update_ship', function (data) {
      game_instance.updatePlayers(data);
    });

    ConnectionHandler.channel.bind('update_health', function (data) {
      game_instance.updateHealth(data);
    });
  };

  return {
    init: init
  }

}
