/**************
  FUNCTIONS
**************/

var renderChat = function() {

  // create our panel
  var panel = $("<div />", {class: "col-md-3 panel panel-primary chatfix"});

  // build up the panel
  
  // heading
  var heading = $("<div />", {class: "panel-heading"});
  heading.append("<h2 class='chathead'>Chat</h2>");  
  heading.appendTo(panel);

  // body
  var body = $("<div />", {class: "panel-body", id: "redditchatcontainer_"});
  var chat = $("<ul />", {class: "chat", id: "redditchat_"})
  chat.appendTo(body);
  body.appendTo(panel);

  // footer
  var footer = $("<div />", {class: "panel-footer"});
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

  // add to main page
  $("body").append(panel)

}

// function to send the msg
var sendMsg = function() {

  var msg = $('#input-redditchat').val();

  if (msg) {

    insto.send({thread: thread}, {msg: msg, username: username}, true)

    $('#input-redditchat').val("")

  }

}

// function to render the msg
var renderMsg = function(data) {

  var chatwindow = $('#redditchat_');

  var li = $("<li />", {class: "left clearfix"});
  
  var body = $("<div />", {class: "chat-body clearfix"});
  body.appendTo(li);

  var header = $("<div />", {class: "header"});
  header.html('<strong class="primary-font">'+data.username+'</strong>');
  header.appendTo(body);

  var text = $("<p />").text(data.msg);
  text.appendTo(body);

  li.appendTo(chatwindow);

  var chatcontainer = $('#redditchatcontainer_');
  var height = chatcontainer[0].scrollHeight;
  chatcontainer.scrollTop(height);

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

if (!username || !thread) {

  console.log("no chat");

}

// otherwise, we want to connect to Insto
// and setup our users etc...

else {

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
    
    // what happens when we connect?
    onConnect: function(data) { 
      renderChat();
    },

    // handle incoming messages
    onNotification: function(data) { 
      renderMsg(data);
    }
    
  });
  

}