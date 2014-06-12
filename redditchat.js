// get the user name
var username = $("span.user a").text();

// make sure user is logged in
if (username == "login or register") {
  username = false;
}

// get the subreddit

// user data
var userData = {
  name: username
}

// user query
var userQuery = {
  userType: "example"
}

//connect to insto
var insto = new InstoClient('467c4957eb36428b25745e053c757521', userData, userQuery, {
  
  onConnect: function(data) { console.log(data) },
  onNotification: function(data) { console.log(data) }
  
});

setTimeout(function() {

  insto.broadcast({foo: "bar"});

}, 3000)