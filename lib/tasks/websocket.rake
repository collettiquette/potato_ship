namespace :websocket_rails do
  desc "Restart websocket server"
  task :restart_server => :environment do
    Rake::Task["websocket_rails:stop_server"].invoke
    Rake::Task["websocket_rails:start_server"].invoke
  end
end
