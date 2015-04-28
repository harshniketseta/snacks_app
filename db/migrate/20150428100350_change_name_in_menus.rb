class ChangeNameInMenus < ActiveRecord::Migration
  def change
    change_column :items, :name, :string, limit: 20
  end
end
