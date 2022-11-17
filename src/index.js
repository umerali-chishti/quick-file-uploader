import './style.css';
import Api from './adapters/Api.js';
import Local from './adapters/Local.js';
import S3 from './adapters/S3.js';


class Upload {
    /**
     * Storage local, s3 , ajax
     */
    constructor(config={}) {
        this.config = {};
        this.ID = config.container || 'upload-container';
        this.BrowseID = this.ID+'__browse';
        this.config.uploadContainer = document.getElementById(this.ID);
        if(!this.config.uploadContainer){
            console.log('Container not found!');
            return false;
        }
        this.config.storage = config.storage || 'local'
        this.config.headers = config.headers || {}
        this.config.preview = config.preview || this.preview;
        this.config.mimeTypes = config['mime-types'] || 'jpg|jpeg|png|pdf|svg|mp4|3gp|mov|avi|wmv';
        this.config.accept = config.accept || 'image/*,video/*,application/pdf'
        this.config.size = config.size || (1024 * 2000);
        this.config.error = config.error || this.errorMessage;
        this.config.success = config.success || this.successMessage;
        this.config.progress = config.progress || this.progressBar;
        this.config.multiple = config.multiple || false;
        let fileInput = (this.config.multiple)? 'file-input[]' :'file-input';
        this.config.hiddenInputName = config['input-name'] || fileInput;
        this.config.path = config.path || 'tmp/';
        this.config.draggable = config.draggable || true;
        this.config.onDrag = config.onDrag || this.emptyFunc;
        this.config.onDrop = config.onDrop || this.emptyFunc;
        this.config.removeFile = this.removeFile;
        this.config.removePoster = this.removePoster;
        this.files = [];
        this.uploadProgress = [];
        this.dT = new DataTransfer();
        this.config.dT = this.dT;
        this.config.BrowseID = this.BrowseID;
        this.isCustomPreview = (config.preview) ? true : false;
        this.init();
        // return this.removeFile;
    }

    init() {
        this.randerContainer();
        this.events();
        console.log('init uploader');
    }

    events() {
        if(this.config.uploadContainer){
            let self = this;
            this.config.uploadContainer.addEventListener('click', function(){
                document.getElementById(self.BrowseID).click();
            });
            if(this.config.draggable){
                this.config.uploadContainer.addEventListener("dragover", (event)=>{
                    event.preventDefault();
                    this.config.uploadContainer.dataset.dragged = true;
                    this.config.onDrag();
                });
                this.config.uploadContainer.addEventListener("dragleave", ()=>{
                    this.config.uploadContainer.dataset.dragged = '';
                    this.config.uploadContainer.removeAttribute('data-dragged');
                    this.config.onDrop();
                });
                this.config.uploadContainer.addEventListener("drop", this.uploaderElClick.bind(this));
            }
        }
    }
    emptyFunc(){}
    preview(src, type, i){
        const div = document.querySelector('#progress-bar-'+i)
        const a = document.createElement('a')
        a.innerText = "Remove Image";
        a.classList.add('remove-poster')
        a.dataset.id = i
        a.href = "javascript:;"
        a.addEventListener("click", this.removePoster.bind(this))
        if(type === 'image'){
            const img = document.createElement('img')
            img.src = src
            img.classList.add('poster-image')
            div.appendChild(img);
        }
        if(type === 'video'){
            const video = document.createElement('video')
            video.controls = true;
            video.classList.add('poster-video')
            const videoSource = document.createElement('source');
            videoSource.setAttribute('src', src);
            video.appendChild(videoSource);
            div.appendChild(video);
            video.load();
            // video.play();
        }
        if(type === 'application/pdf'){
            const link = document.createElement('a')
            link.src = src
            link.innerText = 'PDF File'
            div.appendChild(link);

        }
        setTimeout(()=> div.querySelector('progress').remove(), 500);
        div.appendChild(a)

    }

    removePoster(){
        let self = event.target;
        let id = self.dataset.id
        let itemNumber = null;
        document.querySelectorAll('.poster-wrapper').forEach((obj,i) => {
            let removeLink = obj.querySelector('.remove-poster');
            if(removeLink.dataset.id == id){
                itemNumber = obj;
            }
            if(removeLink.dataset.id > id){
                removeLink.dataset.id = removeLink.dataset.id - 1
            }
        })
        itemNumber.remove();
        let fileInput = document.getElementById('file__'+id)
        if(fileInput){
            fileInput.remove();
        }
        this.removeFile(id);
    }

    removeFile(id){
        this.dT.items.remove(id)
        document.getElementById(this.BrowseID).files = this.dT.files
    }

    progressBar(progress, fileNumber = 0){
        let preview = document.querySelector('#preview-container');
        let progressBar = document.querySelector('#progress-bar-'+fileNumber);
        if(!progressBar){
            preview.insertAdjacentHTML('beforeend', '<div id="progress-bar-'+fileNumber+'" class="poster-wrapper"><progress max=100 value=0></progress></div>');
            progressBar = document.querySelector('#progress-bar-'+fileNumber);
        }
        progressBar.children[0].value = progress
    }

    errorMessage(errors, fileNumber){
        console.log(errors)
    }

    successMessage(msg, fileNumber){
        console.log(msg)
    }

    formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'
        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
    }

    getFileType(file) {
        if(file.type.match('image.*')){
            return 'image'
        }
        if(file.type.match('video.*')){
            return 'video';
        }
        if(file.type.match('audio.*')){
            return 'audio';
        }
        return file.type;
    }

    randerContainer(){
        let hiddenInput = '';
        let previewContainer = '';
        let multiple = (this.config.multiple)? 'multiple' :'';
        let localInputName = 'name='+this.config.hiddenInputName;
        if(this.config.storage === 's3' || this.config.storage === 'api'){
            if(!this.config.multiple){
                let editInput = document.querySelector('input[name="'+this.config.hiddenInputName+'"]')
                let editValue = (editInput)? editInput.value :'';
                hiddenInput = '<input type="hidden" name='+this.config.hiddenInputName+' value="'+editValue+'">';
            }
            localInputName = ''
        }

        if(!this.isCustomPreview){
            previewContainer = '<div id="preview-container"></div>';
        }

        this.config.uploadContainer.insertAdjacentHTML(
            'afterend',
            hiddenInput+'<input type="file" id="'+this.BrowseID+'" '+localInputName+' hidden '+multiple+' accept="'+this.config.accept+'"/>' + previewContainer
        );
        document.getElementById(this.BrowseID).addEventListener('change', this.uploaderElClick.bind(this));
    }

    addInput(value, fileNumber){
        if(!this.config.multiple){
            console.log(this.config);
            console.log(this.config.hiddenInputName);
            document.querySelector('input[name="'+this.config.hiddenInputName+'"]').value = value;
            return true;
        }
        this.config.uploadContainer.insertAdjacentHTML(
            'afterend',
            '<input type="hidden" id="file__'+fileNumber+'" name='+this.config.hiddenInputName+' value="'+value+'">'
        );
    }

    uploaderElClick(event){
        event.preventDefault();
        let self = event.target;
        this.files = self.files || event.dataTransfer.files;
        if(this.config.uploadContainer.dataset.dragged){
            this.config.uploadContainer.dataset.dragged = '';
            this.config.uploadContainer.removeAttribute('data-dragged');
            self = document.getElementById(this.BrowseID);
        }
        ([...this.files]).forEach(async (obj,i) => {
            let number = this.dT.items.length;
            if(await this.uploadFile(obj, number)){
                this.dT.items.add(obj)
            }
        });
        self.files = this.dT.files
    }
    async uploadFile(file, fileNumber) {
        let $this = this
        let hasError = false;
        let errors = [];
        let regex = new RegExp("(.*?)\.(" + this.config.mimeTypes + ")$");
        if (!(regex.test(file.name))) {
            hasError = true;
            errors.push('Allowed file type are ' + this.config.mimeTypes.split('|').join(', '));
        }
        if (file.size > this.config.size) {
            hasError = true;
            errors.push('File size should not be greater than ' + this.formatBytes(this.config.size));
        }
        if (hasError) {
            this.config.error(errors, fileNumber);
            return false;
        }
        this.uploadProgress.push(0);
        const adapters = {
            's3': S3,
            'api': Api,
            'local': Local
        };

        const selectedAdapter = adapters[this.config.storage];
        if (selectedAdapter === undefined) {
            errors.push('No adapter found for your storage system' + this.config.storage);
            this.config.error(errors, fileNumber)
            return false;
        }

        return await (new selectedAdapter(this.config)).file(file, fileNumber, this);
    }

}

export default Upload;