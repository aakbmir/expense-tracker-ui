import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  getYears() {
    return ['2024'];
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

  getBudget() {
    return '17717';
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

  getCurrentMonthString(monthString) {
    switch (monthString) {
      case 1:
      case '01':
        return 'January';
        break;
      case 2:
      case '02':
        return 'February';
        break;
      case 3:
      case '03':
        return 'March';
        break;
      case 4:
      case '04':
        return 'April';
        break;
      case 5:
      case '05':
        return 'May';
        break;
      case 6:
      case '06':
        return 'June';
        break;
      case 7:
      case '07':
        return 'July';
        break;
      case 8:
      case '08':
        return 'August';
        break;
      case 9:
      case '09':
        return 'September';
        break;
      case 10:
        return 'October';
        break;
      case 11:
        return 'November';
        break;
      case 12:
        return 'December';
        break;
      default:
        return '';
    }
  }

  getCurrentMonthStringShort(monthString) {
    switch (monthString) {
      case 1:
      case '01':
        return 'Jan';
        break;
      case 2:
      case '02':
        return 'Feb';
        break;
      case 3:
      case '03':
        return 'Mar';
        break;
      case 4:
      case '04':
        return 'Apr';
        break;
      case 5:
      case '05':
        return 'May';
        break;
      case 6:
      case '06':
        return 'Jun';
        break;
      case 7:
      case '07':
        return 'Jul';
        break;
      case 8:
      case '08':
        return 'Aug';
        break;
      case 9:
      case '09':
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
