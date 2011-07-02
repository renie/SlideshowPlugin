/*
    Copyright (C) 2011  Renie Siqueira da Silva

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function(jQuery){  
	jQuery.fn.slideshow = function(options) {  
		
		/*Plugin attributes*/
		var _element;
		var _itemCollectionParent;
		var _itemCollection;
		var _itemCollectionLength;
		var _timeCounter;
		var _currentItem;
		var _firstItem;
		var _lastItem;
		var _tmpFn;
		var _target;
		var _effects;
		var _navigationbar;
		var _itemNavigationCollection;
		var _itemNavigationCollectionLength;
		var _navFirstItem;
		var _navCurrentItem;
		
		/*Call a 'fake constructor' */
		init(this);

		/*Load default or given params */
		var defaults = {
			itemWidth: _firstItem.find('img').width(),
			itemHeight: _firstItem.find('img').height(),
			widthSlider: _itemCollection.length * _firstItem.find('img').width(),
			transitionSpeed: 1500,
			pauseTime: 3000,
			effect: 'fade',
			navigation: true,
			navigationGapItem: '5px',
			navigationItemFontSize: '16px',
			navigationItemFontFamily: 'Helvetica',
			navigationItemFontWeight: 'bold',
			navigationItemHeight: '30px',
			navigationItemWidth: '30px',
			navigationItemBorderSize: '1px',
			navigationItemBorderStyle: 'solid',
			navigationItemBorderColor: '#666',
			navigationItemBorderRadius: '5px',
			navigationItemBackgroundColor: '#fff',
			navigationItemTextColor: '#000',
			navigationHoverItemBorderColor: '#dedede',
			navigationHoverItemBackgroundColor: '#666',
			navigationHoverItemTextColor: '#dedede'
		}

		var _this = jQuery.extend(defaults, options);
		
		/*Prepare elements to an specific effect */
		prepareEffect();
		
		/*Start effect*/
		start();
		
		/**
		 *This function sets some values to plugin attributes e CSS properties
		 **/
		function init(el){
			_element = el;
			_element.css({visibility: 'hidden', overflow: 'hidden'});
			_itemCollectionParent	= _element.find('ul');
			_itemCollection 		= _itemCollectionParent.find('li');
			_itemCollectionLength	= _itemCollection.length - 1;
			_firstItem				= _itemCollection.first();
			_lastItem				= _itemCollection.last();
			_effects 				= {horizontalSlide: hSlide, fade: fade};
			_prepareEffects 		= {horizontalSlide: hSlidePrepare, fade: fadePrepare};
			_navEffects 			= {horizontalSlide: hSlideNav, fade: fadeNav};		
		}
		
		/**
		 *Functions that sets some specific CSS properties to each effect
		 **/
		function prepareEffect(){
			_itemCollectionParent.css({width: _this.widthSlider, height: _this.itemHeight, display: 'block'});
			_element.css({width: _this.itemWidth, height: _this.itemHeight});
			_prepareEffects[_this.effect]();	
		}
		
		function basicUnitPrepare(el){
			jQuery(el).css({
					listStyle: 'none',
					display: 'block',
					width: _this.itemWidth,
					height: _this.itemHeight
				});
		}
		
		function fadePrepare(){
			cont = 0;
			_itemCollection.each(function(){
				basicUnitPrepare(this);
				jQuery(this).css({
					position: 'absolute'
				});
				if(cont!=0)
					jQuery(this).css({ opacity: 0, zIndex: -9999 });
				else
					jQuery(this).css({ zIndex: 0 });
				cont--;
			});			
		}
		
		function hSlidePrepare(){
			_itemCollection.each(function(){
				jQuery(this).css({
					float: 'left'
				});
			})
		}
		
		/**
		 *This function starts an auto plugin animation
		 **/
		function start(){
			if(_this.navigation)
				createNavBar();
				
			_currentItem = _firstItem;
			if(_this.navigation){
				_navFirstItem = jQuery(_navigationbar).find("ul li:first").find('a');
				setCurrentNavItem(_navFirstItem, true);
			}
			_tmpFn = _effects[_this.effect];
			_element.css({visibility: 'visible'});
			_timeCounter = setInterval(logicalSequenceAnimation,_this.pauseTime);
			setTimeout(resetTimer,60000);	
		}
		
		/**
		 *This function stops the animation
		 **/
		function stop(){
			clearInterval(_timeCounter);		
		}
		
		/**
		 *This function restarts the animation
		 **/
		function restart(){
			_timeCounter = setInterval(logicalSequenceAnimation,_this.pauseTime);		
		}
		
		/**
		 *This function stop ans restart the animation
		 **/
		function resetTimer(){
			stop();
			restart();
			setTimeout(resetTimer,60000);
			console.log('reset()');
		}
		
		/**
		 *Here is the animation logic
		 **/
		function logicalSequenceAnimation(){
			if( _currentItem.get(0) == _lastItem.get(0) ){				
				_tmpFn(true);
				_currentItem = _firstItem;
				if(_this.navigation)
					_navCurrentItem = _navFirstItem;
			}else{
				_tmpFn(false);
				_currentItem = _currentItem.next();
				if(_this.navigation)
					_navCurrentItem = _navCurrentItem.parent().next().find('a');
			}
			
			if(_this.navigation)
				setCurrentNavItem(_navCurrentItem, true);
		}
		
		/**
		 *Horizontal slide animation
		 **/
		function hSlide(last){
			target = _currentItem.parent();
			if(last)
				target.animate({marginLeft: 0}, _this.transitionSpeed );
			else
				target.animate({marginLeft: "-="+_this.itemWidth}, _this.transitionSpeed );
		}
		
		/**
		 *Fade animation
		 **/
		function fade(last){
			_currentItem.animate({opacity: 0, zIndex: -9999 }, _this.transitionSpeed / 2 );
			if(last)	
				_firstItem.animate({opacity: 1, zIndex: 0 }, _this.transitionSpeed / 2 );
			else
				_currentItem.next().animate({opacity: 1, zIndex: 0 }, _this.transitionSpeed / 2 );
			
		}
		
		/**
		 *Create navbar
		 **/
		function createNavBar(){
			_navigationbar = document.createElement('div');
			var nav = document.createElement('ul');
			var setItemPosition;
			i=0;
			
			while(i<=_itemCollectionLength){
				item = document.createElement('li');
				jQuery(item).css({listStyle: 'none', display: 'block', float: 'left', margin: _this.navigationGapItem, textAlign: 'center'});
				link = document.createElement('a');
				link = jQuery(link);
				link.attr('href','#');	
				link.css({textDecoration: 'none', display: 'block', background: _this.navigationItemBackgroundColor, borderRadius: _this.navigationItemBorderRadius, border: _this.navigationItemBorderSize +' '+_this.navigationItemBorderStyle +' '+_this.navigationHoverItemBorderColor, color: _this.navigationItemTextColor, width: _this.navigationItemWidth, height: _this.navigationItemHeight, font: _this.navigationItemFontWeight+' '+_this.navigationItemFontSize+'/'+_this.navigationItemHeight+' '+_this.navigationItemFontFamily});
				link.bind('mouseover', function(){setStyleNavItem(jQuery(this), true)});
				link.bind('mouseout', function(){setStyleNavItem(jQuery(this), false)});
				link.html(i+1);
				jQuery(item).append(link);
				jQuery(nav).append(item);
				item = null;
				link = null;
				i++;
			}
			
			jQuery(nav).find('li a').each(function(){
				
				jQuery(this).bind('click', function(){
					
					setCurrentNavItem(jQuery(this), true);
					
					index = parseInt(jQuery(this).text())-1;
					_navEffects[_this.effect](index);
					_currentItem = _itemCollectionParent.find("li:eq("+index+")");
					stop();
					restart();
					return false;
				});
			});
			
			jQuery(nav).css({zIndex: _itemCollectionLength, position: 'absolute', margin: "-20px 0", display: 'block' });
			ml = (_element.width()/2) - ((40*_itemCollectionLength)/2);
			jQuery(nav).css({marginLeft: ml});
			jQuery(_navigationbar).append(nav);
			_element.append(_navigationbar);
			_itemNavigationCollection = jQuery(_navigationbar).find('ul li');
			_itemNavigationCollectionLength = _itemNavigationCollection.length;
		}
		
		function setCurrentNavItem(el, state){
			
			_itemNavigationCollection.find('a').each(function(){
						jQuery(this).removeClass('active');
						setStyleNavItem(jQuery(this), false);
					});
			jQuery(el).addClass('active');
			
			if(state || jQuery(el).hasClass('active'))
				jQuery(el).css({ background: _this.navigationHoverItemBackgroundColor, border: _this.navigationItemBorderSize +' '+_this.navigationItemBorderStyle +' '+_this.navigationHoverItemBorderColor, color: _this.navigationHoverItemTextColor});
			else
				jQuery(el).css({ background: _this.navigationItemBackgroundColor, border: _this.navigationItemBorderSize +' '+_this.navigationItemBorderStyle +' '+_this.navigationItemBorderColor, color: _this.navigationItemTextColor});
		
			_navCurrentItem = jQuery(el);
		}
		
		function setStyleNavItem(el, state){
			if(state || jQuery(el).hasClass('active'))
				jQuery(el).css({ background: _this.navigationHoverItemBackgroundColor, border: _this.navigationItemBorderSize +' '+_this.navigationItemBorderStyle +' '+_this.navigationHoverItemBorderColor, color: _this.navigationHoverItemTextColor});
			else
				jQuery(el).css({ background: _this.navigationItemBackgroundColor, border: _this.navigationItemBorderSize +' '+_this.navigationItemBorderStyle +' '+_this.navigationItemBorderColor, color: _this.navigationItemTextColor});
		}
		
		/**
		 *Effects nav functions
		 **/
		function hSlideNav(index){
			setItemPosition = -1*(_this.itemWidth * index);					
			_itemCollectionParent.animate({marginLeft: setItemPosition}, _this.transitionSpeed );
		}
		
		function fadeNav(index){
			_currentItem.animate({opacity: 0, zIndex: -9999 }, _this.transitionSpeed / 2 );	
			_itemCollectionParent.find("li:eq("+index+")").animate({opacity: 1, zIndex: 0 }, _this.transitionSpeed / 2 );
		}
	}; 
	
})(jQuery);
