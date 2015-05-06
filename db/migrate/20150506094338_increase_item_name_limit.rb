class IncreaseItemNameLimit < ActiveRecord::Migration
  def change
    change_column :items, :name, :string, limit: 100
  end
end
