var loaded = false;
var galleryLoaded = false;
var imageList = ["abst_1.jpg","abst_2.jpg","arch_1.jpg","arch_2.jpg","arch_3.jpg","arch_4.jpg","chi_1.jpg","chi_2.jpg","gb_1.jpg","gb_2.jpg","gb_3.jpg","irl_1.jpg","it_1.jpg","skye_1.jpg","skye_2.jpg","skye_3.jpg","skye_4.jpg","snow_1.jpg"];

$( function(e) {

	setTimeout(function() {
		if (!loaded) {
			$('.loader').animate({
					opacity: 1
				}, 500, function() {
					//loadHash();
				}
			);
		}
	}, 50);

	$('#home-link').click(function(e) {
	    showHome();
	});

	$('.nav-link').click(function(e) {
      var link = e.target.getAttribute("data");
      showBody(link);
	});

	$(document).scroll(function(e) {
		if ($(document).width() < 800) {
			// Blur the header image on scroll when on mobile (and make transparent)
			// And give the navigation links a bg color on scroll
			var sval = $(e.target).scrollTop();
			var blurval = 0;
			var alphaval = 0.0;
			var opacityval = 1.0;
			var maxVal = 100.0;
			if (sval <= maxVal) {
				blurval = sval*8/maxVal;
				alphaval = sval*0.8/maxVal;
				opacityval = 1-sval*1.0/maxVal;
		  } else {
		  	blurval = 8;
		  	alphaval = 0.8;
		  	opacityval = 0.0;
		  }
		  blurHeader(blurval,opacityval);
		  setHeaderBgLinks(alphaval);
	  } else {
	  	var sval = $(e.target).scrollTop();
			var alphaval = 0.0;
			var maxVal = 170.0;
			if (sval <= maxVal) {
				alphaval = sval*0.8/maxVal;
		  } else {
		  	alphaval = 0.8;
		  }
		  setHeaderBgFull(alphaval);
	  }
	});

	// Unblur the header if the window is resized
	$(window).resize(function(e) {
		if ($(document).width() > 800) {
			blurHeader(0,1);
			setHeaderBgLinks(0);
		} else {
			setHeaderBgFull(0);
		}
	});

	// Show shadowbox for images
	$('#gallery .thumb').click(function(e) {
		var bgImageVal = $(e.target).css("background-image");
		var srcVal = bgImageVal.substring(bgImageVal.search("https?://"), bgImageVal.indexOf(".jpg")+4);
		$('#gallery-popup img').attr("src", srcVal);
		var gp = $('#gallery-popup');
		if ($(e.target).hasClass("portrait")) {
			gp.removeClass("landscape");
			gp.addClass("portrait");
		} else {
			gp.removeClass("portrait");
			gp.addClass("landscape");
		}
		gp.removeClass("hide-display-none");
		if (gp[0].clientHeight == 10) {
			var it = setInterval(function() {
				if ($('#gallery-popup')[0].clientHeight != 10) {
					clearInterval(it);
					setGalleryPopupHeight($('#gallery-popup'));
				}
			}, 20);
		} else {
			setGalleryPopupHeight(gp);
		}
	});
	// Exit shadowbox on esc
	$(document).keyup(function(e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
    	customHide('#gallery-popup');
    }
	});

});

function checkGPLoaded(gp) {
	if (gp[0].clientHeight == 10) {
		setInterval(function() {checkGPLoaded()}, 20);
	} else {
		return true;
	}
}

function setGalleryPopupHeight(gp) {
	gp.css("margin-top","-"+gp[0].clientHeight/2+"px");
	$('#gallery-popup').animate({
      opacity: 1
    }, 500, function() {
      $(document).on('click.hideShadowbox',function(e) {
      	customHide('#gallery-popup');
      	$(document).off('click.hideShadowbox');
      });
    }
  );
}

function blurHeader(blurval,opacityval) {
	var filterVal = 'blur('+blurval+'px)';
	$('#header #home')
	  .css('filter',filterVal)
	  .css('webkitFilter',filterVal)
	  .css('mozFilter',filterVal)
	  .css('oFilter',filterVal)
	  .css('msFilter',filterVal)
	  .css('opacity',opacityval);
  // If at full blur, hide the home button so it can't be clicked.
	if (blurval == 8) {
		$('#header #home').css('display','none');
	} else {
		$('#header #home').css('display','block');
	}
}
function setHeaderBgLinks(alphaval) {
	$('#header #links')
		.css('background-color','rgb(255,255,255,'+alphaval+')')
		.css('border','2px solid rgba(169,169,169,'+alphaval+')');
}
function setHeaderBgFull(alphaval) {
	$('#header')
		.css('background-color','rgb(255,255,255,'+alphaval+')')
		.css('border-bottom','2px solid rgba(169,169,169,'+alphaval+')');
}

function pageLoaded() {
	loaded = true;
	$('.loader').animate({
			opacity: 0
		}, 500, function() {
			$(this).css("display","none");
			$('#content').css("display","block");
			$('#content').animate({
					opacity: 1
				}, 500, function () {
					loadHash();
				}
			);
		}
	);
	$('#content').css("display","block");
}

function loadHash() {
	if (location.hash != "") {
    var link = location.hash.substring(1);
    showBody(link);
  } else {
  	changePage("");
  }
}

function customShow(obj, callback) {
	if (obj == "#gallery" && !galleryLoaded) {
		loadGallery();
		return;
	}
	$(obj).removeClass("hidden");
	$(obj).animate({
      opacity: 1
    }, 500, function() {
			if (callback != null) {
      	callback();
      }
    }
  );
}

function loadGallery() {
	if (!galleryLoaded) {
		// Show loader
		$('.loader').css('display','block');
		$('.loader').animate({
				opacity: 1
			}, 500, function() {}
		);
		// Load all the gallery images in ajax requests
		var deferreds = [];
		$.each(imageList, function(index, image){
		    deferreds.push(
		        $.ajax({
		            url: 'images/'+image,
		            type: 'GET'
		        })
		    );
		});
		// Once they've all been loaded hide loader and show gallery
		$.when.apply($, deferreds).always(function(){
		    galleryLoaded = true;
				$('.loader').animate({
						opacity: 0
					}, 500, function() {
						$('.loader').css('display','none');
						customShow("#gallery");
					}
				);
		});
	}
}

function customHide(obj, callback) {
	$(obj).animate({
      opacity: 0
    }, 500, function() {
    	if (obj == "#gallery-popup") {
    		$(this).addClass("hide-display-none");
    	} else {
      	$(this).addClass("hidden");
      }
      if (callback != null) {
      	callback();
      }
    }
  );
}

function showBody(link) {
		$('html, body').animate({scrollTop : 0},700);
		hideVisibleDivs(link,
			function() {
				customShow("#"+link);
		    changePage(link);
	    }
    );
}

function hideVisibleDivs(link, callback) {
	var bodyDivs = $("#body").children();
	var noneShowing = true;
	for(var i=0; i<bodyDivs.length; i++) {
		if (!$(bodyDivs[i]).hasClass("hidden") && bodyDivs[i].id != link) {
			customHide(bodyDivs[i], callback);
			noneShowing = false;
		}
	}
	if (noneShowing) {
		callback();
	}
}

function showHome() {
    hideVisibleDivs("");
    changePage("");
    window.scrollTo(0,0);
}

function changePage(page) {
	location.hash = page;
	gtag('config', 'UA-119319679-1', {
	  'page_path': location.pathname + page
	});
}
