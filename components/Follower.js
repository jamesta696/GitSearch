class Follower {
    constructor(follower) {
        this.element = this.createElement(follower);
    }

    createElement(follower) {
        var figure = `
                <figure class="fig-element follower">
                    <img src="${follower.avatar_url}" alt="${follower.login}" />
                    <figcaption>
                        <h3>${follower.login}</h3>
                    </figcaption>
                    <a href="${follower.html_url}" target="_blank"></a>
                </figure>
            `;

        return figure.toHtmlElement();
    }
}
