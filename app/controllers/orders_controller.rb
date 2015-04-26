class OrdersController < ApplicationController

  include OrdersHelper

  before_action :get_menu
  before_action :get_order, :only => [:show]

  def index

  end

  def create
    order = current_user.orders.create(:menu => @menu)
    Item.find(params[:items]).each do |item|
      order.order_items.create(:item => item, :quantity => params[:item_quantity][item.id.to_s])
    end
    redirect_to menu_order_path(@menu, order)
  end

  def show

  end
end
