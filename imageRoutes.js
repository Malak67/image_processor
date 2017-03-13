const express = require('express'),
      multer = require('multer'),
      path = require('path'),
      router = express.Router();

const fs = require('fs');
const Jimp = require('jimp');

var cache = {
  hit:0,
  miss:0
}

// Function used to display an image from the Local storage
function displayImage(imagePath, response)
{
  try
  {
    // read the image path from the local storage and add it to a var called img
    let img = fs.readFileSync(imagePath);
    console.log(img);
    response.writeHead(200, {'Content-Type': 'image/png' });
    response.end(img, 'binary');
  }
  catch(err)
  {
      console.log(err);
      response.writeHead(200, {'Content-Type': 'text/plain' });
      response.end('Image not found! \n');
  }
}

// Set storage details for Multer
let storage = multer.diskStorage(
{
  destination: './uploads/',
  filename: function (req, file, callback)
  {
    callback(null, file.originalname);
  }
});

let upload = multer({ storage: storage });

// POST image to upload
router.post('/image', upload.single('avatar'), function(req, res, next)
{
  try
  {
    let originalFileName = req.file.originalname;
    let fileName = req.file.filename;

    console.log(req.file, 'files');
    console.log(req.file.originalname, 'File name');

    res.writeHead(200, {'Content-Type': 'text/plain' });
	  res.end('Image uploaded! \n');
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

  //if the size is not set, just display the normal image
  if(!size)
  {
    return displayImage('./uploads/'+imageName, res);
  }

  var path = './uploads/resized/' + size + imageName;

  // check if the image already exists and display it, if not resize it and display it
  if(fs.existsSync(path))
  {
    cache.hit++;
    return displayImage(path, res);
  }

  // if the image is not yet resized, set the width and height and resize it with Jimp
  let width = Number(size.substring(0, size.indexOf("x")));
  let height = Number(size.substr(size.indexOf("x")+1, size.length));

  Jimp.read(fs.readFileSync('./uploads/'+imageName), function (err, image)
  {
      if (err) throw err;

      image.resize(width, height)                     // resize
           .quality(100)                              // set JPEG quality
           .write(path, function()                    // save
           {
                cache.miss++;
                return displayImage(path, res);
           });
  });
});

router.get('/stats', function(req, res, next){


    var allFiles = [];
    var resized = [];

    // fetch all pictures from uploads folder
    var files = fs.readdirSync('uploads');
    files.forEach(file =>
    {
      var f = {};
      if(file.indexOf('.') != -1)
      {
        var f =
        {
          name : file,
          files: [],
          counter: 0
        };

        // fetch all resized pictures from uploads/resized folder
        var resizedFiles = fs.readdirSync('uploads/resized');
        resizedFiles.forEach(resizedFile =>
        {
          if(resizedFile.indexOf(file) != -1)
          {
            f.files.push(resizedFile);
            f.counter++;
            resized.push(resizedFile);
          }
        });
        allFiles.push(f);
      }
    });

    // Create the stats json containg all of the details needed
    var stats =
    {
      allImages: allFiles.length,
      data: allFiles,
      resized:
      {
        images: resized,
        count: resized.length
      },
      cache: cache
    }

    res.writeHead(200, {'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));

});

module.exports = router;
