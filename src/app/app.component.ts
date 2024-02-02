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

// interface eventClickArg {
//   event: {
//     title: string;
//     date: Date;
//   };
// }


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    fixedWeekCount: false,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  content: any[] = [];

  newEvent: { title: string, date: string, time: string} = { title: '', date: '', time: ''};

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.sharedService.getEvents().subscribe(events => {
      this.content = events;
      this.updateCalendarEvents();
    });
  }

  //stop here

  handleDateClick(arg: DateClickArg) {
    const title = prompt('Enter event title:');
    const time = prompt('Enter event time (HH:MM format):');
    
    if (title && time) {
      const dateTimeString = arg.dateStr + ' ' + time;
      const eventDateTime = new Date(dateTimeString);
  
      if (!isNaN(eventDateTime.getTime())) {
        this.sharedService.addEvents(title, arg.dateStr, time)
          .then(() => {
            console.log('Event added successfully');
            this.loadEvents();
          })
          .catch(error => {
            console.error('Error adding event:', error);
          });
      } else {
        alert('Invalid date-time format. Please enter the date and time in HH:MM format.');
      }
    }
  }
  

  addEvent() {
    if (this.newEvent.title && this.newEvent.date && this.newEvent.time) {
      this.sharedService.addEvents(this.newEvent.title, this.newEvent.date, this.newEvent.time)
        .then(() => {
          console.log('Event added successfully');
          this.loadEvents();
          this.newEvent = { title: '', date: '', time: ''};
        })
        .catch(error => {
          console.error('Error adding event:', error);
        });
    }
  }

  updateCalendarEvents() {
    this.calendarOptions.events = this.content;
  }

  handleEventClick(arg: any) {
    console.log("Clicked Event:", arg);
    const eventDate = arg.event.startStr;
    const eventTitle = arg.event.title;
    const eventTime = arg.event.extendedProps.time;
    const [hours, minutes] = eventTime.split(':');

    let formattedTime: string;
    const hoursNumber = parseInt(hours, 10);

    if (hoursNumber > 12) {
      formattedTime = (hoursNumber - 12).toString() + ':' + minutes + ' PM';
    } else {
      formattedTime = hours + ':' + minutes + ' AM';
    }
  
    alert('Event Title: ' + eventTitle + '\nEvent Time: ' + formattedTime);
  }
}
