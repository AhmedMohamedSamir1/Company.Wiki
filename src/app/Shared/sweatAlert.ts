// alert.service.ts
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';



  export function showSweatAlert(
    icon: SweetAlertIcon = 'info',
    title: string = '', // Changed to string only, providing default value
    text: string = '', // Changed to string only, providing default value
    showCancelButton: boolean = false,
    position: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end' = 'center',
    showDenyButton: boolean = false,
    denyButtonText: string = '', // Changed to string only, providing default value
    confirmButtonColor: string = '#3085d6',
    cancelButtonColor: string = '#d33'
  ) {
    // Define the options for SweetAlert
    const options: SweetAlertOptions = {
      icon,
      title: title || undefined, // Set to undefined if empty
      text: text || undefined, // Set to undefined if empty
      showCancelButton,
      position,
      showDenyButton,
      denyButtonText: denyButtonText || undefined, // Set to undefined if empty
      confirmButtonColor,
      cancelButtonColor,
    };

    // Call SweetAlert2 with the options
    return Swal.fire(options);
  }

