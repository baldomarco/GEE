
// Script by Dr Louise Rayne, University of Leicester

// This script displays Landsat images over time and allows one to: 
// Edit the dates etc to get desired images.
// Edit the band selections to change, assinging a band each to red, blue, green. 
// Different combinations highlight different features:
// To highlight vegetation: Landsat 8 is B5, B4, B3. Landsat 7 and 5 is B4, B3, B2. 
// To produce 'natural' colour, Landsat 8 is B4, B3, B2, and Landsat 7 and 5 are B3, B2, B1.
// To highlight quarries, Landsat 8 is B7, B3, B2, and Landsat 7 and 5 are B7, B2, B1. 
// Download the results 


/// FIRST DRAW YOUR GEOMETRY 

/// Define bands of interest here. Be careful not to delete any commas, brackets, or speech marks. 

var L8bands = ['B2']

//var L7bands =['B7', 'B2', 'B1']

//var L5bands = ['B7', 'B2', 'B1']



///////// Visualisation parameters
var L8vis = {
  bands: L8bands,
  min: 0,
  max: 0.5,
  gamma: [1]
};


//var L7vis = {
//  bands: L7bands,
//  min: 0,
//  max: 0.5,
//  gamma: [0.95, 1.1, 1]
//};


//var L5vis = {
//  bands: L5bands,
//  min: 0,
//  max: 0.5,
//  gamma: [0.95, 1.1, 1]
//};

//mask clouds
function maskLandsatclouds(image) {
  var qa = image.select('BQA')
  var cloudBitMask = ee.Number(2).pow(4).int()
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
  return image.updateMask(mask)
      .select("B.*")
      .copyProperties(image, ["system:time_start"])
}


//Landsat 5 TM, available from 1984-2012
//1985-1986
//var L5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_TOA") 
//  .filterDate('1985-01-01', '1986-12-30') // you can change date here
//  .filter(ee.Filter.lt("CLOUD_COVER", 0.1))
//  .filterBounds(geometry)
//  .map(maskLandsatclouds)
//  .select(L5bands)
  
//var mosaic_L5 = L5.median().clip(geometry); // here we are taking the median at each pixel in the collection
//map.addLayer(mosaic_L5, L5vis, "mosaic_L5")




//Landsat 7, available from 1999. 
//Nb striping is due to the scan line corrector
// on the satellite failing, median compositor smooths that out but be aware
//var L7 = ee.ImageCollection("LANDSAT/LE07/C01/T1_TOA")
//  .filterDate('2002-01-01', '2003-12-30') // you can change date here
//  .filter(ee.Filter.lt("CLOUD_COVER", 0.1))
//  .filterBounds(geometry)
//  .map(maskLandsatclouds)
//  .select(L7bands)
  
//var mosaic_L7 = L7.median().clip(geometry); // here we are taking the median at each pixel in the collection
//Map.addLayer(mosaic_L7, L7vis, "mosaic_L7")



//Landsat 8. Avalable from 2013
////2017-2018
var L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA") 
  .filterDate('2018-04-01', '2019-09-30') // you can change date here
  .filter(ee.Filter.lt("CLOUD_COVER", 3))
  .filterBounds(polygon)
  .map(maskLandsatclouds)
  .select(L8bands)
  
var mosaic_L8 = L8.median().clip(polygon); // here we are taking the median at each pixel in the collection
Map.addLayer(mosaic_L8, L8vis, "mosaic_L8")

Map.centerObject(polygon)

///////
//// If you want to export any, edit this:
Export.image.toDrive({ 
  image: mosaic_L8, /// To choose which imagery to export change the number (e.g. L5, L7 or L8)
  description: 'Landsat8_B2',  //give correct name
  scale: 30, 
  maxPixels: 1e13, 
  region: polygon 
});

