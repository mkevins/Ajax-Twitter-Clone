$.UsersSearch = function (el) {
  this.$el = $(el);
  this.$input = this.$el.find("input.search-input");
  this.$users = this.$el.find("ul.users");

  this.$input.on("input", this.handleInput.bind(this));
};

$.UsersSearch.prototype.handleInput = function (event) {
  event.preventDefault();
  var action = this.$input.closest("form").attr("action");

  $.ajax({
    type: "get",
    url: action,
    data: this.$input.closest("form").serializeJSON(),
    dataType: "json",
    success: function (data) {
      this.renderResults(data);
    }.bind(this)
  });
};

$.UsersSearch.prototype.renderResults = function (data) {
  console.log(data);
  this.$users.empty();
  for (var i = 0; i < data.length; i++) {
    var user = data[i];
    var $a = $("<a>", {
      href: "/users/" + user.id,
      text: user.username
    });
    var $form = $("<form>", {
      action: "/users/" + user.id + "/follow"
    });
    var $button = $("<button>", {addClass: "follow-toggle"});
    $button.followToggle({
      userId: user.id,
      followState: user.followed ? "followed" : "unfollowed"
    });
    var $li = $("<li>").append($a).append($form.append($button));
    this.$users.append($li);
  }
};

$.fn.usersSearch = function () {
  return this.each(function () {
    new $.UsersSearch(this);
  });
};

$(function () {
  $("div.users-search").usersSearch();
});