(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // Initialize DOM Elements
            var btnStart = document.getElementById("startButton");
            if (WinJS.Application.sessionState.TUTOR_SAVED) {
                btnStart.innerText = "RESTART " + TUTOR.APP_TITLE;
            } else {
                btnStart.innerText = "START " + TUTOR.APP_TITLE;
            }

            // Set Event Handlers
            btnStart.addEventListener("click", loadMainPage, false);
        }
    });

    function loadMainPage() {
        WinJS.Navigation.navigate("/pages/main/main.html");
    }

})();
