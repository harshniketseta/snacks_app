module MenusHelper

  def get_menu
    begin
      @menu = Menu.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to new_menu_path and return
    end
  end

  def menu_path(menu)
    if menu.for_day.today?
      return "/menus/today"
    else
      return "/menus/#{menu.for_day.strftime("%d_%m_%y")}"
    end
  end
end
