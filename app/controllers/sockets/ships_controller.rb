module Sockets
  class ShipsController < Sockets::ApplicationController
    def update_ship
      WebsocketRails[:da_game].trigger(:update_ship, message)
    end
  end
end
