module OrdersHelper

  def get_menu
    begin
      @menu = Menu.find(params[:menu_id])
    rescue ActiveRecord::RecordNotFound
      redirect_to new_menu_path and return
    end
  end

  def get_order
    begin
      @order = @menu.orders.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to menus_path(@menu) and return
    end
  end

end
