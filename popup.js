/*$(document).ready(function() {

  var disabled = {};

  chrome.storage.sync.get({
    subreddits: {}
  }, function(items) {
    console.log("loaded subreddits");
    console.log(items.subreddits);
    disabled = items.subreddits;
    renderDisabled();
  });

  $('#btn-save').click(function(e) {

    var name = $('#subreddit').val();

    if (name) {

      disabled[name] = true

      chrome.storage.sync.set({
        subreddits: disabled
      }, function() {
        console.log('saved');
        renderDisabled();
      });

    }  

  });

  var renderDisabled = function() {

    $('ul#subreddits').html("");

    for (var d in disabled) {
      var li = $("<li />", {class: "list-group-item"}).text(d);
      var icon = $("<i />", {class: "glyphicon glyphicon-minus pull-right link", "data-del": d})
      $(icon).click(function(e) {
        delete disabled[d];
        chrome.storage.sync.set({
          subreddits: disabled
        }, function() {
          console.log('saved');
          renderDisabled();
        });
      });
      icon.appendTo(li);
      $('ul#subreddits').append(li);
    }

  }

});*/