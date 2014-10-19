module Sockets
  class ShipsController < Sockets::ApplicationController
    def update_ship
      websocket_channel(message[:game_id]).trigger(:update_ship, message)
    end
  end
end
