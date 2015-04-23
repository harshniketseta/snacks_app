class HomeController < ApplicationController

  def index
    if user_signed_in?
      redirect_to "/menus/today"
    end
  end
end
