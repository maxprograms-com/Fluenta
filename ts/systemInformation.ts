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

export class SystemInformation {

    constructor() {
        ipcRenderer.send('get-theme');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, theme: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = theme;
            ipcRenderer.send('get-system-info');
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                ipcRenderer.send('close-system-info');
            }
        });
        ipcRenderer.on('set-system-info', (event: Electron.IpcRendererEvent, arg: any) => {
            this.setVersions(arg);
            setTimeout(() => {
                ipcRenderer.send('set-height', { window: 'systemInfo', width: document.body.clientWidth, height: document.body.clientHeight });
            }, 300);
        });
      
    }

    setVersions(arg: any) {
        (document.getElementById('fluenta') as HTMLTableCellElement).innerText = arg.version + '-' + arg.build;
        (document.getElementById('swordfish') as HTMLTableCellElement).innerText = arg.swordfish;
        (document.getElementById('openxliff') as HTMLTableCellElement).innerText = arg.openxliff;
        (document.getElementById('electron') as HTMLTableCellElement).innerText = arg.electron;
        (document.getElementById('xmljava') as HTMLTableCellElement).innerText = arg.xmljava;
        (document.getElementById('bcp47j') as HTMLTableCellElement).innerText = arg.bcp47j;
        (document.getElementById('java') as HTMLTableCellElement).innerText = arg.java + ' (' + arg.vendor + ')';
    }
}