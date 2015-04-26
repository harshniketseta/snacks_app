class Item < ActiveRecord::Base
  has_many :order_items

  def self.segregate_items(ordered_items)
    main_items, sub_items = [[], []]
    ordered_items.each do |item_number, parent_item_number|
      main_items << item_number if parent_item_number == "null"
      sub_items << item_number if parent_item_number != "null"
    end
    return main_items, sub_items
  end
end
