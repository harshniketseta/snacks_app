class OrdersController < ApplicationController

  include OrdersHelper

  before_action :get_menu
  before_action :get_order, :only => [:show]
  before_filter :authenticate_admin!, :only => [:index]

  def index
    @all_item_orders = {}
    @menu.orders.includes(:order_items).each{ |order|
      order.order_items.each do |order_item|
        @all_item_orders[order_item.item] = @all_item_orders.fetch(order_item.item, 0) + order_item.quantity.to_i
      end
    }
  end

  def create
    order = current_user.orders.find_or_create_by(:menu => @menu)
    order.items = []
    Item.find(params[:items]).each do |item|
      order.order_items.create(:item => item, :quantity => params[:item_quantity][item.id.to_s])
    end
    redirect_to menu_order_path(@menu, order)
  end

  def show

  end
end
