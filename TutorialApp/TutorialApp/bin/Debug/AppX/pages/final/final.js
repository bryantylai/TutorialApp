// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/final/final.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // INITIALIZE DOM ELEMENTS
            var divMessage = document.getElementById("message");
            var divScore = document.getElementById("finalScore");
            var btnRestart = document.getElementById("restartButton");

            //DISPLAY FINAL SCORE AND MESSAGE
            divMessage.innerText = "Thank you for playing! Your final score is...";
            divScore.innerText = TUTOR.getCurrentScore();

            // ADD EVENT HANDLERS
            btnRestart.addEventListener("click", restart, false);
            btnRestart.innerText = "RESTART " + TUTOR.APP_TITLE;

            //ENABLE SHARE CHARM
            //var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            //dataTransferManager.addEventListener("datarequested", dataRequested);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
            //DISABLE SHARE CHARM
            //var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            //dataTransferManager.removeEventListener("datarequested", dataRequested);
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });

    function restart() {
        WinJS.Navigation.navigate("/pages/main/main.html");
    }

    //SHARE FUNCTION
    //function dataRequested(e) {
    //    var request = e.request;

    //    // TITLE IS REQUIRED FOR SHARING
    //    var dataPackageTitle = "TITLE"
    //    if ((typeof dataPackageTitle === "string") && (dataPackageTitle !== "")) {
    //        var range = document.createRange();
    //        range.selectNode(document.getElementById("final"));
    //        request.data = MSApp.createDataPackage(range);
    //        request.data.properties.title = dataPackageTitle;

    //        // The description is optional.
    //        var dataPackageDescription = "description";
    //        if ((typeof dataPackageDescription === "string") && (dataPackageDescription !== "")) {
    //            request.data.properties.description = dataPackageDescription;
    //        }

    //        // The HTML fragment we are using has an image tag that references a local file accessible only to this application.
    //        // To make sure that target application can render this image, we need to populate a resourceMap as part of the share operation data
    //        // We use the image's relative src property as the key to the resourceMap item we're adding
    //        var path = document.getElementById("image").getAttribute("src");
    //        var imageUri = new Windows.Foundation.Uri(path);
    //        var streamReference = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(imageUri);
    //        request.data.resourceMap[path] = streamReference;
    //    }
    //}
})();
