import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { InputComponent } from 'src/app/base/input/input.component';
import { CategoryService } from 'src/app/services/category.service';
import { ClientService } from 'src/app/services/client.service';
import { MaterialService } from 'src/app/services/material.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { ToolService } from 'src/app/services/tool.service';
import { Service } from 'src/libs/core/service';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { StrUtils } from 'src/libs/utils/str.utils';

const SERVICES_BY_OBJECT: { [key: string]: any } = {
  Material: MaterialService,
  Category: CategoryService,
  Client: ClientService,
  Order: OrderService,
  Product: ProductService,
  Purchase: PurchaseService,
  Tool: ToolService,
}

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent extends InputComponent implements OnInit {

  @ViewChild('dropdown') dropdown!: NgbDropdown;
  @Input() placeholder: string = '';
  @Input() floatingLabel: boolean = false;
  @Input() override control: FormControl<string | string[] | null> = new FormControl<string | string[] | null>(null);
  @Input() set query(value: { [key: string]: any } | undefined) {
    this._query = value;
    this._records = this.service?.find(this.processQuery()) || [];
    this.recordsToShow = this.filterRecords(this._records, this.selectedRecords);
  }
  get query() {
    return this._query;
  }
  @Input() labelField: string = 'name';
  @Input() limit: number = 200;
  @Input() messageWhenValueIsMissing?: string;
  @Input() messageWhenFilterNotMatch?: string;
  @Input() messageWhenRecordsNotFound?: string;
  @Input() model?: keyof typeof SERVICES_BY_OBJECT;
  @Input() set multiple(value: boolean) {
    this._multiple = value;
    this.selectedRecords = [];
    this.record = undefined;
    this.control.setValue(null);
    this.inputControl.setValue(null);
  }
  get multiple() {
    return this._multiple;
  }
  @Input() icon?: string;
  @Input() set records(value: any[]) {
    this._records = value;
    this.recordsToShow = this.filterRecords(this._records, this.selectedRecords);
    if (this.control.value) {
      const val = Array.isArray(this.control.value) ? this.control.value[0] : this.control.value || '';
      this.record = this.getRecord(val);
      this.inputControl.setValue(this.getValue());
    }
  }
  get records() {
    return this._records;
  }

  _records: any[] = [];
  selectedRecords: any[] = [];
  recordsToShow: any[] = [];
  record: any;
  timeout: any;
  service?: Service<any>;
  searchTerm: string = '';
  loading: boolean = false;
  dropDownId: string = CoreUtils.createUUID();
  _multiple: boolean = false;
  _query?: { [key: string]: any };
  inputControl: FormControl<string | string[] | null> = new FormControl<string | string[] | null>(null);

  constructor(
    private injector: Injector,
  ) {
    super();
  }

  getValue() {
    return this.record?.[this.labelField ?? 'name'] || '';
  }

  ngOnInit() {
    this.control.valueChanges.subscribe(async (value) => {
      if (value) {
        if (this.multiple && this.selectedRecords.length === 0) {
          if (Array.isArray(value)) {
            value.forEach((id: string) => {
              this.selectedRecords.push(this.getRecord(id));
            });
          } else {
            this.selectedRecords.push(this.getRecord(value));
          }
        } else if (!this.record && !Array.isArray(value)) {
          this.record = this.getRecord(value);
          this.inputControl.setValue(this.getValue());
        }
      } else {
        this.record = null;
        this.selectedRecords = [];
      }
      this.recordsToShow = this.filterRecords(this._records, this.selectedRecords);
    });
    this.labelField = 'name';
    if (!this.model) {
      let recordsTmp = this.getRecords();
      this.recordsToShow = this.filterRecords(recordsTmp, this.selectedRecords);
    } else {
      const serviceToInject = SERVICES_BY_OBJECT[this.model as keyof typeof SERVICES_BY_OBJECT];
      if (!serviceToInject) {
        let recordsTmp = this.getRecords();
        this.recordsToShow = this.filterRecords(recordsTmp, this.selectedRecords);
      } else {
        this.service = this.injector.get<Service<any>>(serviceToInject);
        this._records = this.service?.find(this.processQuery()) || [];
        if (this._records.length === 0) {
          this._records = this.service?.getAll();
        }
        this.recordsToShow = this.filterRecords(this._records, this.selectedRecords);
      }
    }
    if (this.control.value) {
      if (this.multiple && Array.isArray(this.control.value)) {
        this.control.value.forEach((id: string) => {
          this.selectedRecords.push(this.getRecord(id));
        });
        this.inputControl.setValue(null);
        //this._records = [...this.selectedRecords];
      } else if (!Array.isArray(this.control.value) && this.control.value) {
        this.record = this.getRecord(this.control.value);
        this.inputControl.setValue(this.getValue());
        //this._records = [this.record];
      }
      this.recordsToShow = this.filterRecords(this._records, this.selectedRecords);
    }
  }

  private getRecord(recordId: string) {
    if (!this.service) {
      return this.searchOnRecords({
        id: recordId
      })?.[0];
    } else {
      return this.service.findById(recordId);
    }
  }

  private getRecords() {
    if (!this.service) {
      return this.searchOnRecords(this.processQuery());
    } else {
      return this.service.find(this.processQuery())
    }
  }

  onChange(event: any) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.searchTerm = event.target.value;
    this.setSearchTimeout();
  }

  private setSearchTimeout() {
    this.timeout = setTimeout(() => {
      if (!this.loading) {
        this.searchRecords();
      } else {
        clearTimeout(this.timeout);
        this.setSearchTimeout();
      }
    }, 200);
  }

  onClickRecord(record: any) {
    if (this.multiple) {
      this.selectedRecords.push(record);
      this.control.setValue(this.selectedRecords.map((element) => element.id));
      this.recordsToShow = this.filterRecords(this._records, this.selectedRecords);
      this.inputControl.setValue(null);
    } else {
      this.record = record;
      this.inputControl.setValue(this.getValue());
      this.control.setValue([this.record.id]);
    }
    this.hideDropdown();
  }

  onClickInput() {
    if (this.disabled || this.readonly) {
      return;
    }
    if (this.record && this.isDropdownVisible()) {
      this.hideDropdown();
    }
    if (!this.isDropdownVisible()) {
      this.showDropdown();
    }
  }

  onBlur() {
    /*if (!this.record || this.selectedRecords.length === 0) {
      this.control.setValue(null);
      this.control.markAsDirty();
      this.control.updateValueAndValidity();
      //this.control.setErrors({ filter: true });
    }*/
  }

  onRemovePill(index: number) {
    if (this.disabled || this.readonly) {
      return;
    }
    this.selectedRecords.splice(index, 1);
    this.control.setValue(this.selectedRecords.map((element) => element.id));
    this.recordsToShow = this.filterRecords(this._records, this.selectedRecords);
  }

  private searchRecords() {
    try {
      if (this.isDropdownVisible()) {
        this.hideDropdown();
      }
      this.record = undefined;
      this.inputControl.setValue(null);
      this.loading = true;
      let recordsTmp: any[] = [];
      if (this.service) {
        this._records = this.service?.find(this.processQuery()) || [];
        recordsTmp = this._records;
      } else {
        recordsTmp = this.searchOnRecords(this.processQuery()) || [];
      }
      this.recordsToShow = this.filterRecords(recordsTmp, this.selectedRecords);
      this.loading = false;
    } catch (error) {

    }
    if (!this.isDropdownVisible()) {
      this.showDropdown();
    }
  }

  private isDropdownVisible() {
    return this.dropdown.isOpen();
  }

  private showDropdown() {
    this.dropdown.open();
  }

  private hideDropdown() {
    this.dropdown.close();
  }


  private processQuery() {
    const query: any = {};
    if (this.query) {
      for (const key in this.query) {
        if (this.query[key] === '{!value}' && !this.searchTerm) {
          continue;
        }
        const val = this.query[key] === '{!value}' ? this.searchTerm : this.query[key];
        query[key] = val;
      }
    } else {
      query[this.labelField] = this.searchTerm;
    }
    return query;
  }

  private filterRecords(records: any[], selected: any[]) {
    if (this.multiple && selected && selected.length > 0) {
      return records.filter((record) => {
        return !selected.map((element) => { return element.id }).includes(record.id);
      });
    } else {
      return records;
    }
  }

  private searchOnRecords(query: { [key: string]: any}): any[] {
    return this._records.filter((element: any) => {
      let evalString = '';
      Object.keys(query).forEach((key) => {
        const value = element[key as keyof any];
        const queryVal = query[key];
        if (evalString)
          evalString += ' && ';
        if (typeof value === 'string' && typeof queryVal === 'string') {
          evalString += StrUtils.containsIgnoreCase(value, queryVal);
        } else {
          evalString += value == queryVal;
        }
      });
      return eval(evalString);
    });
  }

}
