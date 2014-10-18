var MessageHandler = function (dispatcher, channel) {
  console.log('New message handler!');

  var dispatcher,
      channel,
      $message_container = $("#message-container");

  var init = function () {
    channel.bind('new_message', function(data) {
      console.log("called here");
      $message_container.append("<li>" + data.message + "</li>");
    });
  };

  return {
    init: init
  }

}
