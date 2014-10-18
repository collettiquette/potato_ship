module Sockets
  class PlayersController < Sockets::ApplicationController
    def initialize_session
      puts 'Initializing session'
    end

    def player_connected
      player = Player.find_by(name: message[:player_name])
      puts "Player connected #{player.name}"
      game = find_game
      game[client_id] = Stat.new(player: player, game_id: game.id)
      games[game.id] = game
      store_games
      WebsocketRails[:da_game].trigger(:player_connected, {
        players: game.player_names,
        new_player_name: player.name,
        game_id: game.id
      })

      WebsocketRails[:da_game].trigger(:new_message, {
        message: "#{player.name} joined game."
      })
    end

    def client_disconnected
      puts "Player #{client_id} disconnected"
      games.each do |game_id, game|
        if game.remove(client_id)
          break game
        end
      end
      store_games
      puts "#{client_id} removed"
    end

    private

    def find_game
      games.each do |game_id, game|
        unless game.full?
          return games.delete(game_id)
        end
      end
      Game.new((games.keys.max || 0) + 1)
    end
  end
end
