# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

Rails.application.config.assets.precompile += %w( bootstrap/glyphicons-halflings-regular.eot )
Rails.application.config.assets.precompile += %w( bootstrap/glyphicons-halflings-regular.svg )
Rails.application.config.assets.precompile += %w( bootstrap/glyphicons-halflings-regular.ttf )
Rails.application.config.assets.precompile += %w( bootstrap/glyphicons-halflings-regular.woff )
Rails.application.config.assets.precompile += %w( bootstrap/glyphicons-halflings-regular.woff2 )

Rails.application.config.assets.precompile += %w( home.js )
Rails.application.config.assets.precompile += %w( home.css )

Rails.application.config.assets.precompile += %w( menus.js )
Rails.application.config.assets.precompile += %w( menus.css )

Rails.application.config.assets.precompile += %w( items.js )
Rails.application.config.assets.precompile += %w( items.css )