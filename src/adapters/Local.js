class Local {
    constructor(config) {
        this.config = config;
    }

    file(file, fileNumber, object) {
        const reader = new FileReader();
        reader.onload = function (e) {
            this.config.preview(e.target.result, this.getFileType(file), fileNumber);
        };
        reader.onprogress = function (e) {
            this.uploadProgress[fileNumber] = Math.round((e.loaded * 100) / e.total);
            this.config.progress(this.uploadProgress[fileNumber], fileNumber);
        };
        reader.readAsDataURL(file);
        return true;
    }

}

export default Local;