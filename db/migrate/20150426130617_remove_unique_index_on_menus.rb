class RemoveUniqueIndexOnMenus < ActiveRecord::Migration
  def change
    remove_index :menus, :for_day
  end
end
