import {
  HttpRequest,
  HttpClient,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
  FilePickerAdapter,
  UploadResponse,
  UploadStatus,
  FilePreviewModel,
} from 'ngx-awesome-uploader';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
// import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  template: '',
})
export class DemoFilePickerAdapter extends FilePickerAdapter {
  @ViewChildren('rotateButtons') rotateButtons: QueryList<ElementRef>;
  // imgSrc: SafeUrl;
  degrees: {
    [x: string]: number; 
   } = {'': 0};
  // degrees = new Array(5).fill(0);
  file: File | Blob;
  constructor(private http: HttpClient) {
    // constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    super();
  }
  public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
    // console.log('uploadFile =>', fileItem);
    // this.file = fileItem.file;
    const form = new FormData();
    form.append('file', fileItem.file);
    const api = 'http://localhost:3000/uploads';
    const req = new HttpRequest('POST', api, form, { reportProgress: true });
    return this.http.request(req).pipe(
      map((res: HttpEvent<any>) => {
        console.log('making request')
        if (res.type === HttpEventType.Response) {
          const responseFromBackend = res.body;
          return {
            body: responseFromBackend,
            status: UploadStatus.UPLOADED,
          };
        } else if (res.type === HttpEventType.UploadProgress) {
          /** Compute and show the % done: */
          const uploadProgress = +Math.round((100 * res.loaded) / res.total);
          return {
            status: UploadStatus.IN_PROGRESS,
            progress: uploadProgress,
          };
        }
      }),
      catchError((er) => {
        console.log(er);
        return of({ status: UploadStatus.ERROR, body: er });
      })
    );
  }
  public removeFile(fileItem: FilePreviewModel): Observable<any> {
    const id = 50;
    const responseFromBackend = fileItem.uploadResponse;
    // console.log(fileItem);
    const removeApi = `http://localhost:3000/delete-file/${fileItem.fileName}`;
    return this.http.post(removeApi, { id });
  }

  public rotateFile(fileItem: FilePreviewModel, event) {
    if (this.degrees[fileItem.fileName] === undefined) {
      this.degrees[fileItem.fileName] = 0;
    }
    this.degrees[fileItem.fileName] += 90;
    const rotateButton = event.target.parentNode.children[1];
    console.log('rotateButtons: ', event.target.parentNode.children[1]);
    const img = rotateButton.closest('img') as HTMLImageElement;
    console.log(' this.degrees: ',  this.degrees);
    const imgWidth = img.offsetWidth;
    const imgHeight = img.offsetHeight;
    img.style.height = 'auto';
    img.style.width = 'auto';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.transformOrigin = 'center center';
    img.style.transition = 'transform 0.3s ease';
    console.log('imgWidth: ', imgWidth, ' imgHeight: ', imgHeight);
    if (this.degrees[fileItem.fileName] % 90 === 0 || this.degrees[fileItem.fileName] % 270 === 0) {
      img.style.transform = `rotate(${this.degrees[fileItem.fileName]}deg) scale(0.75)`;
      img.style.height = `${160}px`;
    } else {
      img.style.transform = `rotate(${this.degrees[fileItem.fileName]}deg)`;
    } 
  }
}
