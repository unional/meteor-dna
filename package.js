Package.describe({
    summary: "Datum Network Architecture for Meteor"
});

Package.on_use(function(api) {
    api.add_files(["dna.js"], ['client', 'server']);
    api.export(["Dna"], ['client', 'server']);
});

Package.on_test(function(api) {
    api.use(["tinytest"]);
    api.add_files(["dna.js"], ['client', 'server']);
});