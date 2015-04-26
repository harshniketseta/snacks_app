class AddStatusColumnToMenus < ActiveRecord::Migration
  def change
    add_column :menus, :status, :integer, default: 0
  end
end
