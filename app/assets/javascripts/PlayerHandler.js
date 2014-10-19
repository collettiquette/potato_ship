var PlayerHandler = function () {

  var dispatcher = ConnectionHandler.dispatcher,
      channel = ConnectionHandler.channel,
      myName = ConnectionHandler.myName;

  var init = function () {
    channel.bind('player_connected', function (data) {
      if (myName == data.new_player_name) {
        game_instance.spawnMyPlayer(ConnectionHandler.myName);

        $.each(data.players, function (index, player) {
          if (myName != player.name) {
            game_instance.spawnRemotePlayer(player.name, player.ship_type);
          }
        });

      } else {
        game_instance.spawnRemotePlayer(data.new_player_name, data.new_player_ship_type);
      }
    });

    channel.bind('player_disconnected', function (data) {
      game_instance.deletePlayer(data.player_name);
    });
  };

  return {
    init: init
  }

}
