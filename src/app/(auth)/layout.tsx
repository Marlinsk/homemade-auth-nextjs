import { AuthLayout } from "@/components/auth/auth-layout";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  )
}

export default Layout;