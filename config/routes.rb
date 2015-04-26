Rails.application.routes.draw do

  devise_for :users, controllers: { omniauth_callbacks: "omniauth_callbacks" }

  resources :menus do
    member do
      get :publish
      get :unpublish
    end
    resources :items
  end

  root 'home#index'
end
