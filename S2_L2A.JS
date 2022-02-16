Import shape file from “assets”.. i.g. uppangala
Change the geometry from “table” to “up”
--------------------------------------------------------------------------------------------------------------------

var geometry = up (before was sentinel)

var S2 = ee.ImageCollection('COPERNICUS/S2');
var S2_filter = S2.filterDate('2015-06-01', '2018-12-31').filterBounds(geometry);
print(S2_filter);
print('Total Products Found:',S2_filter.size());


for(var i= 0; i <=30; i++){
  processsing(i);
}
function processsing(idx){
print(idx);
var ImageList = S2_filter.toList(S2_filter.size());

var Image1 = ee.Image(ImageList.get(idx));
print('Filename:',ImageList.get(idx));
var date_Image1=Image1.date().format('YYYY_MM_dd');
print('Date Acquisition: ',date_Image1)
var bandNames = Image1.bandNames();
print('Band names: ', bandNames); // ee.List of band names

var img = Image1;

// Compute the Normalized Difference Vegetation Index (NDVI).
var nir = img.select('B8');
var red = img.select('B4');
var ndvi = nir.subtract(red).divide(nir.add(red)).rename('NDVI');


//.cat(ee.Number(idx).format())
//
var string1 = ee.String('ndvi').cat(ee.String('-'));
var ndvi_outfile_all = string1.cat(date_Image1);
print(ndvi_outfile_all);

// Make a palette: a list of hex strings.
var palette = ['FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
               '74A901', '66A000', '529400', '3E8601', '207401', '056201',
               '004C00', '023B01', '012E01', '011D01', '011301'];

Map.addLayer(ndvi, {min: 0, max: 1, palette: palette}, 'NDVI');
var ndviParams = {min: -1, max: 1, palette: ['blue', 'white', 'green']};
Map.addLayer(ndvi, ndviParams, 'NDVI image');

Export.image.toDrive({
  image: ndvi,
  description: ndvi_outfile_all.getInfo(),
  scale: 10,
 region: geometry
});
}


#####################################################################################################################

 # https://code.earthengine.google.com/9b0cff62e9a28dada67c6fb82e850086

# https://www.youtube.com/watch?v=h8g9IgxWwqw  video qgis crop shape file-raster
# crop satellite images. https://www.youtube.com/watch?v=HKNS-wsc7lo&t=70s
