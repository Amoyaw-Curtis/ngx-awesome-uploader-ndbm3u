import { FilePickerComponent } from 'ngx-awesome-uploader';
import { ValidationError } from 'ngx-awesome-uploader';
import { FilePreviewModel } from 'ngx-awesome-uploader';
import { UploaderCaptions } from 'ngx-awesome-uploader';
import { HttpClient } from '@angular/common/http';
import { DemoFilePickerAdapter } from '../demo-file-picker.adapter';
import {
 Component,
 ElementRef,
 OnInit,
 QueryList,
 ViewChild,
 ViewChildren,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
 selector: 'advanced-demo',
 templateUrl: './advanced-demo.component.html',
 styleUrls: ['./advanced-demo.component.css'],
})
export class AdvancedDemoComponent {
 @ViewChild('uploader', { static: false }) uploader: FilePickerComponent;
 // @ViewChild('rotateButtons') rotateButtons: ElementRef;
 @ViewChildren('rotateButtons') rotateButtons: QueryList<ElementRef>;
 public adapter = new DemoFilePickerAdapter(this.http);
 public myFiles: FilePreviewModel[] = [];
 public captions: UploaderCaptions = {
   dropzone: {
     title: 'Fayllari bura ata bilersiz',
     or: 'və yaxud',
     browse: 'Fayl seçin',
   },
   cropper: {
     crop: 'Kəs',
     cancel: 'Imtina',
   },
   previewCard: {
     remove: 'Sil',
     uploadError: 'Fayl yüklənmədi',
   },
 };


 public cropperOptions = {
   minContainerWidth: '300',
   minContainerHeight: '300',
 };
 imgSrcs: SafeUrl[] = [];
fileItems: FilePreviewModel[] = [];
imgSrc: {
   [x: string]: SafeUrl; 
  } = {};
  degrees: {
    [x: string]: number; 
   } = {'': 0};

fileItemsToUpload: FilePreviewModel[] = [];


 constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}


 public onValidationError(error: ValidationError): void {
   alert(`Validation Error ${error.error} in ${error.file?.name}`);
 }


 public onUploadSuccess(e: FilePreviewModel): void {
  //  console.log(e);
 }


 public onRemoveSuccess(e: FilePreviewModel) {
  //  console.log(e);
 }
 public onFileAdded(fileItem: FilePreviewModel) {
  // this.degrees[fileItem.fileName] = 0;
   // console.log('onFileAdded => ', file.fileName.split('.')[1]);
   // const rotateButtons = this.rotateButtons.map(btn => btn.nativeElement);
  //  console.log('rotateButtons: ', this.rotateButtons);
   // this.myFiles.push(file); 
  //  console.log('uploadFile =>', fileItem);
  //  this.fileItems.push(fileItem);
  //  this.fileItems.forEach(fileItem => {
  //   const objUrl = URL.createObjectURL(fileItem.file);
  //   this.imgSrcs = [...this.imgSrcs, this.sanitizer.bypassSecurityTrustUrl(objUrl)];
  // })
  const objUrl = URL.createObjectURL(fileItem.file);
  this.imgSrc[fileItem.fileName] = this.sanitizer.bypassSecurityTrustUrl(objUrl);
  console.log('this.imgSrc[fileItem.fileName]', this.imgSrc[fileItem.fileName])
  this.collectFilesToUpload(fileItem);
  // this.fileItemsToUpload = [...this.fileItemsToUpload, fileItem];
  // this.uploader.setFiles(this.fileItemsToUpload);
  // this.uploader.setFiles(this.fileItems);
  //  this.initializeRotateButton(file);
 }

 collectFilesToUpload(fileItem) {
  if (!this.fileItemsToUpload.some(fi => fi.fileName === fileItem.fileName)) {
    this.fileItemsToUpload = [...this.fileItemsToUpload, fileItem];
    this.uploader.setFiles(this.fileItemsToUpload);
   }
 }

 rotateFile(fileItem, event) {
  //  this.adapter.rotateFile(fileItem, event, this.degrees[fileItem.fileName]);
   this.adapter.rotateFile(fileItem, event);
   this.collectFilesToUpload(fileItem);
  //  if (!this.fileItemsToUpload.some(fi => fi.fileName === fileItem.fileName)) {
  //   this.fileItemsToUpload = [...this.fileItemsToUpload, fileItem];
  //   this.uploader.setFiles(this.fileItemsToUpload);
  //  }

  //  this.adapter.rotateFile(this.fileItems, event);
 }

 public uploadFiles() {
  console.log('this.fileItemsToUpload.', this.fileItemsToUpload)
  this.fileItemsToUpload.forEach(fileItem => {
    console.log('fileItem.', fileItem)
    this.adapter.uploadFile(fileItem);
  })
 }

 public myCustomValidator(file: File): Observable<boolean> {
   if (!file.name.includes('uploader')) {
     return of(true).pipe(delay(2000));
   }
   // if (file.size > 50) {
   //   return this.http.get('https://vugar.free.beeceptor.com').pipe(map((res) =>  res === 'OK' ));
   // }
   return of(false).pipe(delay(2000));
 }

 private rotateImageBlob(file: FilePreviewModel, degrees, index) {
   return new Promise((resolve, reject) => {
     const img = new Image();
     degrees[index] += 90;
     console.log(' degrees[index] += 90;', degrees[index]);
     img.onload = function() {
       // create a canvas element
       const canvas = document.createElement('canvas');
       const ctx = canvas.getContext('2d');
      
       // set canvas dimensions to match image
       canvas.width = img.width;
       canvas.height = img.height;
      
       // rotate the canvas context
         ctx.translate(canvas.width, 0);
         ctx.rotate(Math.PI / 2);
         ctx.drawImage(img, 0, 0);
       // ctx.translate(canvas.width / 2, canvas.height / 2);
       // ctx.rotate(degrees * Math.PI / 180);
       // ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
       // convert canvas to blob
       // canvas.toBlob(blob => {
       //   resolve(blob);
       // }, 'image/jpeg');
     };
     img.onerror = reject;
     img.src = URL.createObjectURL(file.file);
   });
 }


 private initializeRotateButton(file: FilePreviewModel): void {
   // const rotateButtons = this.rotateButtons;
  //  console.log('rotateButtons: ', document.querySelector('#rotateSourceImage'));
   // this.isRotation = true;
   const rotatedFiles = [];
   let newFile: File;
   // let angle = 0;
   const degrees = new Array(5).fill(0);
   // rotateButtons.forEach((button: ElementRef, index: number) => {
   //   button.nativeElement.addEventListener('click', async () => {
   //     // this.rotateImageBlob(file, degrees, index);
   //     degrees[index] += 90;
   //     console.log(' degrees[index] += 90;', degrees[index]);
   //     const preview = button.nativeElement.closest('.img-preview-thumbnail') as HTMLDivElement;
   //     const img = preview.firstChild as HTMLImageElement;
   //     const file = this.myFiles[index].file;
   //     console.log('file: ', file);
   //     const rotatedCanvas: HTMLCanvasElement = await new Promise(resolve => {
   //       const img = new Image();
   //       const canvas = document.createElement('canvas');
   //       const ctx = canvas.getContext('2d');


   //       canvas.width = img.naturalHeight;
   //       canvas.height = img.naturalWidth;


   //       ctx.translate(canvas.width, 0);
   //       ctx.rotate(Math.PI / 2);
   //       ctx.drawImage(img, 0, 0);
   //       resolve(canvas);
   //     });
   //     rotatedCanvas.toBlob(blob => {
   //       img.src = URL.createObjectURL(blob);
   //       // resolve(blob);
   //       // const newFile = new File([blob], file.name, { type: file.type });
   //       // rotatedFiles.push(newFile);
   //       // console.log(rotatedFiles.length);
   //       // const stack = this.$fi.fileinput('getFileStack');
   //       // console.log('stack: ', stack);
   //       // this.$fi.fileinput('reset').fileinput('_readFiles', rotatedFiles);
   //     }, file.type);
   //   });
   // });
 }
}
