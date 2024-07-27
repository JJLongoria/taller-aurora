import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ImageViewerModalComponent } from 'src/app/components/image-viewer-modal/image-viewer-modal.component';
import { IpcService } from 'src/app/services/ipc.service';
import { ToolService } from 'src/app/services/tool.service';
import { ITool, IToolInput } from 'src/libs/types/tool.interface';
import { CoreUtils } from 'src/libs/utils/core.utils';

@Component({
  selector: 'app-tool-page',
  templateUrl: './tool-page.component.html',
  styleUrls: ['./tool-page.component.css']
})
export class ToolPageComponent implements OnInit {

  @ViewChild('imageViewerModal') private imageViewerModal!: ImageViewerModalComponent;
  action: string = 'new';
  tool: IToolInput = {} as IToolInput;
  form = new FormGroup({
    id: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null),
    price: new FormControl<number | null>(null, [Validators.required]),
    location: new FormControl<string | null>(null),
    electric: new FormControl<boolean | null>(null),
    power: new FormControl<number | null>(null, [Validators.min(0)]),
    consumption: new FormControl<number | null>(null),
    amortizationUses: new FormControl<number | null>(null, [Validators.min(1)]),
    usePrice: new FormControl<number | null>(null),
    amortized: new FormControl<boolean | null>(null),
    uses: new FormControl<number | null>(null),
    broken: new FormControl<boolean | null>(null),
  });
  tmpImg = '';
  imgPath = '';
  previewSrc = '';
  oldImgPath = '';

  get title(): string {
    if (this.action === 'new') {
      return 'Nueva Herramienta';
    }
    if (this.action === 'edit') {
      return 'Editar Herramienta: ' + this.tool.name;
    }
    return 'Detalles de la Herramienta: ' + this.tool.name;
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
    private readonly toolService: ToolService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly ipcService: IpcService
  ) {

  }

  ngOnInit(): void {
    this.action = this.activatedRoute.snapshot.paramMap.get('action') || 'new';
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.tool = this.toolService.findById(id) || {} as IToolInput;
      this.mapToolToForm();
    }
    this.form.controls.amortizationUses.valueChanges.subscribe((value) => {
      if (value && this.form.controls.price.value) {
        this.form.controls.usePrice.setValue(this.form.controls.price.value / value);
      } else {
        this.form.controls.usePrice.setValue(null);
      }
    });
    this.form.controls.price.valueChanges.subscribe((value) => {
      if (value && this.form.controls.amortizationUses.value) {
        this.form.controls.usePrice.setValue(value / this.form.controls.amortizationUses.value);
      } else {
        this.form.controls.usePrice.setValue(null);
      }
    });
    this.form.controls.power.valueChanges.subscribe((value) => {
      if (value) {
        this.form.controls.consumption.setValue(value / 1000);
      } else {
        this.form.controls.consumption.setValue(null);
      }
    });
  }

  save(createNew: boolean) {
    this.mapFormToTool();
    if (this.isNewAction) {
      this.toolService.createOne(this.tool as ITool);
    }
    if (this.isEditAction && this.tool.id) {
      this.toolService.updateById(this.tool.id, this.tool as ITool);
      if (this.imgPath != this.oldImgPath) {
        this.ipcService.invoke('deleteFile', this.oldImgPath).then(() => {

        });
      }
    }
    if (createNew) {
      this.form.reset();
    } else {
      window.history.back();
    }
  }

  private mapToolToForm() {
    this.imgPath = this.tool.image;
    this.oldImgPath = this.imgPath;
    this.previewSrc = 'file:///' + this.imgPath;
    this.form.patchValue({
      id: this.tool.id,
      name: this.tool.name,
      description: this.tool.description,
      price: this.tool.price,
      location: this.tool.location,
      electric: this.tool.electric,
      power: this.tool.power,
      consumption: this.tool.consumption,
      amortizationUses: this.tool.amortizationUses,
      usePrice: this.tool.usePrice,
      amortized: this.tool.amortized,
      uses: this.tool.uses,
      broken: this.tool.broken,
    });
  }

  private mapFormToTool() {
    this.tool = {
      id: this.tool.id,
      name: this.form.controls.name.value || '',
      description: this.form.controls.description.value || '',
      price: this.form.controls.price.value || 0,
      location: this.form.controls.location.value || '',
      electric: this.form.controls.electric.value || false,
      power: this.form.controls.power.value || 0,
      consumption: this.form.controls.consumption.value || 0,
      amortizationUses: this.form.controls.amortizationUses.value || 0,
      usePrice: this.form.controls.usePrice.value || 0,
      amortized: this.form.controls.amortized.value || false,
      uses: this.form.controls.uses.value || 0,
      broken: this.form.controls.broken.value || false,
      image: this.imgPath
    };
  }

  cancel() {
    this.ipcService.invoke('deleteFile', this.tmpImg).then(() => {

    });
    this.form.reset();
    window.history.back();
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
      if (!this.imgPath) {
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
