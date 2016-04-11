
/*!
 * Image Loader Angular v1.0.7
 * (c) 2016 Sepehr Amoor Pour
 * Released under the MIT License.
 */
angular.module('sap.imageloader', []).factory('ImageLoader', ['$q', function($q){
	return {
		loadImages: function (images, srcProperty) {
			srcProperty = typeof srcProperty !== "undefined" ? srcProperty : "src";
				var promises = [];
				if (Array.isArray(images)) {
					for (var i = 0; i < images.length; i++) {
						var image = this.loadImage(images[i].src, srcProperty);
                        
						promises.push(image);
					}
				}
				else {
					throw new TypeError("No image list provided");
				}
			

			return $q.all(promises);
		},

		loadImage: function(image, srcProperty) {
			srcProperty = typeof srcProperty !== "undefined" ? srcProperty : "src";
			var deferred = $q.defer();
			var imageObject = new Image();
          
            imageObject.onload=function() {
				if (typeof image === "object") {
				    imageObject.src=	image[srcProperty] ;
				}
				else if (typeof image === "string") {
					imageObject.src = image;
				}
                
				deferred.resolve(image);
				return deferred.promise;
			};
             imageObject.src=image;
            return imageObject
		}
	};
}]);
