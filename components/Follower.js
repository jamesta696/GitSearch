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
                    <a href="javascript:void(0);" class="profile-link" data-user="${
                        follower.login
                    }"></a>
                </figure>
            `;

        return figure.toHtmlElement();
    }
}
