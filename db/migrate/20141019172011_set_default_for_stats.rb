class SetDefaultForStats < ActiveRecord::Migration
  def change
    change_column :stats, :score, :integer, :default => 0
    change_column :stats, :kills, :integer, :default => 0
    change_column :stats, :deaths, :integer, :default => 0
  end
end
