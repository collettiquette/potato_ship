module Sockets
  class PlayersController < WebsocketRails::BaseController
    def initialize_session
      puts 'Session initialized'
    end

    def player_connected
      puts "Player connected #{message[:connection_id]}"
      WebsocketRails[:da_game].trigger(:player_connected, { message: "hello there" } )
    end

    def client_disconnected
      puts "Player #{client_id} disconnected"
    end
  end
end
