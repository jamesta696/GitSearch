class ProfileHunt {
    constructor(el) {
        this.element = el;
        document.addEventListener(
            "DOMContentLoaded",
            e => this.onLoad(e),
            false
        );
    }

    // Initializer
    onLoad(e) {
        this.container = document.querySelector(".card-container");
        this.alertMessage = document.getElementById("id-error");
        this.loading = document.getElementById("loading");
        this.inputQuery = document.getElementById("inputQuery");
        this.horizontalDivider = document.querySelector(".dropdown-divider");
        this.followBanner = document.querySelector(".display-3");
        this.userAvatar = document.getElementById("avatar");
        this.name = document.getElementById("name");
        this.gitHubId = document.getElementById("username");
        this.userLocation = document.getElementById("location");
        this.userBio = document.getElementById("bio");
        this.followers = document.getElementById("count");
        this.userHireable = document.getElementById("for-hire");
        this.userCard = document.querySelector(".card");
        this.viewProfile = document.querySelector(".view-profile");
        this.submitButton = document
            .querySelector(".btn")
            .addEventListener("click", e => this.onValidateInputQuery(), false);
        this.organizationContainer = document.querySelector(".org-container");
        this.followContainer = document.getElementById("list");

        this.figElementsList = document
            .getElementById("list")
            .addEventListener(
                "click",
                e => this.onGetFollowerProfile(e),
                false
            );

        document.addEventListener(
            "keypress",
            e => this.submitOnEnter(e),
            false
        );

        this.notFound = `
            <div id="not-found-error" class="alert alert-danger mt-4 mb-4" role="alert" style="display: block">
                <strong>Error:</strong> User Doesn't Exist! Please try again.
            </div>`;
    }

    submitOnEnter(e) {
        const key = e.which || e.keyCode;
        key === 13 && e.target === this.inputQuery
            ? this.onValidateInputQuery()
            : null;
    }

    onHideElements() {
        this.loading.style.display = "none";
        this.userCard.style.display = "none";
        this.followBanner.style.display = "none";
        this.horizontalDivider.style.display = "none";
    }

    onShowElements() {
        this.userCard.style.display = "flex";
        this.followBanner.style.display = "block";
        this.horizontalDivider.style.display = "flex";
    }

    // onUserNotFound(response) {
    //     if (response.status == 404) {
    //         this.notFound = this.notFound.toHtmlElement();
    //         this.container.appendChild(this.notFound);
    //     } else if (response.status == 200) {
    //         this.onValidateInputQuery();
    //     } else {
    //         return;
    //     }
    // }

    onUserNotFound() {
        this.notFound = this.notFound.toHtmlElement();
        this.container.appendChild(this.notFound);
    }

    async getData(name) {
        this.loading.style.display = "flex";
        try {
            const response = await fetch(
                "https://api.github.com/users/" + name
            );
            const res = await response.json().then(res => {
                console.log(res);
                console.log(response);
                if (response.status == 200) {
                    this.onCheckForUserNotFound();
                    this.onClearContainers();
                    this.onShowElements();
                    this.onRenderUserInfo(res);
                    this.onRetrieveFollowers(res.followers_url);
                    this.onGetOrganizations(res.organizations_url);
                }

                if (response.status == 404) {
                    this.onUserNotFound();
                    this.onHideElements();
                    this.onClearContainers();
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    onValidateInputQuery() {
        if (this.inputQuery.value == "") {
            this.onDisplayIdNotFoundError();
            return false;
        } else {
            this.alertMessage.style.display = "none";
            this.getData(inputQuery.value);
            this.inputQuery.value = "";
            return true;
        }
    }

    onDisplayIdNotFoundError() {
        this.alertMessage.style.display = "block";
    }

    onRenderUserInfo(res) {
        this.userCard.parentNode.removeChild(this.userCard);
        const newUserCard = document.createElement("div");
        newUserCard.className = "card mt-4";
        newUserCard === this.userCard;
        this.container.appendChild(this.userCard);
        this.organizationContainer.innerHTML = "";
        this.loading.style.display = "none";

        this.userAvatar.src = res.avatar_url;
        this.viewProfile.href = res.html_url;
        this.gitHubId.innerHTML = `<i class="fas fa-id-badge"></i>${" "}GitHub: <a href="${
            res.html_url
        }" target="_blank">${res.login}</a>`;
        this.followers.innerHTML = `<i class="fas fa-users"></i>${" "}Followers: ${
            res.followers
        }`;

        if (res.hireable === null) {
            this.userHireable.innerHTML = `<i class="fas fa-file-signature"></i> Available For Hire: <strong>N/A</strong>`;
        } else if (res.hireable === false) {
            this.userHireable.innerHTML = `<i class="fas fa-file-signature"></i> Available For Hire: <strong>No</strong>`;
        } else {
            this.userHireable.innerHTML = `<i class="fas fa-file-signature"></i> Available For Hire: <strong>Yes</strong>`;
        }

        res.name === null
            ? (this.name.innerHTML = `<i class="fas fa-user"></i>${" "}Name: N/A`)
            : (this.name.innerHTML = `<i class="fas fa-user"></i>${" "}Name: ${
                  res.name
              }`);

        res.location === null
            ? (this.userLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i>Location: ${" "}N/A`)
            : (this.userLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i>${" "}Location: ${
                  res.location
              }`);

        res.bio === null
            ? (this.userBio.innerHTML = `<i class="fas fa-info-circle"></i>${" "}N/A`)
            : (this.userBio.innerHTML = `<i class="fas fa-info-circle"></i>${" "}${
                  res.bio
              }`);
    }

    onCheckForUserNotFound() {
        if (document.contains(document.getElementById("not-found-error"))) {
            document.getElementById("not-found-error").remove();
        } else {
            return;
        }
    }

    onClearContainers() {
        this.followContainer.innerHTML = "";
        this.organizationContainer.innerHTML = "";
    }

    async onRetrieveFollowers(url, res) {
        try {
            const response = await fetch(url);
            await response.json().then(followers => {
                console.log("Followers: ", followers);
                this.onListFollowers(followers);
            });
        } catch (err) {
            console.log(err);
        }
    }

    async onGetOrganizations(orgUrl) {
        try {
            const response = await fetch(orgUrl);
            await response.json().then(organizations => {
                console.log("Organizations: ", organizations);
                this.onListOrganizations(organizations);
            });
        } catch (err) {
            console.error(err);
        }
    }

    onListOrganizations(organizations) {
        organizations.map(organization => {
            const institution = new Organization(organization);
            this.organizationContainer.appendChild(institution.element);
        });
    }

    onListFollowers(followers) {
        followers.map(follower => {
            const user = new Follower(follower);
            this.followContainer.appendChild(user.element);
        });
    }

    onGetFollowerProfile(e) {
        e.preventDefault(e);
        if (e.target.classList.contains("profile-link")) {
            const name = e.target.getAttribute("data-user");
            this.getData(name);
            window.scrollTo(0, 0);
        }
    }
}
