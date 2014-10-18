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

var ConnectionHandler = function () {
  console.log('New connection!');
  var dispatcher;
  var channel;


  var init = function () {
    dispatcher = new WebSocketRails(window.location.hostname + ':3218/websocket');
    channel = dispatcher.subscribe('da_game');

    channel.bind('player_connected', function(data) {
      $.each(data.players, function(index, player) {
        console.log(player);
      });

      dispatcher.trigger("new_message", {game_id: "da_game", message: data.new_player_name + " joined game."})
    });

    dispatcher.on_open = function(data) {
      console.log('Connection has been established: ', data);
      console.log(getCookie('player_id'));
      dispatcher.trigger("player_connected", { player_id: getCookie('player_id') });
    }

    MessageHandler(dispatcher, channel).init();
  };

  return {
    init: init
  }

}
