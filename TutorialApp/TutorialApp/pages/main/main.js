// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/main/main.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // Initialize DOM Elements
            if (WinJS.Application.sessionState.TUTOR_SAVED) {
                TUTOR.reloadTutor();
            } else {
                TUTOR.initializeTutor();
            }
            var title = document.getElementById("pagetitle");
            title.innerText = TUTOR.APP_TITLE;
        },

        unload: function () {
            // TODO: Respond to navigations away from this page. 
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
