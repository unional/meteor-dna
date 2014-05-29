//region datums
var datums = new Meteor.Collection("dna.datums");

datums.search = function (searchValue) {
    return datums.find({names: {$regex: ".*" + searchValue + ".*"}});
};

datums.load = function (datumId) {
    var datum = datums.findOne({_id: datumId});
    var referenceIds = getReferenceIds(datum);
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

datums.loadByContext = function (context) {
//    switch (context.viewType) {
//
//    }
    return datums.browse(context.datumId)
};

datums.browse = function (datumId) {
    var relatedDatums = datums.find({$or: [
        {contexts: {$elemMatch: {_id: datumId}}},
        {types: {$elemMatch: {_id: datumId}}},
        {relations: {$elemMatch: {$or: [
            {left: {$elemMatch: {_id: datumId}}},
            {right: {$elemMatch: {_id: datumId}}}
        ]}}}
    ]});
    var referenceIds = getReferenceIds(relatedDatums);
    var relatedIds = referenceIds.join(relatedDatums.map(function (i) {
        return i._id
    }));
    return datums.find({$or: [
        {_id: datumId},
        {_id: {$in: relatedIds}}
    ]});
};

function prepareDoc(doc) {
    doc.contentType = doc.contentType || "markdown";
    return doc;
}

function getReferenceIds(datums) {
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
}


if (Meteor.isClient) {
    _.extend(Dna.subscription, {
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
    });
}
if (Meteor.isServer) {
//    admin = {
//        reset: function () {
//            datums.remove({});
//        }
//    };
    Meteor.publish("dna.loadContext", function (datumId) {
        return datums.loadContext(datumId);
    });
    Meteor.publish("dna.load", function (datumId) {
        return datums.load(datumId);
    });
    Meteor.publish("dna.browse", function (datumId) {
        return datums.browse(datumId);
    });
    Meteor.publish("dna.search", function (searchValue) {
        return datums.search(searchValue);
    });
}

Dna.datums = datums;
//endregion datums

//region Datum
/**
 *
 * @param datum the actual datum data object.
 * @constructor
 * @property {string} _id Identifier
 * @property [string] _names Names of the datum.
 * @property [Reference
 * @property [{_id: int, name: string, nameIndex: int}] _types Types of the datum. "Harry Potter" is a "Fantasy Novel"
 * @property [{_id: int, name: string, nameIndex: int}] _contexts Contexts of the datum. "Albus Dumbledore" is a "Character" in the context of "Harry Potter".
 *
 *
 */
function Datum(datum) {
    this.datum = datum;
}

(function(p) {
    p.is = function(type, nameIndex) {
        // Future: support String and look it up intelligently.
        check(type, Datum);
        check(nameIndex, Match.Optional(Number));

        nameIndex = nameIndex || 0;
        p._types.push({_id: type._id, name: type._names[nameIndex], nameIndex: nameIndex});
    };
}(Datum.prototype));

Datum._transform = function(doc) {
    return new Datum(doc)
};

Datum._addTransform = function(options) {
    return _.extend(options, { transform: Datum._transform })
};
//endregion Datum


//region Datums
Dna.Datums = {};

(function(p) {
    p.create = function(name, typeDatum, callback) {
        var doc = {name: name};
        if (typeDatum && typeof typeDatum === "Datum") {
            doc.type = typeDatum._id;
        }

        var id;
        if (callback && typeof callback === "function") {
            id = Dna.datums.insert(doc, callback);
        }
        else {
            id = Dna.datums.insert(doc);
        }

        return Dna.Datums.findOne(id);
    };

    p.find = function(selector, options) {
        options = options || {};
        Datum._addTransform(options);
        return Dna.datums.find(selector, options);
    };
    p.findOne = function(selector, options) {
        options = options || {};
        Datum._addTransform(options);
        return Dna.datums.findOne(selector, options);
    };
}(Dna.Datums));
//endregion Datums