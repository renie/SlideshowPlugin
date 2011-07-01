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
		
		/*Call a 'fake constructor' */
		init(this);

		/*Load default or given params */
		var defaults = {
			itemWidth: _firstItem.find('img').width(),
			itemHeight: _firstItem.find('img').height(),
			widthSlider: _itemCollection.length * _firstItem.find('img').width(),
			transitionSpeed: 1500,
			pauseTime: 3000,
			effect: 'fade'
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
			_itemCollectionParent	= _element.find('ul')
			_itemCollection 		= _itemCollectionParent.find('li');
			_itemCollectionLength	= _itemCollection.length - 1;
			_firstItem				= _itemCollection.first();
			_lastItem				= _itemCollection.last();
			_effects 				= {horizontalSlide: hSlide, fade: fade};
			_prepareEffects 		= {horizontalSlide: hSlidePrepare, fade: fadePrepare};
				
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
			_currentItem = _firstItem;
			_tmpFn = _effects[_this.effect];
			_element.css({visibility: 'visible'})
			_timeCounter = setInterval(logicalSequenceAnimation,_this.pauseTime);		
		}
		
		/**
		 *This function stops the animation
		 **/
		function stop(){
			clearInterval(_timeCounter);		
		}
		
		/**
		 *Here is the animation logic
		 **/
		function logicalSequenceAnimation(){
			if( _currentItem.get(0) == _lastItem.get(0) ){				
				_tmpFn(true)
				_currentItem = _firstItem;
			}else{
				_tmpFn(false);
				_currentItem = _currentItem.next();
			}
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
	};  
})(jQuery);
