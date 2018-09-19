/*! (c) Philipp König under GPL-3.0 */
(e=>{"use strict";e.EntryHelper=function(e){let t=!1,a={},l={},r={},n={bookmarks:{},directories:{},pinned:{}};this.init=(e=>(t=!0,new Promise(t=>{this.update(e).then(t)}))),this.initOnce=(()=>new Promise(e=>{t?e():this.init().then(e)})),this.getAmount=(t=>{if(i(),0===Object.keys(a).length&&(a=e.helper.model.getData("u/entryAmounts")),a&&a[t]){let e=a[t].visible;return l.showHidden&&(e+=a[t].hidden),e}return null}),this.getAllDataByType=(e=>Object.values(n[e]||{})),this.getDataById=(e=>{let t=null;return"object"==typeof n.bookmarks[e]?(t=n.bookmarks[e],"object"==typeof n.pinned[e]&&(t.pinnedIndex=n.pinned[e].index)):"object"==typeof n.directories[e]&&(t=n.directories[e]),t}),this.getParentsById=(e=>{let t=[];try{let a=this.getDataById(e).parentId;for(;a;){let e=this.getDataById(a);e&&t.push(e),a=e&&e.parentId?e.parentId:null}}catch(e){}return t}),this.addData=((e,t,a)=>{"object"==typeof n.bookmarks[e]?("pinnedIndex"===t&&"object"==typeof n.pinned[e]&&(n.pinned[e].index=a),n.bookmarks[e][t]=a):"object"==typeof n.directories[e]&&(n.directories[e][t]=a)}),this.isSeparator=(e=>{let t=!1;if("object"==typeof n.bookmarks[e]){let a=n.bookmarks[e].title.replace(/[^-_]/g,"");t="about:blank"===n.bookmarks[e].url&&a.length===n.bookmarks[e].title.length}return t}),this.isVisible=(e=>{let t=!1;return"object"==typeof n.bookmarks[e]?t=!1===n.bookmarks[e].hidden:"object"==typeof n.directories[e]&&(t=!1===n.directories[e].hidden),t}),this.update=((t=null)=>new Promise(l=>{i();let o=[e.helper.model.call("viewAmounts")];null===t&&o.push(e.helper.model.call("bookmarks",{id:0})),Promise.all(o).then(i=>{r=i[0],null===t&&i[1]&&i[1].bookmarks&&i[1].bookmarks[0]&&i[1].bookmarks[0].children&&(t=i[1].bookmarks[0].children),n={bookmarks:{},directories:{},pinned:{}},a={bookmarks:{visible:0,hidden:0},directories:{visible:0,hidden:0},pinned:{visible:0,hidden:0}},s(t),e.helper.model.setData({"u/entryAmounts":a}),l()})}));let i=()=>{l=e.helper.model.getData(["u/hiddenEntries","u/additionalInfo","u/pinnedEntries","u/showHidden"])},s=(e,t=[],a=!1)=>{e.forEach(e=>{let n=[...t];"0"!==e.parentId&&n.push(e.parentId),e.additionalInfo=l.additionalInfo[e.id]||{},e.hidden=a||!0===l.hiddenEntries[e.id],e.parents=n,e.views={startDate:+new Date(Math.max(e.dateAdded,r.counterStartDate)),total:0},e.url?d(e):e.children&&o(e)})},o=e=>{e.childrenAmount={bookmarks:0,directories:0,total:0},e.parents.forEach(e=>{n.directories[e].childrenAmount.directories++}),n.directories[e.id]=e,s(e.children,e.parents,e.hidden),e.isDir=!0,e.childrenAmount.total=e.childrenAmount.bookmarks+e.childrenAmount.directories,e.views.perMonth=Math.round(e.views.total/h(e.views.startDate)*100)/100,a.directories[e.hidden?"hidden":"visible"]++},d=e=>{let t=0,i=0;if(r.viewAmounts[e.id]&&(t=r.viewAmounts[e.id].c,i=r.viewAmounts[e.id].d||0),e.views.total=t,e.views.lastView=i,e.views.perMonth=Math.round(t/h(e.views.startDate)*100)/100,e.parents.forEach(e=>{n.directories[e]&&(n.directories[e].childrenAmount.bookmarks++,n.directories[e].views.total+=t,n.directories[e].views.lastView=Math.max(n.directories[e].views.lastView||0,i))}),e.pinned=!1,n.bookmarks[e.id]=e,!1===this.isSeparator(e.id)&&a.bookmarks[e.hidden?"hidden":"visible"]++,l.pinnedEntries[e.id]){e.pinned=!0;let t=Object.assign({},e);t.index=l.pinnedEntries[e.id].index,delete t.parents,delete t.parentId,n.pinned[e.id]=t,a.pinned[e.hidden?"hidden":"visible"]++}},h=e=>Math.max(1,Math.round((+new Date-e)/2627999942.4))},e.EditHelper=function(t){let a=!1;this.init=(async()=>{e("<a />").addClass(e.cl.newtab.edit).appendTo(t.elm.body),l(),location.href.search(/#edit$/i)>-1&&i()}),this.isEditMode=(()=>a);let l=()=>{t.elm.body.on("click","a."+e.cl.newtab.edit,e=>{e.preventDefault(),a||i()})},r=()=>new Promise(a=>{let l=[];t.elm.topNav.find("a."+e.cl.newtab.link).forEach(t=>{let a=e(t).text().trim(),r=(e(t).data("href")||e(t).attr("href")).trim();a&&a.length>0&&r&&r.length>0&&l.push({label:a,url:r})});let r=+new Date,n=t.helper.template.loading().appendTo(t.elm.body);t.elm.body.addClass(e.cl.loading);let i=t.elm.body.css("background-image").replace(/(^url\(|\)$)/g,"");t.helper.model.setData({"n/searchEngine":t.elm.search.wrapper.children("select")[0].value,"n/topPagesType":t.elm.topPages.children("select")[0].value,"n/shortcuts":l,"u/newtabBackground":i&&"none"!==i?i:null}).then(()=>e.delay(Math.max(0,1e3-(+new Date-r)))).then(()=>{t.elm.body.removeClass(e.cl.loading),n.remove(),a()})}),n=()=>{a=!1,history.pushState({},null,location.href.replace(/#edit/g,"")),t.elm.body.removeClass(e.cl.newtab.edit),t.elm.search.wrapper.children("select").remove(),t.elm.topPages.children("select").remove(),t.elm.topNav.find("a:not(."+e.cl.newtab.link+")").remove(),t.helper.search.updateSearchEngine(t.helper.model.getData("n/searchEngine")),t.helper.topPages.setType(t.helper.model.getData("n/topPagesType")),t.helper.shortcuts.refreshEntries(),t.setBackground(),e.delay(500).then(()=>{e("menu."+e.cl.newtab.infoBar).remove()})},i=()=>{a=!0,history.pushState({},null,location.href.replace(/#edit/g,"")+"#edit");let l=e("<menu />").addClass(e.cl.newtab.infoBar).append("<a class='"+e.cl.newtab.cancel+"'>"+t.helper.i18n.get("overlay_cancel")+"</a>").append("<a class='"+e.cl.newtab.save+"'>"+t.helper.i18n.get("settings_save")+"</a>").appendTo(t.elm.body),i=e("<div />").addClass(e.cl.newtab.upload).appendTo(l);"premium"===t.helper.model.getUserType()?(e("<a />").addClass(e.cl.newtab.remove).appendTo(i),e("<div />").html('<span>Upload background image</span><input type="file" accept="image/*" />').appendTo(i)):(i.attr("title","This feature is only available with Premium"),e("<span />").text("Premium").addClass(e.cl.premium).appendTo(i),e("<div />").html("<span>Upload background image</span>").appendTo(i)),e("menu."+e.cl.newtab.infoBar+" > a").on("click",t=>{t.preventDefault();let a=e(t.currentTarget);a.hasClass(e.cl.newtab.cancel)?n():a.hasClass(e.cl.newtab.save)&&r().then(()=>{n()})}),"premium"===t.helper.model.getUserType()?(e("menu."+e.cl.newtab.infoBar+" > div."+e.cl.newtab.upload+" input").on("change",a=>{if(a.currentTarget.files){let l=new FileReader;l.onload=(a=>{try{t.elm.body.addClass(e.cl.newtab.customBackground).css("background-image","url("+a.target.result+")")}catch(a){}}),l.readAsDataURL(a.currentTarget.files[0])}}),e("menu."+e.cl.newtab.infoBar+" > div."+e.cl.newtab.upload+" a."+e.cl.newtab.remove).on("click",()=>{t.elm.body.removeClass(e.cl.newtab.customBackground).css("background-image","")})):e("menu."+e.cl.newtab.infoBar+" > div."+e.cl.newtab.upload).on("click",()=>{t.helper.model.call("openLink",{href:chrome.extension.getURL("html/settings.html#premium"),newTab:!0})}),e.delay().then(()=>{t.elm.body.addClass(e.cl.newtab.edit),h(),d(),s(),e.delay(500).then(()=>{e(window).trigger("resize")})})},s=()=>{let a=["<a class='"+e.cl.newtab.edit+"' />","<a class='"+e.cl.newtab.remove+"' />","<a "+e.attr.position+"='left' />","<a "+e.attr.position+"='right' />"];t.elm.topNav.find("> ul > li").forEach(t=>{e(t).append(a)}),e("<a class='"+e.cl.newtab.add+"' />").prependTo(t.elm.topNav),t.elm.topNav.off("click.edit").on("click.edit","a."+e.cl.newtab.edit,t=>{t.stopPropagation();let a=e(t.currentTarget).parent("li");o(a)}).on("click.edit","a."+e.cl.newtab.add,()=>{let l=e("<li />").append("<a class='"+e.cl.newtab.link+"'>&nbsp;</a>").append(a).prependTo(t.elm.topNav.children("ul"));e.delay().then(()=>{o(l)})}).on("click.edit","a."+e.cl.newtab.remove,t=>{e(t.currentTarget).parent("li").remove()}).on("click.edit","a["+e.attr.position+"]",t=>{let a=e(t.currentTarget).attr(e.attr.position),l=e(t.currentTarget).parent("li");switch(a){case"left":l.prev("li").length()>0&&l.insertBefore(l.prev("li"));break;case"right":l.next("li").length()>0&&l.insertAfter(l.next("li"))}}).on("click.edit","> ul > li > div",e=>{"BUTTON"!==e.target.tagName&&e.stopPropagation()}),e(document).off("click.edit").on("click.edit",()=>{t.elm.topNav.find("> ul > li > div").remove()})},o=a=>{t.elm.topNav.find("> ul > li > div").remove();let l=a.children("a."+e.cl.newtab.link).eq(0);e("<div />").append("<label>"+t.helper.i18n.get("overlay_bookmark_title")+"</label>").append("<input type='text' value='"+l.text().trim().replace(/'/g,"&#x27;")+"' "+e.attr.type+"='label' />").append("<label>"+t.helper.i18n.get("overlay_bookmark_url")+"</label>").append("<input type='text' value='"+(l.data("href")||l.attr("href")).trim().replace(/'/g,"&#x27;")+"' "+e.attr.type+"='url' />").append("<button type='submit'>"+t.helper.i18n.get("overlay_close")+"</button>").appendTo(a).find("input[type='text']").on("change input",t=>{let a=t.currentTarget.value.trim();switch(e(t.currentTarget).attr(e.attr.type)){case"url":l.removeAttr("href").removeData("href"),a&&a.length>0&&(a.startsWith("chrome://")||a.startsWith("chrome-extension://")?l.data("href",a):(0!==a.search(/^\w+:\/\//)&&(a="http://"+a),l.attr("href",a)));break;case"label":a&&a.length>0?l.text(a.trim()):l.html("&nbsp;")}})},d=()=>{let a=e("<select />").prependTo(t.elm.topPages),l=t.helper.topPages.getAllTypes(),r=t.helper.model.getData("n/topPagesType");Object.keys(l).forEach(n=>{let i=t.helper.i18n.get("newtab_top_pages_"+l[n]);e("<option value='"+n+"' "+(r===n?"selected":"")+" />").text(i).appendTo(a)}),a.on("input change",e=>{t.helper.topPages.setType(e.currentTarget.value)})},h=()=>{let a=e("<select />").appendTo(t.elm.search.wrapper),l=t.helper.search.getSearchEngineList(),r=t.helper.model.getData("n/searchEngine");Object.entries(l).forEach(([t,l])=>{e("<option value='"+t+"' "+(r===t?"selected":"")+" />").text(l.name).appendTo(a)}),a.on("input change",e=>{t.helper.search.updateSearchEngine(e.currentTarget.value)})}},e.FallbackHelper=function(t){this.init=(async()=>{let r=new URL(location.href).searchParams.get("type");null!==r&&(t.elm.topPages.addClass(e.cl.hidden),t.elm.fallbackInfo.addClass(e.cl.active),n(r),a(r),"new_tab"!==r&&"fallback"!==r||!1!==t.helper.model.getData("n/override")||l())});let a=e=>{t.elm.fallbackInfo.children("a").on("click",t=>{t.preventDefault();let a="general";switch(e){case"notWhitelisted":case"blacklisted":a="filter"}chrome.tabs.create({url:chrome.extension.getURL("html/settings.html#feedback_error_"+a)})})},l=()=>{let a=e("<div />").appendTo(t.elm.fallbackInfo),l=t.helper.checkbox.get(t.elm.body,{},"checkbox","switch").appendTo(a);e("<span />").html(t.helper.i18n.get("newtab_fallback_set_as_new_tab")).insertAfter(l),l.children("input[type='checkbox']").on("change",e=>{e.currentTarget.checked?chrome.permissions.request({permissions:["tabs","topSites"]},e=>{e?r(!0):l.trigger("click")}):r(!1)})},r=e=>{chrome.storage.sync.get(["newtab"],a=>{let l=a.newtab||{};l.override=e,chrome.storage.sync.set({newtab:l},()=>{t.enabledSetAsNewtab=!0,t.helper.model.call("reinitialize")})})},n=a=>{let l={headline:"newtab_fallback_headline_general",desc:"newtab_fallback_desc",link:"more_link"};switch(a){case"new_tab":case"system":case"extension_page":case"webstore":l.headline="newtab_fallback_headline_"+a;break;case"notWhitelisted":case"blacklisted":l.headline="newtab_fallback_headline_url_filter"}e("<h2 />").text(t.helper.i18n.get(l.headline)).appendTo(t.elm.fallbackInfo),e("<p />").text(t.helper.i18n.get(l.desc)).appendTo(t.elm.fallbackInfo),e("<a />").text(t.helper.i18n.get(l.link)).appendTo(t.elm.fallbackInfo)}},e.SearchHelper=function(t){let a={},l=null,r={},n={google:{name:"Google",url:"https://www.google.com/",queryUrl:"https://www.google.com/search?q={1}",sorting:10},bing:{name:"Bing",url:"https://www.bing.com/",queryUrl:"https://www.bing.com/search?q={1}",sorting:20},yahoo:{name:"Yahoo",url:"https://search.yahoo.com/",queryUrl:"https://search.yahoo.com/search?p={1}",sorting:30,lang:{de:{url:"https://de.search.yahoo.com/",queryUrl:"https://de.search.yahoo.com/search?p={1}"},jp:{url:"https://search.yahoo.co.jp/",queryUrl:"https://search.yahoo.co.jp/search?p={1}"}}},duckduckgo:{name:"DuckDuckGo",url:"https://duckduckgo.com/",queryUrl:"https://duckduckgo.com/?q={1}",sorting:40},yandex:{name:"Yandex",url:"https://yandex.com/",queryUrl:"https://yandex.com/search/?text={1}",sorting:50,lang:{ru:{name:"Яндекс",url:"https://yandex.ru/",queryUrl:"https://yandex.ru/search/?text={1}",sorting:15},uk:{name:"Яндекс",url:"https://yandex.ua/",queryUrl:"https://yandex.ua/search/?text={1}",sorting:15},tr:{url:"https://yandex.com.tr/",queryUrl:"https://yandex.com.tr/search/?text={1}",sorting:15}}},baidu:{name:"Baidu",url:"https://www.baidu.com/",queryUrl:"https://www.baidu.com/s?wd={1}",sorting:60,lang:{"zh-CN":{name:"百度",sorting:15}}}};this.init=(async()=>{i(),d(),this.updateSearchEngine(t.helper.model.getData("n/searchEngine"))}),this.updateSearchEngine=(e=>{if(r[e]){l=e;let a=t.helper.i18n.get("newtab_search_placeholder",[r[e].name]);t.elm.search.field.attr("placeholder",a)}}),this.getSearchEngineList=(()=>r);let i=()=>{let e=t.helper.i18n.getUILanguage(),a=[];Object.entries(n).forEach(([t,l])=>{let r={alias:t,name:l.name,url:l.url,queryUrl:l.queryUrl,sorting:l.sorting};l.lang&&l.lang[e]&&Object.entries(l.lang[e]).forEach(([e,t])=>{r[e]=t}),r.name&&r.url&&r.queryUrl&&a.push(r)}),a.sort((e,t)=>(e.sorting||9999)-(t.sorting||9999)),r={},a.forEach(e=>{r[e.alias]=e})},s=a=>{let l=e("ul."+e.cl.newtab.suggestions+" > li."+e.cl.active),r="next"===a?0:-1;l.length()>0&&(r=l.prevAll("li").length()+("next"===a?1:-1),l.removeClass(e.cl.active));let n=!1;if(r>=0){let a=e("ul."+e.cl.newtab.suggestions+" > li").eq(r);a.length()>0&&(n=!0,a.addClass(e.cl.active),t.elm.search.field[0].value=a.text().trim())}!1===n&&(t.elm.search.field[0].value=t.elm.search.field.data("typedVal")||"")},o=e=>{e&&e.trim().length>0&&(0===e.search(/https?\:\/\//)||0===e.search(/s?ftps?\:\/\//)||0===e.search(/chrome\:\/\//)?chrome.tabs.update({url:e}):r[l]&&chrome.tabs.update({url:r[l].queryUrl.replace("{1}",encodeURIComponent(e))}))},d=()=>{t.elm.search.submit.on("click",e=>{e.preventDefault(),e.stopPropagation();let a=t.elm.search.field[0].value;a&&a.trim().length>0?o(a):r[l]&&chrome.tabs.update({url:r[l].url})}),t.elm.search.field.on("keyup click",l=>{l.preventDefault(),l.stopPropagation();let r=l.currentTarget.value,n=event.which||event.keyCode;13===n?o(r):40===n?s("next"):38===n?s("prev"):(t.elm.search.field.data("typedVal",r),(t=>new Promise(l=>{if(t)if(a[t])l(a[t]);else{let r=encodeURIComponent(t),n=(e=[])=>{a[t]=e,l(e)};e.xhr("http://google.com/complete/search?client=chrome&q="+r,{responseType:"json"}).then(e=>{try{if(e.response&&e.response[0]===t){let t=[],a=[];e.response[1].forEach((l,r)=>{"NAVIGATION"===e.response[4]["google:suggesttype"][r]?t.push({type:"url",label:l}):a.push({type:"word",label:l})}),n(t.concat(a))}}catch(e){n()}},()=>{n()})}else l([])}))(r).then(a=>{if(e("ul."+e.cl.newtab.suggestions).remove(),a.length>0){let l=e("<ul />").addClass(e.cl.newtab.suggestions).insertAfter(t.elm.search.field);a.some((t,a)=>{if(e("<li />").attr(e.attr.type,t.type).text(t.label).appendTo(l),a>4)return!0}),l.css({top:t.elm.search.field[0].offsetTop+"px",left:t.elm.search.field[0].offsetLeft+"px"})}}))}),e(document).on("mousemove","ul."+e.cl.newtab.suggestions+" > li",t=>{e("ul."+e.cl.newtab.suggestions+" > li").removeClass(e.cl.active),e(t.currentTarget).addClass(e.cl.active)}).on("click","ul."+e.cl.newtab.suggestions+" > li",a=>{a.preventDefault(),a.stopPropagation();let l=e(a.currentTarget).text().trim();t.elm.search.field[0].value=l,o(l)}),e(document).on("click",()=>{e("ul."+e.cl.newtab.suggestions).remove(),!1===t.helper.edit.isEditMode()&&t.elm.search.field[0].focus()}),e(window).on("resize",()=>{e("ul."+e.cl.newtab.suggestions).remove()},{passive:!0})}},e.ShortcutsHelper=function(t){this.init=(async()=>{this.refreshEntries(),a()}),this.refreshEntries=(()=>{let a=t.helper.model.getData("n/shortcuts");t.elm.topNav.children("ul").remove();let l=e("<ul />").appendTo(t.elm.topNav);a&&a.length>0&&a.forEach(t=>{let a=e("<li />").appendTo(l),r=e("<a />").addClass(e.cl.newtab.link).text(t.label).appendTo(a);t.url.startsWith("chrome://")||t.url.startsWith("chrome-extension://")?r.data("href",t.url):r.attr("href",t.url)})});let a=()=>{t.elm.topNav.on("mousedown","a."+e.cl.newtab.link,a=>{let l=e(a.currentTarget).data("href");l&&(a.preventDefault(),t.helper.model.call("openLink",{href:l,newTab:2===a.which,position:t.helper.model.getData("b/newTabPosition"),active:2!==a.which}))})}},e.TopPagesHelper=function(t){let a=null,l=!1,r={topPages:"default",mostUsed:"most_used",recentlyUsed:"recently_used",pinnedEntries:"pinned_entries",hidden:"hidden"};this.init=(async()=>{n(),t.elm.topPages.html("<ul />"),this.setType(t.helper.model.getData("n/topPagesType")),setInterval(()=>{document.hidden&&s()},12e4)}),this.getAllTypes=(()=>r),this.setType=(e=>{a===e&&"hidden"!==a||(a=e,s())}),this.handleWindowResize=(()=>{let e=i(),a=t.elm.topPages.children("ul").data("total");e.total!==a&&s()});let n=()=>{e(window).on("resize.topPages",()=>{this.handleWindowResize()},{passive:!0})},i=()=>{let a={total:8,rows:2},l={w:t.elm.content[0].offsetWidth||window.innerWidth,h:t.elm.content[0].offsetHeight||window.innerHeight},r=e("menu."+e.cl.newtab.infoBar);return r.length()>0&&(l.h-=r[0].offsetHeight),l.w>650?a.total=8:l.w>490?a.total=6:l.w>340?a.total=4:a.total=0,l.h<330?a.total=0:l.h<470&&(a.total/=2,a.rows=1),a},s=()=>{t.elm.topPages.children("ul").removeClass(e.cl.visible),"hidden"===a?!1===t.helper.edit.isEditMode()&&t.elm.topPages.children("ul").data("total",0).html(""):!1===l&&(l=!0,Promise.all([d(),e.delay(200)]).then(([a])=>{let l=i();return t.elm.topPages.children("ul").html("").data("total",l.total).attr(e.attr.newtab.perRow,l.total/l.rows),a.forEach(a=>{let l=e("<li />").appendTo(t.elm.topPages.children("ul")),r=e("<a />").attr({href:a.url,title:a.title}).appendTo(l),n=e("<span />").text(a.title).appendTo(r);t.helper.model.call("favicon",{url:a.url}).then(e=>{e.img&&n.prepend("<img src='"+e.img+"' />")});let i=e("<img />").appendTo(r);!1===t.helper.utility.isUrlOnBlacklist(a.url)&&t.helper.model.call("thumbnail",{url:a.url}).then(t=>{t.img&&i.attr("src",t.img).addClass(e.cl.visible)})}),e.delay(100)}).then(()=>{t.elm.topPages.children("ul").addClass(e.cl.visible),l=!1}))},o=()=>new Promise(e=>{t.helper.entry.init().then(()=>{e()})}),d=()=>new Promise(e=>{let t=i();if(t.total>0)switch(a){case"mostUsed":case"recentlyUsed":o().then(()=>{let t=c(a);e(t)});break;case"pinnedEntries":o().then(()=>{let t=h();e(t)});break;case"topPages":default:chrome.topSites&&chrome.topSites.get&&chrome.topSites.get(a=>{if(void 0===chrome.runtime.lastError&&a){let l=a.slice(0,t.total);e(l)}else e([])})}else e([])}),h=()=>{let e=t.helper.entry.getAllDataByType("pinned"),a=t.helper.model.getData(["u/showHidden"]),l=i(),r=[];return e.some(e=>{if((a.showHidden||t.helper.entry.isVisible(e.id))&&!1===t.helper.entry.isSeparator(e.id)&&(r.push(e),r.length>=l.total))return!0}),r},c=e=>{let a=i(),l=t.helper.entry.getAllDataByType("bookmarks"),r=t.helper.model.getData(["u/showHidden","u/mostViewedPerMonth"]),n=t.helper.i18n.getLocaleSortCollator();"recentlyUsed"===e?l.sort((e,a)=>{let l=t.helper.entry.getDataById(e.id),r=t.helper.entry.getDataById(a.id),i=l?l.views.lastView:0,s=r?r.views.lastView:0;return i===s?n.compare(e.title,a.title):s-i}):"mostUsed"===e&&l.sort((e,a)=>{let l=t.helper.entry.getDataById(e.id),i=t.helper.entry.getDataById(a.id),s=l?l.views[r.mostViewedPerMonth?"perMonth":"total"]:0,o=i?i.views[r.mostViewedPerMonth?"perMonth":"total"]:0;return s===o?n.compare(e.title,a.title):o-s});let s=[];return l.some(e=>{if((r.showHidden||t.helper.entry.isVisible(e.id))&&!1===t.helper.entry.isSeparator(e.id)&&0!==e.url.search(/^file:\/\//)&&(s.push(e),s.length>=a.total))return!0}),s}};(new function(){this.elm={body:e("body"),title:e("head > title"),content:e("section#content"),topNav:e("section#content > nav"),search:{wrapper:e("div#search"),field:e("div#search > input[type='text']"),submit:e("div#search > button[type='submit']")},fallbackInfo:e("div#fallbackInfo"),topPages:e("div#topPages")},this.enabledSetAsNewtab=!1,this.run=(()=>{l(),t();let r=this.helper.template.loading().appendTo(this.elm.body);this.elm.body.addClass(e.cl.initLoading),this.helper.model.init().then(()=>{let t=this.helper.model.getData(["a/darkMode","a/highContrast","b/sidebarPosition"]);return!0===t.darkMode?this.elm.body.addClass(e.cl.page.darkMode):!0===t.highContrast&&this.elm.body.addClass(e.cl.page.highContrast),this.elm.body.attr(e.attr.position,t.sidebarPosition),this.helper.font.init(),this.helper.stylesheet.init(),this.helper.stylesheet.addStylesheets(["newtab"],e(document)),this.helper.i18n.init()}).then(()=>(this.elm.body.parent("html").attr("dir",this.helper.i18n.isRtl()?"rtl":"ltr"),this.helper.i18n.parseHtml(document),this.helper.topPages.init(),this.helper.search.init(),this.helper.shortcuts.init(),this.helper.fallback.init(),this.helper.edit.init(),a(),e.delay(500))).then(()=>{r.remove(),this.setBackground(),this.elm.body.removeClass([e.cl.building,e.cl.initLoading]),e(window).trigger("resize")})}),this.setBackground=(async()=>{if("premium"===this.helper.model.getUserType()){let t=this.helper.model.getData("u/newtabBackground");t?this.elm.body.addClass(e.cl.newtab.customBackground).css("background-image","url("+t+")"):this.elm.body.removeClass(e.cl.newtab.customBackground).css("background-image","")}});let t=()=>{this.helper={model:new e.ModelHelper(this),template:new e.TemplateHelper(this),i18n:new e.I18nHelper(this),font:new e.FontHelper(this),stylesheet:new e.StylesheetHelper(this),checkbox:new e.CheckboxHelper(this),utility:new e.UtilityHelper(this),search:new e.SearchHelper(this),entry:new e.EntryHelper(this),shortcuts:new e.ShortcutsHelper(this),topPages:new e.TopPagesHelper(this),fallback:new e.FallbackHelper(this),edit:new e.EditHelper(this)}},a=async()=>{chrome.extension.onMessage.addListener(e=>{e&&e.action&&"reinitialize"===e.action&&!1===this.enabledSetAsNewtab&&location.reload(!0)}),this.helper.model.getData("n/autoOpen")&&e(window).on("resize",()=>{if(this.elm.sidebar&&this.elm.sidebar.iframe&&this.elm.sidebar.sidebar){let t=this.elm.sidebar.sidebar.realWidth();window.innerWidth-t>=500?(this.elm.sidebar.sidebar.addClass(e.cl.sidebar.permanent),t>0&&this.elm.content.addClass(e.cl.newtab.smallContent),e(document).trigger(e.opts.events.openSidebar),e.delay(500).then(()=>{e(document).trigger("click")})):(this.elm.sidebar.sidebar.removeClass(e.cl.sidebar.permanent),this.elm.content.removeClass(e.cl.newtab.smallContent)),this.helper.topPages.handleWindowResize()}})},l=()=>new Promise(t=>{e("["+e.attr.type+"='script_sidebar']").remove();let a=[e.opts.events.loaded,e.opts.events.elementsCreated].join(" ");e(document).off(a).on(a,t=>{this.elm.sidebar=t.detail.elm,e(window).trigger("resize")}),e.opts.manifest.content_scripts[0].css.forEach(t=>{e("<link />").attr({href:chrome.extension.getURL(t),type:"text/css",rel:"stylesheet",[e.attr.type]:"script_sidebar"}).appendTo("head")});let l=(a=0)=>{let r=e.opts.manifest.content_scripts[0].js[a];if(void 0!==r){let t=document.createElement("script");document.head.appendChild(t),t.onload=(()=>l(a+1)),t.src="/"+r,e(t).attr(e.attr.type,"script_sidebar")}else t()};l()})}).run()})(jsu);