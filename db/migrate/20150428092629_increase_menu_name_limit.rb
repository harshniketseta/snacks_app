class IncreaseMenuNameLimit < ActiveRecord::Migration
  def change
    change_column :menus, :name, :string, limit: 100
  end
end
