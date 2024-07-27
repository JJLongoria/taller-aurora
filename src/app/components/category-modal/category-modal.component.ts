import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogMode, DialogSize, ModalComponent } from 'src/app/base/modal/modal.component';
import { CategoryService } from 'src/app/services/category.service';
import { ICategory, ICategoryInput } from 'src/libs/types/category.interface';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.css']
})
export class CategoryModalComponent implements OnInit {

  @ViewChild('modal') private modal!: ModalComponent
  get title(): string {
    if (this.isNewAction) {
      return 'Nueva Categoría';
    }
    if (this.isEditAction) {
      return 'Editar Categoría: ' + this.category.name;
    }
    return 'Detalles de la Categoría ' + this.category.name;
  }
  category: ICategoryInput = {} as ICategoryInput;
  mode: DialogMode = DialogMode.View;

  form = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string | null>('', [Validators.required]),
    description: new FormControl<string | null>(''),
    icon: new FormControl<string | null>(''),
    color: new FormControl<string | null>('')
  });

  get isViewAction() {
    return this.mode === DialogMode.View;
  }

  get isEditAction() {
    return this.mode === DialogMode.Edit;
  }

  get isNewAction() {
    return this.mode === DialogMode.New;
  }

  constructor(
    private readonly categoryService: CategoryService
  ) { }

  ngOnInit(): void {
  }

  async open(mode?: DialogMode, category?: ICategory) {
    this.mode = mode || DialogMode.New;
    this.form.reset();
    this.category = category || {} as ICategoryInput;
    this.mapCategoryToForm();
    return this.modal?.open(mode, {
      centered: true,
      size: DialogSize.xl
    });
  }

  private mapFormToCategory() {
    this.category = {
      id: this.form.value.id || undefined,
      name: this.form.value.name || '',
      description: this.form.value.description || undefined,
      icon: this.form.value.icon || undefined,
      color: this.form.value.color || undefined
    }
  }

  private mapCategoryToForm() {
    this.form.patchValue({
      id: this.category?.id || null,
      name: this.category?.name || '',
      description: this.category?.description || null,
      icon: this.category?.icon || null,
      color: this.category?.color || null
    });
  }

  save() {
    this.mapFormToCategory();
    if (this.isEditAction && this.category.id) {
      this.categoryService.updateById(this.category.id, this.category as ICategory);
    } else if (this.isNewAction) {
      this.categoryService.createOne(this.category as ICategory);
    }
    this.modal.close(this.category);
  }

}
