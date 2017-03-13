const express = require('express'),
      multer = require('multer'),
      path = require('path'),
      router = express.Router();

var fs = require('fs');
var Jimp = require('jimp');

var cache = {
  hit:0,
  miss:0
}

function displayImage(imagePath, response)
{

console.log(imagePath);
  try
  {
    let img = fs.readFileSync(imagePath);
    console.log(img);
    response.writeHead(200, {'Content-Type': 'image/png' }); // de pus extensia corect
    response.end(img, 'binary');
  }
  catch(err)
  {
      console.log(err);
      response.writeHead(200, {'Content-Type': 'text/plain' });
      response.end('Image not found! \n');

  }
}

  let storage = multer.diskStorage(
  {
    destination: './uploads/',
    filename: function (req, file, callback)
    {
      callback(null, file.originalname);
    }
  });

  let upload = multer({ storage: storage });

/* POST image to upload */
router.post('/image', upload.single('avatar'), function(req, res, next)
{
  try
  {
    let originalFileName = req.file.originalname;
    let fileName = req.file.filename;

    console.log(req.file, 'files');
    console.log(req.file.originalname, 'File name');

    res.end();
  }
  catch(err)
  {
    res.sendStatus(400);
  }
});

// Deliver image based on requrest
router.get('/image/:imageName/', function(req, res, next)
{
  let imageName = req.params.imageName;

  var size = req.query.size;

  if(!size){
    return displayImage('./uploads/'+imageName, res);
  }

  var path = './uploads/resized/' + size + imageName;

  // check if the image already exists and display it, if not resize it and display it
  if(fs.existsSync(path)){
    cache.hit++;
    return displayImage(path, res);
  }

  let width = Number(size.substring(0, size.indexOf("x")));
  let height = Number(size.substr(size.indexOf("x")+1, size.length));

  Jimp.read(fs.readFileSync('./uploads/'+imageName), function (err, image){
      if (err) throw err;

      image.resize(width, height)                     // resize
           .quality(100)                              // set JPEG quality
           .write(path, function(){                   // save
                cache.miss++;
                return displayImage(path, res);
           });

  });

});

router.get('/stats', function(req, res, next){
    // fetch all pictures from uploads folder

    var allFiles =[];
    var resized = [];

    var files = fs.readdirSync('uploads');
    files.forEach(file => {

      var f = {};
      // console.log(file.indexOf('.'));
      if(file.indexOf('.') != -1){
        var f = {
          name : file,
          files: [],
          counter: 0
        };

        var resizedFiles = fs.readdirSync('uploads/resized');
        resizedFiles.forEach(resizedFile => {
          if(resizedFile.indexOf(file) != -1){
            f.files.push(resizedFile);
            f.counter++;
            resized.push(resizedFile);
          }
        });
        allFiles.push(f);
      }

    });
    var stats = {
      allImages: allFiles.length,
      data: allFiles,
      resized: {
        images: resized,
        count: resized.length
      },
      cache: cache
    }

    res.writeHead(200, {'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));

});

module.exports = router;


