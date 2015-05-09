(function () {
    "use strict";

    //HELPER FUNCTIONS
    function errorHandler(err) {
        var md = new Windows.UI.Popups.MessageDialog("An error occured while running the app. More detail: " + err, "ERROR");
        md.commands.append(new Windows.UI.Popups.UICommand("Resume"));
        md.showAsync().then(function () {
            WinJS.Navigation.navigate("/pages/home/home.html");
        });
    }

    //Play Sound Effects
    function playSound(sfx) {
        sfx.currentTime = 0;  //rewind sound file
        sfx.play();
    }

    function animatePanel(panel) {
        panel.style.opacity = 0;

        var animating = WinJS.Promise.wrap();

        animating = animating
                        .then(function () {
                            // Set desired final opacity on the UI element.
                            panel.style.opacity = "1";

                            return WinJS.UI.Animation.showPanel(panel);
                        });
    }

    function hasClass(el, className) {
        // authors can pass in either an element object or an ID
        el = (typeof (el) == 'object') ? el : document.getElementById(el);

        // no need to continue if there's no className
        if (!el.className) return false;

        // iterate through all the classes
        var classArray = el.className.split(' ');
        for (var i = 0; i < classArray.length; i++) {
            if (className == classArray[i]) return true; // found? return true
        }

        // if we're still here, the class does not exist
        return false;
    }

    function addClass(el, className) {
        // authors can pass in either an element object or an ID
        el = (typeof (el) == 'object') ? el : document.getElementById(el);

        // simply append the className to the string
        el.className += ' ' + className;
        return;
    }

    function addClassRecurse(el, className) {
        addClass(el, className);
        for (var i = 0; i < el.children.length; i++) {
            addClassRecurse(el.children[i], className);
        }
    }

    function removeClass(el, className) {
        // authors can pass in either an element object or an ID
        el = (typeof (el) == 'object') ? el : document.getElementById(el);

        // if the class doesn't exist, there's no need to remove it
        if (!hasClass(el, className)) return;

        // iterate through all the classes
        var classArray = el.className.split(' ');
        for (var i = 0; i < classArray.length; i++) {

            // found it!
            if (className == classArray[i]) {
                classArray.splice(i, 1); // remove it
                i--; // decrement so we don't skip over any future occurences
            }
        }

        // reassign the className
        el.className = classArray.join(' ');
        return;
    }

    function removeClassRecurse(el, className) {
        removeClass(el, className);
        for (var i = 0; i < el.children.length; i++) {
            removeClassRecurse(el.children[i], className);
        }
    }

    WinJS.Namespace.define("HELPER", {
        errorHandler: errorHandler,
        playSound: playSound,
        animatePanel: animatePanel,
        hasClass: hasClass,
        addClassRecurse: addClassRecurse,
        removeClassRecurse: removeClassRecurse
    });

})();