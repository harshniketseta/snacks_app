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

  validates :for_day, presence: true, uniqueness: true
  validates :name, presence: true

  def self.id_to_date(id)
    if id.downcase == "today"
      return "today"
    else
      return id.split("_").join("/")
    end
  end
end
