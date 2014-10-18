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
end
