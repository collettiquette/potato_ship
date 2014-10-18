module Sockets
  class ObstaclesController < Sockets::ApplicationController
    def include_obstacles
      game = games[message[:game_id]]
      obstacles = game.obstacles.map(&:to_h)
      WebsocketRails[:da_game].trigger(:include_obstacles, {
        game_id: game.id,
        obstacles: obstacles
      })
    end
  end
end
