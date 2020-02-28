import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-datepicker",
  templateUrl: "./datepicker.component.html",
  styleUrls: ["./datepicker.component.css"]
})
export class DatepickerComponent implements OnInit {
  @Input() locale: string;
  @Input() canChangeNavMonthLogic: any;
  @Input() isAvailableLogic: any;

  @Output() emitSelectedDate = new EventEmitter<any>();

  navDate: any;
  weekDaysHeaderArr: Array<string> = [];
  gridArr: Array<any> = [];
  selectedDate: any;

  constructor() {}

  ngOnInit() {
    moment.locale(this.locale);
    this.navDate = moment(); // 현재 날짜
    this.makeHeader(); // weekend 설정
    this.makeGrid(); // day 설정
  }

  // month 이동시
  changeNavMonth(num: number) {
    // true면 이동 가능
    if (this.canChangeNavMonth(num)) {
      this.navDate.add(num, "month");
      this.makeGrid();
    }
  }

  // month 이동 가능 여부 확인
  canChangeNavMonth(num: number) {
    if (this.canChangeNavMonthLogic) {
      const clonedDate = moment(this.navDate);
      return this.canChangeNavMonthLogic(num, clonedDate);
    } else {
      return true;
    }
  }

  // 일 -월 - 화 - 수 - 목 - 금 - 토 설정하는거임
  makeHeader() {
    const weekDaysArr: Array<number> = [0, 1, 2, 3, 4, 5, 6];
    weekDaysArr.forEach(day =>
      this.weekDaysHeaderArr.push(
        moment()
          .weekday(day)
          .format("ddd")
      )
    ); // Sun, Mon 등으로 포맷팅
  }

  //
  makeGrid() {
    this.gridArr = [];

    // 현재 2월 27일이라고 가정하고 출력값을 보겠습니다
    const firstDayDate = moment(this.navDate).startOf("month"); // firstDayDate는 2월 1일
    const initialEmptyCells = firstDayDate.weekday(); // 6 (토요일이라서 6인가?)
    const lastDayDate = moment(this.navDate).endOf("month"); // lastDayDate는 2월 29일
    const lastEmptyCells = 6 - lastDayDate.weekday(); // 0 (이때도 토요일이라서 6-6해서 0)
    const daysInMonth = this.navDate.daysInMonth(); // 2월이 29일까지 있으니까 29아닌감?
    const arrayLength = initialEmptyCells + lastEmptyCells + daysInMonth; // 35

    for (let i = 0; i < arrayLength; i++) {
      let obj: any = {};
      // 첫번째 조건문은 없는날짜. 그니까 2월을 보면 1일 전에 빈 부분있잖아? 그부분인듯
      if (i < initialEmptyCells || i > initialEmptyCells + daysInMonth - 1) {
        obj.value = 0;
        obj.available = false;
      } else {
        // 이건 진짜 날짜.
        obj.value = i - initialEmptyCells + 1;
        obj.available = this.isAvailable(i - initialEmptyCells + 1);
      }
      this.gridArr.push(obj);
    }
  }

  isAvailable(num: number): boolean {
    if (this.isAvailableLogic) {
      let dateToCheck = this.dateFromNum(num, this.navDate);
      return this.isAvailableLogic(dateToCheck);
    } else {
      return true;
    }
  }

  // 그날이 무슨 날인지를 알려줌.
  dateFromNum(num: number, referenceDate: any): any {
    let returnDate = moment(referenceDate);
    return returnDate.date(num);
  }

  // 날짜 선택
  selectDay(day: any) {
    if (day.available) {
      this.selectedDate = this.dateFromNum(day.value, this.navDate);
      this.emitSelectedDate.emit(this.selectedDate);
    }
  }
}
