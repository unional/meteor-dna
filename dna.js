Dna = { subscription: {}};

//Dna.getReference = function(doc, nameIndex) {
//    nameIndex = nameIndex || 0;
//    return {
//        _id: doc._id,
//        name: doc.names[nameIndex],
//        nameIndex: nameIndex
//    };
//};
//
//Dna.create = function(name) {
//    check(name, String);
//    return new Datum([name]);
//};

///**
// *
// * @param names
// * @param [relations]
// * @param [types]
// * @param [contexts]
// * @param [contentObject]
// * @constructor
// * @property {string} _id Identifier
// * @property [string] _names Names of the datum.
// * @property [Reference
// * @property [{_id: int, name: string, nameIndex: int}] _types Types of the datum. "Harry Potter" is a "Fantasy Novel"
// * @property [{_id: int, name: string, nameIndex: int}] _contexts Contexts of the datum. "Albus Dumbledore" is a "Character" in the context of "Harry Potter".
// *
// *
// */
//function Datum(names, relations, types, contexts, contentObject) {
//    function assign(propertyName, values) {
//        var type = typeof values;
//        if (values instanceof Array) {
//            self[propertyName] = values;
//        } else if (type === "string") {
//            self[propertyName] = [values];
//        } else {
//            self[propertyName] = [];
//        }
//    }
//
//    var self = this;
//    assign("_names", names);
//    assign("_relations", relations);
//    assign("_types", types);
//    assign("_contexts", contexts);
//
//    _.extend(this, contentObject);
//}
//
//(function() {
//    this.is = function(type, nameIndex) {
//        // Future: support String and look it up intelligently.
//        check(type, Datum);
//        check(nameIndex, Match.Optional(Number));
//
//        nameIndex = nameIndex || 0;
//        this._types.push({_id: type._id, name: type._names[nameIndex], nameIndex: nameIndex});
//    };
//}).call(Datum.prototype);
