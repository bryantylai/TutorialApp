(function () {
    "use strict";

    //*** TASK 10 | DATABASE & APP DEFINITIONS ***//
    var SETS_PER_TEST = 5;  //make sure you have enough question in DB.JSON
    var OPTIONS_PER_SET = 2; //minimum=2, maximum=20
    var DB_FILE = "ms-appx:///data/db.json";
    var APP_TITLE = "Guess The Team"; //DISPLAYED IN BUTTONS AND HEADERS


    //*** TASK 11 | TUTOR LOGIC DEFINITIONS ***//
    //REPLACE WITH FIELDS FROM DB.JSON
    var QUESTION_FIELD = "definition"; //TEXT QUESTION TO BE DISPLAYED
    var OPTIONS_FIELD = "word";  // OPTION TEXT FOREGROUND
    var OPTIONS_IMAGE = "url";   // OPTION IMAGE BACKGROUND
    //WHICH FIELD SHOULD BE COMPARED TO CHECK IF ANSWER IS CORRECT?
    var COMPARE_ANSWER_FIELD = "id"; 
   

    //CSS CLASSES
    var OPTIONSTATES = {
        ACTIVE: "active",
        CORRECT: "correct",
        INCORRECT: "incorrect"
    };

    var OPTIONSIZE = {
        SMALL: "small",
        MEDIUM: "medium",
        LARGE: "large"
    }

    //GAME VARIABLES
    var tutorDB;
    var testSet = [];
    var currentSet;
    var currentScore;
    var optionsize;

    //VARIABLES PER SET
    var currentAnswer;
    var currentPoints;
    var currentAttempts;

    var totalAnswers;
    var totalAnswered;

    //LOAD DATABASE
    function initializeTutor() {
        if (tutorDB) {
            startTutor();
            return;
        }

        try {
            var uri = new Windows.Foundation.Uri(DB_FILE);

            Windows.Storage.StorageFile.getFileFromApplicationUriAsync(uri).then(function readFile(file) {
                Windows.Storage.FileIO.readTextAsync(file).then(function getJson(jSonString) {
                    tutorDB = JSON.parse(jSonString);
                    startTutor();
                }, HELPER.errorHandler);
            }, HELPER.errorHandler);
        } catch (e) {
            HELPER.errorHandler(e);
        }

        if (OPTIONS_PER_SET <= 4) {
            optionsize = OPTIONSIZE.SMALL;
        } else if (OPTIONS_PER_SET <= 8) {
            optionsize = OPTIONSIZE.MEDIUM;
        } else {
            optionsize = OPTIONSIZE.LARGE;
        }
    }

    //START OR RESTART TUTOR
    function startTutor() {
        //INITIALIZE SESSION VARIABLES
        testSet = [];
        currentScore = 0;
        currentSet = 0;

        var tempIndex = [];
        for (var i = 0; i < tutorDB.length; i++) {
            tempIndex[i] = i;
        }

        //GENERATE TEST SET
        var pick;
        for (var i = 0; i < (OPTIONS_PER_SET * SETS_PER_TEST) ; i++) {
            pick = Math.floor(Math.random() * tempIndex.length);
            testSet[i] = tutorDB[tempIndex[pick]];
            tempIndex.splice(pick, 1);
        }

        HELPER.playSound(sndRight);
        loadSet();
    }

    //LOAD SET OF QUESTION + OPTIONS
    function loadSet() {
        //INITIALIZE SET VARIABLES
        currentPoints = 2;
        var divPoints = document.getElementById("pointsDisplay");
        divPoints.innerText = "Earn " + currentPoints + " points.";
        var divScore = document.getElementById("scoreDisplay");
        divScore.innerText = "Your score: " + currentScore;

        //RESET CURRENT ATTEMPTS
        currentAttempts = [];

        //CHECK IF GAME IS DONE (LAST SET)
        if (currentSet == SETS_PER_TEST) {
            HELPER.playSound(sndFinished);
            return WinJS.Navigation.navigate("/pages/final/final.html");
        }

        //Clear optionsPanel
        var optionsPanel = document.getElementById("optionsPanel");
        while (optionsPanel.hasChildNodes())
            optionsPanel.removeChild(optionsPanel.firstChild);

        //GENERATE OPTIONS
        for (var i = 0; i < OPTIONS_PER_SET; i++) {
            //MAIN OPTION DIV
            var divOption = document.createElement("div");
            divOption.id = "optionDiv" + (i + 1);
            divOption.className = "optionDiv";

            //ADDED PROPERTY TO IDENTIFY EVENT TRIGGER
            divOption.index = i;

            //ANSWER COMPARISON FIELD
            divOption.key = testSet[i + (currentSet * OPTIONS_PER_SET)][COMPARE_ANSWER_FIELD];

            //OPTION: IMAGE
            var imgOption = document.createElement("img");
            imgOption.id = "imageOption" + (i + 1);
            imgOption.className = "imgOption";
            imgOption.src = testSet[i + (currentSet * OPTIONS_PER_SET)][OPTIONS_IMAGE];
            divOption.appendChild(imgOption);

            //OPTION: TEXT
            var txtOption = document.createElement("h3");
            txtOption.id = "txtOption" + (i + 1);
            txtOption.className = "txtOption";
            txtOption.innerText = testSet[i + (currentSet * OPTIONS_PER_SET)][OPTIONS_FIELD];
            divOption.appendChild(txtOption);

            //ATTACH EVENT HANDLER (FOR CHECKING OPTIONS)
            divOption.addEventListener("click", checkOption, false);

            //SAVE STATE OF CURRENT OPTION
            currentAttempts[i] = OPTIONSTATES.ACTIVE;

            //ADD OPTION DIV TO OPTIONS PANEL
            optionsPanel.appendChild(divOption);
            HELPER.addClassRecurse(divOption, OPTIONSTATES.ACTIVE);
            HELPER.addClassRecurse(divOption, optionsize);
        }

        //SELECT QUESTION/ANSWER FROM OPTIONS
        var pick = Math.floor(Math.random() * OPTIONS_PER_SET) + (currentSet * OPTIONS_PER_SET);
        currentAnswer = testSet[pick];

        var gameBody = document.getElementById("gameBody");

        //*** TASK 14.1 ***//
        //QUESTION: TEXT
        var txtQuestion = document.getElementById("txtQuestion");
        if (txtQuestion == null) {
            txtQuestion = document.createElement("h3");
            txtQuestion.id = "txtQuestion";
            gameBody.appendChild(txtQuestion);
        }
        txtQuestion.innerText = currentAnswer[QUESTION_FIELD];


        ////*** TASK 14.2 ***//
        ////QUESTION: TEXT
        //var imgQuestion = document.getElementById("imgQuestion");
        //if (imgQuestion == null) {
        //    imgQuestion = document.createElement("img");
        //    imgQuestion.id = "imgQuestion";
        //    gameBody.appendChild(imgQuestion);
        //}
        //imgQuestion.src = currentAnswer[QUESTION_IMAGE];

        //COUNT ALTERNATIVE ANSWERS
        totalAnswered = 0;
        totalAnswers = 0;
        for (var i = 0; i < OPTIONS_PER_SET; i++) {
            if (currentAnswer[COMPARE_ANSWER_FIELD] == testSet[i + (currentSet * OPTIONS_PER_SET)][COMPARE_ANSWER_FIELD])
                totalAnswers++;
        }

        HELPER.animatePanel(optionsPanel);
    }

    //CHECK ANSWER
    function checkOption(e) {
        var triggerDiv; //OPTION DIV
        var index;      //INDEX OF OPTION DIV

        //GET DIV OF SELECTED OPTION
        if (HELPER.hasClass(e.target, "optionDiv")) {
            triggerDiv = e.target;
        } else {
            triggerDiv = e.target.parentNode;
        }
        index = triggerDiv.index;

        HELPER.removeClassRecurse(triggerDiv, OPTIONSTATES.ACTIVE);

        var divPoints = document.getElementById("pointsDisplay");
        var divScore = document.getElementById("scoreDisplay");

        if (currentAnswer[COMPARE_ANSWER_FIELD] == triggerDiv.key) {
            totalAnswered++;
            divPoints.innerText = (totalAnswers-totalAnswered) + " more answers."; //how many more correct answers

            HELPER.addClassRecurse(triggerDiv, OPTIONSTATES.CORRECT);
            currentAttempts[index] = OPTIONSTATES.CORRECT;
            
            HELPER.playSound(sndRight);
            if (totalAnswered == totalAnswers) {
                currentScore += currentPoints;
                divScore.innerText = "Your score: " + currentScore;

                currentSet++;

                loadSet();
            }
        } else {
            currentPoints--;
            divPoints.innerText = "Earn " + currentPoints + " points.";

            HELPER.addClassRecurse(triggerDiv, OPTIONSTATES.INCORRECT);
            currentAttempts[index] = OPTIONSTATES.INCORRECT;


            HELPER.playSound(sndWrong);
        }

        triggerDiv.removeEventListener("click", checkOption, false);
    }

    function getCurrentScore() {
        return currentScore;
    }

    //****IMPLEMENT PLM***
    //SAVE SESSION VARIABLES
    function saveTutor() {
        WinJS.Application.sessionState.testSet = testSet;
        WinJS.Application.sessionState.currentSet = currentSet;
        WinJS.Application.sessionState.currentPoints = currentPoints;
        WinJS.Application.sessionState.currentScore = currentScore;
        WinJS.Application.sessionState.currentAnswer = currentAnswer;
        WinJS.Application.sessionState.currentAttempts = currentAttempts;
        WinJS.Application.sessionState.totalAnswered = totalAnswered;
        WinJS.Application.sessionState.totalAnswers = totalAnswers;

        WinJS.Application.sessionState.TUTOR_SAVED = true;
    }

    function reloadTutor() {
        testSet = WinJS.Application.sessionState.testSet;
        currentSet = WinJS.Application.sessionState.currentSet
        currentScore = WinJS.Application.sessionState.currentScore;
        totalAnswered = WinJS.Application.sessionState.totalAnswered;
        totalAnswers = WinJS.Application.sessionState.totalAnswers;
        
        WinJS.Application.sessionState.TUTOR_SAVED = false;
        loadSet();

        //OVERRIDE CURRENT SET
        currentPoints = WinJS.Application.sessionState.currentPoints;
        var divPoints = document.getElementById("pointsDisplay");
        divPoints.innerText = "Earn " + currentPoints + " points.";

        currentAnswer = WinJS.Application.sessionState.currentAnswer;
        var question = document.getElementById("question");
        question.innerText = currentAnswer.question;

        currentAttempts = WinJS.Application.sessionState.currentAttempts;

        reloadAnswers();
    }

    function reloadAnswers() {
        var optionsPanel = document.getElementById("optionsPanel");

        for (var i = 0; i < OPTIONS_PER_SET; i++) {
            optionsPanel.children[i].className = "optionDiv " + currentAttempts[i];
            if (!HELPER.hasClass(optionsPanel.children[i], OPTIONSTATES.ACTIVE)) {
                optionsPanel.children[i].removeEventListener("click", checkOption, false);
            }
        }
    }

    WinJS.Namespace.define("TUTOR", {
        APP_TITLE: APP_TITLE,
        initializeTutor: initializeTutor,
        getCurrentScore: getCurrentScore,
        saveTutor: saveTutor,
        reloadTutor: reloadTutor
    });

})();