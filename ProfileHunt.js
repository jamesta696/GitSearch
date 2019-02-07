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
        this.gitHubNotFound = document.getElementById("id-error");
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
        this.footer = document.getElementById("lab_social_icon_footer");
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
    }

    onCreateNotFoundElement() {
        this.notFound = `
            <div id="not-found-error" class="alert alert-danger mt-4 mb-4" role="alert" style="display: block">
                <strong>Error:</strong> User Doesn't Exist! Please try again.
            </div>`;
        return this.notFound.toHtmlElement();
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

    onClearContainers() {
        this.followContainer.innerHTML = "";
        this.organizationContainer.innerHTML = "";
    }

    onResetScreen() {
        this.onHideElements();
        this.onClearContainers();
        this.foundUser = false;
        this.onToggleFooter();
    }

    onDisplaygitHubNotFoundError() {
        this.gitHubNotFound.style.display = "block";
    }

    onToggleFooter() {
        if (this.foundUser) {
            this.footer.classList.add("visible");
        } else {
            this.footer.classList.remove("visible");
        }
    }

    onUserNotFound() {
        this.notFound = this.onCreateNotFoundElement();
        this.container.appendChild(this.notFound);
        console.log(this.notFound);
        console.log("User Not Found");
        this.onToggleFooter();
    }

    onCheckForUserNotFound() {
        if (this.notFound) {
            this.notFound.remove();
            console.log("User Not Found Error Removed");
        } else {
            return;
        }
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

                response.status == 200
                    ? this.onRenderUserInfo(res)
                    : response.status == 404
                    ? (this.onResetScreen(), this.onUserNotFound())
                    : response.status == 403
                    ? (this.onResetScreen(),
                      alert(
                          "API rate limit exceeded!, Please try again later."
                      ))
                    : alert(`Unknown Error: ${response.statusText}`);
            });
        } catch (err) {
            console.log("Error: ", err);
        }
    }

    onValidateInputQuery() {
        if (this.inputQuery.value == "") {
            this.onDisplaygitHubNotFoundError();
            return false;
        } else {
            this.gitHubNotFound.style.display = "none";
            this.getData(inputQuery.value);
            this.inputQuery.value = "";
            return true;
        }
    }

    onClearGitHubNotFoundError() {
        if (this.foundUser) {
            this.gitHubNotFound.style.display = "none";
        }
    }

    onRenderUserInfo(res) {
        //------------------------------------------------------
        this.foundUser = true;
        this.onCheckForUserNotFound();
        this.onClearGitHubNotFoundError();
        this.onClearContainers();
        this.onShowElements();
        this.onToggleFooter();
        this.onRetrieveFollowers(res.followers_url);

        this.userCard.parentNode.removeChild(this.userCard);
        const newUserCard = document.createElement("div");
        newUserCard.className = "card mt-4";
        newUserCard === this.userCard;
        this.container.appendChild(this.userCard);
        this.loading.style.display = "none";

        //------------------------------------------------------

        this.userAvatar.src = res.avatar_url;
        this.viewProfile.href = res.html_url;
        this.gitHubId.innerHTML = `<i class="fas fa-id-badge"></i>${" "}GitHub: <a href="${
            res.html_url
        }" target="_blank">${res.login}</a>`;
        this.followers.innerHTML = `<i class="fas fa-users"></i>${" "}Followers: ${
            res.followers
        }`;

        //------------------------------------------------------

        if (res.hireable === null) {
            this.userHireable.innerHTML = `<i class="fas fa-file-signature"></i> Available For Hire: <strong>N/A</strong>`;
        } else if (res.hireable === false) {
            this.userHireable.innerHTML = `<i class="fas fa-file-signature"></i> Available For Hire: <strong>No</strong>`;
        } else {
            this.userHireable.innerHTML = `<i class="fas fa-file-signature"></i> Available For Hire: <strong>Yes</strong>`;
        }

        //------------------------------------------------------

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

        //------------------------------------------------------

        this.onGetOrganizations(res.organizations_url);
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

    onListFollowers(followers) {
        followers.map(follower => {
            const user = new Follower(follower);
            this.followContainer.appendChild(user.element);
        });
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

    onGetFollowerProfile(e) {
        e.preventDefault(e);
        if (e.target.classList.contains("profile-link")) {
            const name = e.target.getAttribute("data-user");
            this.getData(name);
            window.scrollTo(0, 0);
        }
    }
}
