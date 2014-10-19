module Sockets
  class ShipsController < Sockets::ApplicationController
    def update_ship
      game = games.values.find { |g| g[client_id] }
      websocket_channel(game.id).trigger(:update_ship, message)
    end
  end
end
