$.FollowToggle = function (el, options) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id") || options.userId;
  this.followState =
      this.$el.data("initial-follow-state") || options.followState;

  var buttonText = (this.followState === "followed" ? "Unfollow!" : "Follow!");
  this.render(buttonText);
  this.$el.on('click', this.handleClick.bind(this));
};

$.FollowToggle.prototype.render = function (buttonText) {
  if (this.followState.slice(-3) === "ing") {
    this.$el.prop("disabled", true);
  } else {
    this.$el.prop("disabled", false);
  };

  this.$el.text(buttonText);
};

$.FollowToggle.prototype.handleClick = function (event) {
  event.preventDefault();

  this.stepState();

  var action = this.$el.closest("form").attr("action");
  var method = (this.followState === "following" ? "post" : "delete");

  $.ajax({
    type: method,
    url: action,
    dataType: "json",
    success: function () {
      this.stepState();
    }.bind(this)
  });
};

$.FollowToggle.prototype.stepState = function () {
  switch (this.followState) {

  case "unfollowed":
    this.followState = "following";
    this.render("Following...");
    break;

  case "following":
    this.followState = "followed";
    this.render("Unfollow!");
    break;

  case "followed":
    this.followState = "unfollowing";
    this.render("Unfollowing...");
    break;

  case "unfollowing":
    this.followState = "unfollowed";
    this.render("Follow!");
    break;
  }
};

$.fn.followToggle = function (options) {
  return this.each(function () {
    new $.FollowToggle(this, options);
  });
};

$(function () {
  $("button.follow-toggle").followToggle();
});