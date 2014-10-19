module Sockets
  class ShipsController < Sockets::ApplicationController

    def update_ship
      message[:health] = 30 if message[:health] == 0
      websocket_channel(message[:game_id]).trigger(:update_ship, message)
    end

    def fire_bullet
      websocket_channel(message[:game_id]).trigger(:fire_bullet, message)
    end

  end
end
