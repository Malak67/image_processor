# image_processor
Node-based microservice, with RESP API, allowing an user to Upload images, and risize them per request.


## Functionality

This service will have a set of image files, stored in a local folder. 

It will receive HTTP calls for those images on a particular endpoint (like **_/image/img_012343.jpg_**), and will support requests for various resolutions of those images.

For instance, **_/image/img_012343.jpg?size=300x400_** will resize the original image at **300x400** and return it to the client. 

This service is used to serve images optimised for the device they’ll be displayed onto. 


## Installation

Clone the application in your own repo

Install all node modules from package.json:
~~~
npm install
~~~

Run the app by typing:
~~~
node server.js
~~~

or (preferably)
~~~
nodemon
~~~

## Usage

In the browser, type: 
> localhost:6090

Upload images using the GUI

Get an image from the API:
> http://localhost:6090/api/image/maxresdefault.jpg

Get a resized image from the API:
> http://localhost:6090/api/image/maxresdefault.jpg?size=800x800

See stats about the number of uploaded images, resized images, hits and misses (for resized images):
> http://localhost:6090/api/stats

Example output:
~~~
{"allImages":1,"data":[{"name":"maxresdefault.jpg","files":["800x800maxresdefault.jpg"],"counter":1}],"resized":{"images":["800x800maxresdefault.jpg"],"count":1},"cache":{"hit":1,"miss":0}}
~~~
