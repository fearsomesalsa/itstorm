import {
  Component, EventEmitter, inject, Input, OnInit, Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestTypeType } from 'src/types/request-type.type';
import {
  FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { DefaultResponseType } from 'src/types/default-response.type';
import { MatSelectModule } from '@angular/material/select';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { RequestType } from 'src/types/request.type';
import { MatInputModule } from '@angular/material/input';
import { MaskitoModule } from '@maskito/angular';
import { MaskitoOptions } from '@maskito/core';
import { RequestService } from '../../services/request.service';
import mask from '../../utils/phone-mask.util';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MaskitoModule,
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline', subscriptSizing: 'dynamic' } },
  ],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() requestType: RequestTypeType = RequestTypeType.order;

  @Input() services: string[] = [];

  @Input() selectedService = '';

  @Output() closeClick = new EventEmitter();

  fb = inject(FormBuilder);

  requestService = inject(RequestService);

  requestIsSended = false;

  requestSuccess = false;

  requestTypeType = RequestTypeType;

  modalForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(/^\+7\s\(\d{3}\)\s\d{3}(-\d{2}){2}$/)]],
  });

  readonly options: MaskitoOptions = mask;

  ngOnInit() {
    if (this.selectedService) {
      this.modalForm.addControl('service', new FormControl(this.selectedService, Validators.required));
    }
  }

  createRequest() {
    if (this.modalForm.valid) {
      const request: RequestType = {
        name: this.modalForm.value.name,
        phone: this.modalForm.value.phone,
        type: this.requestType,
      };
      if (this.requestType === RequestTypeType.order) {
        request.service = this.modalForm.value.service;
      }
      this.requestService.createRequest(request)
        .subscribe({
          next: (requestResponse: DefaultResponseType) => {
            if (requestResponse.error) {
              throw new Error(requestResponse.message);
            }
            this.requestIsSended = true;
            this.requestSuccess = true;
            this.modalForm.reset();
          },
          error: () => {
            this.requestIsSended = true;
            this.requestSuccess = false;
          },
        });
    }
  }

  closeRequestModal() {
    this.modalForm.reset();
    this.closeClick.emit();
  }
}
