import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

interface DateClickArg {
  date: Date;
  dateStr: string;
  allDay: boolean;
  resource?: any;
  dayEl: HTMLElement;
  jsEvent: MouseEvent;
  view: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this)
  };

  events: any[] = [];

  handleDateClick(arg: DateClickArg) {
    const dateStr = arg.dateStr;
    const title = prompt('Enter a title for the event:');
    if (title) {
      this.events = [...this.events, { title, date: dateStr }];
      this.calendarOptions.events = this.events;
    }
  }
}
