/**
 * Access rights.
 * {
     *  _id: id,
     *  members: [groupId],
     *  rights: "r|w"
     * }
 * @type {Meteor.Collection}
 */
Dna.accessRights = new Meteor.Collection("dna.accessRights");
