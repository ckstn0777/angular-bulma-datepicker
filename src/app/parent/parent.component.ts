import { Component, OnInit } from "@angular/core";

import * as moment from "moment";

@Component({
  selector: "app-parent",
  templateUrl: "./parent.component.html",
  styleUrls: ["./parent.component.css"]
})
export class ParentComponent implements OnInit {
  // 지역은 기본적으로 en설정
  locale: string = "en";
  selectedDate: any;

  constructor() {}

  ngOnInit() {}

  // datapicker에서 선택한 date
  setSelectedDate(date) {
    this.selectedDate = date;
  }

  // 달변경, 현재날짜
  canChangeMonthLogic(num, currentDate) {
    currentDate.add(num, "month");
    // const minDate = moment().add(-1, "month");
    const maxDate = moment().add(0, "month");

    // 달 수정시 '오늘'이 '오늘'과 '다음 연도'사이에 있는지 확인하면 false가 반환됩니다
    return currentDate.isBetween("2019-01-01", maxDate);
  }

  isAvailableLogic(dateToCheck: any) {
    if (dateToCheck.isAfter(moment(), "day")) {
      return false;
    } else {
      return true;
    }
  }
}
