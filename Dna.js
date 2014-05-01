Dna = {};
Dna.Collection = function(collectionId, options) {
    var self = this;
    if (! (self instanceof Dna.Collection)) {
        throw new Error('use "new" to construct a Dna.Collection');
    }

    if (!collectionId || typeof collectionId !== "string") {
        throw new Error("First argument to new Dna.Collection must be a string");
    }

    options = _.extend({
        connection: undefined,
        idGeneration: 'STRING'
    }, options);

    switch (options.idGeneration) {
        case 'MONGO':
            self._makeNewId = function() {
                var src = DDP.randomStream('/collection/' + collectionId);
                return new Meteor.Collection.ObjectID(src.hexString(24));
            };
            break;
        case 'STRING':
        default:
            self._makeNewId = function() {
                var src = DDP.randomStream('/collection/' + collectionId);
                return src.id();
            }
            break;
    }
};

(function(){
    this.test = function() {
        return "Test code is running";
    };
}).call(Dna.Collection.prototype);