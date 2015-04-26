class ItemsController < ApplicationController

  include ItemsHelper
  before_action :get_menu
  before_filter :authenticate_admin!, :only => [:new, :create, :index, :destroy]

  layout false, only: [:new]

  def new
  end

  def create
    @menu.main_items.destroy_all
    item_objects_map = {}
    ordered_items = params[:items][:order]
    main_items, sub_items = Item.segregate_items(ordered_items)

    # create main items
    main_items.each do |item_id|
      item_params = params[:items][item_id]
      item_object = @menu.main_items.create(item_params.permit(:name, :price))
      item_objects_map[item_id] = item_object
    end

    # create sub items
    sub_items.each do |item_id|
      parent_item_id = ordered_items[item_id]
      item_params = params[:items][item_id]
      item_params.merge!({parent_item_id: item_objects_map[parent_item_id].id})
      item_object = @menu.sub_items.create(item_params.permit(:name, :price, :parent_item_id))
      item_objects_map[item_id] = item_object
    end

    render :json => {:success => true, :redirect_to => menus_path}
  end

  def index
    @main_items = @menu.main_items
    @item_count = 1
  end
end
