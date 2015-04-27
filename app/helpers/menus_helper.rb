module MenusHelper

  def get_menu
    begin
      @menu = Menu.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to new_menu_path and return
    end
  end

  def menu_path(menu)
    return menu.path
  end
end
