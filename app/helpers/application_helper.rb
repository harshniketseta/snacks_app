module ApplicationHelper

  def authenticate_admin!
    unless current_user.is_admin?
      if request.xhr?
        render :json => {:success => false, :errors => ["You have only wada pav access."]}
      else
        redirect_to :back, alert: "No cookie for you!!"
      end
    end
  end

  def restrict_access_to_devise_controllers
    if params[:controller] == "devise/sessions" && params[:action] == "destroy"
      return
    end
    if params[:controller] == "omniauth_callbacks"
      return
    end
    redirect_to "/" if devise_controller?
  end

  def parse_date(date)
    return Date.today if date == "today"
    date = date.split(" ").last
    Date.strptime(date, "%d/%m/%Y")
  end

  def unparse_date(date)
    date.strftime("%a").first(2) + " " + date.strftime("%d/%m/%Y")
  end

  def no_cache
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end
end
