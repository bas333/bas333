Template.login.events ({
  'click #login-sign' (elt, instance) {
    event.preventDefault();
    var email = instance.$('#signin-email').val();
    var password = instance.$('#signin-password').val();
    Meteor.loginWithPassword(email,password);
    var login = Meteor.users.findOne(Meteor.userId());
    if (login) {
      Router.go("users");
    }
  }
})
