import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EditorComponent } from './lib/components/editor/editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EditorComponent],
  template: `
    <h3>Blacklisted text: {{ mockBlacklisted | json }}</h3>

    <app-editor [(value)]="mockText" [blacklisted]="mockBlacklisted" [checkNewInput]="true"> </app-editor>

    <p style="margin-top: 2rem;">output: {{ mockText }}</p>
  `,
})
export class AppComponent {
  mockText =
    'Este <strong>editor</strong> de texto tiene <strong>capacidades</strong> de texto enriquecido y deshabilitación parcial.';
  mockBlacklisted = ['texto', 'parcial', 'lectura'];

  onChange(text: string) {
    console.log(text);
  }
}
