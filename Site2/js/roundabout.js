/*

 roundabout.js

 Author: Ken Wheeler
 Date: 06/13/13
 Version: 1.0b

 */

/*global window, document, $, setInterval, clearInterval */

var roundabout = window.roundabout || {};

/************ Helpers ***********/

// Function Binder

var functionBinder = function(fn, me) {
    'use strict';
    return function() {
        return fn.apply(me, arguments);
    };
};

// Mobile Detect

var mobileDetect = function() {
    var check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

// Helpers

    function throttle(fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function() {
            var context = scope || this;

            var now = +new Date,
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function() {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }

    /********** End Helpers *********/

    roundabout.Carousel = (function() {
        'use strict';

        function Carousel(element, options) {

            var defaults = {
                autoplay: true,
                autoplaySpeed: 4000,
                dots: false,
                arrows: false,
                infinite: true,
                speed: 300,
                swipe: true,
                list: 'ul:first',
                slide: 'li'
            };

            this.animType = null;
            this.autoPlayTimer = null;
            this.currentSlide = 0;
            this.currentLeft = null;
            this.direction = 1;
            this.dots = null;
            this.loadIndex = 0;
            this.nextArrow = null;
            this.prevArrow = null;
            this.slideCount = null;
            this.sliderWidth = null;
            this.slideTrack = null;
            this.slides = null;
            this.sliding = false;
            this.slideOffset = 0;
            this.slider = $(element);
            this.swipeLeft = null;
            this.list = null;
            this.touchObject = {};
            this.transformsEnabled = false;

            this.options = $.extend({}, defaults, options);

            this.changeSlide = functionBinder(this.changeSlide, this);
            this.setPosition = functionBinder(this.setPosition, this);
            this.swipeHandler = functionBinder(this.swipeHandler, this);
            this.autoPlayIterator = functionBinder(this.autoPlayIterator, this);

            this.init();

        }


        Carousel.prototype.init = function() {

            if (!$(this.slider).hasClass('sliderInitialized')) {

                $(this.slider).addClass('sliderInitialized');
                this.setValues();
                this.buildOut();
                this.getAnimType();
                this.setPosition();
                this.startLoad();
                this.loadSlider();
                this.intializeEvents();
            }

        };

        Carousel.prototype.getAnimType = function() {

            if (document.body.style.MozTransform !== undefined) {

                this.animType = 'MozTransform';

            } else if (document.body.style.webkitTransform !== undefined) {

                this.animType = "webkitTransform";

            } else if (document.body.style.msTransform !== undefined) {

                this.animType = "msTransform";

            }

            if (this.animType !== null) {

                this.transformsEnabled = true;

            }

        };

        Carousel.prototype.autoPlay = function() {

            if (this.autoPlayTimer) {

                clearInterval(this.autoPlayTimer);

            }

            this.autoPlayTimer = setInterval(this.autoPlayIterator, this.options.autoplaySpeed);

        };

        Carousel.prototype.autoPlayIterator = function() {

            if (this.options.infinite === false) {

                if (this.direction === 1) {

                    if ((this.currentSlide + 1) === this.slideCount - 1) {
                        this.direction = 0;
                    }

                    this.slideHandler(this.currentSlide + 1);

                } else {

                    if ((this.currentSlide - 1 === 0)) {

                        this.direction = 1;

                    }

                    this.slideHandler(this.currentSlide - 1);

                }

            } else {

                this.slideHandler(this.currentSlide + 1);

            }

        };

        Carousel.prototype.startLoad = function() {

            if (this.options.arrows === true) {

                this.prevArrow.hide();
                this.nextArrow.hide();

            }

            if (this.options.dots === true) {

                this.dots.hide();

            }

            this.slider.addClass('roundabout-loading');

        };

        Carousel.prototype.loadSlider = function() {

            var self = this,
                totalImages = null;

            self.setPosition();

            self.slideTrack.animate({
                opacity: 1
            }, this.options.speed, function() {
                self.setPosition();
            });

            $(window).load(function() {

                if (self.options.arrows === true) {

                    self.prevArrow.show();
                    self.nextArrow.show();

                }

                if (self.options.dots === true) {

                    self.dots.show();

                }

                self.slider.removeClass('roundabout-loading');

                if (self.options.autoplay === true) {

                    self.autoPlay();

                }

            });

        };

        Carousel.prototype.setValues = function() {

            this.list = this.slider.find(this.options.list).addClass('roundabout-list');
            this.sliderWidth = this.list.outerWidth();
            this.slides = $(this.options.slide + ':not(.cloned)', this.list).addClass('slide');
            this.slideCount = this.slides.length;

        };

        Carousel.prototype.buildOut = function() {

            var i;

            this.slider.addClass("roundabout-slider");
            this.slideTrack = this.slides.wrapAll('<div class="roundabout-track"/>').parent();
            this.slideTrack.css('opacity', 0);

            if (this.options.arrows === true) {

                this.prevArrow = $('<a href="javascript:void(0)">Previous</a>').appendTo(this.slider).addClass('roundabout-prev');
                this.nextArrow = $('<a href="javascript:void(0)">Next</a>').appendTo(this.slider).addClass('roundabout-next');

                if (this.options.infinite !== true) {
                    this.prevArrow.addClass('disabled');
                }

            }

            if (this.options.dots === true) {

                this.dots = $('<ul class="roundabout-dots"></ul>').appendTo(this.slider);

                for (i = 1; i <= this.slideCount; i += 1) {

                    $('<li><a href="javascript:void(0)">' + i + '</a></li>').appendTo(this.dots);

                }

                this.dots.find('li').first().addClass('active');

            }

            if (this.options.infinite === true) {

                this.slides.first().clone().appendTo(this.slideTrack).addClass('cloned');
                this.slides.last().clone().prependTo(this.slideTrack).addClass('cloned');

            }

        };

        Carousel.prototype.setDimensions = function() {
            this.list.find('.slide').width(this.sliderWidth);
            this.slideTrack.width(this.sliderWidth * this.slider.find('.slide').length);
        };

        Carousel.prototype.setPosition = function() {

            this.setValues();
            this.setDimensions();

            if (this.options.infinite === true) {
                this.slideOffset = this.sliderWidth * -1;
            }

            var animProps = {}, targetLeft = ((this.currentSlide * this.sliderWidth) * -1) + this.slideOffset;

            if (this.transformsEnabled === false) {
                this.slideTrack.css('left', targetLeft);
            } else {
                animProps[this.animType] = "translate(" + targetLeft + "px, 0px)";
                this.slideTrack.css(animProps);
            }

        };

        Carousel.prototype.intializeEvents = function() {

            var self = this;

            if (this.options.arrows === true) {

                this.prevArrow.on('click', {
                    message: 'previous'
                }, this.changeSlide);
                this.nextArrow.on('click', {
                    message: 'next'
                }, this.changeSlide);

            }

            if (this.options.dots === true) {

                $('li a', this.dots).on('click', {
                    message: 'index'
                }, this.changeSlide);

            }

            if (this.options.swipe === true) {

                this.list.on('touchstart', {
                    action: 'start'
                }, throttle(this.swipeHandler, 20));

                this.list.on('touchmove', {
                    action: 'move'
                }, throttle(this.swipeHandler, 20));

                this.list.on('touchend', {
                    action: 'end'
                }, throttle(this.swipeHandler, 20));

            }

            $(window).on('orientationchange', this.setPosition);

            $(window).on('resize', this.setPosition);

            $(window).on('load', this.setPosition);

        };

        Carousel.prototype.changeSlide = function(event) {

            switch (event.data.message) {

                case 'previous':
                    this.slideHandler(this.currentSlide - 1);
                    break;

                case 'next':
                    this.slideHandler(this.currentSlide + 1);
                    break;

                case 'index':
                    this.slideHandler($(event.target).parent().index());
                    break;

                default:
                    return false;
            }

        };

        Carousel.prototype.updateDots = function() {

            this.dots.find('li').removeClass('active');
            $(this.dots.find('li').get(this.currentSlide)).addClass('active');

        };

        Carousel.prototype.slideHandler = function(index) {

            var animProps = {}, targetSlide, slideLeft, targetLeft = null,
                self = this;

            targetSlide = index;
            targetLeft = ((targetSlide * this.sliderWidth) * -1) + this.slideOffset;
            slideLeft = ((this.currentSlide * this.sliderWidth) * -1) + this.slideOffset;

            if (self.options.autoplay === true) {
                clearInterval(this.autoPlayTimer);
            }

            if (this.swipeLeft === null) {
                this.currentLeft = slideLeft;
            } else {
                this.currentLeft = this.swipeLeft;
            }

            if (targetSlide < 0) {

                if (this.options.infinite === true) {

                    if (this.transformsEnabled === false) {

                        this.slideTrack.animate({
                            left: targetLeft
                        }, self.options.speed, function() {
                            self.currentSlide = self.slideCount - 1;
                            self.setPosition();

                            if (self.options.dots) {
                                self.updateDots();
                            }

                            if (self.options.autoplay === true) {
                                self.autoPlay();
                            }
                        });

                    } else {

                        $({
                            animStart: this.currentLeft
                        }).animate({
                            animStart: targetLeft
                        }, {
                            duration: self.options.speed,
                            step: function(now) {
                                animProps[self.animType] = "translate(" + now + "px, 0px)";
                                self.slideTrack.css(animProps);
                            },
                            complete: function() {

                                self.currentSlide = self.slideCount - 1;

                                self.setPosition();

                                if (self.swipeLeft !== null) {
                                    self.swipeLeft = null;
                                }

                                if (self.options.dots) {
                                    self.updateDots();
                                }

                                if (self.options.autoplay === true) {
                                    self.autoPlay();
                                }
                            }
                        });

                    }

                } else {

                    return false;

                }

            } else if (targetSlide > (this.slideCount - 1)) {

                if (this.options.infinite === true) {

                    if (this.transformsEnabled === false) {

                        this.slideTrack.animate({
                            left: targetLeft
                        }, self.options.speed, function() {

                            self.currentSlide = 0;
                            self.setPosition();

                            if (self.options.dots) {
                                self.updateDots();
                            }

                            if (self.options.autoplay === true) {
                                self.autoPlay();
                            }

                        });

                    } else {

                        $({
                            animStart: this.currentLeft
                        }).animate({
                            animStart: targetLeft
                        }, {
                            duration: self.options.speed,
                            step: function(now) {
                                animProps[self.animType] = "translate(" + now + "px, 0px)";
                                self.slideTrack.css(animProps);
                            },
                            complete: function() {

                                self.currentSlide = 0;

                                self.setPosition();

                                if (self.swipeLeft !== null) {
                                    self.swipeLeft = null;
                                }

                                if (self.options.dots) {
                                    self.updateDots();
                                }

                                if (self.options.autoplay === true) {
                                    self.autoPlay();
                                }
                            }
                        });

                    }

                } else {

                    return false;

                }

            } else {

                if (this.transformsEnabled === false) {

                    this.slideTrack.animate({
                        left: targetLeft
                    }, self.options.speed, function() {
                        self.currentSlide = targetSlide;

                        if (self.options.dots) {
                            self.updateDots();
                        }

                        if (self.options.autoplay === true) {
                            self.autoPlay();
                        }

                        if (self.options.arrows === true && self.options.infinite !== true) {
                            if (self.currentSlide === 0) {
                                self.prevArrow.addClass('disabled');
                            } else if (self.currentSlide === self.slideCount - 1) {
                                self.nextArrow.addClass('disabled');
                            } else {
                                self.prevArrow.removeClass('disabled');
                                self.nextArrow.removeClass('disabled');
                            }
                        }
                    });

                } else {

                    $({
                        animStart: this.currentLeft
                    }).animate({
                        animStart: targetLeft
                    }, {
                        duration: self.options.speed,
                        step: function(now) {
                            animProps[self.animType] = "translate(" + now + "px, 0px)";
                            self.slideTrack.css(animProps);
                        },
                        complete: function() {

                            self.currentSlide = targetSlide;

                            if (self.swipeLeft !== null) {
                                self.swipeLeft = null;
                            }

                            if (self.options.dots) {
                                self.updateDots();
                            }

                            if (self.options.autoplay === true) {
                                self.autoPlay();
                            }

                            if (self.options.arrows === true && self.options.infinite !== true) {
                                if (self.currentSlide === 0) {
                                    self.prevArrow.addClass('disabled');
                                } else if (self.currentSlide === self.slideCount - 1) {
                                    self.nextArrow.addClass('disabled');
                                } else {
                                    self.prevArrow.removeClass('disabled');
                                    self.nextArrow.removeClass('disabled');
                                }
                            }
                        }
                    });

                }

            }

        };

        Carousel.prototype.swipeHandler = function(event) {

            var animProps = {}, curLeft, newLeft = null;

            curLeft = ((this.currentSlide * this.sliderWidth) * -1) + this.slideOffset;

            this.touchObject.fingerCount = event.originalEvent.touches.length;

            this.touchObject.minSwipe = this.sliderWidth / 4;

            switch (event.data.action) {

                case 'start':

                    if (this.touchObject.fingerCount === 1) {

                        this.touchObject.startX = event.originalEvent.touches[0].pageX;
                        this.touchObject.startY = event.originalEvent.touches[0].pageY;
                        this.touchObject.curX = event.originalEvent.touches[0].pageX;
                        this.touchObject.curY = event.originalEvent.touches[0].pageY;

                    } else {

                        this.touchObject = {};

                    }

                    break;

                case 'move':

                    if (event.originalEvent.touches.length === 1) {

                        this.touchObject.curX = event.originalEvent.touches[0].pageX;
                        this.touchObject.curY = event.originalEvent.touches[0].pageY;

                        this.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(this.touchObject.curX - this.touchObject.startX, 2)));

                        if (this.swipeDirection() !== 'up' && this.swipeDirection() !== 'down') {

                            event.originalEvent.preventDefault();

                            if (this.touchObject.curX > this.touchObject.startX) {

                                newLeft = curLeft + this.touchObject.swipeLength;
                                if (this.transformsEnabled === false) {
                                    this.slideTrack.css('left', newLeft);
                                } else {
                                    animProps[this.animType] = "translate(" + newLeft + "px, 0px)";
                                    this.slideTrack.css(animProps);
                                    this.swipeLeft = newLeft;
                                }

                            } else {

                                newLeft = curLeft - this.touchObject.swipeLength;
                                if (this.transformsEnabled === false) {
                                    this.slideTrack.css('left', newLeft);
                                } else {
                                    animProps[this.animType] = "translate(" + newLeft + "px, 0px)";
                                    this.slideTrack.css(animProps);
                                    this.swipeLeft = newLeft;
                                }

                            }

                        }

                    } else {

                        this.touchObject = {};

                    }

                    break;

                case 'end':

                    if (this.touchObject.fingerCount === 0 && this.touchObject.curX !== 0) {

                        if (this.touchObject.swipeLength >= this.touchObject.minSwipe) {

                            switch (this.swipeDirection()) {

                                case 'left':

                                    this.slideHandler(this.currentSlide + 1);
                                    this.touchObject = {};

                                    break;

                                case 'right':

                                    this.slideHandler(this.currentSlide - 1);
                                    this.touchObject = {};

                                    break;

                            }

                        } else {

                            this.slideHandler(this.currentSlide);
                            this.touchObject = {};

                        }

                    } else {

                        this.touchObject = {};

                    }

                    break;

                case 'cancel':

                    break;

            }

        };

        Carousel.prototype.swipeDirection = function() {

            var xDist, yDist, r, swipeAngle;

            xDist = this.touchObject.startX - this.touchObject.curX;
            yDist = this.touchObject.startY - this.touchObject.curY;
            r = Math.atan2(yDist, xDist);

            swipeAngle = Math.round(r * 180 / Math.PI);
            if (swipeAngle < 0) {
                swipeAngle = 360 - Math.abs(swipeAngle);
            }

            if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
                return 'left';
            } else if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
                return 'left';
            } else if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
                return 'right';
            } else if ((swipeAngle > 45) && (swipeAngle < 135)) {
                return 'down';
            } else {
                return 'up';
            }

        };

        return Carousel;

    }());

$.fn.roundabout = function(options) {
    'use strict';

    var carousels = [];

    return this.each(function(index) {
        carousels[index] = new roundabout.Carousel(this, options);
    });

};