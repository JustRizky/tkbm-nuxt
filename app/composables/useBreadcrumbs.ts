export const useBreadcrumbs = () => {
  const route = useRoute()

  const breadcrumbName = computed(() => {
    const path = route.path
    if (!path || path === '/') return 'Dashboard'

    const segment = path.split('/').filter(Boolean).pop() || ''

    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  })

  return {
    breadcrumbName
  }
}
