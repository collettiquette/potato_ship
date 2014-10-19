var ShipHandler = function () {
  var init = function () {
    ConnectionHandler.channel.bind('update_ship', function (data) {
      game_instance.updatePlayers(data);
    });

    ConnectionHandler.channel.bind('fire_bullet', function (data) {
      game_instance.fireRemoteBullet(data);
    });

  };

  return {
    init: init
  }

}
