import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostcodeService {
  private apiKey = 'FeIwIXbbk0WhiyuI-Hi-Uw44901';
  constructor(private http: HttpClient) { }

  // Fetch postcodes within a specific area or partial search
  searchPostcodes(searchText: string): Observable<string[]> {
    const url = `https://postcodes.io/postcodes/${searchText}/autocomplete`;
    return this.http.get<any>(url).pipe(
      map(response => response.result?.map((p: any) => p) || [])
    );
  }

  autoCompletePostCodeList(searchText: string): Observable<any> {
    const url = `https://api.getAddress.io/typeahead/${searchText}?api-key=${this.apiKey}`;

    var requestBody = {
      "search": ["postcode"]
    }
    return this.http.post<any>(url, requestBody);
  }

  autoCompleteAddresList(searchText: string): Observable<any> {
    const url = `https://api.getAddress.io/autocomplete/${searchText}?api-key=${this.apiKey}`;

    return this.http.get<any>(url);
  }

  getAddressDetails(id: any): Observable<any> {
    const url = `https://api.getAddress.io/get/${id}?api-key=${this.apiKey}`;

    return this.http.get<any>(url);
  }

  getDistanceBetweenLatAndLong(fromLatitude: any, fromLongitude: any, toLatitude: any, toLongitude: any): Observable<any> {
    const url = `https://api.getAddress.io/distance/${fromLatitude}/${fromLongitude}/to/${toLatitude}/${toLongitude}/?api-key=${this.apiKey}`;

    return this.http.get<any>(url);
  }

}
