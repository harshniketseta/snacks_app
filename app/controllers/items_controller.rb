class ItemsController < ApplicationController

  include ItemsHelper
  before_action :get_menu

  layout false, only: [:new]

  def new
  end

  def create
    @menu.main_items.destroy_all
    item_objects_map = {}
    params[:items][:order].sort_by {|_key, value| value}.reverse.to_h.each do |item_id, parent_item_id|
      item_params = params[:items][item_id]
      if(parent_item_id != "null")
        item_params.merge!({parent_item_id: item_objects_map[parent_item_id].id})
        item_object = @menu.sub_items.create(item_params.permit(:name, :price, :parent_item_id))
      else
        item_object = @menu.main_items.create(item_params.permit(:name, :price))
      end
      item_objects_map[item_id] = item_object
    end

    render :json => {:success => true, :redirect_to => menu_items_path(@menu)}
  end

  def index
    @main_items = @menu.main_items
  end

  def update

  end
end
