/**
 * Creates a collection of First Degree Data.
 * @param collectionId
 * @param options
 * @constructor
 * Reference = {_id: id, nameIndex: int, cachedName: string}
 * RelationOperand = "->"|"<->"
 * Relation = {left: [Reference], operand: RelationOperand, right: [Reference]}
 * Datum = {
 *  _id: id,
 *  Contexts: [Reference]
 *  Names: [String]
 *  Relations: [Relation]
 *  Types: [Reference]
 *  Content: String|StringEncodedBinary|ExternalLink
 * }
 * D2 is for browse view and is read only
 * D2 = {
 *  _id: id,
 *
 */
function DnaClass() {
    var self = this;
    this.test = function () {
        return "testing Works"
    };
    var users = new Meteor.Collection("dna_users");

    /**
     * User Group
     * {
     *  _id: id,
     *  name: string,
     *  members: [userId]
     * }
     * @type {Meteor.Collection}
     */
    this.groups = new Meteor.Collection("dna_groups");

    /**
     * Access rights.
     * {
     *  _id: id,
     *  members: [groupId],
     *  rights: "r|w"
     * }
     * @type {Meteor.Collection}
     */
    this.accessRights = new Meteor.Collection("dna_accessRights");

    this.datums = new Meteor.Collection("dna_datums");

    function prepareDoc(doc) {
        if (doc.accessRights) {
            doc.accessRights.push({_id: Meteor.userId(), rights: "w"});
        } else {
            doc.accessRights = [
                {_id: Meteor.userId(), rights: "w"}
            ];
        }
        doc.defaultContextType = doc.defaultContextType || "public";
        doc.contentType = doc.contentType || "markdown";
        return doc;
    }

    var originalInsert = this.datums.insert;
    this.datums.insert = function (doc, callback) {
        if (!Meteor.userId()) {
            throw new Exception("You must be logged in to use Dna");
        }

        doc = prepareDoc(doc);
        return originalInsert(doc, callback);
    };

    var originalUpdate = this.datums.update;
    this.datums.update = function (doc, callback) {
        if (!Meteor.userId()) {
            throw new Exception("You must be logged in to use Dna");
        }

        doc = prepareDoc(doc);
        return originalUpdate(doc, callback);
    };

    this.datums.getReferenceIds = function getReferenceIds(datums) {
        function getRefs(datum) {
            var result = [];
            if (Array.isArray(datum.contexts)) {
                datum.contexts.map(function (item) {
                    result.push(item._id);
                });
            }
            if (Array.isArray(datum.types)) {
                datum.types.map(function (item) {
                    result.push(item._id);
                });
            }
            if (Array.isArray(datum.relations)) {
                datum.relations.map(function (item) {
                    item.left.map(function (i) {
                        result.push(i);
                    });
                    item.right.map(function (i) {
                        result.push(i);
                    });
                });
            }
            return result;
        }

        if (Array.isArray(datums)) {
            var result = [];
            for (var i = 0, len = arguments.length; i < len; i++) {
                var datum = arguments[i];
                result.push(getRefs(datum));
            }
            return result.join();
        }
        else {
            return getRefs(datums);
        }
    };

    this.datums.load = function (datumId) {
        var datum = self.datums.findOne({_id: datumId});
        var referenceIds = self.datums.getReferenceIds(datum);
        return self.datums.find({$or: [
            {_id: datumId},
            {_id: {$in: referenceIds}},
            {$or: [
                {contexts: {$elemMatch: {_id: datumId}}},
                {types: {$elemMatch: {_id: datumId}}},
                {relations: {$elemMatch: {$or: [
                    {left: {$elemMatch: {_id: datumId}}},
                    {right: {$elemMatch: {_id: datumId}}}
                ]}}}
            ]}
        ]});
    };

    this.datums.loadContext = function (contextId) {
        return self.datums.find({$or: [
            {_id: contextId},
            {context: {$elemMatch: {_id: contextId}}}
        ]});
    };

    this.datums.browse = function (datumId) {
        var relatedDatums = self.datums.find({$or: [
            {contexts: {$elemMatch: {_id: datumId}}},
            {types: {$elemMatch: {_id: datumId}}},
            {relations: {$elemMatch: {$or: [
                {left: {$elemMatch: {_id: datumId}}},
                {right: {$elemMatch: {_id: datumId}}}
            ]}}}
        ]});
        var referenceIds = self.datums.getReferenceIds(relatedDatums);
        var relatedIds = referenceIds.join(relatedDatums.map(function (i) {
            return i._id
        }));
        return self.datums.find({$or: [
            {_id: datumId},
            {_id: {$in: relatedIds}}
        ]});
    };

    if (Meteor.isClient) {
        this.subscription = {
            loadContext: function (datumId) {
                return Meteor.subscribe("dna.loadContext", datumId);
            },
            search: function (selector) {
                return Meteor.subscribe("dna.search", selector);
            },
            load: function (datumId) {
                return Meteor.subscribe("dna.load", datumId);
            },
            browse: function (datumId) {
                return Meteor.subscribe("dna.browse", datumId);
            }
        };

        Deps.autorun(function () {
            var userId = Meteor.userId();
            if (userId) {
                var sub = Meteor.subscribe("dna.loadSetting", userId);
                /**
                 * The default group used by the user. This is only available when user logged in.
                 * @type {{_id: string, name: string, members: *[]}}
                 */
                self.groups.defaultGroup = {_id: userId, name: "default", members: [userId]};

                /**
                 * The default access rights used by the user. This is only available when user logged in.
                 * @type {[{_id: string, type: "r|w"}]}
                 */
                self.accessRights.defaultAccessRights = [
                    {_id: userId, type: "w"}
                ];

                if (sub.ready()) {
                    Session.set("dna.userId", users.findOne({ meteorId: userId}));
                }
            }
        });
    }
    if (Meteor.isServer) {
        this.admin = {
            reset: function () {
                users.removeAll();
                self.groups.removeAll();
                self.accessRights.removeAll();
                self.datums.removeAll();
            }
        };
        Meteor.publish("dna.loadSetting", function (userId) {
            var id = users.findOne({meteorId: userId});
            return [
                users.find({_id: id}),
                self.groups.find({members: id})
            ];
        });
        Meteor.publish("dna.loadContext", function (datumId) {
            //TODO: AccessRights check
            return self.datums.loadContext(datumId);
        });
        Meteor.publish("dna.load", function (datumId) {
            //TODO: AccessRights check
            return self.datums.load(datumId);
        });
        Meteor.publish("dna.browse", function (datumId) {
            //TODO: AccessRights check
            return self.datums.browse(datumId);
        });
        Meteor.publish("dna.search", function (selector) {
            //TODO: AccessRights check
            return self.datums.find(selector);
        });

        Accounts.onCreateUser(function (options, user) {
            var userId = self.users.insert({meteorId: user._id});
            self.groups.insert({_id: userId, name: "default", members: [userId]});
            return user;
        });
    }
}

Dna = new DnaClass();
