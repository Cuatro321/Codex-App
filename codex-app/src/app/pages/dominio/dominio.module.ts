import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DominioPageRoutingModule } from './dominio-routing.module';

import { DominioPage } from './dominio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DominioPageRoutingModule
  ],
  declarations: [DominioPage]
})
export class DominioPageModule {}
