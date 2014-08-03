Dna.contexts = new Meteor.Collection("dna.contexts");

if (Meteor.isClient) {
    Dna.Contexts = {};

    (function(c) {
        c.create = function(datum) {
            var userId = Meteor.userId();
            if (userId) {
                var context = Dna.Contexts.findOne({ datumId: datum._id, userId: userId });
                if (context) {
                    Dna.contexts.update(context._id, {$set: {useOn: new Date() }});
                }
                else {
                    var id = Dna.contexts.insert({ datumId: datum._id, userId: userId, useOn: new Date() });
                    context = Dna.Contexts.findOne(id);
                }

                return context;
            }
            else {
                throw new Error("You need to login to use the context functionality");
            }
        };
        c.current = function(context) {
            var userId = Meteor.userId();
            if (userId) {
                if (context) {
                    // set
                    Dna.contexts.update(context._id, {$set: {useOn: new Date()}});
                    return context;
                }
                else {
                    // get
                    return Dna.Contexts.findOne({userId: userId}, {sort: {useOn: -1}});
                }
            }
            else {
                throw new Error("You need to login to use the context functionality");
            }
        };

        c.findOne = function(selector, options) {
            options = options || {};
            Context.addTransform(options);
            return Dna.contexts.findOne(selector, options);
        };

        c.find = function(selector, options) {
            options = options || {};
            Context.addTransform(options);
            return Dna.contexts.find(selector, options);
        };
    }(Dna.Contexts));

    var Context = function(context) {
        this._context = context;
        this._id = context._id;
        this.useOn = context.useOn;
        this.isFavorite = context.isFavorite;
        this.viewMode = context.viewMode ? context.viewMode : "note";
    };

    (function(p) {
        p.asDatum = function() {
            return Datum.cast(this.datum);
        };

        /**
         * Gets or sets whether this Context as a favorite context.
         * @param value
         */
        p.isFavorite = function(value) {
            Dna.datum.update(this.datum._id, {
                $set: { "context.favorite": value }
            });
        };
    }(Context.prototype));

    Context.cast = function(datum) {
        return datum._context ? datum._context : new Context(datum);
    };

    Context._transform = function(doc) {
        return new Context(doc);
    };

    Context.addTransform = function(options) {
        return _.extend(options, { transform: Context._transform });
    }
}
