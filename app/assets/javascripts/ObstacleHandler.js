var ObstacleHandler = function () {

  var init = function () {
    ConnectionHandler.channel.bind('include_obstacles', function (data) {
      game_instance.loadObstacles(data);
    });

  };

  return {
    init: init
  }

}
