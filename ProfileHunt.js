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
        this.alertMessage = document.querySelector(".alert");
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

    onValidateInputQuery() {
        if (this.inputQuery.value === "") {
            this.alertMessage.style.display = "block";
            this.userCard.style.display = "none";
            this.horizontalDivider.style.display = "none";
            this.followBanner.style.display = "none";
            this.followContainer.innerHTML = "";
            return false;
        } else {
            this.alertMessage.style.display = "none";
            this.getData(inputQuery.value);

            this.inputQuery.value = "";
            return true;
        }
    }

    submitOnEnter(e) {
        const key = e.which || e.keyCode;
        key === 13 && e.target === this.inputQuery
            ? this.onValidateInputQuery()
            : null;
    }

    async getData(name) {
        this.userCard.parentNode.removeChild(this.userCard);
        const newUserCard = document.createElement("div");
        newUserCard.className = "card mt-4";
        newUserCard === this.userCard;
        this.container.appendChild(this.userCard);
        this.userCard.style.display = "flex";
        this.horizontalDivider.style.display = "flex";
        this.followBanner.style.display = "block";
        this.followContainer.innerHTML = "";
        this.loading.style.display = "flex";
        try {
            const response = await fetch(
                "https://api.github.com/users/" + name
            );
            const res = await response.json().then(res => {
                console.log(res);
                this.onRenderUserInfo(res);
                this.onRetrieveFollowers(res.followers_url);
            });
        } catch (err) {
            console.log(err);
        }
    }

    onRenderUserInfo(res) {
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

    async onRetrieveFollowers(url, res) {
        try {
            const response = await fetch(url);
            await response.json().then(followers => {
                console.log(followers);
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

    onGetFollowerProfile(e) {
        e.preventDefault(e);
        if (e.target.classList.contains("profile-link")) {
            const name = e.target.getAttribute("data-user");
            this.getData(name);
            window.scrollTo(0, 0);
        }
    }
}
