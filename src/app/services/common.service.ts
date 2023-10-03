import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  getYears() {
    return ['2023'];
  }

  getMonths() {
    return [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];
  }

  getCurrentMonth() {
    var a = new Date();
    let mnth = a.getMonth() + 1;
    if (mnth.toString().length == 1) {
      return '0' + mnth;
    } else {
      return mnth;
    }
  }

  getCurrentMonthString() {
    var a = new Date();
    var monthString = a.getMonth() + 1;
    switch (monthString) {
      case 1:
        return 'Jan';
        break;
      case 2:
        return 'Feb';
        break;
      case 3:
        return 'Mar';
        break;
      case 4:
        return 'Apr';
        break;
      case 5:
        return 'May';
        break;
      case 6:
        return 'Jun';
        break;
      case 7:
        return 'Jul';
        break;
      case 8:
        return 'Aug';
        break;
      case 9:
        return 'Sep';
        break;
      case 10:
        return 'Oct';
        break;
      case 11:
        return 'Nov';
        break;
      case 12:
        return 'Dec';
        break;
      default:
        return '';
    }
  }

  getCurrentYear() {
    var a = new Date();
    var currentDateString = a.getFullYear();
    return currentDateString;
  }
}
