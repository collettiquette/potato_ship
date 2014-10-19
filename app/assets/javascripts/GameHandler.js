var GameHandler = function () {
  var init = function () {
    ConnectionHandler.channel.bind('end_game', function (data) {
      console.log('Game over');
      setTimeout(function () {
      	$('#winning').fadeIn(500);
      }, 1000)
    });

  };

  return {
    init: init
  }

}
