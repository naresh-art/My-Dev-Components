// import { LightningElement } from 'lwc';

// export default class CustomRichTextEditor extends LightningElement {
//     editorContent = '';

//     applyBold() {
//         document.execCommand('bold', false, null);
//     }

//     applyItalic() {
//         document.execCommand('italic', false, null);
//     }

//     applyUnderline() {
//         document.execCommand('underline', false, null);
//     }

//     applyLink() {
//         const url = prompt('Enter the URL:', 'https://');
//         if (url) {
//             document.execCommand('createLink', false, url);
//         }
//     }

//     handleSave() {
//         const editorDiv = this.template.querySelector('.editor');
//         this.editorContent = editorDiv.innerHTML;
//         console.log('Saved content:', this.editorContent);

//         // Logic to save the content to Salesforce or handle it further
//     }
// }


// import { LightningElement } from 'lwc';

// export default class CustomRichTextEditor extends LightningElement {
//     editorContent = '';

//     changeFont(event) {
//         document.execCommand('fontName', false, event.target.value);
//     }

//     changeFontSize(event) {
//         document.execCommand('fontSize', false, event.target.value);
//     }

//     applyBold() {
//         document.execCommand('bold', false, null);
//     }

//     applyItalic() {
//         document.execCommand('italic', false, null);
//     }

//     applyUnderline() {
//         document.execCommand('underline', false, null);
//     }

//     applyTextColor() {
//         const color = prompt('Enter a color (e.g., red, #ff0000):', 'black');
//         if (color) {
//             document.execCommand('foreColor', false, color);
//         }
//     }

//     applyLink() {
//         const url = prompt('Enter the URL:', 'https://');
//         if (url) {
//             document.execCommand('createLink', false, url);
//         }
//     }

//     applyImage() {
//         const url = prompt('Enter the image URL:', 'https://');
//         if (url) {
//             document.execCommand('insertImage', false, url);
//         }
//     }

//     alignLeft() {
//         document.execCommand('justifyLeft', false, null);
//     }

//     alignCenter() {
//         document.execCommand('justifyCenter', false, null);
//     }

//     alignRight() {
//         document.execCommand('justifyRight', false, null);
//     }

//     alignJustify() {
//         document.execCommand('justifyFull', false, null);
//     }

//     handleSave() {
//         const editorDiv = this.template.querySelector('.editor');
//         this.editorContent = editorDiv.innerHTML;
//         console.log('Saved content:', this.editorContent);

//         // Logic to save the content to Salesforce or handle it further
//     }
// }


// import { LightningElement } from 'lwc';

// export default class CustomRichTextEditor extends LightningElement {
//     editorContent = '';

//     changeFont(event) {
//         document.execCommand('fontName', false, event.target.value);
//     }

//     changeFontSize(event) {
//         document.execCommand('fontSize', false, event.target.value);
//     }

//     applyBold() {
//         document.execCommand('bold', false, null);
//     }

//     applyItalic() {
//         document.execCommand('italic', false, null);
//     }

//     applyUnderline() {
//         document.execCommand('underline', false, null);
//     }

//     applyStrikethrough() {
//         document.execCommand('strikeThrough', false, null);
//     }

//     applyTextColor() {
//         const color = prompt('Enter a text color (e.g., red, #ff0000):', 'black');
//         if (color) {
//             document.execCommand('foreColor', false, color);
//         }
//     }

//     applyBackgroundColor() {
//         const color = prompt('Enter a background color (e.g., yellow, #ffff00):', 'yellow');
//         if (color) {
//             this.applyStyleToSelection(`background-color: ${color};`);
//         }
//     }

//     applyLink() {
//         const url = prompt('Enter the URL:', 'https://');
//         if (url) {
//             document.execCommand('createLink', false, url);
//         }
//     }

//     clearFormatting() {
//         document.execCommand('removeFormat', false, null);
//     }

//     triggerImageUpload() {
//         this.template.querySelector('.image-upload').click();
//     }

//     handleImageUpload(event) {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();

//             reader.onload = () => {
//                 const imageDataUrl = reader.result;
//                 document.execCommand('insertImage', false, imageDataUrl);
//             };

//             reader.readAsDataURL(file);
//         }
//     }

//     alignLeft() {
//         document.execCommand('justifyLeft', false, null);
//     }

//     alignCenter() {
//         document.execCommand('justifyCenter', false, null);
//     }

//     alignRight() {
//         document.execCommand('justifyRight', false, null);
//     }

//     alignJustify() {
//         document.execCommand('justifyFull', false, null);
//     }

//     undo() {
//         document.execCommand('undo', false, null);
//     }

//     redo() {
//         document.execCommand('redo', false, null);
//     }

//     applyStyleToSelection(style) {
//         const selection = window.getSelection();
//         if (!selection.rangeCount) return;

//         const range = selection.getRangeAt(0);
//         const span = document.createElement('span');
//         span.style = style;

//         range.surroundContents(span);
//         selection.removeAllRanges();
//         selection.addRange(range);
//     }

// }


import { LightningElement } from 'lwc';

export default class CustomRichTextEditor extends LightningElement {
    editorContent = '';
    isEditing = true;

    renderedCallback() {
        if (this.isEditing) {
            const editor = this.template.querySelector('.editor');
            if (editor) {
                editor.innerHTML = this.editorContent; // Restore saved content
            }
        }
    }

    changeFont(event) {
        document.execCommand('fontName', false, event.target.value);
    }

    changeFontSize(event) {
        document.execCommand('fontSize', false, event.target.value);
    }

    applyBold() {
        document.execCommand('bold', false, null);
    }

    applyItalic() {
        document.execCommand('italic', false, null);
    }

    applyUnderline() {
        document.execCommand('underline', false, null);
    }

    applyStrikethrough() {
        document.execCommand('strikeThrough', false, null);
    }

    applyTextColor() {
        const color = prompt('Enter a text color (e.g., red, #ff0000):', 'black');
        if (color) {
            document.execCommand('foreColor', false, color);
        }
    }

    applyBackgroundColor() {
        const color = prompt('Enter a background color (e.g., yellow, #ffff00):', 'yellow');
        if (color) {
            document.execCommand('backColor', false, color);
        }
    }

    applyLink() {
        const url = prompt('Enter the URL:', 'https://');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    clearFormatting() {
        document.execCommand('removeFormat', false, null);
    }

    triggerImageUpload() {
        this.template.querySelector('.image-upload').click();
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageDataUrl = reader.result;
                document.execCommand('insertImage', false, imageDataUrl);
            };
            reader.readAsDataURL(file);
        }
    }

    alignLeft() {
        document.execCommand('justifyLeft', false, null);
    }

    alignCenter() {
        document.execCommand('justifyCenter', false, null);
    }

    alignRight() {
        document.execCommand('justifyRight', false, null);
    }

    alignJustify() {
        document.execCommand('justifyFull', false, null);
    }

    undo() {
        document.execCommand('undo', false, null);
    }

    redo() {
        document.execCommand('redo', false, null);
    }

    handleSave() {
        const editor = this.template.querySelector('.editor');
        if (editor) {
            this.editorContent = editor.innerHTML;
        }
    }

    togglePreview() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            const previewContainer = this.template.querySelector('.preview-content');
            if (previewContainer) {
                previewContainer.innerHTML = this.editorContent;
            }
        }
    }

    applyBulletList() {
        document.execCommand('insertUnorderedList', false, null);
    }

    applyNumberedList() {
        document.execCommand('insertOrderedList', false, null);
    }

}