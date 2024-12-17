import { Pipe, PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';

@Pipe({
  name: 'formatHeader'
})


export class FormatHeaderNamePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // Add space before capital letters, convert to uppercase
    return value.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
  }
}
