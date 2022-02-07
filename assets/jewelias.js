(function($) {
  var body = $('body');
  var t = $('body');
  var doc = $(document);  

  var iconNav = $('#showLeftPush');
  var iconCart = $('#cartToggle');

  var dropdownCart = $('#dropdown-cart');
  var navCustomer = $('.nav-customer');
  var wrapperCart = $('.wrapper-top-cart');
  var cartNoItems = dropdownCart.find('.no-items');
  var cartHasItems = dropdownCart.find('.has-items');
  var miniProductList = dropdownCart.find('.mini-products-list');

  var s = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];
  var e = $(".wrapper-overlay");

  if ($('.collection-sidebar').length) {
    History.Adapter.bind(window, 'statechange', function() {
      var State = History.getState();

      if (!jewelias.isSidebarAjaxClick) {
        jewelias.sidebarParams();

        var newurl = jewelias.sidebarCreateUrl();

        jewelias.sidebarGetContent(newurl);
      }

      jewelias.isSidebarAjaxClick = false;
    });
  };

  var changeSwatch = function(swatch) {
    swatch.change(function() {
      var optionIndex = $(this).closest('.swatch').attr('data-option-index');
      var optionValue = $(this).val();

      $(this)
      .closest('form')
      .find('.single-option-selector')
      .eq(optionIndex)
      .val(optionValue)
      .trigger('change');
    });
  };

  if (window.use_color_swatch) {

    changeSwatch($('.swatch :radio'));

    Shopify.productOptionsMap = {};
    Shopify.quickViewOptionsMap = {};

    Shopify.updateOptionsInSelector = function(selectorIndex, wrapperSlt) {

      Shopify.optionsMap = wrapperSlt === '.product' ? Shopify.productOptionsMap : Shopify.quickViewOptionsMap;

      switch (selectorIndex) {
        case 0:
          var key = 'root';
          var selector = $(wrapperSlt + '.single-option-selector:eq(0)');
          break;
        case 1:
          var key = $(wrapperSlt + ' .single-option-selector:eq(0)').val();
          var selector = $(wrapperSlt + ' .single-option-selector:eq(1)');
          break;
        case 2:
          var key = $(wrapperSlt + ' .single-option-selector:eq(0)').val();
          key += ' / ' + $(wrapperSlt + ' .single-option-selector:eq(1)').val();
          var selector = $(wrapperSlt + ' .single-option-selector:eq(2)');
      }

      var initialValue = selector.val();

      selector.empty();

      var availableOptions = Shopify.optionsMap[key];

      if (availableOptions && availableOptions.length) {
        for (var i = 0; i < availableOptions.length; i++) {
          var option = availableOptions[i];

          var newOption = $('<option></option>').val(option).html(option);

          selector.append(newOption);
        }

        $(wrapperSlt + ' .swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function() {
          if ($.inArray($(this).attr('data-value'), availableOptions) !== -1) {
            $(this).removeClass('soldout').find(':radio').removeAttr('disabled', 'disabled');
          }
          else {
            $(this).addClass('soldout').find(':radio').removeAttr('checked').attr('disabled', 'disabled');
          }
        });

        if ($.inArray(initialValue, availableOptions) !== -1) {
          selector.val(initialValue);
        }

        selector.trigger('change');
      };
    };

    Shopify.linkOptionSelectors = function(product, wrapperSlt) {
      // Building our mapping object.
      Shopify.optionsMap = wrapperSlt === '.product' ? Shopify.productOptionsMap : Shopify.quickViewOptionsMap;

      for (var i = 0; i < product.variants.length; i++) {
        var variant = product.variants[i];

        if (variant.available) {
          // Gathering values for the 1st drop-down.
          Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];

          Shopify.optionsMap['root'].push(variant.option1);
          Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);

          // Gathering values for the 2nd drop-down.
          if (product.options.length > 1) {
            var key = variant.option1;
            Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
            Shopify.optionsMap[key].push(variant.option2);
            Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
          }

          // Gathering values for the 3rd drop-down.
          if (product.options.length === 3) {
            var key = variant.option1 + ' / ' + variant.option2;
            Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
            Shopify.optionsMap[key].push(variant.option3);
            Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
          }
        }
      };

      // Update options right away.
      Shopify.updateOptionsInSelector(0, wrapperSlt);

      if (product.options.length > 1) Shopify.updateOptionsInSelector(1, wrapperSlt);
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2, wrapperSlt);

      // When there is an update in the first dropdown.
      $(wrapperSlt + " .single-option-selector:eq(0)").change(function() {
        Shopify.updateOptionsInSelector(1, wrapperSlt);
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2, wrapperSlt);
        return true;
      });

      // When there is an update in the second dropdown.
      $(wrapperSlt + " .single-option-selector:eq(1)").change(function() {
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2, wrapperSlt);
        return true;
      });

    };
  };

  $(document).ready(function() {
  	doc.ajaxStart(function () {
        jewelias.isAjaxLoading = true;
    });

    doc.ajaxStop(function () {
        jewelias.isAjaxLoading = false;
    });

    jewelias.init();
    $(document)    
    .on( 'shopify:section:load', jewelias.initRelatedProductSlider )
    .on( 'shopify:section:unload', jewelias.initRelatedProductSlider)

    .on( 'shopify:section:load', jewelias.initProductSidebarSlider )
    .on( 'shopify:section:unload', jewelias.initProductSidebarSlider)

    .on( 'shopify:section:load', jewelias.initProductMoreview )
    .on( 'shopify:section:unload', jewelias.initProductMoreview)

    .on( 'shopify:section:load', jewelias.Page_brands )
    .on( 'shopify:section:unload', jewelias.Page_brands)

    .on( 'shopify:section:load', jewelias.initMobileMenu )
    .on( 'shopify:section:unload', jewelias.initMobileMenu)

    .on( 'shopify:section:load', jewelias.SlicksliderHP )
    .on( 'shopify:section:unload', jewelias.SlicksliderHP)
    
    
    .on( 'shopify:section:load', jewelias.initQuickView )
    .on( 'shopify:section:unload', jewelias.initQuickView)


    .on( 'shopify:section:load', jewelias.initslideshow )
    .on( 'shopify:section:unload', jewelias.initslideshow);

    $(document).on('click touchstart', function(e) {
      var lookbook_modal = $('.lookbook-modal');
      var hd_option = $('.hd-option');

      if (!lookbook_modal.is(e.target) && lookbook_modal.has(e.target).length === 0 && !hd_option.is(e.target) && hd_option.has(e.target).length === 0 && window.innerWidth > 1024){
        jewelias.closeLookBookPopup();
      }
    });
  });

  $(window).off('resize.mobileMenu').on('resize.mobileMenu', function() {
    jewelias.initMobileMenu();
  });


  $(window).off('resize.initDropdownFooter').on('resize.initDropdownFooter', function() {
    jewelias.initDropdownFooterMenu();
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      jewelias.closeLookBookPopup();
      clearTimeout(jewelias.jeweliasTimeout);
      if ($('.modal').is(':visible')) {
        $('.modal').fadeOut(500);
      }
    }
  });

  if($('.template-collection').length || $('.template-product').length || $('.template-blog').length || $('.template-article').length) {
    var currentWinWidth = $(window).width();
    var resizeTimeout;

    $(window).off('resize.sidebarInitToggle').on('resize.sidebarInitToggle', function() {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(function() {
        if (currentWinWidth !== $(window).width()){
          currentWinWidth = $(window).width();
        }
      }, 50);
    });
  };

  var jewelias = {
    jeweliasTimeout: null,
    isSidebarAjaxClick: false,
    isAjaxLoading: false,
    init: function() {
      this.cookie_popup();
      this.closeproductcms();
      this.initSearchToggle();
      this.initMobileMenu();
      this.appendCustomerDropdownMobile();
      this.appendCartDropdownMobile();
      this.openCustomerDropDownMobile();
      this.MultiOption();
      this.initDropdownLogin();
      this.initLookBookProduct();

      this.initDropdownCart();
      this.closeDropdown();
      this.initColorSwatchGrid();
      this.initScrollTop();

      this.closeModal();
      this.initAddToCart();
      this.initQuickView();

      this.initFixedTopMenu();
      this.initDropdownSearch();
      this.initDropdownMenu();
      this.initDropdownFooterMenu();

      this.SlicksliderHP();

      this.slider_megamenu();
      this.slider_promotion_bar();
      this.initWishListIcons();
      this.doAddOrRemoveWishlish();
      this.checkbox_checkout();

      if($('.template-index').length) {
        this.initToDay();
        this.initInfiniteScrollingHomepage();
      };

      if($('.template-index').length || $('.lookbook-content').length) {
        this.initslideshow();
      };

      if($('.template-collection').length || $('.template-product').length || $('.template-blog').length || $('.template-article').length) {
        this.initProductSidebarSlider();
        this.sidebarInitToggle();
      };

      if($('.template-collection').length) {
        this.initSidebar();
        this.initToolbar();
        this.sidebarMapPaging();
        this.initInfiniteScrolling();
        this.hide_filter();
      };

      if($('.template-product').length) {
        this.initProductMoreview();
        this.initRelatedProductSlider();
        this.initProductAddToCart();
        this.initZoom();
        this.initEventPopupNextPrevProduct();
        this.initStickyAddtoCart();
        this.initLookbookProductDescription();
        this.sidebarMapCategories();
        this.productRecomendation();
        // this.appendProductRecomendation();
      };

      if($('.template-cart').length) {
        this.initCartQty();
        this.featuredproduct($('.best-sell-product'));
      };

      if($('.template-search').length) {
        this.sidebarMapPaging();
        this.sidebarParams();
        this.initInfiniteScrolling();
      };

      if($('.brands-page').length) {
        this.Page_brands();
      };
      
      if($('.template-article').length) {
        this.initLookbookProductDescription();
      };

      if ($('.template-page').length && $(".wishlist-page").length )  {
        this.initWishLists();
      }
    },
    cookie_popup: function() {
      $('#accept-cookies').show();
      if ($.cookie('cookieMessage') == 'closed') {
        $('#accept-cookies').remove();
      }

      $('#accept-cookies .btn-accept').bind('click',function(){
        $('#accept-cookies').remove();
        $.cookie('cookieMessage', 'closed', {expires:1, path:'/'});
      });
    },

    closeproductcms: function() {
      if ($.cookie('closeproductcms') == 'closed') {
        $('.product-cms-custom').remove();
      }
      $('.product-cms-custom a.close_cms').bind('click',function(){
        $('.product-cms-custom').remove();
        $.cookie('closeproductcms', 'closed', {expires:1, path:'/'});
      });
    },

    initSearchToggle: function() {
      var mbSearch = $('.menu-mobile .searchToggle');
      var navSearch = $('.site-header .header-wrapper .column-right .header-search');

      if(mbSearch.length) {
        mbSearch.off('click.initSearchToggle').on('click.initSearchToggle', function(e) {
          e.preventDefault();
          e.stopPropagation();
          navSearch.toggle();
          $('html').toggleClass("open-search");
          $('.header-wrapper .menu-mobile').toggleClass("search-open");
          if (wrapperCart.hasClass('is-open')) {
            wrapperCart.removeClass('is-open');
          };

          if(navCustomer.hasClass('is-open')) {
            navCustomer.removeClass('is-open');
            $('.userToggle').removeClass('is-open');
            $('html').removeClass('customer-open');
          };
          if($("html").hasClass("menu-open")){
            $("html").css({'overflow': ''});
            $("html").removeClass('menu-open');
            $(".header-wrapper .menu-mobile").removeClass('open_menu');
            $(".site-nav-dropdown").removeClass('open-menu');
            $(".site-nav .dropdow-lv2").removeClass('open-menu');
            $(".site-nav .top-brands").removeClass('open-menu');
          }
        });

      }
    },

    initMobileMenu:function() {
      if(window.innerWidth < 1025) {
        if(iconNav.is(':visible')) {
            var heightHeader = $('.site-header').outerHeight();
            body.off('click.toggleNav', '#showLeftPush').on('click.toggleNav', '#showLeftPush', function(e) {
              e.preventDefault();
              e.stopPropagation();

              if($('.search-results').is(':visible')) {
                $('.search-results').hide();
              };

              if($('html').hasClass('open-search')) {
                $('html').removeClass('open-search');
                $('.header-wrapper .menu-mobile').removeClass('search-open');
                $('.header-search').hide();
              }

              if (wrapperCart.hasClass('is-open')) {
                wrapperCart.removeClass('is-open');
              };

              if(navCustomer.hasClass('is-open')) {
                navCustomer.removeClass('is-open');
                $('.userToggle').removeClass('is-open');
                $('html').removeClass('customer-open');
              };

              iconNav.toggleClass('open');


              $(".header-wrapper .menu-mobile").toggleClass('open_menu');
              $('html').toggleClass('menu-open');

              if($('html').hasClass('menu-open')) {
                $('html').css({ "overflow": "hidden"});
              }
              else {
                $('html').css({ "overflow": ""});
                $('.navigation .site-nav .site-nav-dropdown.open-menu, .navigation .site-nav .site-nav-dropdown .inner ul.dropdow-lv2.open-menu, .navigation .site-nav .site-nav-dropdown .top-brands').removeClass('open-menu').css({ "overflow": ""});
                $('.navigation .site-nav .icon-dropdown').removeClass('mobile-toggle-open');
              }

              $('.wrap-overlay, .wrapper-left .close-menu').on('click', function(){ 
                $(".header-wrapper .menu-mobile").removeClass('open_menu');
                $("#showLeftPush").removeClass('open');
                $(".site-nav-dropdown").removeClass('open-menu');
                $(".dropdow-lv2").removeClass('open-menu');
                $(".site-nav .top-brands").removeClass('open-menu');
                $('html').removeClass('menu-open');
                $('html').css({ "overflow": ""});
                $('.navigation .site-nav .site-nav-dropdown.open-menu, .navigation .site-nav .site-nav-dropdown .inner ul.dropdow-lv2.open-menu, .navigation .site-nav .site-nav-dropdown .top-brands').removeClass('open-menu').css({ "overflow": ""});
                $('.navigation .site-nav .icon-dropdown').removeClass('mobile-toggle-open');
              });
            });                
            jewelias.initDropdownMenuMobile();
            $('.ft-multi-cur').prependTo($('.wrapper-navigation .hd-option'));
          }; 
       } else {
        $('.wrapper-navigation .hd-option .ft-multi-cur').hide();
       }
    },

    initDropdownMenuMobile: function() {
      if(window.innerWidth < 1025) {
        var menuMobile = $('.site-nav .dropdown, .site-nav .inner-wrap'),
            menuMbTitle = $('.site-nav .menu-mb-title'),
            icondropdown = $('.site-nav .dropdown a .icon-dropdown');
            dropdown = $('.site-nav li.dropdown');
            dropdown2 = $('.site-nav .inner-wrap');
            dropdownTopBrand = $('.site-nav .top-brands');

        icondropdown.off('click.current').on('click.current', function(e) {
          e.preventDefault();
          e.stopPropagation();
          $(this).parent().next('.site-nav-dropdown, .dropdow-lv2').addClass('open-menu');
        });

        menuMobile.find('a').on('click', function(e) {
          e.stopPropagation();
        });

        menuMbTitle.off('click.closeMenu').on('click.closeMenu', function(e) {
          e.preventDefault();
          e.stopPropagation();
          $(this).parent().removeClass('open-menu');
        });
      }
      dropdown.off('click.current').on('click.current', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).children('.site-nav-dropdown').addClass('open-menu');
      });

      dropdown2.off('click.current').on('click.current', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).children('.dropdow-lv2').addClass('open-menu');
      });

      dropdownTopBrand.off('click.current').on('click.current', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('open-menu');
      });

    },
    appendCustomerDropdownMobile: function() {
      if(window.innerWidth < 1025) {
        $('#dropdown-customer').appendTo('.wrapper-container');
      }
    },
    appendCartDropdownMobile: function() {
      if(window.innerWidth < 768) {
        $('.wrapper-top-cart').appendTo('.wrapper-container');
      }
    },
    initFixedTopMenu: function() {
      if($('.fix-top').length) {
        if ($(window).width() > 1024) {
          $('.wrapper-navigation-sticky').on('sticky-start', function() { 
            $('body').addClass('fixed_top');          
          });

          $('.wrapper-navigation-sticky').on('sticky-end', function() { 
            $('body').removeClass('fixed_top');
          });
           $(".wrapper-navigation-sticky").sticky({
            topSpacing:0,
            zIndex: 100
          });
        }  
      }
    },
    initDropdownSearch: function() {
      $('.header-search .searchToggle').click(function() {
        $('.header-search .search-form').addClass('open_sear');
        $('body').addClass('opensearfix');
      });

      $('.header-search .icon-close-fix').click(function() {
          if ($('.header-search .search-form').is(':visible')) {
              $('.header-search .search-form').removeClass('open_sear');
              $('body').removeClass('opensearfix');
          }
      });

      $('.header-search .search-form .bg-search').click(function() {
        $('.header-search .search-form').removeClass('open_sear');
        $('body').removeClass('opensearfix');
        $('html').removeClass('open-search');
        $('.header-wrapper .menu-mobile').removeClass('search-open');
        $('.header-search').hide();
      });
    },
    initDropdownMenu: function() {
      $('.nav-bar .site-nav .item').on('mouseover',function(event) {
            $('.wrapper-navigation').addClass('overlay-open');
        });

        $('.nav-bar .site-nav .item').on('mouseleave',function(event) {
            $('.wrapper-navigation').removeClass('overlay-open');
        });
    },
    openCustomerDropDownMobile: function(icon, parentSlt) {
      $('.customer-links .userToggle').click(function() {
        if ($(window).width() < 1025) {
          $('html').addClass('customer-open');
        }
      });
    },
    doOpenDropdown: function(icon, parentSlt) {
      icon.off('click.toogleDropdown').on('click.toogleDropdown', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if($('.search-results').is(':visible')) {
          $('.search-results').hide();
        };

        if($('html').hasClass('open-search')) {
          $('html').removeClass('open-search')
          $('.header-wrapper .menu-mobile').removeClass('search-open');
          $('.header-search').hide();
        }

        if($("html").hasClass("menu-open")){
          $("html").removeClass('menu-open');
          $("html").css({ "overflow": ""});
          $(".header-wrapper .menu-mobile").removeClass('open_menu');
          $(".site-nav-dropdown").removeClass('open-menu');
          $(".site-nav .dropdow-lv2").removeClass('open-menu');
          $(".site-nav .top-brands").removeClass('open-menu');
        }

        if(parentSlt == '.nav-customer') {
          if (wrapperCart.hasClass('is-open')) {
            wrapperCart.removeClass('is-open');
            $('.userToggle').removeClass('is-open');
            $('html').removeClass('customer-open');
          }
        }
        else if(parentSlt == '.wrapper-top-cart') {
          if(navCustomer.hasClass('is-open')) {
            navCustomer.removeClass('is-open');
            $('.userToggle').removeClass('is-open');
            $('html').removeClass('customer-open');
          };
        };

        $(parentSlt).toggleClass('is-open');
        $(parentSlt).parent().find('.userToggle').toggleClass('is-open');
      });
    },

    closeDropdown:function() {
      var dropdownCustomerSlt = '#dropdown-customer';
      var dropdownCartSlt = '#dropdown-cart';

      doc.off('click.closeDropdown').on('click.closeDropdown', function(e) {   
        if ((!$(e.target).closest(dropdownCustomerSlt).length && !$(e.target).closest('.nav-customer').length && navCustomer.hasClass('is-open')) || (!$(e.target).closest(dropdownCartSlt).length && !$(e.target).closest('.wrapper-top-cart').length && wrapperCart.hasClass('is-open'))) {
          wrapperCart.removeClass('is-open');
          navCustomer.removeClass('is-open');
          $('.userToggle').removeClass('is-open');
          $('html').removeClass('customer-open');
        }
      });

      $('#dropdown-customer .close-menu').on('click', function(){
        $(".customer-links .userToggle").removeClass('is-open');
        $(".customer-links .nav-customer").removeClass('is-open');
        $('html').removeClass('customer-open');
      });

      $('.wrapper-top-cart .close-menu').on('click', function(){
        $('.wrapper-top-cart').removeClass('is-open');
      });
    },

    initDropdownLogin: function() {
      jewelias.doOpenDropdown($('.header-wrapper .userToggle'), '.nav-customer');        
    },

    MultiOption: function(){

      var sortbyTextLang =$('.lang-currency-groups .lang-switcher').find('.active').text().trim();

      $(".lang-currency-groups .hd_lang").text(sortbyTextLang);


      var sortbyText = $('.lang-currency-groups #currencies').find('.active').text().trim();

      $(".lang-currency-groups .hd_currency").text(sortbyText);

      var icon_img = $('.lang-currency-groups .lang-switcher').find('.active img').attr('data-src');

      $('.lang-currency-groups .lang-switcher .icon-lang img').attr({ src: icon_img });

      $('.lang-currency-groups #currencies li').on('click', function(){
        var sortbyText = $('.lang-currency-groups #currencies').find('.active').text();

        $(".lang-currency-groups .hd_currency").text(sortbyText);
      });

      $(document).click(function(e){
        var mult = $(".footer-middle .lang-currency-groups.ft-multi-cur .lang-switcher");
        if (!mult.is(e.target) && mult.has(e.target).length === 0 ){
          $('.footer-middle .lang-currency-groups .lang-switcher .language').slideUp(300);
        }
      });

      $('.footer-middle .lang-currency-groups.ft-multi-cur .lang-switcher').on('click', function(){
        $('.footer-middle .lang-currency-groups .lang-switcher .language').slideToggle(300);

      }); 


      $(document).click(function(e){
        var mulc = $(".footer-middle .ft-multi-cur .currency-groups");
        if (!mulc.is(e.target) && mulc.has(e.target).length === 0 ){
          $('.footer-middle .lang-currency-groups .currency-groups #currencies').slideUp(300);
        }
      });

      $('.footer-middle .lang-currency-groups.ft-multi-cur .currency-groups').on('click', function(){
        $('.footer-middle .lang-currency-groups .currency-groups #currencies').slideToggle(300);

      });
    },    
    slider_megamenu: function(){
      if($('.featuredProductCarousel').length){
        $('.featuredProductCarousel').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: true
        });      
      }
      if ($('.featuredProductCarousel').length) {
        $(".site-nav li").mouseover(function() {
            $('.featuredProductCarousel').get(0).slick.setPosition();
        }); 
      }
    },
    slider_promotion_bar: function(){
      if($('.promotion-bar .block-item-list').length){
        $('.promotion-bar .block-item-list').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            dots: false,
            arrows: true,
            autoplay: true,
            nextArrow: '<button type="button" class="slick-next"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="284.935px" height="284.936px" viewBox="0 0 284.935 284.936" style="enable-background:new 0 0 284.935 284.936;" xml:space="preserve"><path d="M222.701,135.9L89.652,2.857C87.748,0.955,85.557,0,83.084,0c-2.474,0-4.664,0.955-6.567,2.857L62.244,17.133 c-1.906,1.903-2.855,4.089-2.855,6.567c0,2.478,0.949,4.664,2.855,6.567l112.204,112.204L62.244,254.677 c-1.906,1.903-2.855,4.093-2.855,6.564c0,2.477,0.949,4.667,2.855,6.57l14.274,14.271c1.903,1.905,4.093,2.854,6.567,2.854 c2.473,0,4.663-0.951,6.567-2.854l133.042-133.044c1.902-1.902,2.854-4.093,2.854-6.567S224.603,137.807,222.701,135.9z"/></svg></button>',
            prevArrow: '<button type="button" class="slick-prev"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="284.935px" height="284.936px" viewBox="0 0 284.935 284.936" style="enable-background:new 0 0 284.935 284.936;" xml:space="preserve"><path d="M110.488,142.468L222.694,30.264c1.902-1.903,2.854-4.093,2.854-6.567c0-2.474-0.951-4.664-2.854-6.563L208.417,2.857 C206.513,0.955,204.324,0,201.856,0c-2.475,0-4.664,0.955-6.567,2.857L62.24,135.9c-1.903,1.903-2.852,4.093-2.852,6.567 c0,2.475,0.949,4.664,2.852,6.567l133.042,133.043c1.906,1.906,4.097,2.857,6.571,2.857c2.471,0,4.66-0.951,6.563-2.857 l14.277-14.267c1.902-1.903,2.851-4.094,2.851-6.57c0-2.472-0.948-4.661-2.851-6.564L110.488,142.468z"/></svg></button>',
            speed : 1000,
            responsive: [
            {
              breakpoint: 1025,
              settings: {
                arrows:true,
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows:true,
              }
            },
            {
              breakpoint: 571,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows:true,
              }
            }
          ]
        });      
      }
    },
    initslideshow: function(slideshow, autoplay , autoplaySpeed, fade) {   
      $('.slideslick').each(function(){
        var slideshow =  $(this),
            autoplay=  $(this).data('auto'), 
            autoplaySpeed=  $(this).data('speed'),
            fade=  $(this).data('transition');
        jewelias.slideshow(slideshow, autoplay , autoplaySpeed, fade);

      });
    },

    slideshow: function(slideshow, autoplay , autoplaySpeed, fade){
      if(slideshow.length){
        slideshow.not('.slick-initialized').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: autoplay, 
          autoplaySpeed: autoplaySpeed,
          fade: fade,
          adaptiveHeight: true,
          arrows: true,
          nextArrow: '<button type="button" class="slick-next"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 20 20"><path d="M5 20c-0.128 0-0.256-0.049-0.354-0.146-0.195-0.195-0.195-0.512 0-0.707l8.646-8.646-8.646-8.646c-0.195-0.195-0.195-0.512 0-0.707s0.512-0.195 0.707 0l9 9c0.195 0.195 0.195 0.512 0 0.707l-9 9c-0.098 0.098-0.226 0.146-0.354 0.146z"></path></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 20 20"><path d="M14 20c0.128 0 0.256-0.049 0.354-0.146 0.195-0.195 0.195-0.512 0-0.707l-8.646-8.646 8.646-8.646c0.195-0.195 0.195-0.512 0-0.707s-0.512-0.195-0.707 0l-9 9c-0.195 0.195-0.195 0.512 0 0.707l9 9c0.098 0.098 0.226 0.146 0.354 0.146z"></path></svg></button>',
          speed : 1000,
          dots: true,
          responsive: [
            {
              breakpoint: 1025,
              settings: {
                arrows:false,
              }
            }
          ]
          
        });
        $(slideshow).on('afterChange', function(event, slick, currentSlide){
           jewelias.closeLookBookPopup();
        });
      }
    },
    featuredproduct: function(widgetProduct){
      widgetProduct.each(function(){
        var featured_product =  $(this).find('.products-grid');

        if(featured_product.length){
          featured_product.not('.slick-initialized').slick({
            slidesToShow: featured_product.data('row'),
            slidesToScroll: featured_product.data('row'),
            arrows: true,
            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',       
            speed : 1000,
            responsive: [
              {
                breakpoint: 1025,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                  dots: true,
                  arrows: false   
                }
              },
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  dots: true,
                  arrows: false
                }
              },
              {
                breakpoint: 360,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  dots: true,
                  arrows: false
                }
              }
            ]
          });
        }
      });
    },
    closeLookBookPopup: function(){
      $('.lookbook-modal').fadeOut(100);
    },

    initLookbookProductDescription: function() {
      var productLookbook = $('.product-lookbook:not(.grouped-lb)');
      var glyphIcon = productLookbook.find('.glyphicon');
      var glyphIconSlt = '.product-lookbook .glyphicon';

      if(glyphIcon.length) {
        $(document).on('click', glyphIconSlt, function(e){
          e.preventDefault();
          e.stopPropagation();

          var context = $(this).data('text'),
              position = $(this);

          jewelias.doAjaxLookbookProductDescription(context, position);

          $('.lookbook-modal .close-modal').on('click',function(){
            jewelias.closeLookBookPopup();
          });

        });
      }
    },

    doAjaxLookbookProductDescription: function(context, position){
      if(window.innerWidth > 1024){
        var offSet = $(position).offset(),
            top= offSet.top,
            left = offSet.left,
            content = position.closest('.product-lookbook').innerWidth(),
            newtop = top + 10 + "px",
            newleft = left + 40 + "px";

        if ((content - left) < 290) {
             newleft = (left - 290) + "px";
        }
      }
      else{
        var offSet = $(position).offset(),
            top= offSet.top,
            left = offSet.left,
            content = position.closest('.product-lookbook').innerWidth(),
            newtop = top,
            newleft = left + 40 + "px";

         if ((content - left) < 290) {
             newleft = (left - 290) + "px";
         }
      };

      $('.lookbook-content').html(context); 
      $('.lookbook-modal').addClass('lb-des').fadeIn(500).css({'left': newleft, 'top': newtop });           
    }, 

    Slickslider: function(dataslick, row, rowtb, rowtblg, rowbm, arrows, dots, auto, fade, arrowsmb, dotsmb){
      dataslick.not('.slick-initialized').slick({
        infinite: false,
        slidesToShow: row,
        slidesToScroll: 1,
        arrows: arrows,
        dots: dots,
        fade: fade,
        autoplay:auto,
        autoplaySpeed: 5000,
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
        speed : 500,  
        responsive: [
          {
            breakpoint: 1025,
            settings: {
              slidesToShow: rowtb,
              slidesToScroll: 1,
              dots: dotsmb,
              arrows: arrowsmb,
              autoplay:auto,
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: rowtblg,
              slidesToScroll: 1,
              dots: dotsmb,
              arrows: arrowsmb,
              autoplay:auto,
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: rowbm,
              slidesToScroll: 1,
              dots: dotsmb,
              arrows: arrowsmb,
              autoplay:auto,
            }
          },
          {
            breakpoint: 370,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: dotsmb,
              arrows:arrowsmb,
              autoplay:auto,
            }
          }
        ]
      });
    },

    SlicksliderHP: function() {
      $('.has-slick').each(function(){
        var slick = $(this),
            row = $(this).data('row'),
            rowtb = $(this).data('rowtb'),
            rowtblg = $(this).data('rowtblg'),
            rowbm = $(this).data('rowbm');

        if($(this).hasClass('not-arrows')){
          var arrows = false,
              dots = true,
              auto = true,
              fade = $(this).data('fade');
        }
        else{
          var arrows = true,
              dots = false,
              auto = false,
              fade = false;
        }

        if($(this).hasClass('has-arrows')){

          var arrowsmb = false,
              dotsmb= true;
        } else{
          var arrowsmb= false,
              dotsmb= true;
        }

        jewelias.Slickslider(slick, row, rowtb, rowtblg, rowbm, arrows, dots, auto, fade, arrowsmb, dotsmb);
      });
    },

    clickDropdownCart:function() {
      jewelias.doOpenDropdown($('.wrapper-navigation .cartToggle'), '.wrapper-top-cart');
    },

    initDropdownCart:function() {
      jewelias.clickDropdownCart();
      jewelias.checkItemsInDropdownCart();
      jewelias.removeItemDropdownCart();
    },

    initColorSwatchGrid: function() {
      var windowWidth = $(window).width();
      $(document).on('click', '.item-swatch li label', function(){
        $(".item-swatch li label").removeClass("active");
        $(this).addClass("active");
        var newImage = $(this).data('img');
        $(this).parents('.product-item').find('.product-grid-image img.images-one').attr({ src: newImage }); 
        return false;
      });
    },
    initScrollTop: function() {
      $(window).scroll(function() {
        if ($(this).scrollTop() > 220) {
          $('#back-top').fadeIn(400);
        }

        else {
          $('#back-top').fadeOut(400);
        }
      });

      $('#back-top').off('click.scrollTop').on('click.scrollTop', function(e) {
        e.preventDefault();
        e.stopPropagation();

        $('html, body').animate({scrollTop: 0}, 400);
        return false;
      });
    },

    initProductSidebarSlider: function() {
      var widgetFeaturedProduct = $('.sidebar .widget-featured-product');

      widgetFeaturedProduct.each(function() {
        var productGrid = $(this).find('.products-grid');

        if(productGrid.length && !productGrid.hasClass('slick-initialized')) {
          productGrid.slick({
            dots: true,
            slidesToScroll: 1,
            slidesToShow: 1,
            verticalSwiping: false,
            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>'
          });
        };           
      });
    },

    sidebarParams: function() {
      Shopify.queryParams = {};

      //get after ?...=> Object {q: "Acme"} 

      if (location.search.length) {
        for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('=');

          if (aKeyValue.length > 1) {
            Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
          }
        }
      };
    },

    showLoading: function() {
      $('.loading-modal').show();
    },

    hideLoading: function() {
      $('.loading-modal').hide();
    },

    showModal: function(selector) {
      $(selector).fadeIn(500);
      jewelias.jeweliasTimeout = setTimeout(function() {
        $(selector).fadeOut(500);
      }, 5000);
    },

    closeModal: function() {
      $('.continue-shopping').click(function() {
        clearTimeout(jewelias.ellaTimeout);
        $('.ajax-success-modal').fadeOut(500);
      });
      $('.close-modal').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(jewelias.jeweliasTimeout);
        $('.ajax-success-modal').fadeOut(500);
      });

    },

    checkNeedToConvertCurrency: function() {
      return window.show_multiple_currencies && Currency.currentCurrency != shopCurrency;
    },

    sidebarMapEvents: function() {
      jewelias.sidebarMapCategories();
      jewelias.sidebarMapTagEvents();
    },

    toolbarMapEvents:function() {
      jewelias.sidebarParams();
      jewelias.sidebarMapView();
      jewelias.sidebarMapSorting();
    },

    initSidebar: function() {
      if ($('.collection-sidebar').length) {
        jewelias.sidebarParams();
        jewelias.sidebarMapEvents();          
        jewelias.sidebarMapClear();
        jewelias.sidebarMapClearAll();
      };
    },

    initToolbar: function() {
      jewelias.initDropdownFilterSortby();
      jewelias.toolbarMapEvents();
    },

    sidebarMapPaging: function() {
      var paginationSlt = '.pagination-page a';

      body.off('click.initMapPaging', paginationSlt).on('click.initMapPaging', paginationSlt, function(e) {
        var tiler = $('head title').text();
        e.preventDefault();
        e.stopPropagation();

        var page = $(this).attr('href').match(/page=\d+/g);

        if (page) {
          Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));

          if (Shopify.queryParams.page) {
            var newurl = jewelias.sidebarCreateUrl();

            jewelias.isSidebarAjaxClick = true;

            History.pushState({
              param: Shopify.queryParams
            }, newurl, newurl);
            var tiler = $('head title').text(tiler);
            jewelias.sidebarGetContent(newurl);

            var top = $('.template-collection .row-bt, .search-page').offset().top;

            $('body,html').animate({
              scrollTop: top
            }, 600);
          };
        };

      });
    },

    initInfiniteScrolling: function() {
      var infiniteScrolling = $('.infinite-scrolling');
      var infiniteScrollingLinkSlt = '.infinite-scrolling a';

      if(infiniteScrolling.length > 0) {
        body.off('click.initInfiniteScrolling', infiniteScrollingLinkSlt).on('click.initInfiniteScrolling', infiniteScrollingLinkSlt, function(e) {
          e.preventDefault();
          e.stopPropagation();

          if (!$(this).hasClass('disabled')) {
            jewelias.doInfiniteScrolling();
          };
        });

        if(window.infinity_scroll_feature) {
          window.infinitPos = 0;

          $(window).scroll(function(event) {
            var pos = infiniteScrolling.offset().top;

            if ($(this).scrollTop() > (pos - 600) && $(this).scrollTop() - window.infinitPos > 1000
               ) {
              window.infinitPos = $(this).scrollTop();

              $(infiniteScrollingLinkSlt).trigger("click");

              event.stopPropagation();
              event.preventDefault();
            }
          });
        }
      };
    },

    doInfiniteScrolling: function(i) {
      var currentList = $('.block-row .products-grid');

      if (!currentList.length) {
        currentList = $('.block-row .product-list');
      };

      if (currentList) {
        var showMoreButton = $('.infinite-scrolling a');
        
        $.ajax({
          type: 'GET',
          url: showMoreButton.attr('href'),

          beforeSend: function() {
            jewelias.showLoading();
          },

          success: function(data) {
            jewelias.hideLoading();
            

            var products = $(data).find('.block-row .products-grid');
            

            if (!products.length) {
              products = $(data).find('.block-row .product-list');
            };

            if (products.length) {
              
              currentList.append(products.children());
              

              products.each(function(item) {
                jewelias.initWishListIcons();
              });

              jewelias.translateBlock('.main-content');

              //get link of Show more
              if ($(data).find('.infinite-scrolling').length > 0) {
                showMoreButton.attr('href', $(data).find('.infinite-scrolling a').attr('href'));
              }
              else {
                //no more products
                var noMoreText = window.inventory_text.no_more_product;

                if (window.multi_lang) {
                  if (translator.isLang2()) 
                    noMoreText = window.lang2.collections.general.no_more_product;
                }

                showMoreButton.html(noMoreText).addClass('disabled');
              };

              //currency
              if (jewelias.checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
              };

              //product review
              if ($(".spr-badge").length > 0) {
                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
              };
            }
          },

          error: function(xhr, text) {
            jewelias.hideLoading();
            $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
            jewelias.showModal('.ajax-error-modal');
          },
          dataType: "html"
        });
      }
    },

    sidebarMapCategories: function() {
      if ($('.sidebar-links .widget-content').length > 0) {
        $('.sidebar-links .widget-content ul li').each(function(){
          if ($(this).children('a').hasClass('active')) {
            $(this).addClass('current-cat');
          }
          if ($(this).hasClass('current-cat')) {
            $(this).children('.dropdown-cat').addClass('cat-expanded').siblings('.icon-dropdown').addClass('is-clicked');
            $(this).parents('.dropdown-cat').addClass('cat-expanded').siblings('.icon-dropdown').addClass('is-clicked');
          }

          $(this).find("> .icon-dropdown").on('click', function() {
                $(this).parent().siblings().find("> .icon-dropdown").removeClass('is-clicked');
                $(this).parent().siblings().find("> .dropdown-cat").slideUp( "slow" );
                $(this).parent().find("> .dropdown-cat").slideToggle( "slow" );

                if ($(this).hasClass('is-clicked')) {
                    $(this).removeClass('is-clicked');
                } else {
                    $(this).addClass('is-clicked');
                }
           });
        });
      };
    },

    sidebarMapTagEvents: function() {
      var sidebarTag = $('.sidebar-tag .list-tags a, .sidebar-tag .list-tags label, .refined .selected-tag');
      
      sidebarTag.off('click.checkedTag').on('click.checkedTag', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var currentTags = [];

        if (Shopify.queryParams.constraint) {
          currentTags = Shopify.queryParams.constraint.split('+'); //Array
        };

        //one selection or multi selection
        if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(':checked')) {
          //remove other selection first
          var otherTag = $(this).closest('.sidebar-tag, .refined-widgets').find('input:checked');

          if (otherTag.length) {
            var tagName = otherTag.val();
            if (tagName) {
              var tagPos = currentTags.indexOf(tagName);
              if (tagPos >= 0) {
                //remove tag
                currentTags.splice(tagPos, 1);
              }
            }
          };
        };

        var tagName = $(this).prev().val();

        if (tagName) {
          var tagPos = currentTags.indexOf(tagName);
          if (tagPos >= 0) {
            //tag already existed, remove tag
            currentTags.splice(tagPos, 1);
          }
          else {
            //tag not existed
            currentTags.push(tagName);
          }
        };

        if (currentTags.length) {
          Shopify.queryParams.constraint = currentTags.join('+');
        }
        else {
          delete Shopify.queryParams.constraint;
        };

        jewelias.sidebarAjaxClick();
      });
    },

    sidebarMapClear: function() {
      var sidebarTag = $('.sidebar-tag');

      sidebarTag.each(function() {
        var sidebarTag = $(this);

        if (sidebarTag.find('input:checked').length) {
          //has active tag
          sidebarTag.find('.clear').show().click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            var currentTags = [];

            if (Shopify.queryParams.constraint) {
              currentTags = Shopify.queryParams.constraint.split('+');
            };

            sidebarTag.find("input:checked").each(function() {
              var selectedTag = $(this);
              var tagName = selectedTag.val();

              if (tagName) {
                var tagPos = currentTags.indexOf(tagName);
                if (tagPos >= 0) {
                  //remove tag
                  currentTags.splice(tagPos, 1);
                };
              };
            });

            if (currentTags.length) {
              Shopify.queryParams.constraint = currentTags.join('+');
            }
            else {
              delete Shopify.queryParams.constraint;
            };

            jewelias.sidebarAjaxClick();

          });
        }
      });
    },

    sidebarMapClearAll: function() {
      var clearAllSlt = '.refined-widgets a.clear-all';
      var clearAllElm = $(clearAllSlt);

      body.off('click.clearAllTags', clearAllSlt).on('click.clearAllTags', clearAllSlt, function(e) {
        e.preventDefault();
        e.stopPropagation();

        delete Shopify.queryParams.constraint;
        delete Shopify.queryParams.q;

        jewelias.sidebarAjaxClick();
      });
    },

    sidebarMapView: function() {
      var viewAsSlt = '.toolbar .view-mode .view-as';
      var viewAs = $(viewAsSlt);

      body.off('click.mapView', viewAsSlt).on('click.mapView', viewAsSlt, function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!$(this).hasClass('active')) {

          if ($(this).hasClass('list')) {
            Shopify.queryParams.view = 'list';
          }
          else {
            Shopify.queryParams.view = '';
          }

          jewelias.sidebarAjaxClick();

          $('.view-mode .view-as.active').removeClass('active');
          $(this).addClass('active');
        }
      });
    },

    initDropdownFilterSortby:function() {
      var labelSlt = '.filter-sortby .label-tab';
      var dropdownMenuSlt = '.filter-sortby .dropdown-menu';

      body.off('click.dropdownFilterSortby', labelSlt).on('click.dropdownFilterSortby', labelSlt, function(e) {
        e.preventDefault();
        e.stopPropagation();

        $(this).toggleClass('active').next('.dropdown-menu').toggle();
      });

      doc.off('click.hideFilterSortby').on('click.hideFilterSortby', function(e) {
        if (!$(e.target).closest(dropdownMenuSlt).length && $(labelSlt).hasClass('active')) {
          $(labelSlt).removeClass('active').next('.dropdown-menu').hide();
        }
      });
    },

    sidebarMapSorting: function() {
      var sortbyFilterSlt = '.filter-sortby li span';
      var sortbyFilter = $(sortbyFilterSlt);

      body.off('click.sortBy', sortbyFilterSlt).on('click.sortBy', sortbyFilterSlt, function(e) {
        e.preventDefault();
        e.stopPropagation();

        var self = $(this);
        var parent = self.parent();
        var sortbyText = self.text();
        var label = $('.filter-sortby .label-tab .label-text');

        if(!parent.hasClass('active')) {
          Shopify.queryParams.sort_by = $(this).attr('data-href');
          jewelias.sidebarAjaxClick();
          label.text(sortbyText);
        }

        sortbyFilter.not(self).parent().removeClass('active');
        self.parent().addClass('active');

        $('.filter-sortby .label-tab').removeClass('active').next('.dropdown-menu').hide();
      });

      if (Shopify.queryParams.sort_by) {
        var sortby = Shopify.queryParams.sort_by;
        var sortbyText = $(".filter-sortby span[data-href='" + sortby + "']").text();

        $('.filter-sortby .label-tab .label-text').text(sortbyText);
        $('.filter-sortby li.active').removeClass('active');
        $(".filter-sortby span[data-href='" + sortby + "']").parent().addClass("active");
      }

      else {
        var sortbyText = $('.filter-sortby .dropdown-menu .active').text();

        $('.filter-sortby .label-tab .label-text').text(sortbyText);
      }
    },

    sidebarAjaxClick: function(baseLink) {
      var tiler = $('head title').text();
      delete Shopify.queryParams.page;
      var newurl = jewelias.sidebarCreateUrl(baseLink);

      jewelias.isSidebarAjaxClick = true;

      History.pushState({
        param: Shopify.queryParams
      }, newurl, newurl);
      $('head title').text(tiler);
      jewelias.sidebarGetContent(newurl);

    },

    sidebarCreateUrl: function(baseLink) {
      var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');

      if (baseLink) {
        if (newQuery != "")
          return baseLink + "?" + newQuery;
        else
          return baseLink;
      }

      return location.pathname + "?" + newQuery;
    },

    sidebarInitToggle: function() {
      var sidebarLabelSlt = '.sidebar-label .sidebar-button';
      var sidebarLabel = $(sidebarLabelSlt);
      $(sidebarLabelSlt).click(function(){
        $('.col-sidebar').toggleClass('open');
        $('html').toggleClass('open-sidebar');
        $('.wrap-overlay, .close-sidebar').click(function(){
          $('html').removeClass('open-sidebar'); 
          $('.col-sidebar').removeClass('open');
        });
      });

      var widgetTitleSlt = '.sidebar-custom .widget-header';
      var widgetTitle = $(widgetTitleSlt);

      if(window.innerWidth < 992) {
        widgetTitle.addClass('open'); 
      }
      else {
        widgetTitle.removeClass('open'); 
      }

      body.off('click.slideToogle', widgetTitleSlt).on('click.slideToogle', widgetTitleSlt, function(e) {
        clearTimeout(jewelias.jeweliasTimeout);

        jewelias.jeweliasTimeout = setTimeout(function() {
          $('.widget-product .products-grid').slick('unslick');    
          $('.widget-product .products-grid').find('.slick-list').removeAttr('style');

          jewelias.initProductSidebarSlider();
        }, 50);

        $(this).toggleClass('open');
        $(this).next().slideToggle();
      });
    },

    sidebarGetContent: function(newurl) {
      if (jewelias.isAjaxLoading) return;	
      $.ajax({
        type: 'get',
        url: newurl,

        beforeSend: function() {
          jewelias.showLoading();
        },

        success: function(data) {

          jewelias.sidebarMapData(data);
          jewelias.translateBlock('.main-content');
          jewelias.initColorSwatchGrid();
          jewelias.sidebarMapTagEvents();
          jewelias.sidebarMapClear();
          jewelias.hideLoading();


          if(window.innerWidth < 992 && $('.col-sidebar .sidebar-label').is(':visible')) {
            $('.sidebar').removeClass('open').slideUp(600);
          }
          else {
            $('.sidebar').css({'display': ''});
          };
        },

        error: function(xhr, text) {
          jewelias.hideLoading();
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          jewelias.showModal('.ajax-error-modal');
        }
      });
    },

    sidebarMapData: function(data) {

      var currentList = $('.col-main .products-grid');

      if (currentList.length == 0) {
        currentList = $('.col-main .product-list');
      };

      var productList = $(data).find('.col-main .products-grid');

      if (productList.length == 0) {
        productList = $(data).find('.col-main .product-list');
      };

      if (productList.length > 0 && productList.hasClass('products-grid')) {
        //         jewelias.initResizeImage(productList.find('img'));
      };

      currentList.replaceWith(productList);

      //convert currency
      if (jewelias.checkNeedToConvertCurrency()) {
        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
      };

      //replace paging
      if ($('.toolbar .padding').length > 0) {
        $('.toolbar .padding').replaceWith($(data).find(".toolbar .padding"));
      }
      else {
        $(".toolbar-right").append($(data).find('.toolbar-right .padding'));
      };

      if ($('.collection-padding').length > 0) {
        $('.collection-padding').replaceWith($(data).find(".collection-padding"));
      }
      else {
        $(".collections-content-product").append($(data).find('.collection-padding'));
      };
      if ($('.template-search').length > 0) {
        $('.padding').replaceWith($(data).find(".padding"));
      }

      //replace refined
      $('.refined-widgets').replaceWith($(data).find('.refined-widgets'));

      //replace tags
      $('.sidebar-block').replaceWith($(data).find('.sidebar-block'));

      // breadcrumb
      $('.breadcrumb .bd-title').replaceWith($(data).find('.breadcrumb .bd-title'));

      $(".cat-content").replaceWith($(data).find(".cat-content"));

      $(".page-header h2").replaceWith($(data).find(".page-header h2"));

      $('head title').text(($(data).filter('title').text()));

      jewelias.initProductSidebarSlider();
      jewelias.initWishListIcons();

      //product review
      if ($('.spr-badge').length > 0) {
        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
      };
    },

    translateBlock: function(blockSelector) {
      if (window.multi_lang && translator.isLang2()) {
        translator.doTranslate(blockSelector);
      }
    },

    translateText: function(str) {
      if (!window.multi_lang || str.indexOf("|") < 0)
        return str;

      if (window.multi_lang) {
        var textArr = str.split("|");

        if (translator.isLang2())
          return textArr[1];
        return textArr[0];
      };
    },
    initProductMoreview: function() {
      if ($('.template-product .pro-page').hasClass('halo-product-gallery')) {
        jewelias.initVerticalMoreview();
      } else {
        jewelias.initDefaultMoreview();
      }
    },
    initDefaultMoreview: function() {
      var sliderFor = $('.product .slider-for'),
          sliderNav = $('.product .slider-nav');

      if ($('.product .product-img-box').hasClass('vertical')) {
        var dataVertical = true;
      }
      else if ($('.product .product-img-box').hasClass('horizontal')) {
        var dataVertical = false;
      };

      if($('.template-product .sidebar').length) {
        var dataRow = 5;
      }
      else {
        if ($('.product .product-img-box').hasClass('horizontal')) {
          var dataRow= 6;
        } else {
          var dataRow = 5;
        }
      };
      if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
        sliderFor.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          verticalSwiping: false,
          asNavFor: sliderNav
        });

        sliderNav.slick({
          infinite: true,
          slidesToShow: dataRow,
          slidesToScroll: 1,
          vertical: dataVertical,
          asNavFor: sliderFor,
          verticalSwiping: false,
          dots: false,
          focusOnSelect: true,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 768,
              settings: {
                vertical: false,
                slidesToShow: 5,
                slidesToScroll: 1,
                dots: false,
                arrows:true
              }
            },
            {
              breakpoint: 380,
              settings: {
                vertical: false,
                slidesToShow: 4,
                slidesToScroll: 1,
                dots: false,
                arrows:true
              }
            },
            {
              breakpoint: 360,
              settings: {
                vertical: false,
                slidesToShow: 3,
                slidesToScroll: 1,
                dots: false,
                arrows:true
              }
            }
          ]
        });
      };
    },
    initVerticalMoreview: function() {
      var sliderFor = $('.product .slider-for'),
          sliderNav = $('.product .slider-nav');

       
        if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
          
          sliderNav.slick({
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            vertical: true,
            verticalSwiping: false,
            dots: false,
            focusOnSelect: true,
            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
            responsive: [
            {

                breakpoint: 1199,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 1,
                  vertical: true
                }
              },
              {
                breakpoint: 991,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  dots: false,
                  vertical: true
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 5,
                  slidesToScroll: 1,
                  dots: false,
                  arrows:true,
                  vertical: false,
                  asNavFor: sliderFor
                }
              },
              {
                breakpoint: 380,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 1,
                  dots: false,
                  arrows:true,
                  vertical: false,
                  asNavFor: sliderFor
                }
              },
              {
                breakpoint: 360,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                  dots: false,
                  arrows:true,
                  vertical: false,
                  asNavFor: sliderFor
                }
              }
            ]
          });
        };
 

      if($(window).width() <= 767) {
        if (!sliderFor.hasClass('slick-initialized')) {

          sliderFor.slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            verticalSwiping: false,
            dots: false,
            arrows:false,
            focusOnSelect: true,
            asNavFor: sliderNav
          });
        };
      }

      if($(window).width() > 767) {
        var heightImage = $('.product-img-box .slider-for .thumb img').height();
        var heightSlick = $('.product-img-box .product-thumb-wrapper .slick-list').height();

        if (heightImage > heightSlick) {
          $('.product-img-box .contain-images-pr .product-thumb-wrapper .slider-nav-wrapper').css({'height': heightImage});
        } else {
          $('.product-img-box .contain-images-pr .product-thumb-wrapper .slider-nav-wrapper').css({'height': 'auto'});
        }

        var verticalTabFullWith = $('.halo-product-gallery');   
        var variantImg = verticalTabFullWith.find('.contain-images-pr [href*="#img-"]');

        variantImg.on('click', function(e) {
          e.preventDefault();

          $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
          }, 300);
        });
      }
    },

    initRelatedProductSlider: function() {
      var templatePro = $('.template-product');
      var sidebar = templatePro.find('.sidebar');
      if(sidebar.length) {
        var sidebarRow = 3 ;
      }
      else {
        var sidebarRow = 5;
      };
      var relatedProduct = $('.related-products');
      var productGrid = relatedProduct.find('.products-grid');
      if(relatedProduct.length) {
        productGrid.slick({
          infinite: false,
          speed: 500,
          slidesToShow: sidebarRow,
          slidesToScroll: 1,
          dots: false,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 1025,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: false,
                dots: true
              }
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: false,
                dots: true
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                dots: true,
                arrows: false
              }
            },

            {
              breakpoint: 370,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true,
                arrows: false
              }
            }
          ]
        });
      };
    },

    initZoom: function() {
      if ($(window).width() >= 1025 ) {
        $('.product-photo-container .fancybox').zoom();
      }
      else {    
        $('.product-photo-container .fancybox').trigger('zoom.destroy');
      }                     
    },

    initToDay: function() {
      $(document).on('click', '.add-to-day', function(e) {
        e.preventDefault();
        if($(this).attr('disabled') != 'disabled') {
          var productTD = $('.todays-deal').attr('id');
          productTD = productTD.match(/\d+/g);
          if(!window.ajax_cart) {
            $(this).closest('form').submit();
          }

          else {
            var variant_id = $('#td-' + productTD + '  select[name=id]').val();

            if(!variant_id) {
              variant_id = $('#td-' + productTD + ' input[name=id]').val();
            }

            var quantity = $('#td-' + productTD + ' form input[name=quantity]').val();

            if(!quantity) {
              quantity = 1;
            }

            var title = $('.todays-deal .product-title').html();

            var vendor = $(this).closest('form').data('vendor');

            var image = $('.todays-deal .pro-img-home .item-img img').attr('src');

            jewelias.doAjaxAddToCart(variant_id, quantity, title, vendor, image);
          }
        }
        return false;
      }); 
    },

    initAddToCart: function() {
      if ($('.add-to-cart-btn').length > 0) {
        $(document).on('click', '.add-to-cart-btn', function(e) {
          e.preventDefault();
          var self = $(this),
              data = self.closest('form').serialize();
          if ($(this).attr('disabled') != 'disabled') {
            var productItem = $(this).parents('.product-item');
            var productId = $(productItem).attr('id');          
            var handle = $(productItem).find('.product-grid-image').data('handle');
            var form = $(productItem).find('form');
            
            if (!window.ajax_cart) {
              $(this).closest('form').submit();
            } 
            else {
              var variant_id = form.find('select[name=id]').val();
              if (!variant_id) {
                variant_id = form.find('input[name=id]').val();
              };
              var quantity = form.find('input[name=quantity]').val();

              if (!quantity) {
                quantity = 1;
              }

              var title = $(productItem).find('.product-title').html();
              var vendor = $(this).closest('form').data('vendor');
              var image = $(productItem).find('.product-grid-image img').attr('src');
              jewelias.doAjaxAddToCart(data, title, vendor, image);
            }
          }

          return false;

        });              

      }
    },

    initProductAddToCart: function() {
      var btnAddToCartSlt = '#product-add-to-cart';
      var btnAddToCart = $(btnAddToCartSlt);

      if(btnAddToCart.length) {
        body.off('click.addToCartProduct', btnAddToCartSlt).on('click.addToCartProduct', btnAddToCartSlt, function(e) {
          e.preventDefault();
          e.stopPropagation();
          var self = $(this),
              data = self.closest('form').serialize();
          if($(this).attr('disabled') != 'disabled') {
            if(!window.ajax_cart) {
              $(this).closest('form').submit();
            }

            else {
              var variant_id = $('#add-to-cart-form select[name=id]').val();

              if(!variant_id) {
                variant_id = $('#add-to-cart-form input[name=id]').val();
              }

              var quantity = $('#add-to-cart-form input[name=quantity]').val();

              if(!quantity) {
                quantity = 1;
              }

              var title = $('.product-title h2').html();

              var vendor = $(this).closest('form').data('vendor');

              var image = $('.slick-current img[id|="product-featured-image"]').attr('src') || $('.product img[id|="product-featured-image"]').attr('src');

              jewelias.doAjaxAddToCart(data, title, vendor, image);
            }
          }

          return false;

        });
      }
    },

    doAjaxAddToCart: function(data, title, vendor, image) {
      $.ajax({
        type: "post",
        url: "/cart/add.js",
        data: data,
        dataType: 'json',
        beforeSend: function() {
          jewelias.showLoading();
        },
        success: function(msg) {
          jewelias.hideLoading();
          $('.ajax-success-modal').find('.ajax-product-title').html(jewelias.translateText(title));
          $('.ajax-success-modal').find('.ajax-product-image').attr('src', image);
          $('.ajax-success-modal').find('.message-added-cart').show();
          jewelias.showModal('.ajax-success-modal');
          jewelias.updateDropdownCart();
        },
        error: function(xhr, text) {
          jewelias.hideLoading();
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          jewelias.showModal('.ajax-error-modal');
        }
      });
    },

    updateDropdownCart: function() {
      Shopify.getCart(function(cart) {
        jewelias.doUpdateDropdownCart(cart);
      });
    },

    doUpdateDropdownCart: function(cart) {
      var template = '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-details"><a href="javascript:void(0)" title="Remove This Item" class="btn-remove"><svg class="icon-close" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="357px" height="357px" viewBox="0 0 357 357" style="enable-background:new 0 0 357 357;" xml:space="preserve"><g><g><polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5"></polygon></g></g></svg></a><p class="product-name"><a href="{URL}">{TITLE}</a></p><div class="cart-collateral"><span class="qtt">{QUANTITY} X</span><span class="price">{PRICE}</span></div></div></li>';

      $('.cartCount').text(cart.item_count);

      dropdownCart.find('.summary .price').html(Shopify.formatMoney(cart.total_price, window.money_format));

      miniProductList.html('');

      if (cart.item_count > 0) {
        for (var i = 0; i < cart.items.length; i++) {
          var item = template;

          item = item.replace(/\{ID\}/g, cart.items[i].id);
          item = item.replace(/\{URL\}/g, cart.items[i].url);
          item = item.replace(/\{TITLE\}/g, jewelias.translateText(cart.items[i].product_title));
          item = item.replace(/\{QUANTITY\}/g, cart.items[i].quantity);
          item = item.replace(/\{IMAGE\}/g, Shopify.resizeImage(cart.items[i].image, '64x'));
          item = item.replace(/\{PRICE\}/g, Shopify.formatMoney(cart.items[i].price, window.money_format));

          miniProductList.append(item);
        }

        jewelias.removeItemDropdownCart(cart);

        if (jewelias.checkNeedToConvertCurrency()) {
          Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
        }
      }

      jewelias.checkItemsInDropdownCart();
    },

    removeItemDropdownCart: function(cart) {
      var btnRemove = dropdownCart.find('.btn-remove');

      btnRemove.off('click.removeCartItem').on('click.removeCartItem', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var productId = $(this).parents('.item').attr('id');
        productId = productId.match(/\d+/g);

        Shopify.removeItem(productId, function(cart) {
          jewelias.doUpdateDropdownCart(cart);
        });
      });
    },

    checkItemsInDropdownCart: function() {
      if(miniProductList.children().length) {
        cartHasItems.show();
        cartNoItems.hide();
      }
      else {
        cartHasItems.hide();
        cartNoItems.show();
      }
    },

    initCartQty: function() {
      var button = $('.cart-list .quantity .button');

      button.off('click.changeQuantity').on('click.changeQuantity', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var oldValue = $(this).siblings('input.qty').val(),
            newVal = 1;

        if($(this).hasClass('inc')) {
          newVal = parseInt(oldValue) + 1;
        }
        else if(oldValue > 1) {
          newVal = parseInt(oldValue) - 1;
        }

        $(this).siblings('input.qty').val(newVal);
      });
    },

    initInfiniteScrollingHomepage: function () {
      var newArrivalsProduct = $('[data-new-arrivals-product]');

      newArrivalsProduct.each(function () {
        var self = $(this);
        var infiniteScrolling = self.find('.infinite-scrolling-homepage');
        var infiniteScrollingLinkSlt = self.find('.infinite-scrolling-homepage a');
            
        if (infiniteScrolling.length) {
          infiniteScrollingLinkSlt.off('click.showMoreProduct').on('click.showMoreProduct', function (e) {

            e.preventDefault();
            e.stopPropagation();
            if($(this).hasClass('ajax-loading') )
              return false;
            $(this).addClass('ajax-loading');
            var url = $(this).attr('data-collection'),
                limit = $(this).attr('data-limit'),
                page = parseInt($(this).attr('data-page'));

            if (!$(this).hasClass('disabled')) {
              jewelias.doAjaxInfiniteScrollingGetContentSection(url,limit,page,e,self);
            };
          });
        }
      });
      
    },
  
    doAjaxInfiniteScrollingGetContentSection(url,limit,page,e,self) {
      $.ajax({
        type: "get",
        url: window.router + '/collections/' + url,
        cache: false,
        data: {
          view: 'sorting',
          constraint: 'limit=' + limit + '+page=' + page
        },

        beforeSend: function () {
          jewelias.showLoading();
        },
        success: function (data) {
          self.find('.products-grid').append(data);
          if( $(data).length == limit ){
            $(e.currentTarget).attr('data-page', page + 1);
          }
          else{
            $(e.currentTarget).attr('disabled','disabled');
            $(e.currentTarget).addClass('disabled');
            $(e.currentTarget).text(window.inventory_text.no_more_product);
          }
          jewelias.initWishLists();
          jewelias.initWishListIcons();
          if (jewelias.checkNeedToConvertCurrency()) {
            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
          };
          if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
          };

        },
        complete: function () {
          jewelias.hideLoading();
          $(e.currentTarget).removeClass('ajax-loading');
          $('.infinite-scrolling1').remove();
        }
      });
    },

    initQuickView: function(i) {
      var selectCallbackQuickview = function(variant, selector) {
        var productItem = $('.quick-view .product-item'),
            btnAddToCart = productItem.find('.add-to-cart-btn'),
            productPrice = productItem.find('.price'),
            comparePrice = productItem.find('.compare-price'),
            totalPrice = productItem.find('.total-price .total-money'),
            labelSave = $('.quick-view .label-sale'),
            priceSaving = productItem.find('.price-saving .price-save');

        if(variant) {
          if(variant.available) {
            btnAddToCart.removeClass('disabled').removeAttr('disabled').text(window.inventory_text.add_to_cart);
          }
          else {
            btnAddToCart.addClass('disabled').attr('disabled', 'disabled').text(window.inventory_text.sold_out);
          };

          $('.quick-view #product_regular_price').val(variant.price);
          productPrice.html(Shopify.formatMoney(variant.price, window.money_format));
          if(variant.compare_at_price > variant.price) {
            comparePrice.html(Shopify.formatMoney(variant.compare_at_price, window.money_format)).show();
            productPrice.addClass('on-sale');
            var roundqv = Math.round((1- ( variant.price/variant.compare_at_price))*100);
            priceSaving.html('-'+roundqv+"%");
            priceSaving.show();
            labelSave.html('-' + Math.floor((variant.compare_at_price - variant.price) * 100 / variant.compare_at_price) + '%').show();
          }
          else {
            comparePrice.hide();
            productPrice.removeClass('on-sale');
            priceSaving.hide();
            labelSave.hide();
          };

          if (window.use_color_swatch) {
            var form = $('#' + selector.domIdPrefix).closest('form');
            for (var i=0,length=variant.options.length; i<length; i++) {
              var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]');

              if (radioButton.size()) {
                radioButton.get(0).checked = true;
              }
            }
          };

          if(window.display_quickview_availability) {
            var inventoryInfo = productItem.find('.product-inventory span');

            if (variant.available) {
              if (variant.inventory_management != null) {
                inventoryInfo.text(window.inventory_text.in_stock);
              }
              else {
                inventoryInfo.text(window.inventory_text.many_in_stock);
              }
            }
            else {
              inventoryInfo.text(window.inventory_text.out_of_stock);
            }
          };

          if(window.display_quickview_sku) {
            var sku = productItem.find('.sku-product span');
            if(variant) {
              sku.text(variant.sku);
            }
            else {
              sku.empty();
            };
          };

          jewelias.updatePricingQuickview();

          if (variant && variant.featured_image) {
            var originalImage = $('.quick-view .quickview-featured-image img');
            var newImage = variant.featured_image;
            var element = originalImage[0];
            Shopify.Image.switchImage(newImage, element, function (newImageSizedSrc, newImage, element) {
              newImageSizedSrc = newImageSizedSrc.replace(/\?(.*)/,"");
              $('.quick-view .slider-nav img').each(function() {
                var grandSize = $(this).attr('src');
                grandSize = grandSize.replace('64x76','1024x1024');
                grandSize = grandSize.split('?')[0];
                newImageSizedSrc = newImageSizedSrc.split('?')[0];
                if (grandSize == newImageSizedSrc) {
                  $(this).parent().trigger('click'); 
                  return false;
                };
              });
            });        
          };
        }

        else {
          btnAddToCart.text(window.inventory_text.unavailable).addClass('disabled').attr('disabled', 'disabled');
        };
      }

      var qvButton = '.quickview-button a',
          quickview = $('#quickview-template');
      body.off('click.initQuickView', qvButton).on('click.initQuickView', qvButton, function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('body').addClass('has-popup');

        var productUrl = $(this).attr('data-href'),
            dataUrl = productUrl + '?view=quickview',
            product_handle = $(this).attr('id');

        $.ajax({
            type: "get",
            url: window.router + '/products/' + product_handle + '?view=quickview',
            success: function(data) {

              quickview.find('.content').html($(data));

              Shopify.getProduct(product_handle, function(product) {
                // ------------swatch
                if(product.available && product.variants.length > 1){
                    new Shopify.OptionSelectors("product-select-" + product.id, {
                    product: product,
                    onVariantSelected: selectCallbackQuickview
                  });

                  if (window.use_color_swatch) {
                    changeSwatch(quickview.find('.swatch :radio'));
                    Shopify.linkOptionSelectors(product, '#quickview-template');
                  }
                  quickview.find('form.variants .selector-wrapper label').each(function(i,v) {
                    $(this).html('<span class="required">*</span>' + product.options[i].name);
                  });


                }

                jewelias.translateBlock('#quickview-template');   
                quickview.fadeIn(500);  
                jewelias.intslick();
                jewelias.initQuickviewAddToCart();
                jewelias.initZoom();
                jewelias.setAddedForWishlistIcon(product_handle);
                $.getScript("https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-595b0ea2fb9c5869").done(function () {
                  "undefined" != typeof addthis && (addthis.init(), addthis.layers.refresh())
              });
               
                //quantity
                if(quickview.find('.qty-group').length > 0){
                  quickview.find('.button').off('click.changeQtt').on('click.changeQtt', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var oldValue = quickview.find(".quantity").val(),
                        newVal = 1;
                    if($(this).hasClass('inc')) {
                      newVal = parseInt(oldValue) + 1;
                    }
                    else if(oldValue > 1) {
                      newVal = parseInt(oldValue) - 1;
                    }
                    quickview.find('.quantity').val(newVal);
                    jewelias.updatePricingQuickview();
                  });
                }


                if (jewelias.checkNeedToConvertCurrency()) {
                  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                };

              });
            },
            error: function() {
              $('#notification-bar').text('An error occurred');
            }
          }
        );
      });
      
      doc.off('click.closeQuickView').on('click.closeQuickView', '.quick-view .overlay, .close-window', function() {
        jewelias.closeQuickViewPopup();
        $('body').removeClass('has-popup');
        return false;
      });
    },

    updatePricingQuickview: function() {

      var quantity = parseInt($('.quick-view input[name=quantity]').val());
      var p = $('.quick-view #product_regular_price').val();
      var totalPrice1 = p * quantity;
      var g = Shopify.formatMoney(totalPrice1, window.money_format);
      $('.quick-view .total-price span').html(g);

      if (jewelias.checkNeedToConvertCurrency()) {
        Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
      };


      // var regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;
      // var unitPriceTextMatch = $('.quick-view .price').text().match(regex);

      // if (!unitPriceTextMatch) {
      //   regex = /([0-9]+[.|,][0-9]+)/g;
      //   unitPriceTextMatch = $('.quick-view .price').text().match(regex);
      // }

      // if (unitPriceTextMatch) {
      //   var unitPriceText = unitPriceTextMatch[0];
      //   var unitPrice = unitPriceText.replace(/[.|,]/g, '');
      //   var quantity = parseInt($('.quick-view input[name=quantity]').val());
      //   var totalPrice = unitPrice * quantity;

      //   var totalPriceText = Shopify.formatMoney(totalPrice, window.money_format);
      //   regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;     
      //   if (!totalPriceText.match(regex)) {
      //     regex = /([0-9]+[.|,][0-9]+)/g;
      //   } 
      //   totalPriceText = totalPriceText.match(regex)[0];

      //   var regInput = new RegExp(unitPriceText, "g");
      //   var totalPriceHtml = $('.quick-view .price').html().replace(regInput, totalPriceText);
      //   $('.quick-view .total-price span').html(totalPriceHtml);
      //   $('.quick-view .total-price .total-money').html(totalPriceHtml);
      // };       
    },

    intslick:  function() {
      var sliderForqv = $('.quick-view .slider-for'),
          sliderNavqv =  $('.quick-view .slider-nav');
      if (!sliderForqv.hasClass('slick-initialized') && !sliderNavqv.hasClass('slick-initialized')) {
        sliderForqv.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          verticalSwiping: false,
          asNavFor: sliderNavqv
        });

        sliderNavqv.slick({
          infinite: true,
          slidesToShow: 5,
          slidesToScroll: 1,
          asNavFor: sliderForqv,
          verticalSwiping: false,
          dots: false,
          focusOnSelect: true,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>'
        });
      };
    },

    initQuickviewAddToCart: function() {
      if ($('.quick-view .add-to-cart-btn').length) {
        $('.quick-view .add-to-cart-btn').off('click.quickViewAddToCart').on('click.quickViewAddToCart', function(e) {
          e.preventDefault();
          e.stopPropagation();
          var self = $(this),
              data = self.closest('form').serialize();
          if(!window.ajax_cart) {
            $(this).closest('form').submit();
          } else{


            var variant_id = $('.quick-view select[name=id]').val();

            if (!variant_id) {
              variant_id = $('.quick-view input[name=id]').val();
            };

            var quantity = $('.quick-view input[name=quantity]').val();
            if (!quantity) {
              quantity = 1;
            };

            var title = $('.quick-view .product-title a').html();
            var image = $('.quick-view .quickview-featured-image .slick-current img').attr('src') || $('.quick-view .quickview-featured-image img').attr('src');
            var vendor = $('.quick-view form.variants').data('vendor');

            jewelias.doAjaxAddToCart(data, title, vendor, image);
            jewelias.closeQuickViewPopup();
          }
        });
      };
    },

    closeQuickViewPopup: function() {
      $('.quick-view').fadeOut(500);
      $('body').removeClass('has-popup');
    },

    closeLookBookPopup: function(){
      $('.lookbook-modal').fadeOut(100);
    },

    initLookBookProduct: function(){
      $(document).on('click','.lookbook-item .pr-lb', function(){
        var handle = $(this).data('handle'),
            position = $(this);

        jewelias.doAjaxLookBook(handle, position);

        $('.lookbook-modal .close-modal').on('click',function(){
          jewelias.closeLookBookPopup();
        });        
      });
    },

    doAjaxLookBook: function(handle, position){
      if(window.innerWidth > 1024){
        var offSet = $(position).offset(),
            top= offSet.top,
            left = offSet.left,
            content = position.closest('.lazy-images-contain').innerWidth(),
            newtop = top + "px",
            newleft = left + 22 + "px";

        if(left > (content - 270)) {
          newleft = (left - 270) + 5 + "px";
        }
      }
      else{
        var offSet = $(position).offset(),
            top= offSet.top,
            left = offSet.left,
            content = position.closest('.lazy-images-contain').innerWidth(),
            newtop = top,
            newleft = left + 22 + "px";

          if(left > (content - 270)) {
            newleft = (left - 270) + "px";
          }  
      }

      $.ajax({
        url:window.router + '/products/'+handle+'?view=json',
        success: function(data) {
          $('.lookbook-modal').fadeIn(300).css({'left': newleft, 'top': newtop });;
          $('.lookbook-content').html(data);
          jewelias.translateBlock('.lookbook-content');
          if (window.show_multiple_currencies) {
            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
          }
          if ($('.spr-badge').length > 0) {
            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
          }
        },
        error: function(xhr, text) {
          $('.lookbook-modal').fadeOut(100);
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          jewelias.showModalError('.ajax-error-modal');
        }
      });
    },

    initDropdownFooterMenu: function() {
      var footerTitle = $('.footer-middle .foot-title');

      if(window.innerWidth < 768) {
        if(footerTitle.length) {
          footerTitle.off('click.slideToggle').on('click.slideToggle', function() {
            $(this).toggleClass('show');
            $(this).next().slideToggle();
          });
        }
      }
      else {
        $('.footer-middle .foot-title ~ ul').css({"display": ""});
      }
    },

    Page_brands: function(){
      $(".brands-list .brand").each(function(){
        var chi = $(this).find(".azbrands-title h3").text().trim();
        var ch = $(this).find("ul.brandgrid li:eq(0)").text().charAt(0);
        $('.azbrandstable').children().each(function(){
          if( $(this).find('a').text().trim() == chi){
            if( !$(this).find('a').hasClass('readonly') )
              $(this).find('a').addClass('readonly');
            return;
          }
        });
        if($(this).find(".azbrands-title").length == 0){
          $(this).find("ul.brandgrid").children().appendTo('.brand-' + ch + " ul.brandgrid");
          $(this).remove();
        }
      });

      $('.azbrandstable .vendor-letter a.readonly').click(function(){
        var v = $(this).text();
        $('.brands-list .brand').hide().filter(function(e){
          var n =  $(this).find('h3').text();
          return n == v;
        }).show();
        $('.azbrandstable .all-brand a').click(function(){
          $(".brands-list .brand").show();
        });
      });
      $('.azbrandstable a.readonly').click(function(){
        $('.azbrandstable a').removeClass('active');
        var $this = $(this);
        if (!$this.hasClass('active')) {
          $this.addClass('active');
        }
        var topbrand = $('.wrapper-header').outerHeight();
        $('html, body').animate({scrollTop: topbrand}, 400);
      });

    },

    initEventPopupNextPrevProduct: function() {
      var nextPrevBlock = $('.next-prev-product');
      var iconNextPrev = nextPrevBlock.find('.popup-pro');
      var currentEl;
      if(iconNextPrev.length && iconNextPrev.is(':visible')) {
        if(!('ontouchstart' in document)) {
          iconNextPrev.hover(function() {            
            $(this).find('.modal-pro').toggle();                                      
          });

          iconNextPrev.mouseleave(function() {
            if ($(this).find('.modal-pro').is(':visible')) {
              $(this).find('.modal-pro').hide();
            };
          });
        }
        else {
          iconNextPrev.off('click').on('click', function(e) {
            if (currentEl != this) {
            e.preventDefault();
            e.stopPropagation();
              currentEl = this;
            }
            var modalSibling = $(this).siblings('.popup-pro').find('.modal-pro');

            if(modalSibling.is(':visible')) {
              modalSibling.hide();
            }

            $(this).find('.modal-pro').toggle();  
          });

          $(document).on('click', function(e) {
            if(!$(e.target).closest('.modal-pro').length && iconNextPrev.children('.modal-pro').is(':visible')) {
              iconNextPrev.children('.modal-pro').hide();
            }
          });
        };      	
      }
    },

    initStickyAddtoCart: function(){
      var p = $('#product-selectors option:selected').val();
      var t = $('.sticky_form .pr-swatch[data-value="'+p+'"]').text();
      $('.pr-selectors .pr-active').text(t);
      $('.sticky_form .pr-swatch[data-value="'+p+'"]').addClass('active');


      $( ".swatch .swatch-element" ).each(function(e) {
        var dav = $(this).data("value");
        $('.swatch input.text[data-value="'+dav+'"]').appendTo($(this))
      });


      $( ".selector-wrapper" ).change(function() {
        var n =$("#product-selectors").val();
        $( ".sticky_form .pr-selectors li" ).each(function( e ) {
          var t =$(this).find('a').data('value');
          if(t == n){
            $(this).find('a').addClass('active')
          } else{
            $(this).find('a').removeClass('active')
          }
        });
        $( "#product-selectors" ).change(function() {
          var str = "";
          $( "#product-selectors option:selected" ).each(function() {
            str += $( this ).data('imge');
          });
          $('.sticky_form .pr-img img').attr("src",str );
        }).trigger( "change" );

        if($('.sticky_form .pr-swatch').hasClass('active')){
          var h = $('.sticky_form .pr-swatch.active').text();
          $('.sticky_form .action input[type=hidden]').val(n);
          $('.sticky_form .pr-active').text(h);
          $('.sticky_form .pr-active').attr('data-value', n);
        }

      });

      $(document).click(function(e){
        var container = $(".sticky_form .pr-active");
        if (!container.is(e.target) && container.has(e.target).length === 0){
          $('.sticky_form').removeClass('open-sticky');
        }
      });

      $('.sticky_form .pr-active').on('click', function(){
        $('.sticky_form').toggleClass('open-sticky');
      });

      $('.sticky_form .pr-swatch').on('click', function(e){        
        $('.sticky_form .pr-swatch').removeClass('active');
        $(this).addClass('active');


        $('.sticky_form').toggleClass('open-sticky');


        var text = $(this).text(),
            value = $(this).data('value');

        $('.sticky_form .action input[type=hidden]').val(value);
        $('.sticky_form .pr-active').attr('data-value', value);
        $('.sticky_form .pr-active').text(text);
        $( '.swatch input.text[data-v="'+value+'"]' ).parent().find('.tric').click();

        if($(this).hasClass('sold-out')){
          $('.sticky-add-to-cart').val(window.inventory_text.sold_out).addClass('disabled').attr('disabled', 'disabled');
        }
        else{
          $('.sticky-add-to-cart').removeClass('disabled').removeAttr('disabled').val(window.inventory_text.add_to_cart);
        }

        var newImage = $(this).data('img');
        $('.pr-img img').attr({ src: newImage }); 
        return false;

      });

      $(document).on('click', '.sticky-add-to-cart', function(event) {
        event.preventDefault();
        if ($('#grouped-add-to-cart').length){
          $('#grouped-add-to-cart').click();
        }else{
          $('#product-add-to-cart').click();
        }
        return false;
      });

      if ($('.pro-page').hasClass('halo-product-default')) {
        var height = $('#add-to-cart-form .addToCart').offset().top;
      }

      if ($('.pro-page').hasClass('halo-product-gallery')) {
        var heightGroupBtn = $('#add-to-cart-form .groups-btn').outerHeight();
        var heightProductDetailBottom = $('.product-bottom-wrap').outerHeight();
        var height = $('.product').outerHeight() - (heightProductDetailBottom + heightGroupBtn);
      }

      $(window).scroll(function () {
        var scrollTop = $(this).scrollTop();
        if (scrollTop > height) {
          $('body').addClass('show_sticky');
        }
        else {
          $('body').removeClass('show_sticky');
        }
      });    
    },

    createWishListTplItem: function (t) {

      var a = $("[data-wishlist-container]");
      jQuery.getJSON(window.router + "/products/" + t + ".js", function (t) {
        var e = "",
        i = Shopify.formatMoney(t.price_min, window.money_format);
        e += '<div class="grid-item" data-wishlist-added="wishlist-' + t.id + '">',
        e += '<div class="inner product-item" data-product-id="product-' + t.handle + '">',
        e += '<div class="row2">';
        e += '<div class="product-image col-md-2">',
        e += '<a href="' + t.url + '" class="product-grid-image" data-collections-related="/collections/all?view=related">',
        e += '<img src="' + t.featured_image + '" alt="' + t.featured_image.alt + '">',
        e += "</a></div>",
        e += '<div class="product-bottom col-md-4">',
        e += '<a class="product-title" href="' + t.url + '" title="' + t.title + '">' + t.title + "</a>",
        e += '<div class="product-vendor">',
        e += '<a href="' + window.router + '/collections/vendors?q=' + t.vendor + '" title="' + t.vendor + '">' + t.vendor + "</a></div></div>",
        e += '<div class="price-box col-md-2">' + i + "</div>",
        e += '<div class="col-md-3 wishlist-action">',
        e += '<form action="/cart/add" method="post" class="variants" data-id="product-actions-' + t.id + '" enctype="multipart/form-data">',
        t.available ? (1 == t.variants.length && (e += '<button data-btn-addToCart class="btn add-to-cart-btn" type="submit">' + window.inventory_text.add_to_cart + '</button><input type="hidden" name="id" value="' + t.variants[0].id + '" />'), 1 < t.variants.length && (e += '<a class="btn" title="' + t.title + '" href="' + t.url + '">' + window.inventory_text.select_options + "</a>")) : e += '<button class="btn add-to-cart-btn" type="submit" disabled="disabled">' + window.inventory_text.unavailable + "</button>",
        e += "</form></div>",
        e += '<div class="btn-remove col-md-1"><a class="whislist-added" href="#" data-product-handle="' + t.handle + '" data-icon-wishlist data-id="' + t.id + '"><svg class="closemnu" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 357 357" xml:space="preserve"><g><g><polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5"></polygon></g></g></svg></a></div>',
        e += "</div></div></div>",
        a.append(e)
        var regex = /(<([^>]+)>)/ig;
        var href = $('.wishlist-page a.share').attr("href");
        href += encodeURIComponent( t.title + '\nPrice: ' + i.replace(regex, "") + '\nLink: ' + window.location.protocol + '//' + window.location.hostname + t.url +'\n\n');
        $('.wishlist-page a.share').attr("href", href );
      })
    },
    initWishListPagging: function () {
      var t = JSON.parse(localStorage.getItem("items")),
      n = $("#wishlist-paginate"),
      e = '<li class="text disabled prev"><a href="#" title="' + window.inventory_text.previous + '"><span>' + window.inventory_text.previous + "</span></a></li>",
      s = $("[data-wishlist-container]");
      n.children().remove();
      var r = Math.ceil(t.length / 3);

      if (r <= 1) s.children().show();
      else {
        for (var i = 0; i < r; i++) {
          var a = i + 1;
          e += 0 === i ? '<li class="active"><a data-page="' + a + '" href="' + a + '" title="' + a + '">' + a + "</a></li>": '<li><a data-page="' + a + '" href="' + a + '" title="' + a + '">' + a + "</a></li>"
        }
        e += '<li class="text next"><a href="#" title="' + window.inventory_text.next + '"><span>' + window.inventory_text.next + '</span></a></li>',
        n.append(e),
        s.children().each(function (t, e) {
          0 <= t && t < 3 ? $(e).show() : $(e).hide()
        }),
        n.off("click.wl-pagging").on("click.wl-pagging", "li a", function (t) {
          t.preventDefault();
          var e = $(this).parent().hasClass("prev"),
          i = $(this).parent().hasClass("next"),
          a = $(this).data("page");
          if (e) {
            var o = parseInt($(this).parent().siblings(".active").children().data("page"));
            a = o - 1
          }
          if (i) {
            o = parseInt($(this).parent().siblings(".active").children().data("page"));
            a = o + 1
          }
          s.children().each(function (t, e) {
            3 * (a - 1) <= t && t < 3 * a ? $(e).show() : $(e).hide()
          }),
          1 === a ? (n.find(".prev").addClass("disabled"), n.find(".next").removeClass("disabled")) : a === r ? (n.find(".next").addClass("disabled"), n.find(".prev").removeClass("disabled")) : (n.find(".prev").removeClass("disabled"), n.find(".next").removeClass("disabled")),
          $(this).parent().siblings(".active").removeClass("active"),
          n.find('[data-page="' + a + '"]').parent().addClass("active")
        })
      }
    },
    initWishLists: function () {
      if ("undefined" != typeof Storage) {
        var t = JSON.parse(localStorage.getItem("items"));
        if (t.length <= 0) return;
        t.forEach(function (t) {
          jewelias.createWishListTplItem(t)
        }),
        this.initWishListPagging(),
        this.translateBlock(".wishlist-page")
      } else alert("Sorry! No web storage support..")
    },
    setAddedForWishlistIcon: function (t) {
      var e = $('[data-product-handle="' + t + '"]');
      0 <= s.indexOf(t) ? (e.addClass("whislist-added"), e.find(".wishlist-text").text(window.inventory_text.remove_wishlist)) : (e.removeClass("whislist-added"), e.find(".wishlist-text").text(window.inventory_text.add_wishlist))
    },
    doAddOrRemoveWishlish: function () {
      var t = "[data-icon-wishlist]";
      $(document).off("click.addOrRemoveWishlist", t).on("click.addOrRemoveWishlist", t, function (t) {
        t.preventDefault();
        var e = $(this),
        i = e.data("id"),
        a = e.data("product-handle"),
        o = s.indexOf(a);
        e.hasClass("whislist-added") ? (
          e.removeClass("whislist-added"), 
          e.find(".wishlist-text").text(window.inventory_text.add_wishlist), 
          $('[data-wishlist-added="wishlist-' + i + '"]').length && $('[data-wishlist-added="wishlist-' + i + '"]').remove(), 
          s.splice(o, 1), 
          localStorage.setItem("items", JSON.stringify(s)), $("[data-wishlist-container]").length && jewelias.initWishListPagging()) : (
            e.addClass("whislist-added"), 
            e.find(".wishlist-text").text(window.inventory_text.remove_wishlist), 
            $("[data-wishlist-container]").length && jewelias.createWishListTplItem(a), s.push(a), localStorage.setItem("items", JSON.stringify(s))),
        jewelias.setAddedForWishlistIcon(a);
      })
    },
    initWishListIcons: function () {
      var t = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];
      if (t.length) for (var e = 0; e < t.length; e++) {
        var i = $('[data-product-handle="' + t[e] + '"]');
        i.addClass("whislist-added"),
        i.find(".wishlist-text").text(window.inventory_text.remove_wishlist)
      }
    },
    hide_filter: function(){
      $(".sidebar-tag .widget-content ul").each(function() { 
        if ($(this).children('li').length > 0) {
          $(this).parents('.sidebar-tag').show();
        } else { 
          $(this).parents('.sidebar-tag').hide();
        }
      });
    },
    productRecomendation: function() {
      var $container = $('.js-product-recomendation');
      var productId = $container.data('productId');
      var template = $container.data('template');
      var sectionId = $container.data('sectionId');
      var limit = $container.data('limit');
      var productRecommendationsUrlAndContainerClass =
          window.router + '/recommendations/products?&section_id='+ sectionId +'&limit=' + limit + '&product_id=' + productId + ' .product-recommendations';
      $container.parent().load(productRecommendationsUrlAndContainerClass, function(){
        jewelias.translateBlock('#product-recommendations');
        jewelias.initRelatedProductSlider();
        if (jewelias.checkNeedToConvertCurrency()) {
          Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
        };
      });
    },

    appendProductRecomendation: function(){
      var ProductRecomendation = $('#product-recommendations'),
          appenRecomendation = $('.template-product .product_bottom'),
          appenRecomendation1 = $('.template-product .product_bottom .relate-verticle'),
          appenRecomendation2 = $('.template-product .relate-verticle').find('[data-sticky-3]');
          ProductRecomendation.appendTo(appenRecomendation);
          ProductRecomendation.appendTo(appenRecomendation1);
          ProductRecomendation.appendTo(appenRecomendation2);
    },
    checkbox_checkout: function(){
        var inputWrapper = $('.checkbox-group label');  

        var checkBox = $('.checkbox-group input[type="checkbox"]');
      
        setTimeout(function(){
          checkBox.each(function(){
            if ($(this).is(':checked')) {
              $(this).parent().parent().find('.btn-checkout').removeClass('show');
            } else {
              $(this).parent().parent().find('.btn-checkout').addClass('show');
            }
          });
        },300);

        inputWrapper.off('click').on('click', function (e) {
          var inputTrigger= $(this).parent().find('.conditions'),
              divAddClassbtn = $(this).parent().parent().find('.btn-checkout');

          if (!inputTrigger.is(':checked')) {
            divAddClassbtn.removeClass('show');
            inputTrigger.prop('checked', true);
          } else {
            divAddClassbtn.addClass('show');
            inputTrigger.prop('checked', false);
          }

        });
    }
  };
})(jQuery);