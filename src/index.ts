import {NgModule} from '@angular/core';
import {LocalStorageService, SessionStorageService} from './service/webstorage.service';

export { WebStorage, LocalStorage, SessionStorage } from './decorator/webstorage'
export { WebStorageService, LocalStorageService, SessionStorageService } from './service/webstorage.service';
export { WebStorageUtility } from './utility/webstorage.utility';
export declare class Webstorable {
    save(): void;
}
export let WEBSTORAGE_CONFIG = {
    prefix: 'angular2ws_',
    secretKey: ''
};

@NgModule({
    providers: [LocalStorageService, SessionStorageService]
})
export class WebStorageModule {}
