# he-tabs-plugin
Lightweight and simple tabs plugin for creating tabbed content on the page. 

Simple to implement and has an automatic, built-in, responsive mode.

Written by Human Element's g-milligan 

See <a href="http://humanelement.github.io/he-tabs-plugin/" target="_blank">DEMO</a>

Usage examples:
```
    //example 1
    heTabs.init({
      tabsSelector:'tabs#example_1'
    });

    //example 2
    heTabs.init({
      tabsSelector:'tabs#example_2',
      mobileSlideTime:2000 //slow mobile slide
    });

    //example 3
    heTabs.init({
      tabsSelector:'tabs#example_3',
      mobileOpenOneAtATime:false //allow multiple mobile sliders to be open at one time
    });

    //example 4, default: same as "heTabs.init()"
    heTabs.init({
      tabsSelector:'tabs', //default selector
      mobileSlideTime:300, //good slide speed
      mobileOpenOneAtATime:true //expand only one mobile slider at a time
    });
```
