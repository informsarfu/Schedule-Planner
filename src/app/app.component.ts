import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SharedService } from './shared.service';

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
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    // dateClick: this.handleDateClick.bind(this)
  };

  events: any[] = [];

  newEvent: { title: string, date: string } = { title: '', date: '' };

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.sharedService.getEvents().subscribe(events => {
      this.events = events;
      this.updateCalendarEvents();
    });
  }

  // handleDateClick(arg: DateClickArg) {
  //   const dateStr = arg.dateStr;
  //   const title = prompt('Enter a title for the event:');
  //   if (title) {
  //     this.sharedService.addEvents({ title, dateStr })
  //       .then(() => {
  //         console.log('Event added successfully');
  //         this.loadEvents();
  //       })
  //       .catch(error => {
  //         console.error('Error adding event:', error);
  //       });
  //   }
  // }

  addEvent() {
    if (this.newEvent.title && this.newEvent.date) {
      this.sharedService.addEvents(this.newEvent.title, this.newEvent.date)
        .then(() => {
          console.log('Event added successfully');
          this.loadEvents();
          this.newEvent = { title: '', date: '' };
        })
        .catch(error => {
          console.error('Error adding event:', error);
        });
    }
  }

  updateCalendarEvents() {
    this.calendarOptions.events = this.events;
  }
}
