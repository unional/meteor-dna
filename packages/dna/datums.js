/*
 * Datum Network Architecture
 * Copyright(c) 2014, Unional (https://github.com/unional)
 * @license Licensed under the MIT License (https://github.com/unional/unional/LICENSE)).
 * Created by hwong on 4/28/14.
 */

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