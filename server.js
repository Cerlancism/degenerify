var express = require("express"),
  request = require("request"),
  bodyParser = require("body-parser"),
  app = express();

var myLimit = typeof process.argv[2] != "undefined" ? process.argv[2] : "100mb";
console.log("Using limit: ", myLimit);

app.use(express.static("./public"))

app.use(bodyParser.json({ limit: myLimit }));

app.all("*", function(req, res, next) {
  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    req.header("access-control-request-headers")
  );

  if (req.method === "OPTIONS") {
    // CORS Preflight
    res.send();
  } else {
    var targetURL = req.path.substr(1) || req.header("Target-URL");
    if (!targetURL) {
      res.send(500, {
        error: "There is no Target-Endpoint header in the request"
      });
      return;
    }
    request(
      {
        url: targetURL,
        method: req.method,
        header: req.headers,
        json:
          Object.entries(req.body).length === 0 &&
          req.body.constructor === Object
            ? null
            : req.body,
        followAllRedirects: true
      },
      function(error, response, body) {
        if (error) {
          console.error(error);
          res.send(error.message);
        }
        // console.log(body);
      }
    ).pipe(res);
  }
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function() {
  console.log("Proxy server listening on port " + app.get("port"));
});
