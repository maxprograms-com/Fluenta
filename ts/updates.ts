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

export class Updates {

        constructor() {
        ipcRenderer.send('get-theme');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, theme: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = theme;
            ipcRenderer.send('get-update-versions');
        });
        ipcRenderer.on('set-update-versions', (event: Electron.IpcRendererEvent, arg: { current: string, latest: string }) => {
            this.setVersions(arg);
           
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                ipcRenderer.send('close-updates');
            }
        });
        document.getElementById('release')?.addEventListener('click', () => {
            ipcRenderer.send('show-release-history');
        });
        document.getElementById('download')?.addEventListener('click', () => {
            ipcRenderer.send('download-update');
        });
        setTimeout(() => {
            ipcRenderer.send('set-height', { window: 'updates', width: document.body.clientWidth, height: document.body.clientHeight });
        }, 300);
    }

    setVersions(arg: { current: string; latest: string; }) {
        (document.getElementById('current') as HTMLTableCellElement).innerText = arg.current;
        (document.getElementById('latest') as HTMLTableCellElement).innerText = arg.latest
    }
}