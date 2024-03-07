import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequestTypeType } from 'src/types/request-type.type';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ModalComponent, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  requestType: RequestTypeType = RequestTypeType.consultation;

  requestModalIsShown = false;

  openRequestModal() {
    this.requestModalIsShown = true;
  }

  closeRequestModal() {
    this.requestModalIsShown = false;
  }
}
