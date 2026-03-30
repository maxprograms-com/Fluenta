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

export class AddTargetLanguage {

    constructor() {
        ipcRenderer.send('get-theme');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, theme: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = theme;
            ipcRenderer.send('get-languages');
        });

        ipcRenderer.on('set-languages', (event: Electron.IpcRendererEvent, languages: LanguageInterface[]) => {
            this.setLanguages(languages);
            setTimeout(() => {
                ipcRenderer.send('set-height', { window: 'addTargetLanguage', width: document.body.clientWidth, height: document.body.clientHeight });
            }, 300);
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                ipcRenderer.send('close-addTargetLanguage');
            }
            if (event.code === 'Enter') {
                this.addTargetLanguage();
            }
        });
        document.getElementById('addTargetLanguage')?.addEventListener('click', () => {
            this.addTargetLanguage();
        });
        (document.getElementById('tgtLangSelect') as HTMLSelectElement).focus();
    }

    addTargetLanguage(): void {
        let select: HTMLSelectElement = document.getElementById('tgtLangSelect') as HTMLSelectElement;
        ipcRenderer.send('set-target-language', select.value);
    }

    setLanguages(languages: LanguageInterface[]): void {
        let select: HTMLSelectElement = document.getElementById('tgtLangSelect') as HTMLSelectElement;
        for (let language of languages) {
            let option: HTMLOptionElement = document.createElement('option');
            option.value = language.code;
            option.textContent = language.description;
            select.appendChild(option);
        }
    }
}