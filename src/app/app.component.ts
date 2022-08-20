import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EditorComponent } from './lib/components/editor/editor.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EditorComponent],
  template: `
    <div style="max-width: 800px; margin: 0 auto;">
      <!-- Two-way binding -->
      <div
        style="padding: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);"
      >
        <h3>Two-way binding - Recursive search disabled</h3>
        <pre><code>{{ mockBlacklisted1 | json }}</code></pre>

        <app-editor [(value)]="mockText1" [blacklisted]="mockBlacklisted1"> </app-editor>

        <details style="margin-top: 1rem;">
          <summary>Output:</summary>
          <small>{{ mockText1 }}</small>
        </details>
      </div>

      <!-- Catch event emitter -->
      <div
        style="padding: 1rem; margin-top: 4rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);"
      >
        <h3>Catch event emitter</h3>
        <pre><code>{{ mockBlacklisted2 | json }}</code></pre>

        <app-editor
          [value]="mockText2"
          [blacklisted]="mockBlacklisted2"
          (valueChange)="onValueChange($event)"
        >
        </app-editor>
      </div>

      <!-- Recursive search -->
      <div
        style="padding: 1rem; margin-top: 4rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);"
      >
        <h3>Recursive search</h3>
        <pre><code>{{ mockBlacklisted3 | json }}</code></pre>

        <app-editor [(value)]="mockText3" [blacklisted]="mockBlacklisted3" [hasRecursiveSearch]="true">
        </app-editor>

        <details style="margin-top: 1rem;">
          <summary>Output:</summary>
          <small>{{ mockText3 }}</small>
        </details>
      </div>
    </div>
  `,
})
export class AppComponent {
  mockText1 =
    'Este <strong>editor</strong> de texto tiene <strong>capacidades</strong> de texto enriquecido y deshabilitación parcial';
  mockBlacklisted1 = ['texto', 'parcial'];

  mockText2 = `El hotel del centro es el más antiguo del pueblo y también es aquel que tiene más comodidades. Este hotel fue construido en 1911, pero primero se utilizó como casa de familia. En 1975 un inversionista compró esta propiedad y la reformó para transformarla en el hotel que hoy conocemos. Es un hotel pequeño, pero cuenta con servicio a la habitación, con pileta climatizada, con un restaurante de categoría, entre otras cosas.`;
  mockBlacklisted2 = [
    'antiguo',
    'Este hotel fue construido en 1911, pero primero se utilizó como casa de familia',
  ];

  mockText3 = `Este <strong>editor</strong> de texto tiene <strong>capacidades</strong> de texto enriquecido y deshabilitación parcial`;
  mockBlacklisted3 = ['texto', 'parcial'];

  onValueChange(value: string): void {
    console.log(value);
    alert(value);
  }
}
