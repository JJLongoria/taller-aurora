import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, appRoutingProviders } from './app.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { InputComponent } from './base/input/input.component';
import { ModalComponent } from './base/modal/modal.component';
import { NotificationModalComponent } from './components/notification-modal/notification-modal.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { IconComponent } from './components/icon/icon.component';
import { ButtonComponent } from './components/button/button.component';
import { CheckInputComponent } from './inputs/check-input/check-input.component';
import { DateInputComponent } from './inputs/date-input/date-input.component';
import { DualSelectInputComponent } from './inputs/dual-select-input/dual-select-input.component';
import { EmailInputComponent } from './inputs/email-input/email-input.component';
import { FileInputComponent } from './inputs/file-input/file-input.component';
import { NumberInputComponent } from './inputs/number-input/number-input.component';
import { PasswordInputComponent } from './inputs/password-input/password-input.component';
import { SelectInputComponent } from './inputs/select-input/select-input.component';
import { SwitchInputComponent } from './inputs/switch-input/switch-input.component';
import { TextInputComponent } from './inputs/text-input/text-input.component';
import { TextareaInputComponent } from './inputs/textarea-input/textarea-input.component';
import { MaterialPageComponent } from './pages/material-page/material-page.component';
import { PageComponent } from './base/page/page.component';
import { FreeSelectInputComponent } from './inputs/free-select-input/free-select-input.component';
import { CategoryModalComponent } from './components/category-modal/category-modal.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PurchaseModalComponent } from './components/purchase-modal/purchase-modal.component';
import { PurchasePageComponent } from './pages/purchase-page/purchase-page.component';
import { PurchasesPageComponent } from './pages/purchases-page/purchases-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { ToolsPageComponent } from './pages/tools-page/tools-page.component';
import { ToolPageComponent } from './pages/tool-page/tool-page.component';
import { MaterialsPageComponent } from './pages/materials-page/materials-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductVariantModalComponent } from './components/product-variant-modal/product-variant-modal.component';
import { MaterialSelectorComponent } from './components/material-selector/material-selector.component';
import { ClientsPageComponent } from './pages/clients-page/clients-page.component';
import { ClientPageComponent } from './pages/client-page/client-page.component';
import { ProductSelectorComponent } from './components/product-selector/product-selector.component';
import { PriceCalculatorModalComponent } from './components/price-calculator-modal/price-calculator-modal.component';
import { SurfaceCalculatorComponent } from './components/surface-calculator/surface-calculator.component';
import { PurchaseMaterialSelectorComponent } from './components/purchase-material-selector/purchase-material-selector.component';
import { SearchInputComponent } from './inputs/search-input/search-input.component';
import { PillComponent } from './components/pill/pill.component';
import { LinkComponent } from './components/link/link.component';
import { OrderDeliveredModalComponent } from './components/order-delivered-modal/order-delivered-modal.component';
import { AddProductionModalComponent } from './components/add-production-modal/add-production-modal.component';
import { AddSalesModalComponent } from './components/add-sales-modal/add-sales-modal.component';
import { SalesPageComponent } from './pages/sales-page/sales-page.component';
import { SalePageComponent } from './pages/sale-page/sale-page.component';
import { ProductSaleSelectorComponent } from './components/product-sale-selector/product-sale-selector.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ImageViewerModalComponent } from './components/image-viewer-modal/image-viewer-modal.component';
import { ProductViewerModalComponent } from './components/product-viewer-modal/product-viewer-modal.component';
import { ProductVariantViewerModalComponent } from './components/product-variant-viewer-modal/product-variant-viewer-modal.component';
import { MaterialViewerModalComponent } from './components/material-viewer-modal/material-viewer-modal.component';
import { HelpComponent } from './pages/help/help.component';
import { IntroductionPageComponent } from './pages/help/pages/introduction-page/introduction-page.component';
import { MaterialsHelpPageComponent } from './pages/help/pages/materials-help-page/materials-help-page.component';
import { ProductsHelpPageComponent } from './pages/help/pages/products-help-page/products-help-page.component';
import { ToolsHelpPageComponent } from './pages/help/pages/tools-help-page/tools-help-page.component';
import { PurchasesHelpPageComponent } from './pages/help/pages/purchases-help-page/purchases-help-page.component';
import { ClientsHelpPageComponent } from './pages/help/pages/clients-help-page/clients-help-page.component';
import { OrdersHelpPageComponent } from './pages/help/pages/orders-help-page/orders-help-page.component';
import { SalesHelpPageComponent } from './pages/help/pages/sales-help-page/sales-help-page.component';


@NgModule({
  declarations: [
    AppComponent,
    TitleBarComponent,
    FooterComponent,
    ToastsComponent,
    HeaderComponent,
    NotificationsComponent,
    InputComponent,
    ModalComponent,
    NotificationModalComponent,
    DatatableComponent,
    IconComponent,
    ButtonComponent,
    CheckInputComponent,
    DateInputComponent,
    DualSelectInputComponent,
    EmailInputComponent,
    FileInputComponent,
    NumberInputComponent,
    PasswordInputComponent,
    SelectInputComponent,
    SwitchInputComponent,
    TextInputComponent,
    TextareaInputComponent,
    MaterialPageComponent,
    PageComponent,
    FreeSelectInputComponent,
    CategoryModalComponent,
    SpinnerComponent,
    PaginationComponent,
    PurchaseModalComponent,
    PurchasePageComponent,
    PurchasesPageComponent,
    OrdersPageComponent,
    ProductsPageComponent,
    ToolsPageComponent,
    ToolPageComponent,
    MaterialsPageComponent,
    HomePageComponent,
    OrderPageComponent,
    ProductPageComponent,
    ProductVariantModalComponent,
    MaterialSelectorComponent,
    ClientsPageComponent,
    ClientPageComponent,
    ProductSelectorComponent,
    PriceCalculatorModalComponent,
    SurfaceCalculatorComponent,
    PurchaseMaterialSelectorComponent,
    SearchInputComponent,
    PillComponent,
    LinkComponent,
    OrderDeliveredModalComponent,
    AddProductionModalComponent,
    AddSalesModalComponent,
    SalesPageComponent,
    SalePageComponent,
    ProductSaleSelectorComponent,
    SummaryComponent,
    ImageViewerModalComponent,
    ProductViewerModalComponent,
    ProductVariantViewerModalComponent,
    MaterialViewerModalComponent,
    HelpComponent,
    IntroductionPageComponent,
    MaterialsHelpPageComponent,
    ProductsHelpPageComponent,
    ToolsHelpPageComponent,
    PurchasesHelpPageComponent,
    ClientsHelpPageComponent,
    OrdersHelpPageComponent,
    SalesHelpPageComponent,
  ],
  imports: [
    BrowserModule,
    routing,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
