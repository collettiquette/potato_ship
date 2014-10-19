class AddShipType < ActiveRecord::Migration
  def change
    add_column :players, :ship_type, :string, default: 'one'
  end
end
