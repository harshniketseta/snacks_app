Rails.application.routes.draw do

  devise_for :users, controllers: { omniauth_callbacks: "omniauth_callbacks" }

  resources :menus do
    member do
      get :publish
      get :unpublish
      get :orders_allowed
      get :orders_completed
    end
    resources :items
    resources :orders
  end

  resources :users do
    member do
      get :make_admin
    end
  end

  root 'home#index'
end
