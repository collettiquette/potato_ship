module Sockets
  class ShipsController < Sockets::ApplicationController

    def update_ship
      websocket_channel(message[:game_id]).trigger(:update_ship, message)
    end

    def fire_bullet
      websocket_channel(message[:game_id]).trigger(:fire_bullet, message)
    end

  end
end
