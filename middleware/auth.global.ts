export default defineNuxtRouteMiddleware((to, from) => {
  const UNLOGGED_ROUTES = ["/login", "/signup"];
  const nuxtApp = useNuxtApp();
  const isAuthenticated = computed(() => nuxtApp.$pb.authStore.isValid);

  if (!UNLOGGED_ROUTES.includes(to.path) && !isAuthenticated.value) {
    return navigateTo("/login");
  }
});
