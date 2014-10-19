var GameHandler = function () {
  var init = function () {
    ConnectionHandler.channel.bind('end_game', function (data) {
      $('#winning').fadeIn(500);
      ConnectionHandler.distpatcher.trigger('remove_game', data);
    });

  };

  return {
    init: init
  }

}
