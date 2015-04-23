class Item < ActiveRecord::Base
  has_many :sub_items, foreign_key: :parent_item_id
  belongs_to :menu
end
