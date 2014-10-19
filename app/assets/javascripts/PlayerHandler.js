var PlayerHandler = function () {

  var dispatcher = ConnectionHandler.dispatcher,
      channel = ConnectionHandler.channel,
      myName = ConnectionHandler.myName;

  var init = function () {
    channel.bind('player_connected', function (data) {
      default_position = { x: 800, y: 600 }
      if (myName == data.new_player_name) {
        game_instance.spawnMyPlayer(ConnectionHandler.myName, data.new_player_position);

        $.each(data.players, function (index, player) {
          if (myName != player.name) {
            game_instance.spawnRemotePlayer(player.name, player.ship_type, default_position);
          }
        });

      } else {
        game_instance.spawnRemotePlayer(data.new_player_name, data.new_player_ship_type, default_position);
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
