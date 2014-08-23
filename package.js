Package.describe({
  summary: "Datum Network Architecture for Meteor",
  version: "0.1.0",
  name: "unional:dna",
  git: "https://github.com/unional/meteor-dna.git"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR-CORE@0.9.0-rc12');
  api.addFiles('dna.js');
  api.export('Dna');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('unional:dna');
  api.addFiles('dna-tests.js');
});
