class MenusController < ApplicationController

  include MenusHelper

  before_action :authenticate_user!
  before_filter :authenticate_admin!, :only => [:new, :create, :edit, :publish, :unpublish, :destroy]
  before_action :get_menu, :only => [:publish, :unpublish, :destroy]
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
    @menus = Menu.where("status != #{Menu.statuses["deleted"]}").order(:for_day).page(params[:page]).per(30)
  end

  def show
    @date = parse_date(Menu.id_to_date(params[:id]))
  end

  def edit

  end

  def destroy
    if @menu.published?
      render :json => {:success => false, :error => "Menu is published, please unpublish and then delete."} and return
    end
    @menu.deleted!
    render :json => {:success => true}
  end

  def publish
    @menu.published!
    render :json => {:success => true}
  end

  def unpublish
    @menu.unpublished!
    render :json => {:success => true}
  end

  private

  def menu_params
    params.require(:menu).permit(:for_day, :name, :description)
  end
end
