import { ModuleWithProviders } from '@angular/core';
import { Routes, Route, RouterModule } from '@angular/router';
import { ClientPageComponent } from './pages/client-page/client-page.component';
import { ClientsPageComponent } from './pages/clients-page/clients-page.component';
import { HelpComponent } from './pages/help/help.component';
import { ClientsHelpPageComponent } from './pages/help/pages/clients-help-page/clients-help-page.component';
import { IntroductionPageComponent } from './pages/help/pages/introduction-page/introduction-page.component';
import { MaterialsHelpPageComponent } from './pages/help/pages/materials-help-page/materials-help-page.component';
import { OrdersHelpPageComponent } from './pages/help/pages/orders-help-page/orders-help-page.component';
import { ProductsHelpPageComponent } from './pages/help/pages/products-help-page/products-help-page.component';
import { PurchasesHelpPageComponent } from './pages/help/pages/purchases-help-page/purchases-help-page.component';
import { SalesHelpPageComponent } from './pages/help/pages/sales-help-page/sales-help-page.component';
import { ToolsHelpPageComponent } from './pages/help/pages/tools-help-page/tools-help-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { MaterialPageComponent } from './pages/material-page/material-page.component';
import { MaterialsPageComponent } from './pages/materials-page/materials-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { PurchasePageComponent } from './pages/purchase-page/purchase-page.component';
import { PurchasesPageComponent } from './pages/purchases-page/purchases-page.component';
import { SalePageComponent } from './pages/sale-page/sale-page.component';
import { SalesPageComponent } from './pages/sales-page/sales-page.component';
import { ToolPageComponent } from './pages/tool-page/tool-page.component';
import { ToolsPageComponent } from './pages/tools-page/tools-page.component';

const appRoutes: Routes = [
    { path: '', component: HomePageComponent },

    { path: 'purchases', component: PurchasesPageComponent },
    { path: 'purchases/:materialId', component: PurchasesPageComponent },
    { path: 'purchase/:action', component: PurchasePageComponent },
    { path: 'purchase/:action/:id', component: PurchasePageComponent },

    { path: 'tools', component: ToolsPageComponent },
    { path: 'tool/:action', component: ToolPageComponent },
    { path: 'tool/:action/:id', component: ToolPageComponent },

    { path: 'orders', component: OrdersPageComponent },
    { path: 'orders/:clientId', component: OrdersPageComponent },
    { path: 'order/:action', component: OrderPageComponent },
    { path: 'order/:action/:id', component: OrderPageComponent },

    { path: 'clients', component: ClientsPageComponent },
    { path: 'client/:action', component: ClientPageComponent },
    { path: 'client/:action/:id', component: ClientPageComponent },

    { path: 'products', component: ProductsPageComponent },
    { path: 'product/:action', component: ProductPageComponent },
    { path: 'product/:action/:id', component: ProductPageComponent },

    { path: 'materials', component: MaterialsPageComponent },
    { path: 'material/:action', component: MaterialPageComponent },
    { path: 'material/:action/:id', component: MaterialPageComponent },

    { path: 'sales', component: SalesPageComponent },
    { path: 'sale/:action', component: SalePageComponent },
    { path: 'sale/:action/:id', component: SalePageComponent },

    {
        path: 'help', component: HelpComponent, children: [
            { path: '', component: IntroductionPageComponent },
            { path: 'introduction', component: IntroductionPageComponent },
            { path: 'materials', component: MaterialsHelpPageComponent },
            { path: 'tools', component: ToolsHelpPageComponent },
            { path: 'purchases', component: PurchasesHelpPageComponent },
            { path: 'products', component: ProductsHelpPageComponent },
            { path: 'clients', component: ClientsHelpPageComponent },
            { path: 'orders', component: OrdersHelpPageComponent },
            { path: 'sales', component: SalesHelpPageComponent },
        ]
    },
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<Route> = RouterModule.forRoot(appRoutes);