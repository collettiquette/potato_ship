module Sockets
  class ShipsController < Sockets::ApplicationController
    def update_ship
      game = games.values.find { |g| g.player_names.include?(message[:player_name]) }
      websocket_channel(game.id).trigger(:update_ship, message)
    end
  end
end
