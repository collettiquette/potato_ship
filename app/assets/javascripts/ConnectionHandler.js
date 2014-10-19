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
  dispatcher: null,
  channel: null,
  myName: null,
  gameID: null,

  init: function () {
    this.dispatcher = new WebSocketRails(window.location.host + '/websocket');
    this.channel = this.dispatcher.subscribe('da_game');

    this.dispatcher.on_open = function(data) {
      ConnectionHandler.myName = getCookie('player_name');
      ConnectionHandler.dispatcher.trigger("join_game",
        {
          player_name: ConnectionHandler.myName
        }, function (response) {
          ConnectionHandler.gameID = response.game_id;
          ConnectionHandler.channel = ConnectionHandler.dispatcher.subscribe('game_' + response.game_id);

          ObstacleHandler().init();
          PlayerHandler(response.player_name).init();
          ShipHandler().init();
          MessageHandler(ConnectionHandler.dispatcher, ConnectionHandler.channel).init();
          ConnectionHandler.dispatcher.trigger('player_connected', response);
        }
      );
    }

  }

}
