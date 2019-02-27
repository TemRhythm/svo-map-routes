import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'svgPath'
})
export class SvgPathPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value
      .map((p, i, arr) => {
        let res = '';
        if (i === 0) {
          res += 'M';
        }

        res += p.x + ',' + p.y;

        if (i === arr.length - 1) {
          res += !!args && !!args[0] && args[0].isClosed ? 'z' : '';
        } else {
          res += ' ';
        }
        return res;
      })
      .join('');
  }

}
