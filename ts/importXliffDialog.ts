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

import {ipcRenderer} from 'electron';
import {LanguageInterface} from "./languages.js";

export class ImportXliffDialog {

    projectId: number = -1;
    selectedLanguages: LanguageInterface[] = [];

    constructor() {
        ipcRenderer.send('get-theme');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, theme: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = theme;
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                ipcRenderer.send('close-importXliff');
            }
            if (event.code === 'Enter') {
                this.importXliff();
            }
        });
        ipcRenderer.on('set-project', (event: Electron.IpcRendererEvent, arg: { projectId: number, description: string }) => {
            this.projectId = arg.projectId;
            (document.getElementById('projectDescription') as HTMLTableCellElement).innerText = arg.description;
            ipcRenderer.send('get-project-languages', arg.projectId);
            ipcRenderer.send('get-import-defaults', arg.projectId);
        });
        document.getElementById('fileBrowseButton')?.addEventListener('click', () => {
            ipcRenderer.send('select-xliff-file');
        });
        ipcRenderer.on('set-xliff-file', (event: Electron.IpcRendererEvent, file: string) => {
            (document.getElementById('xliffFile') as HTMLInputElement).value = file;
        });
        document.getElementById('folderBrowseButton')?.addEventListener('click', () => {
            ipcRenderer.send('select-output-folder');
        });
        ipcRenderer.on('set-output-folder', (event: Electron.IpcRendererEvent, folder: string) => {
            (document.getElementById('outputFolder') as HTMLInputElement).value = folder;
        });
        document.getElementById('importXliff')?.addEventListener('click', () => {
            this.importXliff();
        });
        setTimeout(() => {
            ipcRenderer.send('set-height', { window: 'importXliffDialog', width: document.body.clientWidth, height: document.body.clientHeight });
        }, 500);
    }

    importXliff() {
        let xliffFile: string = (document.getElementById('xliffFile') as HTMLInputElement).value;
        if (xliffFile === '') {
            ipcRenderer.send('show-message', { type: 'warning', group: 'importXliffDialog', key: 'selectXliffFile' });
            return;
        }
        let outputFolder: string = (document.getElementById('outputFolder') as HTMLInputElement).value;
        if (outputFolder === '') {
            ipcRenderer.send('show-message', { type: 'warning', group: 'importXliffDialog', key: 'selectOutputFolder' });
            return;
        } let updateMemory: boolean = (document.getElementById('updateMemory') as HTMLInputElement).checked;
        let acceptUnapproved: boolean = (document.getElementById('acceptUnapproved') as HTMLInputElement).checked;
        let ignoreTagErrors: boolean = (document.getElementById('ignoreTagErrors') as HTMLInputElement).checked;
        ipcRenderer.send('import-xliff-file', {
            id: this.projectId,
            xliffFile: xliffFile,
            outputFolder: outputFolder,
            updateTM: updateMemory,
            acceptUnapproved: acceptUnapproved,
            ignoreTagErrors: ignoreTagErrors
        });
    }
}