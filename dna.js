/*
 * Datum Network Architecture
 * Copyright(c) 2014, Unional (https://github.com/unional)
 * @license Licensed under the MIT License (https://github.com/unional/unional/LICENSE)).
 * Created by hwong on 8/11/14.
 */
"use strict";
var repositories = [];
var workingCopies = [];

function getRepositoryName(name) { return "dna." + name; }
function getWorkingCopyName(name) { return "dna.wc." + name; }
function getWorkingCopyConfigName(name) { return "dna.wcc." + name; }
Dna = {
    init: function(databaseName) {
        var repository = repositories[databaseName];
        if (!repository) {
            repository = new Meteor.Collection(getRepositoryName(databaseName));
            repositories[databaseName] = repository;
        }
        return repository;
    },
    clone: function(databaseName, lastTimestamp) {
        var workingCopy = workingCopies[databaseName];
        if (!workingCopy) {
            var repository = this.init(databaseName);
            workingCopy = new Meteor.Collection(getWorkingCopyName(databaseName));
            var workingCopyConfig = new Meteor.Collection(getWorkingCopyConfigName(databaseName));
            workingCopyConfig.insert({
               origin: {
                   server: "localhost"
               }
            });

            if (check(lastTimestamp, Number)) {
                // TODO: copy from repo

            }
            workingCopies[databaseName] = workingCopy;
        }

        return workingCopy;
    }
};
