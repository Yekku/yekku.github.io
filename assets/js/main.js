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
        GitHubCalendar('#github-graph', 'Yekku', { responsive: true });

        // Clean up extra elements injected by the calendar widget
        var calendarCleanup = function () {
            var graph = document.getElementById('github-graph');
            if (!graph) return;

            // Remove links by their text content
            graph.querySelectorAll('a').forEach(function (a) {
                var text = a.textContent.trim().toLowerCase();
                if (text.indexOf('skip to') !== -1 ||
                    text.indexOf('learn how') !== -1 ||
                    text.indexOf('count contributions') !== -1) {
                    a.remove();
                }
            });

            // Remove the stats footer (0 total, 0 days streak, etc.)
            graph.querySelectorAll('.contrib-footer, .contribution-activity').forEach(function (el) {
                el.remove();
            });
        };

        // Run cleanup after calendar loads (observe for changes)
        var observer = new MutationObserver(function (mutations, obs) {
            var svg = document.querySelector('#github-graph svg');
            if (svg) {
                calendarCleanup();
                obs.disconnect();
            }
        });
        observer.observe(document.getElementById('github-graph'), { childList: true, subtree: true });
    }

    /* Github Activity Feed - using GitHub public events API */
    fetchGitHubActivity('Yekku', '#ghfeed');

});

function fetchGitHubActivity(username, selector) {
    var container = document.querySelector(selector);
    if (!container) return;

    container.innerHTML = '<p>Loading activity...</p>';

    fetch('https://api.github.com/users/' + username + '/events/public?per_page=10')
        .then(function (response) { return response.json(); })
        .then(function (events) {
            if (!events.length) {
                container.innerHTML = '<p>No recent activity.</p>';
                return;
            }

            var html = '<div class="github-activity-feed">';
            events.forEach(function (event) {
                var action = '';
                var repo = event.repo ? event.repo.name : '';
                var repoUrl = 'https://github.com/' + repo;
                var date = new Date(event.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                });

                switch (event.type) {
                    case 'PushEvent':
                        var count = event.payload.commits ? event.payload.commits.length : 0;
                        if (count === 0) return; // Skip empty pushes
                        action = 'Pushed ' + count + ' commit' + (count !== 1 ? 's' : '') + ' to';
                        break;
                    case 'CreateEvent':
                        action = 'Created ' + (event.payload.ref_type || 'repository');
                        if (event.payload.ref) action += ' <strong>' + event.payload.ref + '</strong> in';
                        break;
                    case 'WatchEvent':
                        action = 'Starred';
                        break;
                    case 'ForkEvent':
                        action = 'Forked';
                        break;
                    case 'IssuesEvent':
                        action = event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1) + ' an issue in';
                        break;
                    case 'PullRequestEvent':
                        action = event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1) + ' a pull request in';
                        break;
                    case 'DeleteEvent':
                        action = 'Deleted ' + (event.payload.ref_type || '') + ' in';
                        break;
                    default:
                        action = event.type.replace('Event', '') + ' in';
                }

                html += '<div class="ghfeed-event">';
                html += '<span class="ghfeed-date">' + date + '</span> ';
                html += '<span class="ghfeed-action">' + action + '</span> ';
                html += '<a href="' + repoUrl + '" target="_blank" rel="noopener noreferrer">' + repo + '</a>';
                html += '</div>';
            });
            html += '</div>';
            container.innerHTML = html;
        })
        .catch(function () {
            container.innerHTML = '<p>Unable to load activity.</p>';
        });
}
