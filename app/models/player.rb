# == Schema Information
#
# Table name: players
#
#  id   :integer          not null, primary key
#  name :string(255)
#

class Player < ActiveRecord::Base
  has_many :stats
  validates_uniqueness_of :name

  def historical_stats
    stats.select("sum(score)  AS score,
                  sum(kills)  AS kills,
                  sum(deaths) AS deaths,
                  player_id").group(:player_id)[0]
  end

  def self.gather_scores
    all.map(&:historical_stats).compact
  end

end
