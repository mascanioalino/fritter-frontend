import Vue from "vue";
import VueRouter from "vue-router";
import FreetsPage from "./components/Freet/FreetsPage.vue";
import AccountPage from "./components/Account/AccountPage.vue";
import LoginPage from "./components/Login/LoginPage.vue";
import BookmarksPage from "./components/Bookmark/BookmarksPage.vue";
import ProfilePage from "./components/Profile/ProfilePage.vue";
import GroupsPage from "./components/Group/GroupsPage.vue";
import NotFound from "./NotFound.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "Home", component: FreetsPage },
  { path: "/account", name: "Account", component: AccountPage },
  { path: "/profile", name: "Profile", component: ProfilePage },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/bookmark", name: "Bookmark", component: BookmarksPage },
  { path: "/groups", name: "Group", component: GroupsPage },
  { path: "/:username", name: "Profile", component: ProfilePage, props: true },
  {
    path: "/groups/:username",
    name: "Group",
    component: GroupsPage,
    props: true,
  },
  { path: "*", name: "Not Found", component: NotFound },
];

const router = new VueRouter({ routes });

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === "Login" && router.app.$store.state.username) {
      next({ name: "Account" }); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === "Account" && !router.app.$store.state.username) {
      next({ name: "Login" }); // Go to Login page if user navigates to Account and are not signed in
      return;
    }

    if (to.name === "Bookmark") {
      router.app.$store.commit("selectPage", "bookmark");
    } else if (to.name === "Home") {
      router.app.$store.commit("selectPage", "home");
    } else if (to.name === "Profile") {
      router.app.$store.commit("selectPage", "profile");
    } else if (to.name === "Login") {
      router.app.$store.commit("selectPage", "login");
    }
  }

  next();
});

export default router;
