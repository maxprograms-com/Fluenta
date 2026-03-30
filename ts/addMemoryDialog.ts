/*******************************************************************************
 * Copyright (c) 2015-2026 Maxprograms.
 *
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License 1.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/org/documents/epl-v10.html
 *
 * Contributors:
 *     Maxprograms - initial API and implementation
 *******************************************************************************/

import { ipcRenderer } from 'electron';
import { LanguageInterface } from "./languages.js";


export class AddMemoryDialog {

    constructor() {
        ipcRenderer.send('get-theme');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, theme: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = theme;
            ipcRenderer.send('get-languages');
        });
        ipcRenderer.on('set-languages', (event: Electron.IpcRendererEvent, languages: LanguageInterface[]) => {
            this.setLanguages(languages);
            setTimeout(() => {
                ipcRenderer.send('set-height', { window: 'addMemoryDialog', width: document.body.clientWidth, height: document.body.clientHeight });
            }, 300);
        });
        ipcRenderer.on('set-default-languages', (event: Electron.IpcRendererEvent, arg: { srcLang: LanguageInterface, tgtLangs: LanguageInterface[], removeText: string }) => {
            this.setDefaultLanguages(arg);
        });
        document.getElementById('addMemory')?.addEventListener('click', () => {
            this.addMemory();
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                ipcRenderer.send('close-addMemoryDialog');
            }
            if (event.code === 'Enter') {
                this.addMemory();
            }
        });
    }

    setLanguages(languages: LanguageInterface[]): void {
        let select: HTMLSelectElement = document.getElementById('srcLangSelect') as HTMLSelectElement;
        for (let language of languages) {
            let option: HTMLOptionElement = document.createElement('option');
            option.value = language.code;
            option.textContent = language.description;
            select.appendChild(option);
        }
        ipcRenderer.send('get-default-languages');
    }

    setDefaultLanguages(arg: { srcLang: LanguageInterface, tgtLangs: LanguageInterface[] }): void {
        (document.getElementById('srcLangSelect') as HTMLSelectElement).value = arg.srcLang.code;
    }

    addMemory(): void {
        let name: string = (document.getElementById('nameInput') as HTMLInputElement).value;
        if (name === '') {
            ipcRenderer.send('show-message', { type: 'warning', group: 'memoryDialog', key: 'selectName' });
            return;
        }
        let srcLang: string = (document.getElementById('srcLangSelect') as HTMLSelectElement).value;
        let description: string = (document.getElementById('descriptionInput') as HTMLInputElement).value;
        ipcRenderer.send('create-memory', { srcLang: srcLang, name: name, description: description });
    }
}
