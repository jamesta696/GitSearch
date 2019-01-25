class Organization {
    constructor(organization) {
        this.element = this.createElement(organization);
    }

    createElement(organization) {
        const orgElement = `
            <a id="org-avatar-group" href="https://github.com/${
                organization.login
            }" target="_blank">
                <img id="org-avatar" src="${organization.avatar_url}" alt="${
            organization.login
        }" />
            </a>
        `;
        return orgElement.toHtmlElement();
    }
}
