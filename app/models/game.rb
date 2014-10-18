class Game
  attr_reader :id, :stats

  def self.parse(hash)
    stats = hash['stats'].each_with_object({}) do |(k,v), result|
        result[k] = Stat.new(v)
      end
    new(hash['id'], stats)
  end

  def initialize(id, stats = {})
    @id = id
    @stats = stats
  end

  def []=(conn_id, stat)
    stat.game_id = id
    stats[conn_id] = stat
  end

  def [](conn_id)
    stats[conn_id]
  end

  def full?
    stats.length >= 3
  end

  def remove(conn_id)
    stats.delete(conn_id)
  end

  def player_names
    stats.map { |(id, s)| s.player.name }
  end
end
