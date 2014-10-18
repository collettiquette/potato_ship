function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

var ConnectionHandler = {
  //console.log('New connection!');
  dispatcher: null,
  channel: null,
  myName: null,

  init: function () {
    this.dispatcher = new WebSocketRails(window.location.host + '/websocket');
    this.channel = this.dispatcher.subscribe('da_game');

    this.channel.bind('player_connected', function(data) {
      console.log('player connected');
      ConnectionHandler.dispatcher.trigger('include_obstacles', { game_id: data.game_id });
      if(myName == data.new_player_name){
        game_instance.spawnMyPlayer(this.myName);

        $.each(data.players, function(index, name) {
          if(myName != name){
            game_instance.spawnRemotePlayer(name);
          }
        });

      } else {
        game_instance.spawnRemotePlayer(data.new_player_name);
      }
    });

    this.channel.bind('player_disconnected', function(data) {
      console.log("Player delete: " + data.player_name);
      game_instance.deletePlayer(data.player_name);
    });

    this.channel.bind('include_obstacles', function (data) {
      console.log('include obstacles');
      game_instance.loadObstacles(data);
    });

    this.channel.bind('update_ship', function (data) {
      console.log('Ship updated!');
      console.log(data);
    })

    this.dispatcher.on_open = function(data) {
      console.log('Connection has been established: ', data);
      console.log(getCookie('player_name'));
      myName = getCookie('player_name');
      this.trigger("player_connected", { player_name: myName });
    }

    MessageHandler(this.dispatcher, this.channel).init();
  }

}
