class MenusController < ApplicationController

  include MenusHelper

  before_action :authenticate_user!
  before_filter :authenticate_admin!, :only => [:new, :create, :edit, :publish, :unpublish, :orders_allowed, :orders_completed, :destroy]
  before_action :get_menu, :only => [:edit, :update, :publish, :unpublish, :orders_allowed, :orders_completed, :destroy]

  def new
    if params[:menu].present?
      @menu = Menu.new(params[:menu].present? ? menu_params : {})
      @already_existing_menu = Menu.find_by_for_day(parse_date(menu_params[:for_day]))
    else
      @menu = Menu.new
    end
  end

  def create
    menu = Menu.create(menu_params)
    menu.created_by = current_user
    if menu.save
      redirect_to menu_items_path(menu)
    else
      redirect_to "#{new_menu_path}?#{{menu: menu_params}.to_query}", :alert => menu.errors.full_messages
    end
  end

  def index
    @menus = Menu.where("status != #{Menu.statuses["deleted"]}")
    unless current_user.is_admin?
      @menus = @menus.where(:status => [Menu.statuses["published"], Menu.statuses["orders_allowed"]])
    end
    @menus = @menus.order(:for_day).page(params[:page]).per(30)
  end

  def show
    @date = parse_date(Menu.id_to_date(params[:id]))
    @menu = Menu.where(:for_day => @date).where(:status => [Menu.statuses["published"], Menu.statuses["orders_allowed"]]).first
    flash.now.alert = "This menu is not accepting orders at the moment." if @menu.published?
  end

  def edit

  end

  def update
    if @menu.update(menu_params)
      redirect_to menu_items_path(@menu)
    else
      redirect_to edit_menu_path(@menu), :alert => menu.errors.full_messages
    end
  end

  def destroy
    if @menu.published?
      render :json => {:success => false, :error => "Menu is published, please unpublish and then delete."} and return
    end
    if @menu.orders_allowed?
      render :json => {:success => false, :error => "Users are already allowed to order said menu, please unpublish and then delete."} and return
    end
    if @menu.orders_completed?
      render :json => {:success => false, :error => "Users are already allowed to order said menu, please unpublish and then delete."} and return
    end
    render :json => {:success => @menu.deleted!}
  end

  def publish
    render :json => {:success => @menu.published!}
  end

  def unpublish
    render :json => {:success => @menu.unpublished!}
  end

  def orders_allowed
    render :json => {:success => @menu.orders_allowed!}
  end

  def orders_completed
    render :json => {:success => @menu.orders_completed!}
  end

  private

  def menu_params
    params.require(:menu).permit(:for_day, :name, :description)
  end
end
