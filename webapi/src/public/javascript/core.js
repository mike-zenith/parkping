;(function (window, H, reqwest, Custombox, monster) {
    var app = {};
    app.mapBuilder = {};
    app.mapBuilder.here = {};

    app.configure = function configure (opts) {
        app.opts = opts;
    };

    app.start = function start() {
        app.herePlatform = new H.service.Platform(app.opts.here.platform);
        app.mapBuilder.init();
        app.route(document.location.hash);

        window.addEventListener("hashchange", app.onHashChange, false);
    };

    app.onHashChange = function onHashChange(evt) {
        app.route(window.location.hash);
    };

    app.route = function route(hash) {
        var path = hash || "#!/";
        path = path.charAt(0) !== "#" ? "#" + path : path;

        var ctrlName = "";

        switch (true) {
            case /^#!\/user\/(.+)\/?$/.test(path):
                ctrlName = "mainController";
                break;
            case path === "#!/":
            default:
                ctrlName = "registerController";
        }
        var controller = app[ctrlName];

        if (app.controller && app.controller !== controller) {
            app.controller.destroy();
        }
        app.controller = controller;
        app.controller.handle(path);
    };

    app.mapBuilder.createMap = function getMap() {
        return new H.Map(
            app.opts.selector.mapContainer(),
            app.mapBuilder.here.defaultLayers.satellite.traffic,
            { zoom: 10, center: app.opts.here.center}
        );
    };

    app.mapBuilder.liveSpots = {};

    app.mapBuilder.showBubbleMore = function (evt) {
        if (!evt.target || !evt.target.classList.contains(app.opts.selector.marker.substr(1))) {
            return;
        }
    };

    app.mapBuilder.showBubble = function (evt) {
        if (!evt.target || !evt.target.classList.contains(app.opts.selector.marker.substr(1))) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        var spotId = evt.target.getAttribute("data-spot");
        var spot = app.mapBuilder.liveSpots[spotId];

        var bubbleTemplate = document.getElementById("template-bubble");
        var bubbleContent = bubbleTemplate.innerHTML
            .replace("{{picture}}", spot.pictures[0])
            .replace("{{spotid}}", spot.id);

        var coords = {
            lat: spot.location.lat,
            lng: spot.location.long
        };
        var bubble = new H.ui.InfoBubble(coords, { content: bubbleContent });

        app.mapBuilder.here.ui.addBubble(bubble);
        app.mapBuilder.here.map.setCenter(coords, true);
    };

    app.mapBuilder.init = function start() {
        app.mapBuilder.here.defaultLayers = app.herePlatform.createDefaultLayers();
        app.mapBuilder.here.map = app.mapBuilder.createMap();

        app.mapBuilder.here.behaviour = new H.mapevents.Behavior(new H.mapevents.MapEvents(app.mapBuilder.here.map));
        app.mapBuilder.here.ui = H.ui.UI.createDefault(app.mapBuilder.here.map, app.mapBuilder.here.defaultLayers);

    };

    app.mapBuilder.buildMarkerFromSpot = function buildMarkerFromSpot(spot) {
        // Create an icon, an object holding the latitude and longitude, and a marker:
        var icon = new H.map.Icon(app.opts.here.iconFile);
        var coords = {lat: spot.location.lat, lng: spot.location.long};

        return new H.map.Marker(coords, { icon: icon });
    };

    app.mapBuilder.displaySpots = function displaySpots(spots) {
        if (spots) {
            spots.forEach(function (spot) {
                if (app.mapBuilder.liveSpots[spot.id]) {
                    return;
                }

                spot.marker = app.mapBuilder.buildMarkerFromSpot(spot);
                app.mapBuilder.liveSpots[spot.id] = spot;
                app.mapBuilder.here.map.addObject(spot.marker);
            });
        }
    };

    app.mainController = {};
    app.mainController.destroy = function destroyMain() {

    };

    app.mainController.handle = function (route) {
        var lat = app.opts.here.center.lat;
        var long = app.opts.here.center.lng;

        var container = app.opts.selector.mapContainer();
        container.removeEventListener("click", app.mapBuilder.showBubble);
        container.addEventListener("click", app.mapBuilder.showBubble);
        container.removeEventListener("click", app.mapBuilder.showBubbleMore);
        container.addEventListener("click", app.mapBuilder.showBubbleMore);

        app.spotFinderService.findByFilter({ lat: lat, long: long }, app.mapBuilder.displaySpots);
    };


    app.registerController = {};
    app.registerController.destroy = function destroyRegister() {
        document.getElementById("loginFormModal").style.display = "none";
    };

    app.registerController.handle = function registerControllerHandle(route) {
        app.modal.open({
            target: '#loginFormModal',
            effect: 'sign'
        });

        var sendInvitationForm = document.getElementById("sendInvitationForm");
        sendInvitationForm.removeEventListener("submit", onInvitationSent);
        sendInvitationForm.addEventListener("submit", onInvitationSent);

        function onInvitationSent(e) {
            e.preventDefault();
            e.stopPropagation();
            app.modal.close();
            app.spinner.on("sendInvitation");

            app.authService.register(document.getElementById("sendInvitationName").value)
                .then(function (user) {
                    app.authService.login(user);
                    app.spinner.off("sendInvitation");
                    app.navigate("#!/user/" + user.id);
                })
                .catch(function () {
                    app.spinner.off("sendInvitation");
                });
        }
    };

    app.spinner = {};
    app.spinner.data = {};
    app.spinner.on = function onSpinner(ns) {
        if (!app.spinner.modal) {
            app.spinner.show();
        }
        app.spinner.data[ns] = new Date();
    };
    app.spinner.off = function offSpinner(ns) {
        delete app.spinner.data[ns];
        if (!Object.keys(app.spinner.data).length) {
            app.spinner.hide();
        }
    };
    app.spinner.hide = function hideSpinner() {
        if (app.spinner.modal) {
            app.spinner.modal.close();
        }
        app.spinner.modal = null;
    };
    app.spinner.show = function showSpinner() {
        app.spinner.modal = app.modal.open({
            target: "#spinner",
            effect: "blur",
            speed: 300
        });
    };


    app.navigate = function navigate(toHash) {
        window.location.hash = toHash;
    };

    app.modal = Custombox;
    app.modal.defaults = {
        escKey: false,
        overlayClose: false
    };
    app.modal.open = function (opts) {
        return Custombox.apply(Custombox, Object.assign({}, app.modal.defaults, opts || {}));
    };

    app.spotFinderService = {};
    app.spotFinderService.findByFilter = function findByFilter (filter) {
        return app.request({
            url: "/spot",
            method: "get",
            type: "json",
            data: filter
        });
    };

    app.authService = {};
    app.authService.user = {};
    app.authService.register = function registerUser(username) {
        return app.request({
            url: "/user",
            method: "post",
            type: "json",
            data: { username: username }
        });
    };
    app.authService.login = function loginUser(user) {
        app.authService.user = user;
        app.opts.storeLogin(user);
    };
    app.authService.logout = function logoutUser(user) {
        app.authService.user = null;
        app.opts.destroyLogin(user);
    };

    app.request = function request(opts) {
        opts.url = app.opts.url.api + opts.url;
        return reqwest(opts);
    };

    app.cookie = monster;

    window.app = app;

})(window, window.H, window.reqwest, window.Custombox, window.monster);
