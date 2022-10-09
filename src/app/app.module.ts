import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { NgxEchartsModule } from 'ngx-echarts';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { MathjaxModule } from 'mathjax-angular';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { AccordionModule } from 'primeng/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({}, {}),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    InputNumberModule,
    FormsModule,
    NgbModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    MathjaxModule.forRoot(),
    CardModule,
    MessageModule,
    MessagesModule,
    AccordionModule,
    BrowserAnimationsModule,
    ToastModule,
    AppRoutingModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
