var PlayerHandler = function () {
  console.log('New player handler!');

  var dispatcher = ConnectionHandler.dispatcher,
      channel = ConnectionHandler.channel,
      myName = ConnectionHandler.myName;

  var init = function () {
    channel.bind('player_connected', function (data) {
      console.log('player connected');
      dispatcher.trigger('include_obstacles', { game_id: data.game_id });
      if (myName == data.new_player_name) {
        game_instance.spawnMyPlayer(ConnectionHandler.myName);

        $.each(data.players, function (index, name) {
          if (myName != name) {
            game_instance.spawnRemotePlayer(name);
          }
        });

      } else {
        game_instance.spawnRemotePlayer(data.new_player_name);
      }
    });

    channel.bind('player_disconnected', function (data) {
      console.log("Player delete: " + data.player_name);
      game_instance.deletePlayer(data.player_name);
    });
  };

  return {
    init: init
  }

}
