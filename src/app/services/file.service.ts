import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class FileService {
  quarkusServer = 'http://192.168.1.17:8200/api/';


  constructor(private http: HttpClient) {
  }

  public getAsOpenDocument(docId: string) {
    return this.http.get(this.quarkusServer + 'files/getAsOpenDocument/' + docId);
  }

  public getFileById(id: string) {
    if (id) {
      return this.http.get(this.quarkusServer + 'files/presignedUrlForDownload' + '?fileName=' + id).pipe(map(response => {
        const re: any = response;
        return re.presignedUrlForDownload;
      }));
    }
  }

// public getFileById(id: string) {


// return Observable.create((observer)=>{
// observer.next(GlobalConfig.minio.api+"/download/documents/"+id+ "?token="+DocumentService.minioToken);
// });
// }

  public uploadFile(file: File, progress: boolean = false): Observable<any> {
    console.log(file.type);
    return this.http
      .get(this.quarkusServer + 'files/presignedUrlForUpload' + '?fileName=' + file.name).pipe(
        mergeMap(response => {
          const re: any = response;
          console.log('size:' + file.size);
          const headers = new HttpHeaders({
            'Content-type': file.type,
            'ngsw-bypass': 'true',
            skip: 'true'
          });
          const minioUrl = re.presignedUrlForUpload;
          if (progress) {
            return this.http.put(minioUrl, file, {headers, reportProgress: true, observe: 'events'}).pipe(
              map(event => {

                switch (event.type) {
                  case HttpEventType.UploadProgress:
                    return Math.round(100 * event.loaded / event.total);
                  case HttpEventType.Response:
                    return [
                      {id: re.id, fileName: re.fileName, fileType: file.type}
                    ];
                }

              })
            );
          }

          return this.http.put(minioUrl, file, {headers}).pipe(
            map(data => {
              return [
                {id: re.id, fileType: file.type}
              ];
            })
          );
        })
      );
  }

  public getPresignedUrlForUpload(file: File): Observable<any> {
    return this.http.get(this.quarkusServer + 'files/presignedUrlForUpload' + '?fileName=' + file.name);
  }

  public upload(file: File, progress: boolean = false, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Disposition': 'attachment; filename=' + file.name,
      'ngsw-bypass': 'true',
      skip: 'true'
    });
    if (progress) {
      return this.http.put(data.presignedUrlForUpload, file, {headers, reportProgress: true, observe: 'events'}).pipe(
        map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              return Math.round(100 * event.loaded / event.total);
            case HttpEventType.Response:
              return [
                {id: data.id, fileName: data.fileName, fileType: file.type}
              ];
          }

        })
      );
    }

    return this.http.put(data.presignedUrlForUpload, file, {headers}).pipe(
      map(() => {
        return [
          {id: data.id, fileType: file.type}
        ];
      })
    );
  }
}
