Dna.Accounts = {};

Object.defineProperty(Dna.Accounts, "currentContext", {
    get: function() {
        return Dna.Accounts._currentContext;
    },
    set: function(value) {
        Dna.Accounts._currentContext = value;
    }
});

//Deps.autorun(function() {
//   var user = Meteor.user();
//    if (user) {
//        user.dna = {
//            _recentContextsId: [],
//            getCurrentContextId: function() {
//                return user.dna._currentContextId;
//            },
//            setCurrentContextId: function(contextId) {
//                if (user.dna._currentContextId) {
//                    user.dna._recentContextsId.push(user.dna._currentContextId);
//                    if (user.dna._recentContextsId.length > Dna.accounts._options.recentContextsLimit) {
//                        user.dna._recentContextsId.splice(0, Dna.accounts._options.recentContextsLimit);
//                    }
//                    user.dna._currentContextId = contextId;
//                }
//            },
//            getRecentContextsId: function() {
//                return user.dna._recentContextsId;
//            }
//        }
//    }
//});