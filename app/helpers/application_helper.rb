module ApplicationHelper

  def authenticate_admin!
    current_user.is_admin?
  end

  def restrict_access_to_devise_controllers
    redirect_to "/" if devise_controller? && params[:controller] != "omniauth_callbacks"
  end

  def parse_date(date)
    date = date.split(" ").last
    Date.strptime(date, "%d/%m/%Y")
  end

  def unparse_date(date)
    date.strftime("%a").first(2) + " " + date.strftime("%d/%m/%Y")
  end
end
