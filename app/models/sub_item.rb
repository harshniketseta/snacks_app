class SubItem < Item
  belongs_to :item, foreign_key: :parent_item_id
end