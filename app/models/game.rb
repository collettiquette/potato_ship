class Game
  attr_reader :id, :stats, :obstacles

  def self.parse(hash)
    stats = hash['stats'].each_with_object({}) do |(k,v), result|
        unless v["player_id"].blank? || v["game_id"].blank?
          result[k] = Stat.where(player_id: v["player_id"], game_id: v["game_id"]).first_or_create
        end
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
    stats.length >= 5
  end

  def remove(player_id)
    stats.delete(player_id)
  end

  def player_names
    stats.map { |(_, s)| s.player.name }.compact
  end

  def players
    stats.map { |(_, s)| s.player }.compact
  end

  def generate_obstacles
    (0...25).map do
      Obstacle.generate
    end
  end
end
