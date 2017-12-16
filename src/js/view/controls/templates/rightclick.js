export default (menu) => {
    const { items = [] } = menu;
    const itemsHtml = items
        .map(item => {
            return rightClickItem(item.link, item.title, item.featured, item.showLogo);
        })
        .join('');

    return (
        `<div class="jw-rightclick jw-reset">` +
            `<ul class="jw-rightclick-list jw-reset">${itemsHtml}</ul>` +
        `</div>`
    );
};

const rightClickItem = (link = '', title = '', featured, showLogo) => {
    const logo = showLogo ? `<span class="jw-rightclick-logo jw-reset"></span>` : '';

    let content;
    if (link.name) {
        content = `<span data-jw-name="${link.name}" class="jw-rightclick-link jw-reset">${logo}${title}</span>`;
    } else {
        content = `<a href="${link}" class="jw-rightclick-link jw-reset" target="_blank">${logo}${title}</a>`;
    }

    return `<li class="jw-reset jw-rightclick-item ${featured ? 'jw-featured' : ''}">${content}</li>`;
};
