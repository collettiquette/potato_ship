module Sockets
  class ShipsController < Sockets::ApplicationController

    def update_ship
      websocket_channel(find_game.id).trigger(:update_ship, message)
    end

    def update_health
      websocket_channel(find_game.id).trigger(:update_health, message)
    end

    private

    def find_game
      games.values.find { |g| g[client_id] }
    end

  end
end
