import S3 from 'aws-sdk/clients/s3';

class S3Upload {
	constructor() {
        this.bucket = new S3({
            accessKeyId: credentials.AWS_ACCESS_KEY_ID,
            secretAccessKey: credentials.AWS_SECRET_ACCESS_KEY,
            region: credentials.AWS_DEFAULT_REGION,
            signatureVersion: 'v4',
        });
    }
	file(file, fileNumber, object) {
        let fileName = (new Date).getTime() + '-' + file.name;
        const params = {
            Bucket: credentials.AWS_BUCKET,
            Key: object.config.path + fileName,
            Body: file,
            ACL: 'public-read',
            ContentType: file.type
        }
        return this.bucket.upload(params, function(err, data) {
            if (err) {
                object.config.error(['There was an error uploading your file: '+err], fileNumber);
                return false;
            }
            let src = 'https://'+credentials.AWS_BUCKET+'.s3.us-east-2.amazonaws.com/'+object.config.path+''+fileName;
            object.addInput(fileName, fileNumber);
            object.config.preview(src, object.getFileType(file), fileNumber)
            object.config.success(['Successfully uploaded file. '+data], fileNumber);
            return true;
        }).on('httpUploadProgress', function(progress) {
            object.uploadProgress[fileNumber] = Math.round(progress.loaded / progress.total * 100);
            object.config.progress(object.uploadProgress[fileNumber], fileNumber);
            console.log(object.uploadProgress[fileNumber], fileNumber);
        })
    }

}
export default S3Upload;
