/**
 * Leaflet.draw assumes that you have already included the Leaflet library.
 */
L.drawVersion = '0.4.2';
/**
 * @class L.Draw
 * @aka Draw
 *
 *
 * To add the draw toolbar set the option drawControl: true in the map options.
 *
 * @example
 * ```js
 *      var map = L.map('map', {drawControl: true}).setView([51.505, -0.09], 13);
 *
 *      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 *          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 *      }).addTo(map);
 * ```
 *
 * ### Adding the edit toolbar
 * To use the edit toolbar you must initialise the Leaflet.draw control and manually add it to the map.
 *
 * ```js
 *      var map = L.map('map').setView([51.505, -0.09], 13);
 *
 *      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 *          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 *      }).addTo(map);
 *
 *      // FeatureGroup is to store editable layers
 *      var drawnItems = new L.FeatureGroup();
 *      map.addLayer(drawnItems);
 *
 *      var drawControl = new L.Control.Draw({
 *          edit: {
 *              featureGroup: drawnItems
 *          }
 *      });
 *      map.addControl(drawControl);
 * ```
 *
 * The key here is the featureGroup option. This tells the plugin which FeatureGroup contains the layers that
 * should be editable. The featureGroup can contain 0 or more features with geometry types Point, LineString, and Polygon.
 * Leaflet.draw does not work with multigeometry features such as MultiPoint, MultiLineString, MultiPolygon,
 * or GeometryCollection. If you need to add multigeometry features to the draw plugin, convert them to a
 * FeatureCollection of non-multigeometries (Points, LineStrings, or Polygons).
 */
L.Draw = {};

/**
 * @class L.drawLocal
 * @aka L.drawLocal
 *
 * The core toolbar class of the API — it is used to create the toolbar ui
 *
 * @example
 * ```js
 *      var modifiedDraw = L.drawLocal.extend({
 *          draw: {
 *              toolbar: {
 *                  buttons: {
 *                      polygon: 'Draw an awesome polygon'
 *                  }
 *              }
 *          }
 *      });
 * ```
 *
 * The default state for the control is the draw toolbar just below the zoom control.
 *  This will allow map users to draw vectors and markers.
 *  **Please note the edit toolbar is not enabled by default.**
 */
var lang = localStorage.getItem("@IDMIS:current_language");
var polygonText = lang === 'en' ? 'Draw a polygon' : 'Vizato një poligon';
var rectangelText = lang === 'en' ? 'Draw a rectangle' : 'Vizato një katror';
var circleText = lang === 'en' ? 'Draw a circle' : 'Vizato një rreth';
var deleteText = lang === 'en' ? 'No layers to delete' : 'Nuk ka shtresa për të fshirë';
var finish = lang === 'en' ? 'Finish' : 'Përfundo';
var deleted = lang === 'en' ? 'Delete last point' : 'Fshij pikën e fundit';
var cancel = lang === 'en' ? 'Cancel' : 'Anullo';
var clickShape = lang === 'en' ? 'Click to start drawing shape' : 'Kliko për të vizatuar poligonin';
var clickPoint = lang === 'en' ? 'Click first point to close this shape' : 'Kliko pikën e fillimit për të mbyllur poligonin';
var clickreactangle = lang === 'en' ? 'Click and drag to draw rectangle' : 'Kliko mbi hartë për të vizatuar një drejtkëndësh';
var clickCircle = lang === 'en' ? 'Click and drag to draw circle' : 'Kliko mbi hartë për të vizatuar një rreth';
var clickRelease = lang === 'en' ? 'Release mouse to finish drawing' : 'Lëshoni mous-in për të përfunduar vizatimin';
var clickContinue = lang === 'en' ? 'Click to continue drawing shape' : 'Kliko për të vazhduar vizatimin';
var radius = lang === 'en' ? 'Radius' : 'Rrezja';
var save = lang === 'en' ? 'Save' : 'Ruaj';
var saveChange = lang === 'en' ? 'Save changes' : 'Ruaj ndryshimet';
var clearAll = lang === 'en' ? 'Clear all' : 'Fshij të gjitha';
var clearLayer = lang === 'en' ? 'Clear all layers' : 'Fshij të gjitha shtresat';
var clickRemove = lang === 'en' ? 'Click on a feature to remove' : 'Kliko mbi vizatimin për ta hequr atë';
L.drawLocal = {
	// format: {
	// 	numeric: {
	// 		delimiters: {
	// 			thousands: ',',
	// 			decimal: '.'
	// 		}
	// 	}
	// },
	draw: {
		toolbar: {
			// #TODO: this should be reorganized where actions are nested in actions
			// ex: actions.undo  or actions.cancel
			actions: {
				title: 'Cancel drawing',
				text: cancel
			},
			finish: {
				title: 'Finish drawing',
				text: finish
			},
			undo: {
				title: 'Delete last point drawn',
				text: deleted
			},
			buttons: {
				polyline: 'Draw a polyline',
				polygon: polygonText,
				rectangle: rectangelText,
				circle: circleText,
				marker: 'Draw a marker',
				circlemarker: 'Draw a circlemarker'
			}
		},
		handlers: {
			circle: {
				tooltip: {
					start: clickCircle
				},
				radius: radius
			},
			circlemarker: {
				tooltip: {
					start: 'Click map to place circle marker.'
				}
			},
			marker: {
				tooltip: {
					start: 'Click map to place marker.'
				}
			},
			polygon: {
				tooltip: {
					start: clickShape,
					cont: clickContinue,
					end: clickPoint
				}
			},
			polyline: {
				error: '<strong>Error:</strong> shape edges cannot cross!',
				tooltip: {
					start: 'Click to start drawing line.',
					cont: 'Click to continue drawing line.',
					end: 'Click last point to finish line.'
				}
			},
			rectangle: {
				tooltip: {
					start: clickreactangle
				}
			},
			simpleshape: {
				tooltip: {
					end: clickRelease
				}
			}
		}
	},
	edit: {
		toolbar: {
			actions: {
				save: {
					title: saveChange,
					text: save
				},
				cancel: {
					title: 'Cancel editing, discards all changes',
					text: cancel
				},
				clearAll: {
					title: clearLayer,
					text: clearAll
				}
			},
			buttons: {
				edit: 'Edit layers',
				editDisabled: 'No layers to edit',
				remove: 'Delete layers',
				removeDisabled: deleteText
			}
		},
		handlers: {
			edit: {
				tooltip: {
					text: 'Drag handles or markers to edit features.',
					subtext: 'Click cancel to undo changes.'
				}
			},
			remove: {
				tooltip: {
					text: clickRemove
				}
			}
		}
	}
};
