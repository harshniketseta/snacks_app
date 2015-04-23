class CreateMenus < ActiveRecord::Migration
  def change
    create_table :menus do |t|
      t.date :for_day, null: false
      t.string :name, limit: 20, null: false
      t.string :description
      t.integer :created_by_id

      t.timestamps null: false
    end

    add_index :menus, :for_day, unique: true
  end
end
