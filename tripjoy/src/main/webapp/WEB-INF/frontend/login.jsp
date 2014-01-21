<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
    <head>
        <title>Tripjoy Loin</title>
        <link rel="stylesheet" type="text/css" href="resources/js/ext/resources/css/ext-all-neptune.css" />
		<script type="text/javascript" src="resources/js/ext/ext-all-debug.js"></script>
		<link rel="stylesheet" href="resources/css/style.css" type="text/css" media="screen"/>
		<script type="text/javascript" src="resources/js/login.js"></script>
    </head>
    <body>
        <div id="content">
            <div class="wrapper">
                <div id="images" class="images">
                    <img id="image_about" src="resources/images/circles/circlesBG1.png" alt="" width="402" height="402" style="display:block;"/>
                    <img id="image_portfolio" src="resources/images/circles/circlesBG2.png" alt="" width="402" height="402"/>
                    <img id="image_contact" src="resources/images/circles/circlesBG3.png" alt="" width="402" height="402" />
                </div>
                <div class="circleBig">
                    <div id="menu" class="menu">
                        <a id="about" class="about" href="">Facebook</a>
                        <a id="portfolio" class="portfolio" href="">Twitter</a>
                        <a id="contact" class="contact" href="">Gogle+s</a>
                    </div>
                </div>
            </div>
            <div id="circle_about" class="circle">
                <div class="description">
                    <ul>
                        <li><a href="#">Who I am</a></li>
                        <li><a href="#">What I do</a></li>
                        <li><a href="#">My CV</a></li>
                    </ul>
                </div>
            </div>
            <div id="circle_portfolio" class="circle">
                <div class="description">
                    <div class="thumbs"><!-- 
                        <a href="http://www.flickr.com/photos/patdavid/4100979060/in/set-72157622106008372/"><img src="./thumbs/1.jpg" alt=""/></a>
                        <a href="http://www.flickr.com/photos/patdavid/3793395986/in/set-72157622106008372/"><img src="./thumbs/2.jpg" alt=""/></a>
                        <a href="http://www.flickr.com/photos/patdavid/4242525457/in/set-72157622106008372/"><img src="./thumbs/3.jpg" alt=""/></a>
                        <a href="http://www.flickr.com/photos/patdavid/3799109785/in/set-72157622106008372/"><img src="./thumbs/4.jpg" alt=""/></a>
                        <a href="http://www.flickr.com/photos/patdavid/3871609087/in/set-72157622106008372/"><img src="./thumbs/5.jpg" alt=""/></a>
                        <a href="http://www.flickr.com/photos/patdavid/3872388968/in/set-72157622106008372/"><img src="./thumbs/6.jpg" alt=""/></a>
                        <a href="http://www.flickr.com/photos/patdavid/3866147681/in/set-72157622106008372/"><img src="./thumbs/7.jpg" alt=""/></a>
                        <a href="http://www.flickr.com/photos/patdavid/3872389922/in/set-72157622106008372/"><img src="./thumbs/8.jpg" alt=""/></a>
                        <a href="http://www.flickr.com/photos/patdavid/4127983465/in/set-72157622106008372/"><img src="./thumbs/9.jpg" alt=""/></a>
                     --></div>
                </div>
            </div>
            <div id="circle_contact" class="circle">
                <div class="description">
                    <ul>
                        <li><a href="#">Email</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Facebook</a></li>
                    </ul>
                </div>
            </div>
            <div id="loginDeck"></div>
        </div>
        <!-- The JavaScript -->
        <script type="text/javascript" src="resources/js/jquery/jquery-2.0.3.js"></script>
        <script type="text/javascript" src="resources/js/jquery/jquery.path.js"></script>
        <script type="text/javascript">
            $(function() {
                
                /* when page loads animate the about section by default */
                //move($('#about'),2000,2);

                $('#menu > a').mouseover(
                function(){
                    var $this = $(this);
                    move($this,800,1);
                }
            );

                /*
                function to animate / show one circle.
                speed is the time it takes to show the circle
                turns is the turns the circle gives around the big circle
                 */
                function move($elem,speed,turns){
                    var id = $elem.attr('id');
                    var $circle = $('#circle_'+id);

                    /* if hover the same one nothing happens */
                    if($circle.css('opacity')==1)
                        return;

                    /* change the image */
                    $('#image_'+id).stop(true,true).fadeIn(650).siblings().not(this).fadeOut(650);

                    /*
                    if there's a circle already, then let's remove it:
                    either animate it in a circular movement or just fading out, depending on the current position of it
                     */
                    $('#content .circle').each(function(i){
                        var $theCircle = $(this);
                        if($theCircle.css('opacity')==1)
                            $theCircle.stop()
                        .animate({
                            path : new $.path.arc({
                                center	: [209,219],
                                radius	: 257,
                                start	: 65,
                                end     : -110,
                                dir	: -1
                            }),
                            opacity: '0'
                        },1500);
                        else
                            $theCircle.stop()
                        .animate({opacity: '0'},200);
                    });

                    /* make the circle appear in a circular movement */
                    var end = 65 - 360 * (turns-1);
                    $circle.stop()
                    .animate({
                        path : new $.path.arc({
                            center	: [209,219],
                            radius	: 257,
                            start	: 180,
                            end		: end,
                            dir		: -1
                        }),
                        opacity: '1'
                    },speed);
                }
            });
        </script>
    </body>
</html>