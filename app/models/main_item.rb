class MainItem < Item
  belongs_to :menu
  has_many :sub_items, foreign_key: :parent_item_id, dependent: :destroy
end