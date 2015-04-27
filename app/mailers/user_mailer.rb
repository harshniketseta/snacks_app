class UserMailer < ApplicationMailer
  default from: "info@#{MAILER_HOST}"

  def orders_allowed(user, menu)
    @menu = menu
    mail(to: user.email, subject: "Place your orders")
  end

  def place_order(user, menu)
    @all_order_items = []
    @all_item_orders = {}
    menu.orders.includes(:order_items).each{ |order|
      @all_order_items += order.order_items.to_a
      order.order_items.each do |order_item|
        @all_item_orders[order_item.item] = @all_item_orders.fetch(order_item.item, 0) + order_item.quantity.to_i
      end
    }
    mail(to: user.email, subject: "Order Summary")
  end
end
