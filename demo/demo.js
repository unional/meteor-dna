if (Meteor.isClient) {
//    var user = new Dna.users.insert("userId");
//    var group = Dna.groups.insert({_id: "userId"});
//    group.members.push("userId");
//    Dna.groups.update(group._id, {$push: {members: "userId"}});
//    var datums = Dna.datums.open("userId");
//    datums.find();
//    Dna.accessRights.insert({_id: "Internal", userOrGroup: "userOrGroupId", rights: "r|w"});
    Template.editPanel.events({
        "click #prePopulate": function() {

            var hp = Dna.create("Harry Potter").is("book");
            hp.has("Hufflepuff").is("school").of("Hogwarts");
            Dna.create("Padma Patil").and("Parvati Patil").are("twin sister");
            Dna.create("Pansy Parkinson").is("student").of("Slytherin");

            var ap = Dna.create("Antioch Peverell").is("Owner").of("The Elder Wand");
            ap.as("owner").of("The Elder Wand").didAGoodJob();



//            var hufflePuff = context.create("Hufflepuff", "School");
//            var hannahAbbott = context.create("Hannah Abbott", "Character", {content: "Hufflepuff student in Harry's year and member of Dumbledore's Army. Marries Neville Longbottom"});
//
//            // HufflePuff students are: hannahAbbott ...
//            // Gets the relation name and make it plural.
//            hannahAbbott.is("student", hufflePuff);
//            hannahAbbott.is(["wife", "husband"], {names: "Neville Longbottom", types: "Character"});
//            var r = hannahAbbott.is("member", "Dumbledore's Army");
//            var dumbledoreArmy = r.rights[0];
//            dumbledoreArmy.is("student organization");
//
//            var character = Dna.datums.create({names: ["Character"]});
//            var book = Dna.datums.create({names: ["Book"]});
//            var school = Dna.datums.create({names: ["School"]});
//            var harryPotterbook = Dna.datums.create({names: ["Harry Potter"], types: [Dna.getReference(book)]});
//            var hannahAbbott = Dna.datums.create({names: ["Hannah Abbott"], types: [Dna.getReference(character)], content: "Hufflepuff student in Harry's year and member of Dumbledore's Army. Marries Neville Longbottom"});
//            var hufflepuff = Dna.datums.create({names: ["Hufflepuff"], types: [Dna.getReference(school)]});
//            var studentOf = Dna.datums.create({names: ["student of"]});
//            // Think about duel nature of uni-direction relation.
//            Dna.datums.create({relations: [Dna.getRelationReference(hannahAbbott, hufflepuff)], types: [Dna.getReference(studentOf)]});
//
//            var bathshebaBabbling = Dna.datums.create({names: ["Bathsheba Babbling"]});
//            var ludoBagman = Dna.datums.create({names: ["Ludo Bagman"]});
//            var bathildaBagshot = Dna.datums.create({names: ["Bathilda Bagshot"], content: "Author of *A History of Magic*, great aunt of Gellert Grindelwald."});
//            Dna.datums.insert({names: ["Harry Potter"], types: []});
        },
        "click #save": function() {

        }
    });

    Template.main.events({
        "click #searchButton": function() {
            var searchValue = $("#searchValue").val();
            console.log(searchValue);
            Meteor.subscribe("search", searchValue);
            Session.set("searchValue", searchValue);
        }
    });

    Template.main.searchValue = Session.get("searchValue");

    Template.main.searchResults = function() {
        var searchValue = Session.get("searchValue");
        return Dna.datums.search(searchValue);
    };
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });

    Meteor.publish("search", function(searchValue) {
        return Dna.datums.search(searchValue);
    });
}
