var GameHandler = function () {
  var init = function () {
    ConnectionHandler.channel.bind('end_game', function (data) {
      console.log('Game over');
      $('#winning').fadeIn(500);
    });

  };

  return {
    init: init
  }

}
