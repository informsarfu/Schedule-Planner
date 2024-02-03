import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SharedService } from './shared.service';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';


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
    fixedWeekCount: false,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  content: any[] = [];

  newEvent: { title: string, date: string, time: string} = { title: '', date: '', time: ''};

  constructor(
    private sharedService: SharedService,
    private matDialog: MatDialog) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.sharedService.getEvents().subscribe(events => {
      this.content = events;
      this.updateCalendarEvents();
    });
  }

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
    // this.calendarOptions.events = this.content;
    this.calendarOptions.events = this.content.map(event => ({
      title: event.title,
      start: new Date(event.date + 'T' + event.time)
    }));
  }

  handleEventClick(eventData: any) {
    console.log("Clicked Event:", eventData);
    const eventTitle = eventData.event.title;
    const eventStart = new Date(eventData.event.start);
    const eventTime = eventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.openEvent(eventTitle, eventStart, eventTime);

    console.log('Event Title:', eventTitle);
    console.log('Event Date:', eventStart.toDateString());
    console.log('Event Time:', eventTime);
    // alert('Event Title: ' + eventTitle + '\nEvent Date: ' + eventStart.toDateString() + '\nEvent Time: ' + eventTime);
  }

  openEvent(eventTitle: string, eventStart: Date, eventTime: string){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '250px';
    dialogConfig.data = {
      title: eventTitle,
      date: eventStart.toDateString(),
      time: eventTime
    };
    dialogConfig.position = {
      top: '0',
      left: '60%'
    };

    dialogConfig.panelClass = 'event-dialog';
  
    this.matDialog.open(DialogBodyComponent, dialogConfig);
  }
}
