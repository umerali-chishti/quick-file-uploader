import axios from "axios";

class Api {
    constructor(config) {
        this.config = config
        this.url = credentials.UPLOAD_URL;
    }

    async file(file, fileNumber, object) {
        let fileName = (new Date).getTime() + '-' + file.name;
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await axios.post(this.url, formData, {
                onUploadProgress: (progress) => this.handleProgress(object, fileNumber, progress),
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...this.config.headers
                }
            });
            const src = res.data.url;
            object.addInput(fileName, fileNumber);
            object.config.preview(src, object.getFileType(file), fileNumber)
            object.config.success(['Successfully uploaded file.'], fileNumber);
            return true;
        } catch (err) {
            if (err) {
                object.config.error(['There was an error uploading your file: ' + err], fileNumber);
                return false;
            }
        }

    }

    handleProgress(object, fileNumber, progress) {
        object.uploadProgress[fileNumber] = Math.round(progress.loaded / progress.total * 100);
        object.config.progress(object.uploadProgress[fileNumber], fileNumber);
    }

}

export default Api;
