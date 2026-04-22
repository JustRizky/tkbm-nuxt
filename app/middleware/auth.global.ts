export default defineNuxtRouteMiddleware((to) => {
  const userAuth = useCookie<{ role: string }>('user_auth')
  const user = userAuth.value

  if (!user && to.path !== '/') {
    return navigateTo('/')
  }

  if (user && to.path === '/') {
    return navigateTo(`/${user.role.toLowerCase()}/dashboard`)
  }

  if (to.path.startsWith('/admin') && user?.role !== 'ADMIN') {
    return navigateTo('/')
  }

  if (to.path.startsWith('/pengurus') && user?.role !== 'PENGURUS') {
    return navigateTo('/')
  }

  if (to.path.startsWith('/krk') && user?.role !== 'KRK') {
    return navigateTo('/')
  }

  if (to.path.startsWith('/anggota') && user?.role !== 'ANGGOTA') {
    return navigateTo('/')
  }
})
