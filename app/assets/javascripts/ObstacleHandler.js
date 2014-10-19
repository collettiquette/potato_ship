var ObstacleHandler = function () {

  var init = function () {
    ConnectionHandler.dispatcher.bind('include_obstacles', function (data) {
      game_instance.loadObstacles(data);
    });

  };

  return {
    init: init
  }

}
