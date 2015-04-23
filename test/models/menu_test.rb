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

require 'test_helper'

class MenuTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
