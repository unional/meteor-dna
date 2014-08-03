/*
 * Datum Network Architecture
 * Copyright(c) 2014, Unional (https://github.com/unional)
 * @license Licensed under the MIT License (https://github.com/unional/unional/LICENSE)).
 * Created by hwong on 8/3/14.
 */

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
