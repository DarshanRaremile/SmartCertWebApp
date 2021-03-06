import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { RestCallsComponent } from '../../services/httpServices';

@Component({
    selector: 'logo-upload',
    template: '<input type="file" [multiple]="multiple" #fileInput>'
})
export class LogoUploadComponent {
    @Input() multiple: boolean = false;
    @ViewChild('fileInput') inputEl: ElementRef;

    constructor(private http: RestCallsComponent) {}

    upload() {
        console.log("________________Certificate Data_________________________")
        console.log("______________________________________")
        let inputEl: HTMLInputElement = this.inputEl.nativeElement;
        let fileCount: number = inputEl.files.length;
        let formData = new FormData();
        if (fileCount > 0) { // a file was selected
            for (let i = 0; i < fileCount; i++) {
                formData.append('files', inputEl.files.item(i));
            }
            console.log("_____________________________");
            console.log(formData);
        this.http.setTemp(formData);
    }
    }
}