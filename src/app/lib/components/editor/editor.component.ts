import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
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
  @Input() checkNewInput = false;
  @Input() debounceTime = 1000;

  @Output() valueChange = new EventEmitter<string>();

  inputSub!: Subscription;

  finalValue!: SafeHtml;

  constructor(private sanitizer: DomSanitizer, private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.processText(this.value);
  }

  ngAfterViewInit(): void {
    if (!this.checkNewInput) return;

    this.inputSub = fromEvent(this.editor.nativeElement, 'input')
      .pipe(debounceTime(this.debounceTime))
      .subscribe((event) => {
        const html = (event.target as HTMLDivElement).innerHTML || '';
        console.log(html);
        // emit plain text value
        this.valueChange.emit(html);

        // process text to be disabled
        this.processText(html);
      });
  }

  ngOnDestroy(): void {
    this.inputSub.unsubscribe();
  }

  private stripTags(html: string): string {
    return html.replace(/(<([^>]+)>)/gi, '');
  }

  private processText(value: string): void {
    let htmlText = value;

    for (const text of this.blacklisted) {
      const search = new RegExp(text, 'g');
      const tag = `
        <span title="Deshabilitado" contenteditable="false" data-mode="readonly">${text}</span>`;

      htmlText = htmlText.replace(search, tag);
    }

    this.finalValue = this.sanitizer.bypassSecurityTrustHtml(htmlText + ' ');
  }
}
