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

export class AboutDialog {

    constructor() {
        ipcRenderer.send('get-theme');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, theme: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = theme;
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                ipcRenderer.send('close-aboutDialog');
            }
        });
        ipcRenderer.send('get-version');
        ipcRenderer.on('set-version', (event: Electron.IpcRendererEvent, version: string) => {
            (document.getElementById('version') as HTMLTitleElement).textContent = version;
        });
        document.getElementById('systemInfo')?.addEventListener('click', () => {
            ipcRenderer.send('show-system');
        });
        document.getElementById('licenses')?.addEventListener('click', () => {
            ipcRenderer.send('show-licenses', 'aboutDialog');
        });
        setTimeout(() => {
            ipcRenderer.send('set-height', { window: 'aboutDialog', width: document.body.clientWidth, height: document.body.clientHeight });
        }, 500);
    }
}