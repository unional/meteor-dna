Package.describe({
    summary: "Dna Account package for Meteor"
});

Package.on_use(function(api) {
    api.use(["standard-app-packages", "accounts-base", "dna"]);

    api.add_files(["client/accounts.js"], "client");
    api.add_files(["server/accounts.js"], "server");
    api.add_files(["main.js", "accessRights.js", "groups.js"], ['client', 'server']);
});

Package.on_test(function(api) {
    api.use(["standard-app-packages", "accounts-base", "dna", "tinytest"]);

    api.add_files(["client/accounts.js"], "client");
    api.add_files(["server/accounts.js"], "server");
    api.add_files(["main.js", "accessRights.js", "groups.js"], ['client', 'server']);
});