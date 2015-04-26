# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :inet
#  last_sign_in_ip        :inet
#  name                   :string(100)
#  provider               :string
#  uid                    :string
#  username               :string(50)
#  avatar                 :string
#  admin                  :boolean          default(FALSE)
#

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauth_providers => [:google_oauth2]

  has_many :menus, :foreign_key => :created_by_id

  def self.find_for_google_oauth2(access_token, signed_in_resource=nil)

    hosting_domain = access_token.extra.raw_info.hd rescue ""
    username = access_token.info.email.split("@").first
    unless hosting_domain == "idyllic-software.com"
      user = User.new()
      user.errors.add(:base, "You are not part of mavericks. Try when you reach that level.")
      return user
    end
    data = access_token.info
    user = User.where(:provider => access_token.provider, :uid => access_token.uid ).first
    if user
      return user
    else
      registered_user = User.where(:email => access_token.info.email).first
      if registered_user
        return registered_user
      else
        user = User.create(name: data["name"],
                           provider:access_token.provider,
                           email: data["email"],
                           uid: access_token.uid ,
                           password: Devise.friendly_token[0,20],
                           username: username,
                           avatar: access_token.info.image
        )
      end
    end
  end

  def is_admin?
    return self.admin
  end
end
