import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {WebSocketService} from '../websocket.service';
import {MonacoEditorModule} from 'ngx-monaco-editor-v2';
import {Subscription} from 'rxjs';
import * as monaco from 'monaco-editor';
import babelPlugin from "prettier/plugins/babel";
import estreePlugin from "prettier/plugins/estree";
import {format} from "prettier";


@Component({
  selector: 'app-collaborative-editor',
  standalone: true,
  imports: [FormsModule, MonacoEditorModule],
  templateUrl: './collaborative-editor.component.html',
  styleUrls: ['./collaborative-editor.component.css']
})
export class CollaborativeEditorComponent implements OnInit, OnDestroy {

  @Input() sessionId!: string;
  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    paths: {
      vs: '/assets/monaco/min/vs' // Use the local path for Monaco assets
    }
  };
  code: string = '';
  line: number = 1;
  column: number = 1;
  private messageSubcription!: Subscription;
  private editor!: monaco.editor.IStandaloneCodeEditor;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit() {
    // Connect to WebSocket and subscribe to messages
    this.webSocketService.connect(this.sessionId);

    this.messageSubcription = this.webSocketService.getMessages().subscribe((message) => {
      if (message) {
        if (message.type === 'initialCode') {
          // Set the initial code on reconnect
          this.code = message.content;
        } else if (message.type === 'code') {
          // Update the editor content with live updates
          this.code = message.content;
        }
      }
    });
  }


  onEditorChange(content: string) {
    // Send updated content to the WebSocket server
    this.webSocketService.sendMessage({ type: 'code', content });
  }

  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editor = editor;
    editor.onDidChangeCursorPosition((e) => {
      this.line = e.position.lineNumber;
      this.column = e.position.column;
    });
  }

  async formatCode() {
    if (this.editor) {
      try {
        this.code = await format(this.code, {
          parser: 'babel',
          plugins: [babelPlugin, estreePlugin],
          singleQuote: true,
          semi: true
        });
      } catch (error) {
        console.error('Error formatting code:', error);
      }
    }
  }

  ngOnDestroy(): void {
      if (this.messageSubcription) {
          this.messageSubcription.unsubscribe();
      }
      this.webSocketService.disconnect();
  }
}
