var MessageHandler = function (dispatcher, channel) {

  var dispatcher,
      channel,
      $message_container = $("#message-container ul");

  var init = function () {
    channel.bind('new_message', function(data) {
      $message_container.append("<li class='new'>" + data.message + "</li>");

      setTimeout(function () {
        $message_container.children('li.new').first().removeClass('new').fadeOut(1000, function() {
          $(this).remove();
        });
      }, 5000);
    });
  };

  return {
    init: init
  }

}
