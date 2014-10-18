class Game
  attr_reader :id, :stats

  def self.parse(hash)
    stats = hash['stats'].map do |s|
      Stat.new(s)
    end
    new(hash['id'], stats)
  end

  def initialize(id, stats = [])
    @id = id
    @stats = stats
  end

  def <<(stat)
    stat.game_id = id
    stats << stat
  end

  def full?
    stats.length >= 3
  end

  def player_names
    stats.map { |s| s.player.name }
  end
end
