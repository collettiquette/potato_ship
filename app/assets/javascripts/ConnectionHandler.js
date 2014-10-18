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
  var dispatcher,
      channel,
      game_instance,
      myName;

  var init = function (game_instance) {
    dispatcher = new WebSocketRails(window.location.hostname + ':3218/websocket');
    channel = dispatcher.subscribe('da_game');
    game_instance = game_instance;

    channel.bind('player_connected', function(data) {
      return false;
      if(myName == data.new_player_name){
        game_instance.spawnMyPlayer(myName);
        
      } else {
        game_instance.spawnRemotePlayer(data.new_player_name);
      }
    });

    dispatcher.on_open = function(data) {
      console.log('Connection has been established: ', data);
      console.log(getCookie('player_name'));
      myName = getCookie('player_name');
      dispatcher.trigger("player_connected", { player_name: myName });
    }

    MessageHandler(dispatcher, channel).init();
  };

  return {
    init: init
  }

}
