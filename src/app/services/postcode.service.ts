import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostcodeService {
  private baseUrl = 'https://postcodes.io';

  constructor(private http: HttpClient) {}

  // Fetch postcodes within a specific area or partial search
  searchPostcodes(searchText: string): Observable<string[]> {
    const url = `https://postcodes.io/postcodes/${searchText}/autocomplete`;
    return this.http.get<any>(url).pipe(
      map(response => response.result?.map((p: any) => p) || [])
    );
  }
}
