# == Schema Information
#
# Table name: stats
#
#  id        :integer          not null, primary key
#  player_id :integer
#  game_id   :integer
#  score     :integer
#  kills     :integer
#  deaths    :integer
#

class Stat < ActiveRecord::Base
  belongs_to :player

  def to_h
    { id:        id,
      player_id: player_id,
      player_name: Player.find(player_id).name,
      game_id:   game_id,
      score:     score,
      kills:     kills,
      deaths:    deaths, }
  end

end
