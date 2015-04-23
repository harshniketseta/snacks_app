class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.integer :menu_id
      t.string :type
      t.integer :parent_item_id
      t.string :name, limit: 30
      t.integer :price

      t.timestamps null: false
    end
  end
end
