class ItemsController < ApplicationController

  include ItemsHelper
  before_action :get_menu

  layout false, only: [:new]


  def new
    item_count = @menu.items.count
    @new_item = @menu.items.create(:name => "Item #{item_count + 1}")
  end

  def create

  end

  def index
    @items = @menu.items
  end

  def update

  end
end
