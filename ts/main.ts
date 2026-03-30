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
import { MemoriesView } from "./memoriesView.js";
import { ProjectsView } from "./projectsView.js";

export class Main {

    projectsView: ProjectsView;
    memoriesView: MemoriesView;

    constructor() {

        this.projectsView = new ProjectsView();
        this.memoriesView = new MemoriesView();

        ipcRenderer.send('get-theme');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, theme: any) => {
            (document.getElementById('theme') as HTMLLinkElement).href = theme;
        });
        ipcRenderer.on('show-projects', () => {
            this.showProjects();
        });
        ipcRenderer.on('show-memories', () => {
            this.showMemories();
        });
        ipcRenderer.on('set-size', () => {
            this.projectsView.setSizes();
            this.memoriesView.setSizes();
            this.setSizes();
        });
        ipcRenderer.on('start-waiting', () => {
            document.body.classList.add("wait");
        });
        ipcRenderer.on('end-waiting', () => {
            document.body.classList.remove("wait");
        });
        ipcRenderer.on('set-status', (event: Electron.IpcRendererEvent, status: string) => {
            this.setStatus(status);
        });
        ipcRenderer.on('generate-xliff', () => {
            this.projectsView.generateXLIFF();
        });
        ipcRenderer.on('import-xliff', () => {
            this.projectsView.importXLIFF();
        });
        document.getElementById('projectsButton')?.addEventListener('click', () => {
            this.showProjects();
        });
        document.getElementById('memoriesButton')?.addEventListener('click', () => {
            this.showMemories();
        });
        document.getElementById('updatesButton')?.addEventListener('click', () => {
            ipcRenderer.send('check-updates');
        });
        document.getElementById('updatesButton')?.addEventListener('click', () => {
        });
        document.getElementById('settingsButton')?.addEventListener('click', () => {
            ipcRenderer.send('show-settings');
        });
        document.getElementById('aboutButton')?.addEventListener('click', () => {
            ipcRenderer.send('show-about');
        });
        this.showProjects();
        this.setSizes();
    }

    setSizes() {
        let top: number = (document.getElementById('leftTop') as HTMLDivElement).clientHeight;
        let bottom: number = (document.getElementById('leftBottom') as HTMLDivElement).clientHeight;
        let style: string = 'height: calc(100% - ' + (top + bottom + 8) + 'px);'; // add 8px bottom margin
        (document.getElementById('leftCenter') as HTMLDivElement).setAttribute('style', style);
    }

    setStatus(status: string): void {
        let statusDiv: HTMLDivElement = document.getElementById('status') as HTMLDivElement;
        statusDiv.innerText = status;
        if (status.length > 0) {
            statusDiv.style.display = 'block';
        } else {
            statusDiv.style.display = 'none';
        }
    }

    showProjects(): void {
        document.getElementById('projectsButton')?.classList.add('selectedButton');
        document.getElementById('memoriesButton')?.classList.remove('selectedButton');
        this.memoriesView.hide();
        this.projectsView.show();
    }

    showMemories(): void {
        document.getElementById('projectsButton')?.classList.remove('selectedButton');
        document.getElementById('memoriesButton')?.classList.add('selectedButton');
        this.projectsView.hide();
        this.memoriesView.show();
    }
}