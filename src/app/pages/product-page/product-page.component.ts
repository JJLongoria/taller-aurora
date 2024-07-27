import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogMode } from 'src/app/base/modal/modal.component';
import { ColumnDefinition, RowActionEvent } from 'src/app/components/datatable/datatable.component';
import { ImageViewerModalComponent } from 'src/app/components/image-viewer-modal/image-viewer-modal.component';
import { ProductVariantModalComponent } from 'src/app/components/product-variant-modal/product-variant-modal.component';
import { IpcService } from 'src/app/services/ipc.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { IProduct, IProductInput, IProductVariant } from 'src/libs/types/product.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  @ViewChild('productVariantModal') private productVariantModal!: ProductVariantModalComponent;
  @ViewChild('imageViewerModal') private imageViewerModal!: ImageViewerModalComponent;
  action: string = 'new';
  product: IProductInput = {} as IProductInput;
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null),
    unitsSold: new FormControl<number | null>(null),
    unitsProduced: new FormControl<number | null>(null),
    lowPrice: new FormControl<number | null>(null),
    highPrice: new FormControl<number | null>(null),
    avgPrice: new FormControl<number | null>(null),
  });
  tmpImg = '';
  imgPath = '';
  previewSrc = '';
  oldImgPath = '';
  productVariants: IProductVariant[] = [];
  loadingVariants = false;
  columns: ColumnDefinition[] = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'string',
      link: {
        href: '#',
        onClick: async (row, index) => {
          try {
            const updatedVariant = await this.productVariantModal.open(DialogMode.View, row, this.product.id);
            if (updatedVariant) {
              this.productVariants[index] = updatedVariant;
              this.productService.updateVariant(this.product?.id || '', updatedVariant);
            }
            this.updatePrices();
            this.action = 'edit';
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'string',
    },
    {
      name: 'cost',
      label: 'Coste (€)',
      type: 'number',
      transform: (row) => {
        return  this.productService.calculateVariantCost(row);
      }
    },
    {
      name: 'materials',
      label: 'Materiales',
      type: 'number',
      transform(row) {
        return row.materials?.length || 0;
      },
    },
    {
      name: 'tools',
      label: 'Herramientas',
      type: 'number',
      transform(row) {
        return row.tools?.length || 0;
      }
    },
    {
      name: 'unitsProduced',
      label: 'Unidades Producidas',
      type: 'number',
    },
    {
      name: 'unitsSold',
      label: 'Unidades Vendidas',
      type: 'number',
    },
    {
      name: 'actions',
      label: 'Acciones',
      type: 'action',
      typeAttributes: {
        showAsMenu: true,
      },
      attributes: {
        width: 100,
      },
      rowActions: [
        {
          name: 'view',
          label: 'Ver',
          icon: {
            src: 'preview.svg',
            altText: 'Ver',
            color: 'danger'
          },
        },
        {
          name: 'edit',
          label: 'Editar',
          icon: {
            src: 'edit.svg',
            altText: 'Editar',
            color: 'primary'
          },
        },
        {
          name: 'delete',
          label: 'Eliminar',
          icon: {
            src: 'trash.svg',
            altText: 'Eliminar',
            color: 'danger'
          },
        },
      ]
    }
  ];

  get title(): string {
    if (this.action === 'new') {
      return 'Nuevo Producto';
    }
    if (this.action === 'edit') {
      return 'Editar Producto: ' + this.product.name;
    }
    return 'Detalles del Producto: ' + this.product.name;
  }

  get isViewAction() {
    return this.action === 'view';
  }

  get isEditAction() {
    return this.action === 'edit';
  }

  get isNewAction() {
    return this.action === 'new';
  }

  constructor(
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly ipcService: IpcService
  ) { }

  ngOnInit(): void {
    this.action = this.activatedRoute.snapshot.paramMap.get('action') || 'new';
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.product = this.productService.findById(id) || {} as IProductInput;
      this.productVariants = this.product.variants || [];
      this.mapProductToForm();
      this.updatePrices();
    }
  }

  save(createNew: boolean) {
    this.mapFormToProduct();
    if (this.isNewAction) {
      this.productService.createOne(this.product as IProduct);
    }
    if (this.isEditAction && this.product.id) {
      this.productService.updateById(this.product.id, this.product as IProduct);
    }
    if (createNew) {
      this.form.reset();
    } else {
      window.history.back();
    }
  }

  cancel() {
    this.ipcService.invoke('deleteFile', this.tmpImg).then(() => {

    });
    this.form.reset();
    window.history.back();
  }

  private mapProductToForm() {
    this.imgPath = this.product.image || '';
    this.oldImgPath = this.product.image;
    this.previewSrc = 'file:///' + this.imgPath;
    this.form.patchValue({
      id: this.product.id,
      name: this.product.name,
      description: this.product.description,
      unitsSold: this.product.variants?.reduce((acc, curr) => acc + (curr.unitsSold || 0), 0) || 0,
      unitsProduced: this.product.variants?.reduce((acc, curr) => acc + (curr.unitsProduced || 0), 0) || 0,
    });
  }

  private mapFormToProduct() {
    this.product.name = this.form.value.name || '';
    this.product.description = this.form.value.description || '';
    this.product.variants = this.productVariants;
    this.product.image = this.imgPath;
  }

  async newProductVariant() {
    try {
      this.loadingVariants = true;
      const variant = await this.productVariantModal.open();
      if (variant) {
        this.productVariants.push(variant);
        this.productService.updateVariant(this.product?.id || '', variant);
      }
      this.updatePrices();
    } catch (error) {
      console.log(error);
    }
    this.loadingVariants = false;
  }

  handleRowAction(event: RowActionEvent) {
    if (event.action.name === 'view') {
      this.viewVariant(event.index);
    } else if (event.action.name === 'edit') {
      this.editVariant(event.index);
    } else if (event.action.name === 'delete') {
      this.deleteVariant(event.index);
    }
  }

  async viewVariant(index: number) {
    const variant = this.productVariants[index];
    try {
      const updatedVariant = await this.productVariantModal.open(DialogMode.View, variant, this.product.id);
      if (updatedVariant) {
        this.productVariants[index] = updatedVariant;
        this.productService.updateVariant(this.product?.id || '', updatedVariant);
      }
      this.updatePrices();
      this.action = 'edit';
    } catch (error) {
      console.log(error);
    }
  }

  async editVariant(index: number) {
    const variant = this.productVariants[index];
    try {
      const updatedVariant = await this.productVariantModal.open(DialogMode.Edit, variant, this.product.id);
      if (updatedVariant) {
        this.productVariants[index] = updatedVariant;
        this.productService.updateVariant(this.product?.id || '', updatedVariant);
      }
      this.updatePrices();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteVariant(index: number) {
    const variant = this.productVariants[index];
    try {
      await this.notificationService.alert({
        title: 'Eliminar Variante de Producto',
        message: `¿Estás seguro de que quieres eliminar la variante de producto ${variant?.name}?`,
        danger: true,
        acceptLabel: 'Eliminar',
      });
      this.productVariants = this.productVariants.filter((_, i) => i !== index);
      this.product.variants = this.productVariants;
      if (this.product.id) {
        await this.productService.updateById(this.product.id, this.product as IProduct);
      }
      this.notificationService.success({
        header: 'Variante de Producto eliminada',
        message: `La Variante de Producto ${variant?.name} ha sido eliminada correctamente`,
      });
    } catch (error) {

    }
  }

  private updatePrices(){
    let highPrice;
    let lowPrice;
    for(const variant of this.productVariants){
      const price = this.productService.calculateVariantCost(variant);
      if(!highPrice || price > highPrice){
        highPrice = price;
      }
      if(!lowPrice || price < lowPrice){
        lowPrice = price;
      }
    }
    this.form.controls.highPrice.setValue(highPrice || null);
    this.form.controls.lowPrice.setValue(lowPrice || null);
    this.form.controls.avgPrice.setValue(((highPrice || 0) + (lowPrice || 0)) / 2 || null);
  }

  edit() {
    this.action = 'edit';
  }

  clickOnImage() {
    if (this.isEditAction || this.isNewAction) {
      this.ipcService.invoke('selectImage', CoreUtils.createUUID()).then((filePath) => {
        if (filePath) {
          this.ipcService.invoke('deleteFile', this.tmpImg).then(() => {
            this.tmpImg = filePath;
            this.imgPath = filePath;
            this.previewSrc = 'file:///' + this.imgPath;
          }).catch((error) => {
            console.log(error);
          });
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      if(!this.imgPath){
        return;
      }
      try {
        this.imageViewerModal.open(this.previewSrc);
      } catch (error) {
        console.log(error);
      }
    }
  }

}
