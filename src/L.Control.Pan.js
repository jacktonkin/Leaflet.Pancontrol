L.Control.Pan = L.Control.extend({
	options: {
		position: 'topleft',
		panOffset: 500
	},

	onAdd: function (map) {
		var className = 'leaflet-control-pan',
			container = L.DomUtil.create('div', className),
			off = this.options.panOffset;

		this._panButton('Up'   , className + '-up'   
						, container, map, new L.Point(    0 , -off), '&#x25B2;');
		this._panButton('Left' , className + '-left' 
						, container, map, new L.Point( -off ,  0), '&#x25C0;');
		this._panButton('Right', className + '-right'
						, container, map, new L.Point(  off ,  0), '&#x25B6;');
		this._panButton('Down' , className + '-down'
						, container, map, new L.Point(    0 ,  off), '&#x25BC;');
		
		return container;
	},

	_panButton: function (title, className, container, map, offset, text) {
		var wrapper = L.DomUtil.create('div', className + "-wrap", container);
		L.DomUtil.addClass(wrapper, 'leaflet-bar');
		var link = L.DomUtil.create('a', className, wrapper);
		link.href = '#';
		link.title = title;
		link.innerHTML = text;
		L.DomEvent
			.on(link, 'click', L.DomEvent.stopPropagation)
			.on(link, 'click', L.DomEvent.preventDefault)
			.on(link, 'click', function(){
				if (map.options.maxBounds) {
					var bounds = map.options.maxBounds.pad(0.05),
							viewBounds = map.getPixelBounds(),
							viewSw = viewBounds.getBottomLeft(),
							viewNe = viewBounds.getTopRight(),
							sw = map.project(bounds.getSouthWest()),
							ne = map.project(bounds.getNorthEast()),
							afterSw = viewSw.add(offset),
							afterNe = viewNe.add(offset),
							dx = 0,
							dy = 0;

					if (afterNe.y < ne.y) { // north
						dy = Math.ceil(ne.y - viewNe.y);
					}
					if (afterNe.x > ne.x) { // east
						dx = Math.floor(ne.x - viewNe.x);
					}
					if (afterSw.y > sw.y) { // south
						dy = Math.floor(sw.y - viewSw.y);
					}
					if (afterSw.x < sw.x) { // west
						dx = Math.ceil(sw.x - viewSw.x);
					}

					if (dx || dy) {
						map.panBy([dx, dy]);
						return;
					}
				}
				map.panBy(offset);
			}, map)
			.on(link, 'dblclick', L.DomEvent.stopPropagation)

		return link;
	}
});

L.Map.mergeOptions({
    panControl: true
});

L.Map.addInitHook(function () {
    if (this.options.panControl) {
		this.panControl = new L.Control.Pan();
		this.addControl(this.panControl);
	}
});

L.control.pan = function (options) {
    return new L.Control.Pan(options);
};
