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
end
