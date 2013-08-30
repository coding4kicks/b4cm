// MODIFICATION - indicates change from original, duh.

(function () {

  var BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

  var NEIGHBORS = {
    "north": {
      "even" : "p0r21436x8zb9dcf5h7kjnmqesgutwvy",
      "odd"  : "bc01fg45238967deuvhjyznpkmstqrwx",
    },
    "east": {
      "even" : "bc01fg45238967deuvhjyznpkmstqrwx",
      "odd"  : "p0r21436x8zb9dcf5h7kjnmqesgutwvy"
    },
    "south": {
      "even" : "14365h7k9dcfesgujnmqp0r2twvyx8zb",
      "odd"  : "238967debc01fg45kmstqrwxuvhjyznp"
    },
    "west": {
      "even" : "238967debc01fg45kmstqrwxuvhjyznp",
      "odd"  : "14365h7k9dcfesgujnmqp0r2twvyx8zb"
    }
  };

  var BORDERS = {
    "north" : { "even" : "prxz",     "odd"  : "bcfguvyz" },
    "east"  : { "even" : "bcfguvyz", "odd"  : "prxz"     },
    "south" : { "even" : "028b",     "odd"  : "0145hjnp" },
    "west"  : { "even" : "0145hjnp", "odd"  : "028b"     }
  };

  /**
   * Generate a geohash with the specified precision / string length.
   */
  function encode(lat, lon, precision) {
    var hash = "",
        hashVal = 0,
        bits = 0,
        even = 1,
        latRange = { "min":  -90, "max":  90 },
        lonRange = { "min": -180, "max": 180 },
        val, range, mid;

    precision = Math.min(precision || 12, 22);

    if (lat < latRange["min"] || lat > latRange["max"])
      throw "Invalid latitude specified! (" + lat + ")";

    if (lon < lonRange["min"] || lon > lonRange["max"])
      throw "Invalid longitude specified! (" + lon + ")";

    while (hash.length < precision) {
      val = (even) ? lon : lat;
      range = (even) ? lonRange : latRange;

      mid = (range["min"] + range["max"]) / 2;
      if (val > mid) {
        hashVal = (hashVal << 1) + 1;
        range["min"] = mid;
      } else {
        hashVal = (hashVal << 1) + 0;
        range["max"] = mid;
      }

      even = !even;
      if (bits < 4) {
        bits++;
      } else {
        bits = 0;
        hash += BASE32[hashVal].toString();
        hashVal = 0;
      }
    }

    return hash;
  }

  function deg2rad(deg) {
    return deg * Math.PI / 180;
  }

  function rad2deg(rad) {
    return rad * 180 / Math.PI;
  }

  function rad2km(rad) {
    return 6371 * rad;
  }

  function deg2km(deg) {
    return rad2km(deg2rad(deg));
  }

  /**
   * Calculate the distance between two points on a globe, via Haversine
   * formula, in kilometers. This is approximate due to the nature of the
   * Earth's radius varying between 6356.752 km through 6378.137 km.
   */
  function dist(lat1, lon1, lat2, lon2) {
    var radius = 6371, // km
        dlat = deg2rad(lat2 - lat1),
        dlon = deg2rad(lon2 - lon1),
        a, c;

    a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dlon / 2) * Math.sin(dlon / 2);

    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radius * c;
  }

  /**
   * Calculate the dimensions of the bounding box for the specified geohash,
   * in kilometers. This method is even more approximate.
   */
  function dimensions(hash) {
    var length = hash.length,
        parity = (length % 2) ? 1 : 0,
        a = 5 * length - parity;

    return {
      "height" : deg2km(180 / Math.pow(2, a / 2)),
      "width"  : deg2km(180 / Math.pow(2, (a - 1) / 2))
    };
  }

  function neighbor(hash, dir) {
    hash = hash.toLowerCase();

    var lastChar = hash.charAt(hash.length - 1),
        type = (hash.length % 2) ? "odd" : "even",
        base = hash.substring(0,hash.length-1);

    if (BORDERS[dir][type].indexOf(lastChar)!=-1)
      base = neighbor(base, dir);

    return base + BASE32[NEIGHBORS[dir][type].indexOf(lastChar)];
  }

  function neighbors(hash) {
    var neighbors = [];
    neighbors.push(neighbor(hash, "north"));
    neighbors.push(neighbor(hash, "south"));
    neighbors.push(neighbor(hash, "east"));
    neighbors.push(neighbor(hash, "west"));
    neighbors.push(neighbor(neighbors[0], "east"));
    neighbors.push(neighbor(neighbors[0], "west"));
    neighbors.push(neighbor(neighbors[1], "east"));
    neighbors.push(neighbor(neighbors[1], "west"));
    return neighbors;
  }

  function values(obj) {
    var values = [];
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        values.push(obj[key]);
      }
    }
    return values;
  }

  function FirebaseGeo(firebaseRef) {
    this._firebase = firebaseRef;
  }

  FirebaseGeo.prototype.dimensions = FirebaseGeo.dimensions = dimensions;
  FirebaseGeo.prototype.dist = FirebaseGeo.dist = dist;
  FirebaseGeo.prototype.encode = FirebaseGeo.encode = encode;
  FirebaseGeo.prototype.neighbor = FirebaseGeo.neighbor = neighbor;
  FirebaseGeo.prototype.neighbors = FirebaseGeo.neighbors = neighbors;

  FirebaseGeo.prototype.insert = function insert(lat, lon, data) {
    data.hash = encode(lat, lon);
    this._firebase.child(data.hash).push(data);
    // MODIFICATION - return hash
    return data.hash;
  };

  /**
   * Find all matching points within the specified radius, in kilometers,
   * from the specified latitude and longitude.
   */
  FirebaseGeo.prototype.searchRadius = function find(lat, lon, radius, cb) {
    var hash = encode(lat, lon),
        neighborPrefixes = [],
        matches = [],
        matchesFiltered = [],
        i = 0, resultHandler;

    // An approximation of the bounding box dimension per hash length.
    var boundingBoxShortestEdgeByHashLength = [ null, 5003.771699005143, 625.4714623756429, 156.36786559391072, 19.54598319923884, 4.88649579980971, 0.6108119749762138 ];
    var zoomLevel = 6;
    while (radius > boundingBoxShortestEdgeByHashLength[zoomLevel])
      zoomLevel -= 1;

    hash = hash.substring(0, zoomLevel);

    // TODO: Be smarter about this, and only zoom out if actually optimal.
    queries = this.neighbors(hash);
    queries.push(hash);

    // Get unique list of neighbor hashes.
    var uniquesObj = {};
    for (var ix = 0; ix < queries.length; ix++) {
      uniquesObj[queries[ix]] = queries[ix];
    }
    queries = values(uniquesObj);
    delete uniquesObj;

    resultHandler = function(snapshot) {
      // Compile the results for each of the queries as they return.
      var matchSet = snapshot.val();
      for (var hash in matchSet) {
        for (var pushId in matchSet[hash]) {
          matches.push(matchSet[hash][pushId]);
        }
      }

      // Wait for each of the queries to return before filtering and sorting.
      if (++i == queries.length) {

        // Filter the returned queries using the specified radius.
        for (var jx = 0; jx < matches.length; jx++) {
          var match = matches[jx],
              pointDist = dist(lat, lon, match['lat'], match['lon']);

          if (pointDist <= radius) {
            match.dist = pointDist;
            matchesFiltered.push(match);
          }
        }

        // Sort the results by radius.
        matchesFiltered.sort(function(a, b) {
          return a['dist'] - b['dist'];
        });

        cb(matchesFiltered);
      }
    };

    for (var ix = 0; ix < queries.length; ix++) {
      var startPrefix = queries[ix].substring(0, zoomLevel),
          endPrefix = startPrefix;

      while (endPrefix.length < 22)
        endPrefix += "z";

      this._firebase
        .startAt(null, startPrefix)
        .endAt(null, endPrefix)
        .once('value', resultHandler);
    }
  };

  if (typeof module === "undefined") {
    self.FirebaseGeo = FirebaseGeo;
  } else {
    // MODIFICATION place in global namespace so karma unit tests & live reload work.
    self.FirebaseGeo = FirebaseGeo; 
    module.exports = FirebaseGeo;
  }

})();
