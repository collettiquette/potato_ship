module Sockets
  class PlayersController < RedisConnectionController
    def initialize_session
      puts 'Initializing session'
      redis[:games] = [].to_json
    end

    def player_connected
      player = Player.find(message[:player_id])
      puts "Player connected #{player.name}"
      games = JSON.parse(redis[:games])
      game = find_game(games)
      game << Stat.new(player: player, game_id: game.id)
      games << game
      redis[:games] = games.to_json
      WebsocketRails[:da_game].trigger(:player_connected, { players: game.player_names } )
    end

    def client_disconnected
      puts "Player #{client_id} disconnected"
    end

    private

    def find_game(games)
      game_id = 0
      games.each_with_index do |game_hash, i|
        unless Game.parse(game_hash).full?
          return Game.parse(games.delete_at(i))
        end
        game_id += 1
      end
      Game.new(game_id + 1)
    end
  end
end
