document.addEventListener('DOMContentLoaded', function () {

    /* ======= Skillset ======= */

    var levelBars = document.querySelectorAll('.level-bar-inner');

    // Set initial width to 0
    levelBars.forEach(function (bar) {
        bar.style.width = '0';
    });

    // Animate to target width after page load
    window.addEventListener('load', function () {
        levelBars.forEach(function (bar) {
            var targetWidth = bar.getAttribute('data-level');
            bar.style.transition = 'width 0.8s ease';
            bar.style.width = targetWidth;
        });
    });

    /* Bootstrap 5 Tooltip initialization */
    var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(function (el) {
        new bootstrap.Tooltip(el);
    });

    /* Github Calendar - https://github.com/IonicaBizau/github-calendar */
    if (typeof GitHubCalendar !== 'undefined') {
        new GitHubCalendar('#github-graph', 'Yekku');
    }

    /* Github Activity Feed - https://github.com/caseyscarborough/github-activity */
    if (typeof GitHubActivity !== 'undefined') {
        GitHubActivity.feed({ username: 'Yekku', selector: '#ghfeed' });
    }

});
