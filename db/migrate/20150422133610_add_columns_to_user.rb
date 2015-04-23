class AddColumnsToUser < ActiveRecord::Migration
  def change
    add_column :users, :name, :string, limit: 100
    add_column :users, :provider, :string
    add_column :users, :uid, :string
    add_column :users, :username, :string, limit: 50
    add_column :users, :avatar, :string
  end
end
