/***************************************************
 ACTIVITY STREAM
 ***************************************************/

$(function () {
    // Prevent loading of activities stream of no activities container is present
    if(!$("#activities").length) {return}

    // Global for JSONP tweet callback
    window.loadTweets = window.loadTweets || [];

    var PATTERN_GITHUB_TIMESTAMP = /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]+)Z/;
    var PATTERN_TWITTER_TIMESTAMP = /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]+)\+[0-9]+/;

    function parseTime(pattern, value) {
        pattern.exec(value);
        // Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(RegExp.$1, RegExp.$2 - 1, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6).getTime();
    }

    function htmlEscape(str) {
        return String(str)
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // Provider for activities in the stream
    var Provider = function (config) {
        this.config = config;
        this.handle = config.handle;
    };

    // Default AJAX load
    Provider.prototype.load = function (callback) {
        var self = this;
        $.get(self.config.source, function(data) {
            callback(self.handle(data));
        });
    };

    // Tweets. Since there is no authentication-free tweet search API and we've got
    // no server-side component, we'll use a twitter widget as the data source.
    // this means we have to parse the widget HTML to retrieve data.
    var TweetsForWidget = function (widgetId) {
        var result = [];
        var knownTweets = [];

        loadTweets.push(function (data) {
            $(data.body).find("li.tweet").each(function (_, elem) {
                var tweet = {
                    type: "tweet"
                };
                var $elem = $(elem);
                var tweetPermalink;
                $elem.find("a.u-url.permalink").each(function (_, elem) {
                    tweetPermalink = elem.href;
                });

                if (knownTweets[tweetPermalink]) {
                    return;
                }

                knownTweets[tweetPermalink] = true;
                tweet.url = tweetPermalink;

                $elem.find("time.dt-updated").each(function (_, elem) {
                    tweet.time = parseTime(PATTERN_TWITTER_TIMESTAMP, elem.getAttribute("datetime"));
                });
                $elem.find("p.e-entry-title").each(function (_, elem) {
                    tweet.message = elem.innerHTML;
                });

                result.push(tweet);
            });

            return result;
        });

        var provider = new Provider({
            source: "https://cdn.syndication.twimg.com/widgets/timelines/" + widgetId + "?lang=en&t=1560138&callback=loadTweets[" + (loadTweets.length - 1) + "]&suppress_response_codes=true"
        });

        provider.load = function (callback) {
            $.ajax({
                url: provider.config.source,
                dataType: "script",
                success: function () {
                    callback(result);
                },
                error: function (script) {
                    throw new Error("Could not load script " + script);
                }
            });
        };
        return  provider;
    };

    // Register the providers that shall provide activities
    var providers = [
        TweetsForWidget("535389938054094848")
    ];

    // Invokes a callback once a certain number of operations have finished
    var Barrier = function (i, callback) {
        return {
            expected: i,
            count: 0,
            done: function (data) {
                if (++this.count == this.expected) {
                    callback(data)
                }
            }
        };
    };

    // New barrier instance. Callback sorts and renders the activities.
    var b = Barrier(providers.length, function (activities) {
        var $ul = $('<ul class="slides"></ul>');
        var $li = $("<li>");

        activities.sort(function (a, b) {
            return b.time - a.time;
        });

        $.each(activities, function (idx, activity) {
            var isThirdElement = (idx + 1) % 3 == 0;
            $li.append('<div class="one-third' + (isThirdElement ? ' last' : '') + '"><div class="' + activity.type + ' activity">' +
                '<a href="' + activity.url + '" class="activity-link mega-octicon octicon-' + activity.type + '"></a>' +
                ' <span class="date">' + new Date(activity.time).toDateString() + '</span>: ' +
                 activity.message +
                '</div></div>');

            if (isThirdElement) {
                $ul.append($li);
                $li = $("<li>");
            }
        });
        $("#activities").find(".spinner").fadeOut(function() {
            $("#activities").css("opacity", 0).append($ul).flexslider({
                animation: "slide",
                slideDirection: "horizontal",
                slideshow: false,
                animationDuration: 500,
                directionNav: true,
                controlNav: false,
                randomize: false,
                startAt: 1
            }).animate({opacity: 100});
        });
    });

    // Global list of all collected activities
    var activities = [];

    // Invoke all providers, using the barrier created above
    $.each(providers, function (_, provider) {
        provider.load(function (a) {
            activities = activities.concat(a);
            b.done(activities);
        });
    });
});