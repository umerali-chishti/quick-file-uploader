
<a href="https://www.npmjs.com/package/quick-file-uploader"><img alt="npm" src="https://img.shields.io/npm/v/quick-file-uploader"></a>


# Quick File Uploader

> Quick file uploader for s3, html form submission

## Prerequisites

This project requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
8.19.2
v18.10.0
```
### Getting Started

1) Installation
    ```
    npm install quick-file-uploader
    ```
2) add `upload-container` id where you want to display uploader:
     ```html
    <div id="upload-container"></div>
    ```
3) Now,  import upload class and initialize:
     ```js
    import  Upload from 'quick-file-uploader'
    new Upload();
    ```
## Custom Params
you can customise file input, preview, error and success messages base on your desire.
|  Name|Description  |
|--|--|
|container  | element id, by default `upload-container` is set for uploading |
|input-name| name attribute, default name is `name="file-input"`|
|storage |`s3, local`, by default local is set|
|mime-types | for file type validation `Example: "jpg\|jpeg\|png\|pdf\|svg\|mp4\|3gp\|mov\|avi\|wmv"` |
|preview  | callback function for file preview `Received args: src, type, file number` |
| accept| attribute `Example: accept="image/*,video/*,application/pdf"`|
|size| size in bytes|
|error| callback function whenever error occur `Received args: errors, file number`|
|success| callback function when file successfully upload `Received args: message, file number`|
|progress| callback function for file uploading progress `Received args: progress, file number`|
|multiple|boolean |
|path| file path for s3 upload. by default `tmp/` path is set|
|draggable|boolean|
|onDrag|callback function|
|onDrop|callback function|

### Upload file on s3

1) define s3 credentials before initialize
    ```js
    window.credentials = {
       AWS_ACCESS_KEY_ID: 'xxxxxxx',
       AWS_SECRET_ACCESS_KEY:'xxxxxxx',
       AWS_DEFAULT_REGION:'xxxxxxx',
       AWS_BUCKET:'xxxxxxx',
     }
     ```
2) Now,  import upload class and initialize:
     ```js
    import  Upload from 'quick-file-uploader'
    new Upload({storage: 's3'});

## License

[MIT license](https://opensource.org/licenses/MIT).

