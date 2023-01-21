class Local {
    file(file, fileNumber, object) {
        const reader = new FileReader();
        reader.onload = function (e) {
            object.preview(e.target.result, this.getFileType(file), fileNumber);
        };
        reader.onprogress = function (e) {
            this.uploadProgress[fileNumber] = Math.round((e.loaded * 100) / e.total);
            object.progress(this.uploadProgress[fileNumber], fileNumber);
        };
        reader.readAsDataURL(file);
        return true;
    }

}

export default Local;