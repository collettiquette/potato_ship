var GameHandler = function () {
  var init = function () {
    ConnectionHandler.channel.bind('end_game', function (data) {
      console.log('Game over');
    });

  };

  return {
    init: init
  }

}
