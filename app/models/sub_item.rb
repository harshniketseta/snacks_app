class SubItem < Item
  belongs_to :menu
  belongs_to :main_item, foreign_key: :parent_item_id
end