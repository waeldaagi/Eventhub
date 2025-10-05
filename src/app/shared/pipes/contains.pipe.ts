import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contains'
})
export class ContainsPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    const normalizedSearch = String(searchText).toLowerCase();
    return items.filter(item => {
      return JSON.stringify(item).toLowerCase().includes(normalizedSearch);
    });
  }

}
