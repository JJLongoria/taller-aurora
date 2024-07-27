import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreUtils } from 'src/libs/utils/core.utils';
import { DateFormatOptions } from 'src/libs/utils/date.utils';
import { MathUtils } from 'src/libs/utils/math.utils';

export interface ColumnAttributes {
  minWidth?: number;
  width?: number;
  maxWidth?: number;
  align?: 'top' | 'middle' | 'bottom';
  justify?: 'left' | 'center' | 'right';
  style?: string;
  class?: string;
  icon?: {
    name: string;
    altText?: string;
    position?: 'left' | 'right';
    color?: string;
  }
  tooltip?: string;
  sortable?: boolean;
};

export interface ColumnTypeAttributes {
  dateFormat?: {
    locale: string;
    options?: DateFormatOptions;
  };
  decimalPlaces?: number;
  round?: boolean;
  collapse?: boolean;
  showAsMenu?: boolean;
  menuAlign?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export interface ColumnDefinition {
  name: string;
  label: string;
  type?: 'string' | 'number' | 'date' | 'datetime' | 'time' | 'boolean' | 'action';
  editable?: boolean;
  attributes?: ColumnAttributes;
  headerAttributes?: ColumnAttributes;
  typeAttributes?: ColumnTypeAttributes;
  actions?: DatatableAction[];
  rowActions?: DatatableAction[];
  link?: {
    href?: string;
    params?: { [key:string]: string };
    onClick?: (row: any, index: number) => any;
  };
  transform?: (row: any) => any;
}

export interface DatatableAction {
  name: string;
  label?: string;
  icon?: {
    name?: string;
    src?: string;
    altText?: string;
    position?: 'left' | 'right';
    color?: string;
  },
  tooltip?: string;
  toggle?: boolean;
  checked?: boolean | ((row: any) => boolean);
  disabled?: boolean | ((row: any) => boolean);
  hide?: boolean | ((row: any) => boolean);
}

export interface RowActionEvent {
  action: DatatableAction;
  index: number;
  row: any;
}

export interface CellActionEvent {
  action: DatatableAction;
  column: ColumnDefinition;
}

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {

  @Output() onRowAction: EventEmitter<RowActionEvent> = new EventEmitter();
  @Output() onCellAction: EventEmitter<CellActionEvent> = new EventEmitter();
  @Output() onSort: EventEmitter<ColumnDefinition> = new EventEmitter();

  @Input() keyField?: string;
  @Input() columns?: ColumnDefinition[];
  @Input() data?: any[];
  @Input() hideHeader?: boolean;
  @Input() showCheckbox?: boolean;
  @Input() selectedRows?: number[];
  @Input() editable?: boolean;
  @Input() showRowNumber?: boolean;
  @Input() rowNumberOffset?: number;

  _selectedRows?: any[];

  constructor() {

  }

  handleRowAction(action: DatatableAction, row: any, index: number) {
    this.onRowAction.emit({ action, row, index });
  }

  handleCellAction(action: DatatableAction, column: ColumnDefinition) {
    this.onCellAction.emit({ action, column });
  }

  handleSort(column: ColumnDefinition) {
    this.onSort.emit(column);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.data = undefined;
    this.columns = undefined;
  }

  getSelectedRows() {
    return this._selectedRows;
  }

  getDraftValues() {
    return this._selectedRows;
  }

  getCellData(row: any, column: ColumnDefinition) {
    let data;
    if (column.transform) {
      return column.transform(row);
    }
    if (column.name.indexOf('.') > -1) {
      const columnNames = column.name.split('.');
      let data = row;
      for (let i = 0; i < columnNames.length; i++) {
        data = data[columnNames[i]];
      }
    } else {
      data = row[column.name]
    }
    return this.formatCellData(data, column);
  }

  getLink(row: any, column: ColumnDefinition) {
    if (column.link) {
      let href = column.link.href ?? '';
      if (column.link.params) {
        for(const paramKey in column.link.params){
          const field = column.link.params[paramKey];
          href = href.replace(`:${paramKey}`, row[field]);
        }
      }
      return href;
    }
    return '#';
  }

  getCellStyle(column: ColumnDefinition) {
    let style = '';
    if (column.attributes?.minWidth) {
      style += `min-width: ${column.attributes.minWidth}px;`;
    } else if (column.headerAttributes?.minWidth) {
      style += `min-width: ${column.headerAttributes.minWidth}px;`;
    }
    if (column.attributes?.width) {
      style += `width: ${column.attributes.width}px;`;
    } else if (column.headerAttributes?.width) {
      style += `width: ${column.headerAttributes.width}px;`;
    }
    if (column.attributes?.maxWidth) {
      style += `max-width: ${column.attributes.maxWidth}px;`;
    } else if (column.headerAttributes?.maxWidth) {
      style += `max-width: ${column.headerAttributes.maxWidth}px;`;
    }
    if (column.attributes?.align) {
      style += `vertical-align: ${column.attributes.align};`;
    }
    if (column.attributes?.justify) {
      style += `text-align: ${column.attributes.justify};`;
    }
    if (column.attributes?.style) {
      style += column.attributes.style;
    }
    return style;
  }

  getHeaderStyle(column: ColumnDefinition) {
    let style = '';
    if (column.headerAttributes?.minWidth) {
      style += `min-width: ${column.headerAttributes.minWidth}px;`;
    } else if (column.attributes?.minWidth) {
      style += `min-width: ${column.attributes.minWidth}px;`;
    }
    if (column.headerAttributes?.width) {
      style += `width: ${column.headerAttributes.width}px;`;
    } else if (column.attributes?.width) {
      style += `width: ${column.attributes.width}px;`;
    }
    if (column.headerAttributes?.maxWidth) {
      style += `max-width: ${column.headerAttributes.maxWidth}px;`;
    } else if (column.attributes?.maxWidth) {
      style += `max-width: ${column.attributes.maxWidth}px;`;
    }
    if (column.headerAttributes?.align) {
      style += `vertical-align: ${column.headerAttributes.align};`;
    }
    if (column.headerAttributes?.justify) {
      style += `text-align: ${column.headerAttributes.justify};`;
    }
    if (column.headerAttributes?.style) {
      style += column.headerAttributes.style;
    }
    return style;
  }

  getHeaderClass(column: ColumnDefinition) {
    return column?.headerAttributes?.class || '';
  }

  getCellClass(column: ColumnDefinition) {
    return column?.attributes?.class || '';
  }

  private formatCellData(data: any, column: ColumnDefinition) {
    if (column.type === 'date') {
      if (data instanceof Date) {
        return this.formatDate(data, column);
      }
      return !CoreUtils.isNull(data) ? this.formatDate(new Date(data), column) : '';
    } else if (column.type === 'number') {
      if (CoreUtils.isNumber(data)) {
        return this.formatNumber(data, column);
      }
      return !CoreUtils.isNull(data) ? this.formatNumber(Number(data), column) : '';
    } else if (column.type === 'boolean') {
      if (CoreUtils.isBoolean(data)) {
        return data;
      }
      return data === 'true';
    }
    return data;
  }

  private formatDate(date: Date, column: ColumnDefinition) {
    return column?.typeAttributes?.dateFormat ? date.toLocaleDateString(column.typeAttributes.dateFormat.locale, column.typeAttributes.dateFormat.options) : date.toLocaleDateString();
  }

  private formatNumber(number: number, column: ColumnDefinition) {
    return column?.typeAttributes?.round ? MathUtils.round(number, column.typeAttributes?.decimalPlaces || 2) : number.toFixed(column.typeAttributes?.decimalPlaces || 2);
  }

  getActions(actions?: DatatableAction[], row?: any) {
    return actions?.filter(action => !this.hideAction(action, row));
  }

  hideAction(action: DatatableAction, row: any) {
    if (action.hide) {
      if (typeof action.hide === 'boolean') {
        return action.hide;
      } else if (typeof action.hide === 'function') {
        return action.hide(row);
      }
    }
    return false;
  }

}
