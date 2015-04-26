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

  enum status: [ :unpublished, :published, :orders_placed, :orders_completed, :deleted ]

  validate :custom_uniq, :on => :create
  validates :name, presence: true

  def self.id_to_date(id)
    if id.downcase == "today"
      return "today"
    else
      return id.split("_").join("/")
    end
  end

  private

  def custom_uniq
    if Menu.where(:for_day => self.for_day).where("status != #{Menu.statuses["deleted"]}").exists?
      self.errors.add(:for_day, "specified, a menu is already present")
    end
  end
end
