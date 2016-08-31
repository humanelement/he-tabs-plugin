var heTabs = (function () {
  return {
    init:function(initArgs){
      //default configuration values:
      var tabsSelector='tabs', mobileSlideTime=300, mobileOpenOneAtATime=true, buttonHtmlSelector, rememberOpenTab=false, defaultOpenTab=0;
      if(initArgs!=undefined){
        //set different configuration values
        if(initArgs.hasOwnProperty('tabsSelector')){ tabsSelector=initArgs['tabsSelector']; }
        if(initArgs.hasOwnProperty('mobileSlideTime')){ mobileSlideTime=initArgs['mobileSlideTime']; }
        if(initArgs.hasOwnProperty('mobileOpenOneAtATime')){ mobileOpenOneAtATime=initArgs['mobileOpenOneAtATime']; }
        if(initArgs.hasOwnProperty('buttonHtmlSelector')){ buttonHtmlSelector=initArgs['buttonHtmlSelector']; }
        if(initArgs.hasOwnProperty('rememberOpenTab')){ rememberOpenTab=initArgs['rememberOpenTab']; }
        if(initArgs.hasOwnProperty('defaultOpenTab')){ defaultOpenTab=initArgs['defaultOpenTab']; }
      }
      //code:
      var bodyElem=jQuery('body:first');
      var tabs=bodyElem.find(tabsSelector).not('.init-he-tabs');
      //for each <tabs> group on the page
      tabs.each(function(){
        //init main wrappers
        var tabswrap=jQuery(this); tabswrap.addClass('init-he-tabs');
        tabswrap.prepend('<div class="tabs-content"></div>');
        var tabscontent=tabswrap.children('.tabs-content:first');
        tabswrap.prepend('<div class="tabs-btns"></div>');
        var tabsbtns=tabswrap.children('.tabs-btns:first');
        //build each tab
        var hasActive=false, foundFirstActive=false;
        tabswrap.children('tab').each(function(i){
          var tab=jQuery(this); hasActive=tab.hasClass('active');
          var tabBtnEl;
          if(buttonHtmlSelector!=undefined){ tabBtnEl=tab.find(buttonHtmlSelector); }
          //build the tab button
          var tabName=tab.attr('name'); if(tabName==undefined){ tabName=''; }
          if(tabName.length<1){ tabName='[tab-name]'; }
          tabsbtns.append('<div class="tab-btn" name="'+i+'">'+tabName+'</div>');
          var tabBtn=tabsbtns.children('.tab-btn:last');
          if(tabBtnEl!=undefined && tabBtnEl.length>0){ tabBtn.html(''); tabBtn.append(tabBtnEl); }
          //if there is a class list on this tab
          if(tab[0].classList){
            for(var c=0;c<tab[0].classList.length;c++){
              //add this class to the tab button
              tabBtn.addClass(tab[0].classList[c]);
            }
          }
          //add active class, if this tab is the first to have an active class
          if(!foundFirstActive){
            if(hasActive){ tabBtn.addClass('active'); foundFirstActive=true; }
          }else{ tab.removeClass('active'); }
          //add a name key to this tab (based on index)
          tab.attr('name', i+''); tab.attr('btn_name',tabName);
          //get the contents
          var contentStuff=jQuery(tab[0].childNodes);
          //add an inner content wrap
          tab.prepend('<div class="tab-slide-content"><div class="tab-pad"></div></div>');
          var tabInnerContent=tab.children('.tab-slide-content:first');
          var padWrap=tabInnerContent.children('.tab-pad:first');
          //add the content to the wrapper
          padWrap.append(contentStuff);
          //add the slide title (visible in mobile view)
          tab.prepend('<h2 name="'+i+'" class="tab-slide-title">'+tabName+'</h2>');
          var slideTitle=tab.children('.tab-slide-title:first');
          //put the tab content into the content div
          tabscontent.append(tab);
          tabBtn[0]['rememberOpenTab']=rememberOpenTab;
          tabBtn[0]['tabsSelector']=tabsSelector;
          //set the tab button event (desktop view tab button)
          tabBtn.click(function(e){
            e.preventDefault();
            //if this tab is not already selected
            if(!jQuery(this).hasClass('active')){
              //if this tab should be remembered as open after page reload
              if(jQuery(this)[0]['rememberOpenTab']){
                //if not initial page load to set active (if there is already a tab active)
                if(jQuery(this).parent().children('.active:first').length>0){
                  var jsonStr=localStorage.getItem('he_tabs_persistent');
                  var json={};
                  if(jsonStr!=undefined && jsonStr.indexOf('{')!==-1){
                    json=JSON.parse(jsonStr);
                  }
                  if(!json.hasOwnProperty(jQuery(this)[0]['tabsSelector'])){
                    json[jQuery(this)[0]['tabsSelector']]={};
                  }
                  json[jQuery(this)[0]['tabsSelector']]['rememberOpenTab']=jQuery(this).index();
                  jsonStr=JSON.stringify(json);
                  localStorage.setItem('he_tabs_persistent', jsonStr);
                }
              }
              //deselect other tabs
              jQuery(this).parent().children('.tab-btn.active').removeClass('active');
              //select this tab
              jQuery(this).addClass('active');
              //get the tab's content
              var key=jQuery(this).attr('name');
              var wrap=jQuery(this).parents('.init-he-tabs:first');
              var content=wrap.find('.tabs-content:first');
              var contentTab=content.children('tab[name="'+key+'"]:first');
              //deslect other content
              content.children('tab.active').removeClass('active');
              if(!tabswrap.hasClass('mobile-width')){
                //only one slide out tab (if not in mobile width)
                content.children('tab').removeClass('slide-out');
              }
              //select this tab's content
              contentTab.addClass('active').addClass('slide-out');
            }
          });
          //set the slide out event (mobile views)
          slideTitle.click(function(e){
            e.preventDefault();
            var wrap=jQuery(this).parents('.init-he-tabs:first');
            var tab=jQuery(this).parents('tab:first');
            var tabSlideContent=tab.children('.tab-slide-content:first');
            var key=jQuery(this).attr('name');
            //if this tab is NOT already expanded
            if(!tab.hasClass('slide-out')){
              //activate this tab for desktop view
              var desktopBtn=wrap.find('.tabs-btns .tab-btn[name="'+key+'"]:first');
              desktopBtn.click();
              //if only one tab should be open at a time in mobile view
              if(mobileOpenOneAtATime){
                //make sure other tabs are closed (only one open at a time)
                tab.parent().children('tab.slide-out').not(tab).children('.tab-slide-title').click();
              }
              //slide this tab out for mobile view
              tab.addClass('slide-out');
              var tabHeight=tabSlideContent.outerHeight();
              tabSlideContent.css('height','0'); //start at 0
              //animate slide out
        tabSlideContent.animate({
            height: tabHeight+'px'
        }, mobileSlideTime, function() {
            // Animation complete.
            tabSlideContent.css('height',''); //clear out inline style
        });
            }else{
              //tab already expanded... animate slide in
              var tabHeight=tabSlideContent.outerHeight();
              tabSlideContent.css('height',tabHeight+'px'); //start at tabHeight
              //animate
        tabSlideContent.animate({
            height: '0'
        }, mobileSlideTime, function() {
            // Animation complete.
            tab.removeClass('slide-out');
            tabSlideContent.css('height',''); //clear out inline style
        });
            }
          });
        });
        //if no tab is already set as active
        if(!hasActive){
          var firstTab=tabswrap.find('.tab-btn:eq('+defaultOpenTab+')');
          if(firstTab.length<1){ firstTab=tabswrap.find('.tab-btn:first'); }
          //set the first tab as active
          firstTab.click();
        }
      });
      //init window events, if not already init
      if(!window.hasOwnProperty('heTabsWindowEventsInit')){
        //window load event
        jQuery(window).ready(function(){
          //handle window resize
          var handleWindowResize=function(){
            var bodyElem=jQuery('body:first');
            var tabs=bodyElem.find('.init-he-tabs');
            //for each <tabs> group on the page
            tabs.each(function(){
              var tabswrap=jQuery(this);
              tabswrap.removeClass('mobile-width');
              var tabsbtns=tabswrap.children('.tabs-btns:first');
              //for each tab (detect if it's breaking to the next line)
              var topOffset, isMobileWidth=false;
              tabsbtns.children().each(function(){
                if(topOffset==undefined){
                  //set first tab offset to compare to the next tab's top offset
                  topOffset=jQuery(this).offset().top;
                }else{
                  //if this tab is on a different line break than the last
                  if(topOffset!==jQuery(this).offset().top){
                    isMobileWidth=true; return false;
                  }
                }
              });
              //if line break not detected
              if(!isMobileWidth){
                var lastTabBtn=tabsbtns.children('.tab-btn:last');
                if(lastTabBtn.length>0){
                  var wrapRightEdge=tabswrap.offset().left + tabswrap.outerWidth();
                  var btnRightEdge=lastTabBtn.offset().left + lastTabBtn.outerWidth();
                  if(wrapRightEdge<btnRightEdge){
                    //buttons hanging beyond the right edge detected
                    isMobileWidth=true;
                  }
                }
              }
              //if tab buttons are line-breaking or extending beyond the mobile width
              if(isMobileWidth){
                //at mobile width
                tabswrap.addClass('mobile-width');
              }
            });
          };
          //resize event
          var resize_timeout;
          jQuery(window).resize(function(){
            clearTimeout(resize_timeout);
            resize_timeout=setTimeout(function(){
              //after window resize
              handleWindowResize();
            },100);
          });
          //on window load
          handleWindowResize();
        });
        window['heTabsWindowEventsInit']=true;
      }
      //if this tab should be remembered as open after page reload
      if(rememberOpenTab){
        var jsonStr=localStorage.getItem('he_tabs_persistent');
        var json={};
        if(jsonStr!=undefined && jsonStr.indexOf('{')!==-1){
          json=JSON.parse(jsonStr);
        }
        if(json.hasOwnProperty(tabsSelector)){
          var btn=tabs.find('.tabs-btns .tab-btn:eq('+json[tabsSelector]['rememberOpenTab']+')');
          if(btn.length>0){ btn.click(); }
        }
      }
    }
  };
}());
