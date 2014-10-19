var ObstacleHandler = function () {
  console.log('New obstacle handler!');

  var init = function () {
    ConnectionHandler.channel.bind('include_obstacles', function (data) {
      console.log('include obstacles');
      game_instance.loadObstacles(data);
    });

  };

  return {
    init: init
  }

}
