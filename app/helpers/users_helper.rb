module UsersHelper

  def get_user
    begin
      @user = User.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      redirect_to users_path and return
    end
  end
end
