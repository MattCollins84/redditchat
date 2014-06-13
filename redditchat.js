/**************
  GLOBAL
**************/

var extension_id = chrome.runtime.id;
var _users = {}

/**************
  FUNCTIONS
**************/

var calculateConnectedUsers = function(id, direction) {
  
  if (direction == "out" && id) {
    if (_users[id]) {
      delete _users[id];
    }
  } else if (direction == "in" && id) {
    _users[id] = true;
  }

  return Object.keys(_users).length;
  
}

var getImagePath = function(img) {

  return "chrome-extension://"+extension_id+"/"+img;

}

var minimise = function() {

  $('#redditchat-minimise,#redditchatcontainer_,#redditchatfooter_').addClass("hidden");
  $('#redditchat-maximise').removeClass("hidden");

}

var maximise = function() {

  $('#redditchat-minimise,#redditchatcontainer_,#redditchatfooter_').removeClass("hidden");
  $('#redditchat-maximise').addClass("hidden");

}

var renderChat = function(users) {

  // create our panel
  var panel = $("<div />", {class: "col-md-3 panel panel-primary chatfix"});

  // build up the panel
  
  // heading
  var heading = $("<div />", {class: "panel-heading"});
  var min = $("<button />", {id: "redditchat-minimise", class: "btn btn-default btn-xs pull-right"}).html('<span class="glyphicon glyphicon-chevron-down"></span>');
  min.click(function(e) {
    minimise();
  });
  min.appendTo(heading);
  var max = $("<button />", {id: "redditchat-maximise", class: "btn btn-default btn-xs pull-right"}).html('<span class="glyphicon glyphicon-chevron-up"></span>');
  max.click(function(e) {
    maximise();
  });
  max.appendTo(heading);

  heading.append("<h2 class='chathead'><span class='glyphicon glyphicon-comment'></span> RedditChat (<span id='redditchatusers_'>"+users+"</span> people chatting)</h2>");

  heading.appendTo(panel);

  // body
  var body = $("<div />", {class: "panel-body", id: "redditchatcontainer_"});
  var chat = $("<ul />", {class: "chat", id: "redditchat_"})
  chat.appendTo(body);
  body.appendTo(panel);

  // footer
  var footer = $("<div />", {class: "panel-footer", id: "redditchatfooter_"});
  footer.appendTo(panel);
  var inputgroup = $("<div />", {class: "input-group"});
  inputgroup.appendTo(footer);
  var input = $("<input />", {id: "input-redditchat", type: "text", class: "form-control input-sm", placeholder: "Type your message here..."})
  $(input).keyup(function(e) {
    if (e.keyCode == 13) {
      sendMsg();
    }
  })
  input.appendTo(inputgroup);
  var inputgroupbtn = $("<span />", {class: "input-group-btn"});
  inputgroupbtn.appendTo(inputgroup);
  var btn = $("<button />", {class: "btn btn-warning btn-sm", id: "btn-redditchat"}).text("Send");
  
  $(btn).click(function(e) {
    sendMsg();
  })

  btn.appendTo(inputgroupbtn);

  // only us? then minimise
  if (users == 1) {
    min.addClass("hidden");
    body.addClass("hidden");
    footer.addClass("hidden");
  }

  // otherwise, maximise
  else {
    max.addClass("hidden");
  }

  // add to main page
  $("body").append(panel)

}

// function to send the msg
var sendMsg = function() {

  var msg = $('#input-redditchat').val();

  if (msg) {

    insto.send({thread: thread}, {msg: msg, username: username}, true)

    $('#input-redditchat').val("");

  }

}

// function to render the msg
var renderMsg = function(data) {

  var chatwindow = $('#redditchat_');

  var li = $("<li />", {class: "left clearfix"});
  
  var body = $("<div />", {class: "chat-body clearfix"});
  body.appendTo(li);

  var header = $("<div />", {class: "header"});
  header.html('<strong class="primary-font"><a target="_blank" href="/user/'+data.username+'/">'+data.username+'</a></strong>');
  header.appendTo(body);

  var text = $("<p />").html(urlify(data.msg));
  text.appendTo(body);

  li.appendTo(chatwindow);

  var chatcontainer = $('#redditchatcontainer_');
  var height = chatcontainer[0].scrollHeight;
  chatcontainer.scrollTop(height);

}

function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
      return '<a target="_blank" href="' + url + '">' + url + '</a>';
  })
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

/**************
  LOGIN 'N STUFF
**************/

// get the user name
var username = $("span.user a").text();

// make sure user is logged in
if (username == "login or register") {
  username = false;
}

// get the thread
var thread = (window.location.href.split("/")[6]?window.location.href.split("/")[6]:false);

// if don't have a user
// or we don't have a thread
// then we aren't gonna show the chat window
// but if we do...!

if (username && thread) {

  // user data
  var userData = {
    name: username,
    thread: thread
  }

  // user query
  var userQuery = {
    thread: thread
  }

  //connect to insto
  var insto = new InstoClient('467c4957eb36428b25745e053c757521', userData, userQuery, {
    
    onConnect: function(data) {

      calculateConnectedUsers(data._id, "in");

    },

    // what happens when we connect?
    onConnectedUsers: function(data) { 

      renderChat(data.users.length + 1);

      for (var u in data.users) {
        $('#redditchatusers_').html(calculateConnectedUsers(data.users[u]._id, "in"));
      }     

    },

    // handle incoming messages
    onNotification: function(data) { 
      renderMsg(data);
    },

    onUserConnect: function(data) {

      $('#redditchatusers_').html(calculateConnectedUsers(data._id, "in"));

    },

    onUserDisconnect: function(data) {

      $('#redditchatusers_').html(calculateConnectedUsers(data._id, "out"));

    }
    
  });
  

}