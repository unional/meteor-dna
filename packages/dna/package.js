Package.describe({
    summary: "Datum Network Architecture for Meteor"
});

Package.on_use(function(api) {
    api.use(["standard-app-packages"]);

    api.add_files(["dna.js", "datums.js", "contexts.js"], ['client', 'server']);
    api.export(["Dna"], ['client', 'server']);
});

Package.on_test(function(api) {
    api.use(["tinytest"]);
    api.add_files(["datums-test.js", "dna.js", "datums.js"], ['client', 'server']);
});