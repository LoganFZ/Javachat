$(function () {
  const socket = io();

  // obtaining DOM elements from the interface
  const $messageForm = $('#message-form');
  const $messageBox = $('#message');
  const $chat = $('#chat');

  // obtaining DOM elements from the nicknameForm
  const $nickForm = $('#nickForm');
  const $nickError = $('#nickError');
  const $nickname = $('#nickname');

  const $users = $('#usernames');

  $nickForm.submit( e => {
    e.preventDefault();
    socket.emit('new user', $nickname.val(), data => {
      if (data) {
        $("#nickWrap").hide();
        $('#contentWrap').show();
      } else {
        $nickError.html(`
          <div class:"alert alert-danger mx-auto">
            That username already exists.
          </div>
        `);
      }
      $nickname.val('');
    });
  });

  // events
  $messageForm.submit( e => {
    e.preventDefault();
    socket.emit('send message', $messageBox.val(), data => {
      $chat.append(`<p class="error">${data}</p>`)
    });
    $messageBox.val('');
  });

  socket.on('new message', function (data) {
    $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br/>');
  });

  socket.on('usernames', data => {
    let html = ' ';
    for (let i = 0;  i < data.length; i++) {
      html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`
    }
    $users.html(html);
  });

  socket.on('whisper', data => {
    $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`);
  })

  socket.on('load old msgs', msgs => {
    for (let i = 0;  i < msgs.length; i++) {
      displayMsg(msgs[i]);
    }
  })

  function displayMsg(data) {
    $chat.append(`<p class="oldMsgs"><b>${data.nick}:</b> ${data.msg}</p>`);
  }

})
