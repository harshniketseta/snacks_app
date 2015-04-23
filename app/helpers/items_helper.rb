module ItemsHelper

  def get_menu
    begin
      @menu = Menu.find(params[:menu_id])
    rescue ActiveRecord::RecordNotFound
      redirect_to new_menu_path and return
    end
  end
end
