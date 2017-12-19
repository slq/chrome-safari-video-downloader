(function () {
    if(/.*learning-paths.*/.test(document.location.href)) {
        parseLearningPath();
    } else {
        parseVideoTutorial()
    }
})();
