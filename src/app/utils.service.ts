import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  addParams(add: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: add,
      queryParamsHandling: '',
      skipLocationChange: false
    });
  }

  copyLink() {
    let href = window.location.href;

    document.addEventListener('copy', (e: any) => {
      e.clipboardData.setData('text/plain', (href));
      e.preventDefault();
      document.removeEventListener('copy', e);
    });
    document.execCommand('copy');
    this.showSuccess("Copied url to clipboard!")
    return href;
  }

  showSuccess(message: string) {
    this.messageService.add({severity: 'success', summary: 'Success', detail: message, sticky: false, life: 4000});
  }

  showError(message: string) {
    this.messageService.add({severity: 'error', summary: 'Error', detail: message, sticky: false, life: 4000});
  }

  showInfo(message: string) {
    this.messageService.add({severity: 'info', summary: 'Info', detail: message, sticky: false, life: 4000});
  }

  showWarn(message: string) {
    this.messageService.add({severity: 'warn', summary: 'Warning', detail: message, sticky: false, life: 4000});
  }


}
