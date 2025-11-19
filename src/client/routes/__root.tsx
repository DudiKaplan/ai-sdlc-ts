import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient } from '@tanstack/react-query'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="nav">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/tasks" className="[&.active]:font-bold">
          Tasks
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <div className="container">
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-left" />
    </>
  )
}
