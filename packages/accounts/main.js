//function prepareDoc(doc) {
//    if (doc.accessRights) {
//        doc.accessRights.push({_id: Meteor.userId(), rights: "w"});
//    } else {
//        doc.accessRights = [
//            {_id: Meteor.userId(), rights: "w"}
//        ];
//    }
//    doc.defaultContextType = doc.defaultContextType || "public";
//    return doc;
//}
//
//var originalInsert = Dna.datums.insert;
//Dna.datums.insert = function (doc, callback) {
//    if (!Meteor.userId()) {
//        throw new Error("You must be logged in to use Dna");
//    }
//
//    prepareDoc(doc);
//    return originalInsert(doc, callback);
//};
//
//var originalUpdate = Dna.datums.update;
//Dna.datums.update = function (doc, callback) {
//    if (!Meteor.userId()) {
//        throw new Error("You must be logged in to use Dna");
//    }
//
//    prepareDoc(doc);
//    return originalUpdate(doc, callback);
//};

if (Meteor.isClient) {
//    Deps.autorun(function () {
//        var userId = Meteor.userId();
//        if (userId) {
//            var sub = Meteor.subscribe("dna.loadSetting", userId);
//            /**
//             * The default group used by the user. This is only available when user logged in.
//             * @type {{_id: string, name: string, members: *[]}}
//             */
//            Dna.groups.defaultGroup = {_id: userId, name: "default", members: [userId]};
//
//            /**
//             * The default access rights used by the user. This is only available when user logged in.
//             * @type {[{_id: string, type: "r|w"}]}
//             */
//            Dna.accessRights.defaultAccessRights = [
//                {_id: userId, type: "w"}
//            ];
//
//            if (sub.ready()) {
//                Session.set("dna.userId", users.findOne({ meteorId: userId}));
//            }
//        }
//    });
}

if (Meteor.isServer) {
//    Accounts.onCreateUser(function (options, user) {
//        var userId = Dna.users.insert({meteorId: user._id});
//        Dna.groups.insert({_id: userId, name: "default", members: [userId]});
//        return user;
//    });
    Meteor.publish("dna.accounts", function (userId) {
        var id = users.findOne({meteorId: userId});
        return [
            users.find({_id: id}),
            self.groups.find({members: id})
        ];
    });
}