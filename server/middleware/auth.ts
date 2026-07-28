export default defineEventHandler((event) => {
  const userAuth = getCookie(event, 'user_auth')

  if (userAuth) {
    try {
      const user = JSON.parse(userAuth)
      event.context.user = user
    } catch {
      event.context.user = null
    }
  }
})
