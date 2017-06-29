/*
 Helios by HTML5 UP
 html5up.net | @n33co
 Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
 */

var settings = {

    // Carousels
    carousels: {
        speed: 4,
        fadeIn: true,
        fadeDelay: 50
    },
    dateFormatOption: {
        year: "numeric", month: "long", day: "numeric"
    },
    locale: 'de'
};

(function ($) {
    skel.breakpoints({
        wide: '(max-width: 1680px)',
        normal: '(max-width: 1280px)',
        narrow: '(max-width: 960px)',
        narrower: '(max-width: 840px)',
        mobile: '(max-width: 736px)'
    });

    $(function () {

        var $window = $(window),
            $body = $('body');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function () {
            $body.removeClass('is-loading');
        });

        // CSS polyfills (IE<9).
        if (skel.vars.IEVersion < 9)
            $(':last-child').addClass('last-child');

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on mobile.
        skel.on('+mobile -mobile', function () {
            $.prioritize(
                '.important\\28 mobile\\29',
                skel.breakpoint('mobile').active
            );
        });

        // Dropdowns.
        $('#nav > ul').dropotron({
            mode: 'fade',
            speed: 350,
            noOpenerFade: true,
            alignment: 'center'
        });

        // Scrolly links.
        $('.scrolly').scrolly();

        // Off-Canvas Navigation.

        // Navigation Button.
        $(
            '<div id="navButton">' +
            '<a href="#navPanel" class="toggle"></a>' +
            '</div>'
        )
            .appendTo($body);

        // Navigation Panel.
        $(
            '<div id="navPanel">' +
            '<nav>' +
            $('#nav').navList() +
            '</nav>' +
            '</div>'
        )
            .appendTo($body)
            .panel({
                delay: 500,
                hideOnClick: true,
                hideOnSwipe: true,
                resetScroll: true,
                resetForms: true,
                target: $body,
                visibleClass: 'navPanel-visible'
            });

        // Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
        if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
            $('#navButton, #navPanel, #page-wrapper')
                .css('transition', 'none');

        // Carousels.
        var a = function () {

            var $t = $(this),
                $forward = $('<span class="forward"></span>'),
                $backward = $('<span class="backward"></span>'),
                $reel = $t.children('.reel'),
                $items = $reel.children('article');

            var pos = 0,
                leftLimit,
                rightLimit,
                itemWidth,
                reelWidth,
                timerId;

            // Items.
            if (settings.carousels.fadeIn) {

                $items.addClass('loading');

                $t.onVisible(function () {
                    var timerId,
                        limit = $items.length - Math.ceil($window.width() / itemWidth);

                    timerId = window.setInterval(function () {
                        var x = $items.filter('.loading'), xf = x.first();

                        if (x.length <= limit) {

                            window.clearInterval(timerId);
                            $items.removeClass('loading');
                            return;

                        }

                        if (skel.vars.IEVersion < 10) {

                            xf.fadeTo(750, 1.0);
                            window.setTimeout(function () {
                                xf.removeClass('loading');
                            }, 50);

                        }
                        else
                            xf.removeClass('loading');

                    }, settings.carousels.fadeDelay);
                }, 50);
            }

            // Main.
            $t._update = function () {
                pos = 0;
                rightLimit = (-1 * reelWidth) + $window.width();
                leftLimit = 0;
                $t._updatePos();
            };

            if (skel.vars.IEVersion < 9)
                $t._updatePos = function () {
                    $reel.css('left', pos);
                };
            else
                $t._updatePos = function () {
                    $reel.css('transform', 'translate(' + pos + 'px, 0)');
                };

            // Forward.
            $forward
                .appendTo($t)
                .hide()
                .mouseenter(function (e) {
                    timerId = window.setInterval(function () {
                        pos -= settings.carousels.speed;

                        if (pos <= rightLimit) {
                            window.clearInterval(timerId);
                            pos = rightLimit;
                        }

                        $t._updatePos();
                    }, 10);
                })
                .mouseleave(function (e) {
                    window.clearInterval(timerId);
                });

            // Backward.
            $backward
                .appendTo($t)
                .hide()
                .mouseenter(function (e) {
                    timerId = window.setInterval(function () {
                        pos += settings.carousels.speed;

                        if (pos >= leftLimit) {

                            window.clearInterval(timerId);
                            pos = leftLimit;

                        }

                        $t._updatePos();
                    }, 10);
                })
                .mouseleave(function (e) {
                    window.clearInterval(timerId);
                });

            // Init.
            $window.load(function () {

                reelWidth = $reel[0].scrollWidth;

                skel.on('change', function () {

                    if (skel.vars.touch) {

                        $reel
                            .css('overflow-y', 'hidden')
                            .css('overflow-x', 'scroll')
                            .scrollLeft(0);
                        $forward.hide();
                        $backward.hide();

                    }
                    else {

                        $reel
                            .css('overflow', 'visible')
                            .scrollLeft(0);
                        $forward.show();
                        $backward.show();

                    }

                    $t._update();

                });

                $window.resize(function () {
                    reelWidth = $reel[0].scrollWidth;
                    $t._update();
                }).trigger('resize');

            });

        };
        var initializeCarousel = function () {

            var $t = $(this),
                $forward = $('<span class="forward"></span>'),
                $backward = $('<span class="backward"></span>'),
                $reel = $t.children('.reel'),
                $items = $reel.children('article');

            var pos = 0,
                leftLimit,
                rightLimit,
                itemWidth,
                reelWidth,
                timerId;

            // Items.
            if (settings.carousels.fadeIn) {

                $items.addClass('loading');

                $t.onVisible(function () {
                    var timerId,
                        limit = $items.length - Math.ceil($window.width() / itemWidth);

                    timerId = window.setInterval(function () {
                        var x = $items.filter('.loading'), xf = x.first();

                        if (x.length <= limit) {

                            window.clearInterval(timerId);
                            $items.removeClass('loading');
                            return;

                        }

                        if (skel.vars.IEVersion < 10) {

                            xf.fadeTo(750, 1.0);
                            window.setTimeout(function () {
                                xf.removeClass('loading');
                            }, 50);

                        }
                        else
                            xf.removeClass('loading');

                    }, settings.carousels.fadeDelay);
                }, 50);
            }

            // Main.
            $t._update = function () {
                pos = 0;
                rightLimit = (-1 * reelWidth) + $window.width();
                leftLimit = 0;
                $t._updatePos();
            };

            if (skel.vars.IEVersion < 9)
                $t._updatePos = function () {
                    $reel.css('left', pos);
                };
            else
                $t._updatePos = function () {
                    $reel.css('transform', 'translate(' + pos + 'px, 0)');
                };

            // Forward.
            $forward
                .appendTo($t)
                .hide()
                .mouseenter(function (e) {
                    timerId = window.setInterval(function () {
                        pos -= settings.carousels.speed;

                        if (pos <= rightLimit) {
                            window.clearInterval(timerId);
                            pos = rightLimit;
                        }

                        $t._updatePos();
                    }, 10);
                })
                .mouseleave(function (e) {
                    window.clearInterval(timerId);
                });

            // Backward.
            $backward
                .appendTo($t)
                .hide()
                .mouseenter(function (e) {
                    timerId = window.setInterval(function () {
                        pos += settings.carousels.speed;

                        if (pos >= leftLimit) {

                            window.clearInterval(timerId);
                            pos = leftLimit;

                        }

                        $t._updatePos();
                    }, 10);
                })
                .mouseleave(function (e) {
                    window.clearInterval(timerId);
                });

            // Init.
            var activateSkel = function () {

                reelWidth = $reel[0].scrollWidth;

                skel.on('change', function () {

                    if (skel.vars.touch) {

                        $reel
                            .css('overflow-y', 'hidden')
                            .css('overflow-x', 'scroll')
                            .scrollLeft(0);
                        $forward.hide();
                        $backward.hide();

                    }
                    else {

                        $reel
                            .css('overflow', 'visible')
                            .scrollLeft(0);
                        $forward.show();
                        $backward.show();

                    }

                    $t._update();

                });

                $window.resize(function () {
                    reelWidth = $reel[0].scrollWidth;
                    $t._update();
                }).trigger('resize');

            };

            if ($t.hasClass("serverside")) {
                $window.load(activateSkel);
            }
            else {
                activateSkel()
            }

        };
        $('.carousel.serverside').each(initializeCarousel);

        //Activities
        // Prevent loading of activities stream of no activities container is present
        if (!$("#activities").length) {
            return
        }

        //open modal window for wemakeit
        var modal = jQuery("#modal_window");
        modal.css("opacity", "1");
        modal.css("pointer-events", "auto")

        jQuery("#close_modal").on("click",
            function (event) {
                event.preventDefault()
                var modal = jQuery(".modal");
                modal.css("opacity", "0");
                modal.css("pointer-events", "none")
            }
        );

        // Global for JSONP tweet callback
        window.loadTweets = window.loadTweets || [];

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

        // Tweets. Since there is no authentication-free tweet search API and we've got
        // no server-side component, we'll use a twitter widget as the data source.
        // this means we have to parse the widget HTML to retrieve data.

        function addTweets(activities) {
            var $ul = $('<div class="reel">');
            var $li = $('<article>');

            activities.sort(function (a, b) {
                return b.time - a.time;
            });

            $.each(activities, function (idx, activity) {
                var activityHtml = '<div class="image featured"><a href="' + activity.url + '">';
                if (activity.srcset) {
                    activityHtml += '<img srcset="' + activity.srcset + '" width="100%" />';
                }
                else if (activity.src) {
                    activityHtml += '<img src="' + activity.src + '" width="100%" />';
                }
                else {
                    activityHtml += '<img src="/images/avatar.png" width="100%" />';
                }
                activityHtml += '</a></div>';
                activityHtml +=
                    '<div class="inner">' +
                    '<p class="icon fa-twitter">&nbsp;' + new Date(activity.time).toLocaleDateString(settings.locale, settings.dateFormatOption) + '</p>' +
                    '<p>' + activity.message + '</p>' +
                    '</div>';

                $li.append(activityHtml);
                //$li.append('<div class="' + activity.type + ' activity">' +
                //	'<a href="' + activity.url + '" class="activity-link mega-octicon octicon-' + activity.type + '"></a>' +
                //	' <span class="date">' + new Date(activity.time).toDateString() + '</span>: ' +
                //	activity.message +
                //	'<img srcset="' + activity.srcset + '" width="100%"/>' +
                //	'</div>');

                $ul.append($li);
                $li = $("<article>");
            });

            var activitiesContainer = $("#activities");
            activitiesContainer.find(".spinner").fadeOut(function () {
                activitiesContainer.append($ul);
                activitiesContainer.each(initializeCarousel);
            });
        };

        // Global list of all collected activities
        var activities = [];
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (!mutation.addedNodes) return;

                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].id == "rufous-sandbox") {
                        var timelineTweets = $("#twitter-widget-0").contents().find("div.timeline-Tweet");

                        var knownTweets = [];
                        var tweets = [];
                        timelineTweets.each(function (_, elem) {

                                var tweet = {
                                    type: "tweet"
                                };
                                var $elem = $(elem);
                                var tweetPermalink;
                                $elem.find("a.timeline-Tweet-timestamp").each(function (elem) {
                                    tweetPermalink = elem.href;
                                });

                                if (tweetPermalink && knownTweets[tweetPermalink]) {
                                    return;
                                }

                                knownTweets[tweetPermalink] = true;
                                tweet.url = tweetPermalink;

                                $elem.find("time.dt-updated").each(function (_, elem) {
                                    tweet.time = parseTime(PATTERN_TWITTER_TIMESTAMP, elem.getAttribute("datetime"));
                                });
                                $elem.find("p.timeline-Tweet-text").each(function (_, elem) {
                                    tweet.message = elem.innerHTML;
                                });

                                $elem.find("img.NaturalImage-image").each(function (_, elem) {
                                    if (elem.dataset.srcset) {
                                        tweet.srcset = decodeURIComponent(elem.dataset.srcset);
                                    }
                                    else {
                                        tweet.src = decodeURIComponent(elem.src)
                                    }
                                });

                                tweets.push(tweet);
                            }
                        );
                        // tweets.each(function(i, e)  {console.log(e)});
                        addTweets(tweets);
                        observer.disconnect();
                    }
                }
            })
        });

        observer.observe(document.body, {
            childList: true
            , subtree: true
            , attributes: false
            , characterData: false
        });

    });
})(jQuery);
