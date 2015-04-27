# == Schema Information
#
# Table name: menus
#
#  id            :integer          not null, primary key
#  for_day       :date
#  name          :string(20)
#  description   :string
#  created_by_id :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class Menu < ActiveRecord::Base
  belongs_to :created_by, class_name: "User"
  has_many :main_items, :dependent => :destroy
  has_many :sub_items
  has_many :orders

  enum status: [ :unpublished, :published, :orders_allowed, :orders_completed, :deleted ]

  validate :custom_uniq, :on => :create
  validates :name, presence: true

  def self.id_to_date(id)
    if id.downcase == "today"
      return "today"
    else
      return id.split("_").join("/")
    end
  end

  def open_orders
    if self.orders_allowed!
      User.all.map{ |user| UserMailer.orders_allowed(user, self).deliver }
      return {:success => true}
    else
      return {:success => false, :errors => @menu.errors.full_messages}
    end
  end

  def orders_done
    if self.orders_completed!
      User.where(:admin => true).map{ |user| UserMailer.place_order(user, self).deliver }
      return {:success => true}
    else
      return {:success => false, :errors => @menu.errors.full_messages}
    end
  end

  def path
    if self.for_day.today?
      return "/menus/today"
    else
      return "/menus/#{self.for_day.strftime("%d_%m_%Y")}"
    end
  end

  private

  def custom_uniq
    if Menu.where(:for_day => self.for_day).where("status != #{Menu.statuses["deleted"]}").where("status != #{Menu.statuses["orders_completed"]}").exists?
      self.errors.add(:for_day, "specified, a menu is already present")
    end
  end
end
