class Game
  attr_reader :id, :stats, :obstacles

  def self.parse(hash)
    stats = hash['stats'].each_with_object({}) do |(k,v), result|
        result[k] = Stat.new(v)
      end
    obstacles = hash['obstacles'].map do |obstacle|
      Obstacle.new(obstacle.symbolize_keys)
    end
    new(hash['id'], stats, obstacles)
  end

  def initialize(id, stats = {}, obstacles = nil)
    @id = id
    @stats = stats
    @obstacles = obstacles || generate_obstacles
  end

  def []=(player_id, stat)
    stat.game_id = id
    stats[player_id] = stat
  end

  def [](player_id)
    stats[player_id]
  end

  def over?
    stats.any? { |s| s.kills >= 10 }
  end

  def full?
    stats.length >= 10
  end

  def remove(player_id)
    stats.delete(player_id)
  end

  def player_names
    stats.map { |(id, s)| s.player.name }
  end

  def generate_obstacles
    (0...25).map do
      Obstacle.generate
    end
  end
end
