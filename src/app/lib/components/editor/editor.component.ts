import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { debounceTime, fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;

  @Input() value!: string;
  @Input() blacklisted: string[] = [];

  @Input() spellcheck = true;

  @Input() hasRecursiveSearch = false;
  @Input() debounceTime = 1000;

  @Output() valueChange = new EventEmitter<string>();

  inputSub!: Subscription;

  editorContent!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const { safeHtml } = this.parseInputSource(this.value);
    this.editorContent = safeHtml;
  }

  ngAfterViewInit(): void {
    this.inputSub = fromEvent(this.editor.nativeElement, 'input')
      .pipe(debounceTime(this.debounceTime))
      .subscribe((e) => {
        this.validateDeletion(e as KeyboardEvent);

        // process text to be disabled
        const htmlText = (e.target as HTMLDivElement).innerHTML || '';

        if (this.hasRecursiveSearch) {
          const { html, safeHtml } = this.parseInputSource(htmlText);
          this.editorContent = safeHtml;
          this.valueChange.emit(html);
        } else {
          this.valueChange.emit(htmlText);
        }

        setTimeout(() => this.placeCaretAtEnd());
      });
  }

  ngOnDestroy(): void {
    this.inputSub.unsubscribe();
  }

  private validateDeletion(e: KeyboardEvent) {}

  /**
   * Analiza un texto proporcionado en búsqueda de las palabras o frases por deshabilitar
   * y las reemplaza por etiquetas span con el atributo "contenteditable" en false.
   * @
   * @param source texto base por analizar
   * @returns
   */
  private parseInputSource(source: string): { html: string; safeHtml: SafeHtml } {
    this.blacklisted.forEach((text) => {
      const search = new RegExp(`(?<!<span \w+>)(${text})`, 'g');
      const tag = `<span contenteditable="false" data-mode="readonly">${text}</span>`;
      source = source.replace(search, tag);
    });

    return {
      html: source,
      safeHtml: this.sanitizer.bypassSecurityTrustHtml(source + ' '),
    };
  }

  placeCaretAtEnd() {
    this.editor.nativeElement.focus();

    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
      const range = document.createRange();
      range.selectNodeContents(this.editor.nativeElement);
      range.collapse(false);

      const selection = window.getSelection() as Selection;
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}
