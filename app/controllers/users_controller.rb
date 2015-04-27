class UsersController < ApplicationController

  include UsersHelper

  before_filter :authenticate_admin!, :only => [:make_admin]
  before_action :get_user, :only => [:make_admin]

  def index
    @users = User.all.page(params[:page]).per(30)
  end

  def make_admin
    @user.admin = true
    @user.save!
  end
end
