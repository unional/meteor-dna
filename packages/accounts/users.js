var users = new Meteor.Collection("dna.users");

Dna.users = users;


function User(userData) {
    this.userData = userData;
}

(function(p) {
})(User.prototype);