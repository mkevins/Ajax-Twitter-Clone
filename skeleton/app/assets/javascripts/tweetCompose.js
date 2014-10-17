$.TweetCompose = function (el) {
  this.$el = $(el);
  this.$formEls = this.$el.find("textarea, select");
  this.$charsLeft = this.$el.find('.chars-left');

  this.$el.on("submit", this.submit.bind(this));
  this.$el.find("textarea").on('input', this.updateCharsLeft.bind(this));
}

$.TweetCompose.prototype.submit = function (event) {
  event.preventDefault();

  var action = this.$el.attr("action");

  $.ajax({
    type: "post",
    url: action,
    data: this.$el.serializeJSON(),
    dataType: "json",
    success: function (data) {
      this.handleSuccess(data);
    }.bind(this)
  });

  this.$formEls.prop("disabled", true);
};

$.TweetCompose.prototype.handleSuccess = function (data) {
  this.clearInput();
  this.$formEls.prop("disabled", false);

  var $li = $("<li>", { text: JSON.stringify(data) });
  $(this.$el.data("feed-ul")).prepend($li);
};

$.TweetCompose.prototype.clearInput = function () {
  this.$el.find("textarea").val("");
  this.$charsLeft.text(140);
  this.$el.find("select").children().prop("selected", false);
  this.$el.find("select").children().eq(0).prop("selected", true);
};

$.TweetCompose.prototype.updateCharsLeft = function (event) {
  var charsLeft = 140 - this.$el.find('textarea').val().length;
  this.$charsLeft.text(charsLeft);
};

$.fn.tweetCompose = function () {
  return this.each(function () {
    return new $.TweetCompose(this);
  });
};

$(function () {
  $(".tweet-compose").tweetCompose();
});