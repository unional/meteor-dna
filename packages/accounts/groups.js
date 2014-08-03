/**
 * User Group
 * {
     *  _id: id,
     *  name: string,
     *  members: [userId]
     * }
 * @type {Meteor.Collection}
 */
Dna.groups = new Meteor.Collection("dna.groups");
