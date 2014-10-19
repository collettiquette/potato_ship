module Sockets
  class PlayersController < Sockets::ApplicationController
    def initialize_session
      puts 'Initializing session'
    end

    def player_connected
      player_name = CGI::parse(message[:player_name]).keys.first
      player = Player.find_by(name: player_name)
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
      games.each do |game_id, game|
        stat = game.remove(client_id)

        if stat
          player = stat.player

          WebsocketRails[:da_game].trigger(:player_disconnected, { player_name: player.name })
          WebsocketRails[:da_game].trigger(:new_message, { message: "#{player.name} left game." })
          puts "Player #{player.name} - #{client_id} disconnected"

          break game
        end
      end
      store_games

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
