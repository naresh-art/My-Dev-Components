import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { publish, MessageContext } from "lightning/messageService";
import { refreshApex } from "@salesforce/apex";
import getFileVersions from "@salesforce/apex/FilePreviewController.getVersionFiles";
// import FILE_SELECTION from "@salesforce/messageChannel/FileSelectionChannel__c";

export default class FilePreviewComponent extends LightningElement {
    loaded = false;
    previewUrl;
    @api recordId;
    @api acceptedFormatList;
    @api filesPerPage; // Number of files per page
    imageSelected;
    files = [];
    fileCount = 0;

    subscription = null;
    @wire(MessageContext)
    messageContext;

    // Pagination properties
    currentPage = 1;
    totalPages = 0;

    get acceptedFormats() {
        return this.acceptedFormatList.split(",");
    }

    get cardTitle() {
        return "Files (" + this.fileCount + ")";
    }

    get showPagination() {
        return this.totalPages > 1;
    }

    @wire(getFileVersions, { recordId: "$recordId" })
    fileResponse(value) {
        this.wiredActivities = value;
        const { data, error } = value;
        this.loaded = false; // Reset loading indicator
        this.files = []; // Clear out previous files

        if (data) {
            let fileList = data;
            for (let i = 0; i < fileList.length; i++) {
                let file = {
                    Id: fileList[i].Id,
                    Title: fileList[i].Title,
                    Extension: fileList[i].FileExtension,
                    ContentDocumentId: fileList[i].ContentDocumentId,
                    CreatedDate: fileList[i].CreatedDate,
                    Size: this.formatBytes(fileList[i].ContentSize),
                    thumbnailFileCard:
                        "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB120BY90&versionId=" +
                        fileList[i].Id +
                        "&operationContext=CHATTER&contentId=" +
                        fileList[i].ContentDocumentId,
                    downloadUrl: "/sfc/servlet.shepherd/document/download/" + fileList[i].ContentDocumentId,
                    styleToShow: ""
                };
                this.files.push(file);
            }
            this.fileCount = this.files.length;
            this.totalPages = Math.ceil(this.fileCount / this.filesPerPage);
            this.currentPage = 1; // Reset to the first page after fetching new data
            this.loaded = true;
        } else if (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error loading Files",
                    message: error.body.message,
                    variant: "error"
                })
            );
        }
    }

    get paginatedFiles() {
        const start = (this.currentPage - 1) * this.filesPerPage;
        const end = start + this.filesPerPage;
        return this.files.slice(start, end);
    }

    get disablePrev() {
        return this.currentPage === 1;
    }

    get disableNext() {
        return this.currentPage === this.totalPages;
    }

    // Pagination navigation
    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    // publishMC(fileId) {
    //     const message = {
    //         selectedFileId: fileId
    //     };
    //     publish(this.messageContext, FILE_SELECTION, message);
    // }

    handleClick(event) {
        this.files.forEach((file) => {
            file.styleToShow = "";
        });
        const fileId = event.currentTarget.dataset.id;
        const index = this.files.findIndex((file) => file.ContentDocumentId === fileId);
        this.files[index].styleToShow = "border: 2px solid #0070d2; box-shadow: 0 0 4px #0070d2; border-radius: 4px;";
        const selectedItem = this.files[index];
        this.imageSelected = ["jpg", "jpeg", "png", "gif", "bmp", "svg"].includes(selectedItem.Extension);
        this.previewUrl = "/sfc/servlet.shepherd/document/download/" + selectedItem.ContentDocumentId;
        this.publishMC(selectedItem.ContentDocumentId);
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        refreshApex(this.wiredActivities);
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Success!",
                message: uploadedFiles.length + " Files Uploaded Successfully.",
                variant: "success"
            })
        );
    }

    formatBytes(bytes) {
        const marker = 1024;
        const kiloBytes = marker;
        const megaBytes = marker * marker;
        const gigaBytes = marker * marker * marker;

        if (bytes < kiloBytes) return bytes + " Bytes";
        else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed() + " KB";
        else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed() + " MB";
        else return (bytes / gigaBytes).toFixed() + " GB";
    }
}