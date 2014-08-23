/*
 * Datum Network Architecture
 * Copyright(c) 2014, Unional (https://github.com/unional)
 * @license Licensed under the MIT License (https://github.com/unional/unional/LICENSE)).
 * Created by hwong on 8/13/14.
 */
"use strict";
Tinytest.add("Dna is defined", function(test) {
    test.notEqual(undefined, Dna, "Dna should exists");
});

Tinytest.add("Create new repository", function(test) {
    var name = "testName";
    var instance = Dna.init(name);
    test.notEqual(undefined, instance, "instance is created");
});