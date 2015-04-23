Rails.application.routes.draw do

  devise_for :users, controllers: { omniauth_callbacks: "omniauth_callbacks" }

  resources :menus do
    resources :items
  end

  root 'home#index'
end
