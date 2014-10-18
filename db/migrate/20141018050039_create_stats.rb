class CreateStats < ActiveRecord::Migration
  def change
    create_table :stats do |t|
      t.belongs_to :player

      t.integer :player_id
      t.integer :game_id
      t.integer :score
      t.integer :kills
      t.integer :deaths
    end
  end
end
