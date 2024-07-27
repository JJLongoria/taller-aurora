import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export const calculateMaxPages = (total: number, size: number): number => {
  return Math.ceil(total / size);
}

interface Page {
  number: number;
  value: string;
  active: boolean;
  variant: 'primary' | 'secondary' | 'danger' | 'warning' | 'info';
  outline: boolean;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Output() onPageClick: EventEmitter<number> = new EventEmitter();
  @Output() onNextPage: EventEmitter<number> = new EventEmitter();
  @Output() onPreviousPage: EventEmitter<number> = new EventEmitter();
  @Output() onFirstPage: EventEmitter<number> = new EventEmitter();
  @Output() onLastPage: EventEmitter<number> = new EventEmitter();

  @Input() name: string = 'Pagination';
  @Input() page: number = 1;
  @Input() maxPages: number = 1;
  @Input() extraPages: number = 1;


  @Input() firstPageButton: boolean = true;
  @Input() lastPageButton: boolean = true;
  @Input() nextPageButton: boolean = true;
  @Input() previousPageButton: boolean = true;
  @Input() clickable: boolean = true;

  firstPageDisabled: Boolean = false;
  lastPageDisabled: boolean = false;
  nextPageDisabled: boolean = false;
  previousPageDisabled: boolean = false;

  pagesToShow: Page[] = [];

  constructor() { }

  ngOnInit(): void {
    this.process();
  }

  private process(): void {
    this.pagesToShow = [];
    this.lastPageDisabled = !this.hasNextPage();
    this.nextPageDisabled = !this.hasNextPage();
    this.firstPageDisabled = !this.hasPreviousPage();
    this.previousPageDisabled = !this.hasPreviousPage();
    let start = this.page - this.extraPages;
    let end = this.page + this.extraPages;
    if (start < 1) {
      start = 1;
    }
    if (end < start) {
      end = start;
    }
    if (end > this.maxPages) {
      end = this.maxPages;
    }
    if (this.firstPageButton && start > 1) {
      this.pagesToShow.push({
        number: 1,
        value: '1',
        active: false,
        variant: 'secondary',
        outline: true
      });
    }
    if (start - 1 > 0) {
      this.pagesToShow.push({
        number: start - 1,
        value: '...',
        active: false,
        variant: 'secondary',
        outline: true
      });
    }
    for (let i = start; i <= end; i++) {
      this.pagesToShow.push({
        number: i,
        value: i.toString(),
        active: i === this.page,
        variant: i === this.page ? 'primary' : 'secondary',
        outline: i !== this.page
      });
    }
    if (this.maxPages - end > 0) {
      this.pagesToShow.push({
        number: end + 1,
        value: '...',
        active: false,
        variant: 'secondary',
        outline: true
      });
    }
    if (this.lastPageButton && end < this.maxPages) {
      this.pagesToShow.push({
        number: this.maxPages,
        value: this.maxPages.toString(),
        active: false,
        variant: 'secondary',
        outline: true
      });
    }
  }

  private hasNextPage(): boolean {
    return this.page < this.maxPages;
  }

  private hasPreviousPage(): boolean {
    return this.page > 1;
  }

  pageClick(page: Page): void {
    if(page.number === this.page || !this.clickable){
      return;
    }
    this.page = page.number;
    this.onPageClick.emit(page.number);
    this.process();
  }

  nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }
    this.page++;
    this.onNextPage.emit(this.page);
    this.process();
  }

  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }
    this.page--;
    this.onPreviousPage.emit(this.page);
    this.process();
  }

  firstPage(): void {
    if (this.page === 1) {
      return;
    }
    this.page = 1;
    this.onFirstPage.emit(this.page);
    this.process();
  }

  lastPage(): void {
    if (this.page === this.maxPages) {
      return;
    }
    this.page = this.maxPages;
    this.onLastPage.emit(this.page);
    this.process();
  }

}
