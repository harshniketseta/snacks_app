class OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def google_oauth2
    @user = User.find_for_google_oauth2(request.env["omniauth.auth"], current_user)
    errors = @user.errors.full_messages
    if @user.persisted?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Google"
      sign_in_and_redirect @user, :event => :authentication
    elsif errors.present?
      redirect_to root_path, :alert => errors.join("</br>")
    else
      session["devise.google_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end

  def passthru
    if params[:provider] == "google_oauth2"
      redirect_to root_path, :alert => "Google Oauth not configured."
    end
  end
end