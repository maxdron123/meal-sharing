import "./globals.css";
import Footer from "@/components/Footer/Footer.jsx";
import Navbar from "@/components/Navbar/Navbar.jsx";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Meal Sharing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
