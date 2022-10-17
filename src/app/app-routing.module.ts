import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FieldAdditionComponent } from './field-addition/field-addition.component';
import { ScalarComponent } from './scalar/scalar.component';

const routes: Routes = [
  { path: 'addition', component: FieldAdditionComponent },
  { path: 'scalar', component: ScalarComponent },
  { path: '',   redirectTo: '/addition', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
