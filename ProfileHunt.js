class ProfileHunt {
    constructor(el) {
        this.element = el;
        document.addEventListener(
            "DOMContentLoaded",
            e => this.onLoad(e),
            false
        );
    }

    onLoad(e) {
        this.loading = document.getElementById("loading");
        this.horizontalDivider = document.querySelector(".dropdown-divider");
        this.followBanner = document.querySelector(".display-3");
        this.userAvatar = document.getElementById("avatar");
        this.name = document.getElementById("name");
        this.gitHubId = document.getElementById("username");
        this.userLocation = document.getElementById("location");
        this.userBio = document.getElementById("bio");
        this.followers = document.getElementById("count");
        this.userCard = document.querySelector(".card");
        this.followContainer = document.getElementById("list");
        this.viewProfile = document.querySelector(".view-profile");
        this.button = document
            .querySelector(".btn")
            .addEventListener(
                "click",
                e => this.getData(document.getElementById("inputQuery").value),
                false
            );
    }

    async getData(name) {
        this.userCard.style.display = "flex";
        this.horizontalDivider.style.display = "flex";
        this.followBanner.style.display = "block";
        this.followContainer.innerHTML = "";
        this.loading.style.display = "flex";
        const inputQuery = document.getElementById("inputQuery");

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

        inputQuery.value = "";
    }

    onRenderUserInfo(res) {
        this.loading.style.display = "none";
        this.userAvatar.src = res.avatar_url;
        this.viewProfile.href = res.html_url;
        res.name === null
            ? (this.name.innerHTML = `<i class="fas fa-user"></i>${" "}Name: N/A`)
            : (this.name.innerHTML = `<i class="fas fa-user"></i>${" "}Name: ${
                  res.name
              }`);

        this.gitHubId.innerHTML = `<i class="fas fa-id-badge"></i>${" "}GitHub: <a href="${
            res.html_url
        }" target="_blank">${res.login}</a>`;
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
        this.followers.innerHTML = `<i class="fas fa-users"></i>${" "}Followers: ${
            res.followers
        }`;
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
            let user = new Follower(follower);
            this.followContainer.appendChild(user.element);
            return user;
        });
    }
}
