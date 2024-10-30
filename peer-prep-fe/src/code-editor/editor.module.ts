import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CollaborativeEditorComponent } from './collaborative-editor/collaborative-editor.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@NgModule({
  declarations: [
    CollaborativeEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MonacoEditorModule
  ],
  providers: [],
  bootstrap: [CollaborativeEditorComponent]
})

export class EditorModule {
}
