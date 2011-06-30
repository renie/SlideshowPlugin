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
(function($){  
	$.fn.slideshow = function(options) {  
		
		var itemWidth = this.find('ul li').first().width();
		var widthSlider = this.find('ul li').length * itemWidth;
		
		this.find('ul').css('width', widthSlider);
		this.find('ul li').delegate('a', 'click', function(){
			if($(this).parent().is(':last-child')){
				$(this).parent().parent().animate({
													marginLeft: 0
												  }, 1500 );
			}else{
				$(this).parent().parent().animate({
													marginLeft: "-="+itemWidth
												  }, 1500 );
			}
			return false;	
		});
		
	};  
})(jQuery);
