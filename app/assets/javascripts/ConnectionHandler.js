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

    this.dispatcher.on_open = function(data) {
      console.log('Connection has been established: ', data);
      console.log(getCookie('player_name'));
      myName = getCookie('player_name');
      ConnectionHandler.dispatcher.trigger("join_game", { player_name: myName }, function (response) {
        ConnectionHandler.channel = ConnectionHandler.dispatcher.subscribe('game_' + response.game_id);

        ObstacleHandler(ConnectionHandler.dispatcher, ConnectionHandler.channel).init();
        PlayerHandler().init();
        ShipHandler(ConnectionHandler.dispatcher, ConnectionHandler.channel).init();
        MessageHandler(ConnectionHandler.dispatcher, ConnectionHandler.channel).init();

        ConnectionHandler.dispatcher.trigger('player_connected', response)
      });

    }

  }

}
