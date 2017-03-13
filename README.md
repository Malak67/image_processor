# image_processor
Node-based microservice, with RESP API, allowing an user to Upload images, and risize them per request.


## Functionality

This service will have a set of image files, stored in a local folder. 
It will receive HTTP calls for those images on a particular endpoint (like **_/image/img_012343.jpg_**), and will support requests for various resolutions of those images. 
For instance, **_/image/img_012343.jpg?size=300x400_** will resize the original image at **300x400** and return it to the client. 
This service is used to serve images optimised for the device they’ll be displayed onto. 


## Installation

Install all node modules from package.json:
~~~
npm install
~~~

Run the app by typing:
~~~
npm install
~~~

or (preferably)
~~~
nodemon
~~~

## Usage
