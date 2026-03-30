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

import { ipcRenderer } from "electron";
import { Project, StatusEvent } from "./project.js";

export class StatusDialog {

    project: Project | undefined;
    languages: Map<string, string> = new Map<string, string>();
    statusMap: Map<string, string> = new Map<string, string>();
    eventsMap: Map<string, string> = new Map<string, string>();
    selectedLanguages: Array<string> = new Array<string>();
    selectedEvents: Array<string> = new Array<string>();

    constructor() {
        ipcRenderer.send('get-theme');
        ipcRenderer.on('set-theme', (event: Electron.IpcRendererEvent, theme: string) => {
            (document.getElementById('theme') as HTMLLinkElement).href = theme;
        });
        document.getElementById('statusButton')?.addEventListener('click', () => {
            document.getElementById('statusButton')?.classList.add('selectedTab');
            document.getElementById('historyButton')?.classList.remove('selectedTab');
            document.getElementById('statusTab')?.classList.remove('hidden');
            document.getElementById('historyTab')?.classList.add('hidden');
        });
        document.getElementById('historyButton')?.addEventListener('click', () => {
            document.getElementById('statusButton')?.classList.remove('selectedTab');
            document.getElementById('historyButton')?.classList.add('selectedTab');
            document.getElementById('statusTab')?.classList.add('hidden');
            document.getElementById('historyTab')?.classList.remove('hidden');
        });
        document.getElementById('markTranslated')?.addEventListener('click', () => {
            this.markTranslated();
        });
        document.getElementById('cancelXliff')?.addEventListener('click', () => {
            this.cancelXliff();
        });
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                ipcRenderer.send('close-statusDialog');
            }
        });
        ipcRenderer.on('set-project', (event: Electron.IpcRendererEvent, arg: { project: Project, languages: Map<string, string>, statusMap: Map<string, string>, eventsMap: Map<string, string> }) => {
            this.project = arg.project;
            this.languages = arg.languages;
            this.statusMap = arg.statusMap;
            this.eventsMap = arg.eventsMap;
            (document.getElementById('projectDescription') as HTMLTableCellElement).textContent = this.project.title;
            this.buildTables();
        });
        setTimeout(() => {
            ipcRenderer.send('set-height', { window: 'statusDialog', width: document.body.clientWidth, height: document.body.clientHeight });
        }, 300);
    }

    markTranslated() {
        if (this.selectedLanguages.length === 0) {
            ipcRenderer.send('show-message', { type: 'warning', group: 'statusDialog', key: 'selectLanguage' });
            return;
        }
        ipcRenderer.send('mark-translated', { project: this.project, languages: this.selectedLanguages });
    }

    cancelXliff() {
        if (this.selectedEvents.length === 0) {
            ipcRenderer.send('show-message', { type: 'warning', group: 'statusDialog', key: 'selectXliff' });
            return;
        }
        ipcRenderer.send('cancel-xliff', { project: this.project, events: this.selectedEvents });
    }


    buildTables() {
        if (this.project) {
            let statusTableBody: HTMLTableSectionElement = document.getElementById('statusTableBody') as HTMLTableSectionElement;
            statusTableBody.innerHTML = '';
            let keys: Array<string> = Array.from(Object.keys(this.project.languageStatus));
            for (let key of keys) {
                let row: HTMLTableRowElement = document.createElement('tr');
                let cell: HTMLTableCellElement = document.createElement('td');
                let checkbox: HTMLInputElement = document.createElement('input');
                let status: string = this.project.languageStatus[key];
                if (status !== '2' && status !== '4') {
                    checkbox.type = 'checkbox';
                    checkbox.id = key;
                    checkbox.addEventListener('change', (event: Event) => {
                        let checkbox: HTMLInputElement = event.target as HTMLInputElement;
                        if (checkbox.checked) {
                            this.selectedLanguages.push(checkbox.id);
                        } else {
                            let index: number = this.selectedLanguages.indexOf(checkbox.id);
                            if (index !== -1) {
                                this.selectedLanguages.splice(index, 1);
                            }
                        }
                    });
                    cell.appendChild(checkbox);
                } else {
                    cell.innerHTML = '&nbsp;';
                }
                row.appendChild(cell);

                cell = document.createElement('td');
                const lang: string | undefined = this.languages.get(key);
                if (lang) {
                    cell.textContent = lang;
                }
                row.appendChild(cell);
                cell = document.createElement('td');
                const stat: string | undefined = this.project.languageStatus[key];
                if (stat) {
                    cell.textContent = stat;
                }
                row.appendChild(cell);
                statusTableBody.appendChild(row);
            }
            let historyTableBody: HTMLTableSectionElement = document.getElementById('historyTableBody') as HTMLTableSectionElement;
            historyTableBody.innerHTML = '';
            let history: Array<StatusEvent> = this.project.history;
            for (let item of history) {
                let row: HTMLTableRowElement = document.createElement('tr');
                let cell: HTMLTableCellElement = document.createElement('td');
                if (item.type === '0' && this.canCancel(item.build, item.language)) {
                    let checkbox: HTMLInputElement = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = item.language + '_' + item.build;
                    checkbox.addEventListener('change', (event: Event) => {
                        let checkbox: HTMLInputElement = event.target as HTMLInputElement;
                        if (checkbox.checked) {
                            this.selectedEvents.push(checkbox.id);
                        } else {
                            let index: number = this.selectedEvents.indexOf(checkbox.id);
                            if (index !== -1) {
                                this.selectedEvents.splice(index, 1);
                            }
                        }
                    });
                    cell.appendChild(checkbox);
                } else {
                    cell.innerHTML = '&nbsp;';
                }
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = item.date;
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = '' + item.build;
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = item.language;
                row.appendChild(cell);
                cell = document.createElement('td');
                const itemType: string | undefined = this.eventsMap.get(item.type);
                if (itemType) {
                    cell.textContent = itemType;
                }
                row.appendChild(cell);
                historyTableBody.appendChild(row);
            }
        }
    }

    canCancel(build: number, language: string): boolean {
        let history: Array<StatusEvent> = this.project?.history || [];
        for (let item of history) {
            if (item.build === build && item.language === language && item.type !== '0') {
                return false;
            }
        }
        return true
    }
}
