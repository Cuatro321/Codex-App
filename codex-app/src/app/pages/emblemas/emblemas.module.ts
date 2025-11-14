import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EmblemasPageRoutingModule } from './emblemas-routing.module';
import { EmblemasPage } from './emblemas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmblemasPageRoutingModule
  ],
  declarations: [EmblemasPage],
})
export class EmblemasPageModule {}
