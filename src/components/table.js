import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    if (before) {
        before.reverse().forEach(subName => {
            const cloned = cloneTemplate(subName);
            root[subName] = cloned; 
            root.container.prepend(root[subName].container);
        });
    }

    if (after) {
        after.forEach(subName => {
            const cloned = cloneTemplate(subName);
            root[subName] = cloned; 
            root.container.append(root[subName].container);
        });
    }

    // @todo: #1.3 —  обработать события и вызвать onAction()
    // Обработка события change
    root.container.addEventListener('change', () => {
        onAction(); // Вызываем без аргументов
    });

    // Обработка события reset
    root.container.addEventListener('reset', () => {
        setTimeout(onAction()); // Отложенный вызов
    });

    // Обработка события submit
    root.container.addEventListener('submit', event => {
        event.preventDefault(); // Предотвращаем стандартное поведение
        onAction(event.submitter); // Передаем элемент, инициировавший отправку
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => { 
                if (key in row.elements) {
                    row.elements[key].textContent = item[key];
                }
            });
            return row.container;
         })
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}